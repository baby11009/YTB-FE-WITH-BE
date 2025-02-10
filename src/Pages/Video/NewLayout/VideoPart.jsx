import Other from "./Other/Other";
import Video from "./Video/Video";
import Description from "./Description/Description";
import CommentSection from "./Comment/CommentSection";
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import { IsEnd } from "../../../util/scrollPosition";
import { getData } from "../../../Api/getData";
import { useAuthContext } from "../../../Auth Provider/authContext";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

// video mode : normal , theater , fullscreen

const initCombineQuery = {
  page: 1,
  limit: 12,
  watchedVideoIdList: [],
  sort: undefined,
  prevPlCount: 0,
};

const VideoPart = () => {
  const { pathname } = useLocation();

  const queryClient = useQueryClient();

  let [searchParams] = useSearchParams();

  const { id, list } = Object.fromEntries(searchParams.entries());

  const { user } = useAuthContext();

  const navigate = useNavigate();

  const [smallMedia, setSmallMedia] = useState();

  const [playlistQuery, setPlaylistQuery] = useState({
    videoLimit: 100,
    videoPage: 1,
    reset: list,
  });

  const [addNew, setAddNew] = useState(true);

  const [videoInfo, setVideoInfo] = useState(undefined);

  const [videoMode, setVideoMode] = useState("normal");

  const [isEnd, setIsEnd] = useState(false);

  const [playlistStatus, setPlaylistStatus] = useState({
    loop: false,
    shuffle: false,
  });

  const [playlistInfo, setPlaylistInfo] = useState(undefined);

  const [playlistAddNew, setPlaylistAddNew] = useState(true);

  const [playlistVideos, setPlaylistVideos] = useState([]);

  const playlistTotalPage = useRef();

  const currentVideoId = useRef(id);

  const nextVideoInfo = useRef(undefined);

  const playlistVideoIds = useRef(new Set());

  // To get random video if shuffle is on or get next playlist video if video is ended
  const playlistVideosArr = useRef(new Set());

  const firstRender = useRef(true);

  const currentPage = useRef(1);

  const currentSortId = useRef("all");

  const [combineQuery, setCombineQuery] = useState(undefined);

  const [comebineDataList, setCombineDataList] = useState([]);

  const [combineAddNew, setCombineAddNew] = useState();

  // Video details
  const {
    data: videoDetails,
    refetch,
    isError,
  } = getData(
    `/data/video/${id}`,
    {
      subscriberId: user?._id,
      id: id,
    },
    !!id,
    false,
  );

  // playlist data
  const { data: playlistDetails, isError: plIsError } = getData(
    `/data/playlist/${list}`,
    playlistQuery,
    !!list,
    false,
  );

  // video, short , playlist
  const { data: combineData } = getData(
    `/data/all`,
    combineQuery,
    !!combineQuery,
    false,
  );

  const handlePlayNextVideo = useCallback(() => {
    let playlist = [...playlistVideosArr.current];

    let nextVideoIndex = playlist.indexOf(currentVideoId.current) + 1 || 1;

    if (playlistStatus.shuffle) {
      if (playlistVideosArr.current.has(currentVideoId.current)) {
        playlistVideosArr.current.delete(currentVideoId.current);
        playlist = [...playlistVideosArr.current];
      }

      nextVideoIndex = Math.floor(Math.random() * playlist.length);
    }

    let nextVideo = playlist[nextVideoIndex];

    if (nextVideo) {
      const searchParams = new URLSearchParams({
        id: nextVideo,
        list: list,
      }).toString();
      navigate(pathname + "?" + searchParams);
    } else if (!nextVideo && playlistStatus.loop) {
      // if don't have any next video to play and loop is on then reset the playlist
      if (playlistStatus.shuffle) {
        playlistVideosArr.current = new Set([...playlistVideoIds.current]);

        playlist = [...playlistVideosArr.current];
        nextVideo =
          playlist[
            Math.floor(Math.random() * [...playlistVideosArr.current].length)
          ];
      } else {
        nextVideo = playlist[0];
      }
      const searchParams = new URLSearchParams({
        id: nextVideo,
        list: list,
      }).toString();
      navigate(pathname + "?" + searchParams);
    }
  }, [playlistStatus, pathname, list]);

  const handlePlaylistShowMore = useCallback(() => {
    if (playlistInfo && playlistTotalPage.current > playlistQuery.videoPage) {
      setPlaylistQuery((prev) => ({ ...prev, videoPage: prev.videoPage + 1 }));
    }
  }, [playlistInfo, playlistQuery]);

  const handleModifyVideoList = useCallback((videoId) => {
    setPlaylistVideos((prev) => prev.filter((item) => item._id !== videoId));
    playlistVideoIds.current.delete(videoId);

    if (playlistVideosArr.current.has(videoId)) {
      playlistVideosArr.current.delete(videoId);
    }
    setPlaylistInfo((prev) => ({ ...prev, size: prev.size - 1 }));
  }, []);

  const handleSort = useCallback(
    (data) => {
      queryClient.removeQueries({
        queryKey: [...Object.values(combineQuery), "/data/all"],
        exact: true,
      });

      setCombineQuery({
        ...initCombineQuery,
        reset: id + list,
        sort: data.value,
      });
      setCombineAddNew(true);
      currentSortId.current = data.id;
    },
    [id, list, combineQuery],
  );

  const handleShowMore = useCallback(() => {
    // get current data page
    const currentData = comebineDataList[currentPage.current - 1];
    if (!currentData) return;

    // calculate total playlist is available
    const playlistQtt = currentData?.videoList.filter(
      (data) => data.video_list,
    ).length;

    // // calculate all the data id is available
    const watchedId = [
      ...currentData?.videoList.map((item) => item._id),
      ...currentData?.shortList.map((item) => item._id),
    ];

    setCombineQuery((prev) => ({
      ...prev,
      page: prev.page + 1,
      watchedVideoIdList: [...prev.watchedVideoIdList, ...[...watchedId]],
      prevPlCount: prev.prevPlCount + playlistQtt,
    }));
  }, [comebineDataList]);

  useLayoutEffect(() => {
    if (videoDetails) {
      if (addNew) {
        setVideoInfo(videoDetails.data);
        setAddNew(false);
      } else {
        setVideoInfo((prev) => ({ ...prev, ...videoDetails.data }));
      }
    }
  }, [videoDetails, addNew]);

  useLayoutEffect(() => {
    if (playlistDetails) {
      playlistTotalPage.current = playlistDetails.totalPages;

      setPlaylistInfo((prev) => {
        if (prev) {
          return { ...prev, ...playlistDetails.data };
        }

        return playlistDetails.data;
      });

      if (playlistAddNew) {
        const finalList = [];
        playlistVideoIds.current.clear();
        playlistVideosArr.current.clear();
        playlistDetails.data.video_list?.forEach((item) => {
          if (!playlistVideoIds.current.has(item._id)) {
            playlistVideoIds.current.add(item._id);
            playlistVideosArr.current.add(item._id);

            finalList.push(item);
          }
        });
        setPlaylistVideos([...finalList]);
        setPlaylistAddNew(false);
      } else {
        const finalList = [];

        playlistDetails.data.video_list?.forEach((item) => {
          if (!playlistVideoIds.current.has(item._id)) {
            playlistVideoIds.current.add(item._id);
            playlistVideosArr.current.add(item._id);

            finalList.push(item);
          }
        });

        setPlaylistVideos((prev) => [...prev, ...finalList]);
      }
    }
  }, [playlistDetails]);

  useEffect(() => {
    playlistVideosArr.current = new Set([...playlistVideoIds.current]);
  }, [playlistStatus]);

  useLayoutEffect(() => {
    if (list && playlistInfo) {
      queryClient.invalidateQueries({
        queryKey: Object.values(playlistQuery),
        exact: true,
      });
    }
  }, [list]);

  useLayoutEffect(() => {
    if (id) {
      currentVideoId.current = id;
      if (videoInfo) {
        queryClient.invalidateQueries({
          queryKey: [user?._id, id],
          exact: true,
        });
        setAddNew(true);
      }
    } else {
      navigate("/");
    }
  }, [id]);

  useLayoutEffect(() => {
    // Don't get new data when the playlist is loaded
    if (!list || firstRender.current) {
      firstRender.current = false;

      setCombineQuery({
        ...initCombineQuery,
        reset: id + list,
      });
      setCombineAddNew(true);
      setCombineDataList([]);
    }
  }, [id, list]);

  useLayoutEffect(() => {
    if (combineQuery) {
      currentPage.current = combineQuery?.page;
    }
  }, [combineQuery]);

  useLayoutEffect(() => {
    if (
      combineData &&
      (combineData.data.length > 0 || combineData.short.length > 0)
    ) {
      const data = { videoList: [], shortList: [] };

      if (combineData.data.length > 0) {
        data.videoList = [...combineData.data];
      }

      if (combineData.shorts.length > 0) {
        data.shortList = [...combineData.shorts];
      }

      if (combineAddNew) {
        setCombineDataList([data]);
        setCombineAddNew(false);
      } else {
        setCombineDataList((prev) => [...prev, data]);
      }
    }
  }, [combineData]);

  useEffect(() => {
    const handleOnScroll = (e) => {
      IsEnd(setIsEnd);
    };

    window.addEventListener("scroll", handleOnScroll);

    const handleResize = (e) => {
      setSmallMedia(window.innerWidth < 1024 ? true : false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleOnScroll);
      window.removeEventListener("resize", handleResize);

      queryClient.clear();
    };
  }, []);

  useLayoutEffect(() => {
    if (id && playlistVideos.length > 0) {
      const idList = playlistVideos.map((item) => item._id);
      let index = idList.indexOf(currentVideoId.current) + 1 || 1;

      nextVideoInfo.current = playlistVideos[index];
    }
  }, [id, playlistVideos]);

  useEffect(() => {
    if (
      isEnd &&
      !smallMedia &&
      combineData &&
      (combineData?.data?.length === combineQuery?.limit ||
        combineData?.shorts?.length === combineQuery?.limit)
    ) {
      handleShowMore();
    }
  }, [isEnd, smallMedia, combineData]);

  if (isError || plIsError) {
    return <div>Failed to loading data</div>;
  }

  if (!videoInfo) return;

  return (
    <div className='max-w-[1754px] lg:min-w-min-360 1356:min-w-min-480 mx-auto flex flex-col'>
      {/* <div
        className={`h-[56.25vw] max-h-[calc(100vh-169px)] min-h-[480px] overflow-x-clip
          ${videoMode === "theater" ? "block" : "hidden"} `}
      >
        <Video
          data={state}
          playerMode={"theater"}
          videoMode={videoMode}
          setVideoMode={setVideoMode}
          videoSettings={videoSettings}
          setVideoSettings={setVideoSettings}
          prevVideoSettings={prevVideoSettings}
          volume={volume}
          setVolume={setVolume}
          containerStyle={"size-full"}
        />
      </div> */}
      <div
        className={`flex sm:justify-center ${
          videoMode === "normal" && "pt-[24px]"
        }`}
      >
        {/* Left side */}
        <button></button>
        <div
          className='flex-1 min-w-240-16/9 lg:min-w-360-16/9 lg:max-w-max-16/9
         1356:min-w-480-16/9 ml-[24px] pr-[24px] '
        >
          {/* ${videoMode !== "normal" && "hidden"} */}

          <div className={`w-full `}>
            <Video
              data={videoInfo}
              handlePlayNextVideo={handlePlayNextVideo}
              playlitStatus={playlistStatus}
            />
          </div>

          <Description data={videoInfo} refetch={refetch} />

          {smallMedia && (
            <Other
              videoId={id}
              playlistId={list}
              combineData={comebineDataList}
              handleSort={handleSort}
              handleShowMore={combineQuery?.page < 2 && handleShowMore}
              currentSortId={currentSortId.current}
              playlistInfo={playlistInfo}
              playlistVideos={playlistVideos}
              handlePlaylistShowMore={handlePlaylistShowMore}
              handleModifyVideoList={handleModifyVideoList}
              playlistStatus={playlistStatus}
              setPlaylistStatus={setPlaylistStatus}
            />
          )}

          <CommentSection
            videoId={id}
            videoUserId={videoInfo?.channel_info?._id}
            totalCmt={videoInfo?.totalCmt}
            refetch={refetch}
            isEnd={isEnd}
          />
        </div>
        {/* Right side */}
        {!smallMedia && (
          <div className='pr-[24px] w-[402px] min-w-[300px] box-content'>
            <Other
              videoId={id}
              playlistId={list}
              combineData={comebineDataList}
              handleSort={handleSort}
              currentSortId={currentSortId.current}
              playlistInfo={playlistInfo}
              playlistVideos={playlistVideos}
              playlistCurrentVideoIndex={
                playlistVideos
                  .map((item) => item._id)
                  .indexOf(currentVideoId.current) + 1 || 1
              }
              playlistNextVideoInfo={nextVideoInfo.current}
              handlePlaylistShowMore={handlePlaylistShowMore}
              handleModifyVideoList={handleModifyVideoList}
              playlistStatus={playlistStatus}
              setPlaylistStatus={setPlaylistStatus}
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default VideoPart;
