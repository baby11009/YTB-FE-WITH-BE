import Other from "./Other/Other";
import Video from "./Video/Video";
import Description from "./Description/Description";
import CommentSection from "./Comment/CommentSection";
import { useState, useEffect, useRef, useCallback } from "react";
import { IsEnd } from "../../../util/scrollPosition";
import { getData } from "../../../Api/getData";
import { useAuthContext } from "../../../Auth Provider/authContext";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

// video mode : normal , theater , fullscreen

const VideoPart = () => {
  
  const { state } = useLocation();

  const queryClient = useQueryClient();

  let [searchParams] = useSearchParams();

  const { id, list } = Object.fromEntries(searchParams.entries());

  const { user } = useAuthContext();

  const navigate = useNavigate();

  const [videoInfo, setVideoInfo] = useState(undefined);

  const [videoMode, setVideoMode] = useState("normal");

  const [isEnd, setIsEnd] = useState(false);

  const nextVideoPath = useRef();

  const setNextVideoPath = useCallback((path) => {
    nextVideoPath.current = path;
  });

  const handlePlayNextVideo = useCallback(() => {
    navigate(nextVideoPath.current);
  }, []);

  const [playlistStatus, setPlaylistStatus] = useState({
    loop: false,
    shuffle: false,
  });

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

  useEffect(() => {
    if (videoDetails) {
      setVideoInfo((prev) =>
        prev ? { ...prev, ...videoDetails.data } : { ...videoDetails.data },
      );
    }
  }, [videoDetails]);

  useEffect(() => {
    if (id) {
      if (videoInfo) {
        queryClient.invalidateQueries({
          queryKey: [user?._id, id],
          exact: true,
        });
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

  if (isError) {
    return <div>Failed to loading data</div>;
  }

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
          playlistStatus={playlistStatus}
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
            <Video data={state} playlistStatus={playlistStatus} handlePlayNextVideo={handlePlayNextVideo} />
          </div>
          <Description data={videoInfo} refetch={refetch} />
          <div className=' block lg:hidden  '>
            <Other
              videoId={id}
              playlistId={list}
              showMore={true}
              id={"small"}
              setNextVideoPath={setNextVideoPath}
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
            setNextVideoPath={setNextVideoPath}
            playlistStatus={playlistStatus}
            setPlaylistStatus={setPlaylistStatus}
          />
        </div>
      </div>
    </div>
  );
};
export default VideoPart;
