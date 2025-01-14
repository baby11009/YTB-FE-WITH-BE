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

const initVideoQuery = {
  page: 1,
  limit: 12,
  type: "video",
  watchedVideoIdList: [],
  sort: undefined,
  prevPlCount: 0,
};

const initShortQuery = {
  page: 1,
  limit: 12,
  type: "short",
  sort: undefined,
};

const VideoPart = () => {
  const { pathname } = useLocation();

  const queryClient = useQueryClient();

  let [searchParams] = useSearchParams();

  const { id, list } = Object.fromEntries(searchParams.entries());

  const { user } = useAuthContext();

  const navigate = useNavigate();

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

  const currentPlaylistVideo = useRef();

  const playlistVideoIds = useRef(new Set());

  // To get random video if shuffle is on or get next playlist video if video is ended
  const playlistVideosArr = useRef(new Set());

  const nextVideoPath = useRef({ path: "", payload: {} });

  // const [videoQuery, setVideoQuery] = useState(undefined);

  // const [videoList, setVideoList] = useState([]);

  // const videoIdList = useRef(new Set());

  // const [shortQuery, setShortQuery] = useState(undefined);

  // const [shortList, setShortList] = useState([]);

  // const shortIdList = useRef(new Set());

  // const currentSortId = useRef("all");

  // const handleSort = useCallback((data) => {
  //   queryClient.removeQueries({
  //     queryKey: [...Object.values(videoQuery), "/data/all"],
  //     exact: true,
  //   });
  //   queryClient.removeQueries({
  //     queryKey: [...Object.values(shortQuery), "/data/all"],
  //     exact: true,
  //   });
  //   setVideoQuery({
  //     ...initVideoQuery,
  //     reset: videoId,
  //     sort: data.value,
  //   });
  //   setShortQuery({
  //     ...initShortQuery,
  //     reset: videoId,
  //     sort: data.value,
  //   });
  //   setAddNew(true);
  //   setShortAddNew(true);
  //   currentSortId.current = data.id;
  // });

  // const handleShowMore = useCallback(() => {
  //   setVideoQuery((prev) => ({
  //     ...prev,
  //     page: prev.page + 1,
  //     watchedVideoIdList: [
  //       ...prev.watchedVideoIdList,
  //       ...[...videoIdList.current],
  //     ],
  //     prevPlCount: videoList.filter((data) => data.video_list).length,
  //   }));
  // }, []);

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

  // video
  // const { data: videoData } = getData(
  //   `/data/all`,
  //   videoQuery,
  //   !!videoQuery,
  //   false,
  // );

  // // short
  // const { data: shortData } = getData(
  //   `/data/all`,
  //   shortQuery,
  //   !!shortQuery,
  //   false,
  // );

  const setNextVideo = useCallback((path, payload) => {
    if (path) {
      nextVideoPath.current.path = path;
      nextVideoPath.current.payload = payload;
    } else {
      nextVideoPath.current = { path: "", payload: {} };
    }
  });

  const handlePlayNextVideo = useCallback(() => {
    let playlist = [...playlistVideosArr.current];

    let nextVideoIndex = playlist.indexOf(id) + 1 || 1;

    if (playlistStatus.shuffle) {
      if (playlistVideosArr.current.has(id)) {
        playlistVideosArr.current.delete(id);
        playlist = [...playlistVideosArr.current];
      }

      nextVideoIndex = Math.floor(Math.random() * playlist.length);
    }

    console.log(playlist);
    console.log("🚀 ~ nextVideoIndex:", nextVideoIndex);

    const nextVideo = playlist[nextVideoIndex];

    if (nextVideo) {
      const searchParams = new URLSearchParams({
        id: nextVideo,
        list: list,
      }).toString();
      navigate(pathname + "?" + searchParams);
    }
  }, [playlistStatus, id, pathname, list]);

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
  }, [playlistStatus.shuffle]);

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

  useEffect(() => {
    const handleOnScroll = (e) => {
      IsEnd(setIsEnd);
    };
    window.addEventListener("scroll", handleOnScroll);

    return () => {
      window.removeEventListener("scroll", handleOnScroll);
      queryClient.clear();
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
            <Video data={videoInfo} handlePlayNextVideo={handlePlayNextVideo} />
          </div>

          <Description data={videoInfo} refetch={refetch} />
          <div className='block lg:hidden'>
            <Other
              videoId={id}
              playlistId={list}
              showMore={true}
              id={"small"}
              playlistInfo={playlistInfo}
              playlistVideos={playlistVideos}
              handlePlaylistShowMore={handlePlaylistShowMore}
              handleModifyVideoList={handleModifyVideoList}
              playlistStatus={playlistStatus}
              setPlaylistStatus={setPlaylistStatus}
            />
          </div>
          <CommentSection
            videoId={id}
            videoUserId={videoInfo?.channel_info._id}
            totalCmt={videoInfo?.totalCmt}
            refetch={refetch}
            isEnd={isEnd}
          />
        </div>
        {/* Right side */}
        <div className='hidden lg:block  pr-[24px] w-[402px] min-w-[300px] box-content'>
          <Other
            videoId={id}
            playlistId={list}
            isEnd={isEnd}
            id={"large"}
            playlistInfo={playlistInfo}
            playlistVideos={playlistVideos}
            handlePlaylistShowMore={handlePlaylistShowMore}
            handleModifyVideoList={handleModifyVideoList}
            playlistStatus={playlistStatus}
            setPlaylistStatus={setPlaylistStatus}
          />
        </div>
      </div>
    </div>
  );
};
export default VideoPart;
