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
import { cleanSessionCookies } from "../../../util/other";
import { scrollToTop } from "../../../util/scrollCustom";

// video mode : normal , theater , fullscreen

const initButtonQueries = (handleOnClick) => {
  return [
    {
      id: "all",
      title: "All",
      value: undefined,
      type: "default",
      handleOnClick,
    },
    {
      id: "recently",
      title: "Recently uploaded",
      type: "sort",
      handleOnClick,
    },
    {
      id: "oldest",
      title: "Oldest uploads",
      type: "sort",
      handleOnClick,
    },
    {
      id: "popular",
      title: "Popular",
      type: "sort",
      handleOnClick,
    },
  ];
};

const VideoPart = () => {
  const { pathname } = useLocation();

  const queryClient = useQueryClient();

  let [searchParams] = useSearchParams();

  const { id, list } = Object.fromEntries(searchParams.entries());

  const { user } = useAuthContext();

  const navigate = useNavigate();

  const [smallMedia, setSmallMedia] = useState();

  const [playlistQueries, setPlaylistQueries] = useState({
    videoLimit: 100,
    videoPage: 1,
    reset: list,
  });

  const addNew = useRef(true);

  const [videoInfo, setVideoInfo] = useState(undefined);

  const [videoMode, setVideoMode] = useState("normal");

  const [isEnd, setIsEnd] = useState(false);

  const [playlistStatus, setPlaylistStatus] = useState({
    loop: false,
    shuffle: false,
  });

  const [playlistInfo, setPlaylistInfo] = useState(undefined);

  const playlistAddNew = useRef(true);

  const [playlistVideos, setPlaylistVideos] = useState([]);

  const playlistTotalPage = useRef();

  const currentVideoId = useRef(id);

  const nextVideoInfo = useRef(undefined);

  const playlistVideoIds = useRef(new Set());

  // To get random video if shuffle is on or get next playlist video if video is ended
  const playlistVideosArr = useRef(new Set());

  const firstRender = useRef(true);

  const nextCursors = useRef(null);

  const currentSortId = useRef("all");

  const [otherDataQueries, setOtherDataQueires] = useState(undefined);

  const [otherDataList, setOtherDataList] = useState([]);

  const addNewOtherData = useRef(true);

  const [queryBtns, setQueryBtns] = useState([]);

  const [currentQuery, setCurrentQuery] = useState("all");

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
  );

  // playlist data
  const { data: playlistDetails, isError: plIsError } = getData(
    `/data/playlist/${list}`,
    playlistQueries,
    !!list,
  );

  // video, short , playlist
  const { data: otherData } = getData(
    "/data/random",
    otherDataQueries,
    !!otherDataQueries,
  );

  const { data: tagData } = getData("/data/tags", {
    clearCache: "tag",
  });

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
    if (playlistInfo && playlistTotalPage.current > playlistQueries.videoPage) {
      setPlaylistQueries((prev) => ({
        ...prev,
        videoPage: prev.videoPage + 1,
      }));
    }
  }, [playlistInfo, playlistQueries]);

  const handleModifyVideoList = useCallback((videoId) => {
    setPlaylistVideos((prev) => prev.filter((item) => item._id !== videoId));
    playlistVideoIds.current.delete(videoId);

    if (playlistVideosArr.current.has(videoId)) {
      playlistVideosArr.current.delete(videoId);
    }
    setPlaylistInfo((prev) => ({ ...prev, size: prev.size - 1 }));
  }, []);

  const handleQueryChange = useCallback(async (queryData) => {
    await cleanSessionCookies();

    setCurrentQuery(queryData.id);
    // Xóa queries cũ với giá trị mới nhất của prevQueries
    queryClient.removeQueries({ queryKey: ["/data/random"] });

    setOtherDataQueires(() => {
      // Tạo queries mới
      let queries;
      switch (queryData.type) {
        case "search":
          queries = { tag: queryData.id };
          break;
        case "sort":
          queries = { sort: queryData.id };
          break;
        default:
          queries = {};
      }

      scrollToTop();
      addNewOtherData.current = true;
      return queries; // Trả về state mới
    });
  }, []);

  const handleShowMore = useCallback(() => {
    // get current data page
    if (!nextCursors.current) return;

    setOtherDataQueires((prev) => ({
      ...prev,
      cursors: nextCursors.current,
    }));
  }, []);

  const updateVideoData = useCallback((newData) => {
    setVideoInfo((prev) => ({ ...prev, ...newData }));
  }, []);

  useEffect(() => {
    if (videoDetails) {
      if (addNew) {
        setVideoInfo(videoDetails.data);
        addNew.current = false;
      } else {
        setVideoInfo((prev) => ({ ...prev, ...videoDetails.data }));
      }
    }
  }, [videoDetails]);

  useEffect(() => {
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
        playlistAddNew.current = false;
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
        queryKey: [`/data/playlist/${list}`],
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
        addNew.current = true;
      }
    } else {
      navigate("/");
    }
  }, [id]);

  useEffect(() => {
    // Load new others data when id is changed
    // but not when user playing a playlist
    if (!list || firstRender.current) {
      setOtherDataQueires({
        reset: id + list,
      });
      addNewOtherData.current = true;
    }
  }, [id, list]);

  useEffect(() => {
    if (otherData) {
      if (addNewOtherData.current) {
        const modifedList = [...otherData.video];
        if (otherData.short.length > 0) {
          modifedList.splice(1, 0, otherData.short);
        }

        setOtherDataList(modifedList);
        addNewOtherData.current = false;
      } else {
        setOtherDataList((prev) => [...prev, ...otherData.video]);
      }

      nextCursors.current = otherData.cursors;
    }
  }, [otherData]);

  useEffect(() => {
    if (tagData && tagData.data.length) {
      setQueryBtns(() => {
        const init = initButtonQueries(handleQueryChange);
        tagData.data.forEach((tag) => {
          init.push({
            id: tag.title,
            title: tag.title,
            type: "search",
            handleOnClick: handleQueryChange,
          });
        });

        return init;
      });
    }
  }, [tagData]);

  useLayoutEffect(() => {
    if (id && playlistVideos.length > 0) {
      const idList = playlistVideos.map((item) => item._id);
      let index = idList.indexOf(currentVideoId.current) + 1 || 1;

      nextVideoInfo.current = playlistVideos[index];
    }
  }, [id, playlistVideos]);

  useEffect(() => {
    if (isEnd && !smallMedia && nextCursors.current) {
      handleShowMore();
    }
  }, [isEnd, smallMedia]);

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

    const handleBeforUnload = () => {
      cleanSessionCookies();
    };

    window.addEventListener("beforeunload", handleBeforUnload);
    return () => {
      if (!firstRender.current) {
        handleBeforUnload();
        queryClient.removeQueries(`/data/video/${id}`);
        queryClient.removeQueries(`/data/playlist/${list}`);
        queryClient.removeQueries("/data/random");
      }

      window.removeEventListener("beforeunload", handleBeforUnload);

      firstRender.current = false;
      window.removeEventListener("scroll", handleOnScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
              key={"small"}
              videoId={id}
              playlistId={list}
              otherDataList={otherDataList}
              handleQueryChange={handleQueryChange}
              handleShowMore={nextCursors.current && handleShowMore}
              currentSortId={currentSortId.current}
              playlistInfo={playlistInfo}
              playlistVideos={playlistVideos}
              handlePlaylistShowMore={handlePlaylistShowMore}
              handleModifyVideoList={handleModifyVideoList}
              playlistStatus={playlistStatus}
              setPlaylistStatus={setPlaylistStatus}
              queryBtns={queryBtns}
              currentQuery={currentQuery}
            />
          )}

          <CommentSection
            videoData={videoInfo}
            videoUserId={videoInfo?.channel_info?._id}
            refetch={refetch}
            updateVideoData={updateVideoData}
            isEnd={isEnd}
          />
        </div>
        {/* Right side */}
        {!smallMedia && (
          <div className='pr-[24px] w-[402px] min-w-[300px] box-content'>
            <Other
              key={"large"}
              videoId={id}
              playlistId={list}
              otherDataList={otherDataList}
              handleQueryChange={handleQueryChange}
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
              queryBtns={queryBtns}
              currentQuery={currentQuery}
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default VideoPart;
