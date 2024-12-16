import { useRef, useLayoutEffect, useEffect, useState } from "react";
import Hls from "hls.js";
import {
  FillSettingIcon,
  TheaterIcon,
  FullScreenIcon,
  PlayIcon,
  PauseIcon,
  ThickAudioIcon,
  MuteAudiIcon,
  NextIcon,
} from "../../../../Assets/Icons";
const Video = ({ data }) => {
  const [videoState, setVideoState] = useState();

  const videoRef = useRef();

  const videoSrc = useRef();

  const timeLineContainer = useRef();

  const videoProgress = useRef(0);

  useLayoutEffect(() => {
    if (data) {
      if (data?.stream && Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(
          `${import.meta.env.VITE_BASE_API_URI}/file/videomaster/${
            data?.stream
          }`,
        );
        hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {});
        hls.attachMedia(videoRef.current);
      } else {
        videoSrc.current = data?.video;
        videoRef.current.src = `${import.meta.env.VITE_BASE_API_URI}${
          import.meta.env.VITE_VIEW_VIDEO_API
        }${data?.video}?type=video`;
      }
    }
  }, [data]);

  useLayoutEffect(() => {
    const timeline = document.querySelector(".time-line");

    const handleUpdateTimeLine = (e) => {
      const rect = timeLineContainer.current.getBoundingClientRect();
      const percent =
        Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;

      timeline.style.setProperty("--preview-progress", percent);
    };

    timeLineContainer.current.addEventListener(
      "mousemove",
      handleUpdateTimeLine,
    );

    timeLineContainer.current.addEventListener("mouseleave", (e) => {
      timeline.style.setProperty("--preview-progress", 0);
    });

    videoRef.current.addEventListener("timeupdate", () => {
      if (videoRef.current.duration) {
        setVideoState((prev) => ({
          ...prev,
          currentTime: videoRef.current.currentTime,
        }));
        timeline.style.setProperty(
          "--progress-position",
          videoRef.current.currentTime / videoRef.current.duration,
        );
      }
    });

    videoRef.current.addEventListener("loadedmetadata", () => {
      setVideoState({
        duration: videoRef.current.duration,
        currentTime: videoRef.current.currentTime,
      });
    });

    videoRef.current.addEventListener("progress", () => {
      let bufferedTime = 0;

      for (let i = 0; i < videoRef.current.buffered.length; i++) {
        bufferedTime +=
          videoRef.current.buffered.end(i) - videoRef.current.buffered.start(i);
      }

      timeline.style.setProperty("--preview-progress", bufferedTime);
    });
  }, []);

  return (
    <div className='bg-[#000000] rounded-[12px] overflow-hidden relative'>
      <div className='w-full absolute  bottom-0 z-[99] px-[12px]' id='controls'>
        <div className='w-full group h-[7px]' ref={timeLineContainer}>
          <div className='w-full h-[3px] bg-[rgba(100,100,100,.5)] cursor-pointer group-hover:h-full time-line'>
            <div className='thumb-indicator'></div>
          </div>
        </div>
        <div className='w-full flex  h-[48px]'>
          <div className='flex-1 flex items-center'>
            <button
              type='button'
              className='p-[8px] 2xsm:p-[12px]'
              onClick={() => {
                console.log(videoRef.current.paused);
                videoRef.current.paused
                  ? videoRef.current.play()
                  : videoRef.current.pause();
              }}
            >
              <div className='size-[20px] 2xsm:size-[24px]'>
                <PlayIcon />
              </div>
            </button>
            <button type='button' className='fill-white'>
              <div className='size-[36px] 2xsm:size-[48px]'>
                <NextIcon />
              </div>
            </button>
            <button type='button' className='p-[8px] 2xsm:p-[12px] fill-white'>
              <div className='size-[20px] 2xsm:size-[24px]'>
                <ThickAudioIcon />
              </div>
            </button>
            {videoState && (
              <div className='px-[5px] text-[#dddddd] text-[13px] leading-[36px] 2xsm:leading-[48px]'>
                <span>{Math.floor(videoState.currentTime)} </span>/
                <span> {Math.floor(videoState.duration)}</span>
              </div>
            )}
          </div>
          <div className='w-fit'>
            <button
              type='button'
              className='fill-white  px-[2px] size-[36px] 2xsm:size-[48px]'
            >
              <FillSettingIcon />
            </button>
            <button
              type='button'
              className='fill-white  px-[2px] size-[36px] 2xsm:size-[48px]'
            >
              <TheaterIcon />
            </button>
            <button
              type='button'
              className='fill-white  px-[2px] size-[36px] 2xsm:size-[48px]'
            >
              <FullScreenIcon />
            </button>
          </div>
        </div>
      </div>
      <video
        className='w-full aspect-video object-contain'
        ref={videoRef}
      ></video>
    </div>
  );
};
export default Video;
