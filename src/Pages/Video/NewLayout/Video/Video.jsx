import {
  useRef,
  useLayoutEffect,
  useEffect,
  useState,
  useCallback,
} from "react";
import Hls from "hls.js";
import {
  FillSettingIcon,
  TheaterIcon,
  FullScreenIcon,
  Play2Icon,
  PauseIcon,
  NextIcon,
} from "../../../../Assets/Icons";
import { durationCalc } from "../../../../util/durationCalc";
import { getObjectChangedKey } from "../../../../util/func";
import { AudioRange } from "../../../../Component";
import VideoSettingMenu from "./Setting menu/VideoSettingMenu";

const defaultQuality = [{ title: "Auto", value: -1, res: 1080 }];

const defaultSettings = {
  stableVolume: true,
  ambientMode: false,
  subtitles: {
    title: "Off",
    value: false,
  },
  playbackSpeed: { title: "Normal", value: 1 },
  sleepTimer: { title: "Off", value: false },
  quality: { title: "1080 HD", value: 1080 },
};

const Video = ({
  data,
  playerMode,
  videoMode,
  setVideoMode,
  videoSettings,
  setVideoSettings,
  volume,
  setVolume,
  prevVideoSettings,
  containerStyle,
}) => {
  const hlsRef = useRef();

  const isStreamingHls = useRef();

  const container = useRef();

  const togglePlayArea = useRef();

  const videoRef = useRef();

  const videoSrc = useRef();

  const controls = useRef();

  const timeLineContainer = useRef();

  const timeline = useRef();

  const isScrubbing = useRef();

  const audioScrubbing = useRef();

  const wasPaused = useRef();

  const previewProgress = useRef();

  const settingMenuRef = useRef();

  const settingsBtn = useRef();

  const timeOut = useRef();

  // const prevVideoSettings = useRef();

  const qualityDisplay = useRef(defaultQuality);

  const firstTimeSetting = useRef(true);

  const [videoLoaded, setVideoLoaded] = useState(false);

  const [videoState, setVideoState] = useState({ paused: true });

  const [openedSettings, setOpenSettings] = useState(false);

  // const [videoSettings, setVideoSettings] = useState(() => {
  //   if (
  //     window.localStorage.getItem("video_player_settings") &&
  //     window.localStorage.getItem("video_player_settings") !== "undefined"
  //   ) {
  //     const settings = JSON.parse(
  //       localStorage.getItem("video_player_settings"),
  //     );

  //     prevVideoSettings.current = settings;
  //     return settings;
  //   } else {
  //     localStorage.setItem(
  //       "video_player_settings",
  //       JSON.stringify(defaultSettings),
  //     );
  //     prevVideoSettings.current = defaultSettings;
  //     return defaultSettings;
  //   }
  // });

  // handle window events
  const handleWindowMouseDown = useCallback(
    (e) => {
      // Click Update Timeline

      // Close setting menu when user clicks outside of the menu and the setting button
      if (
        !settingsBtn.current.contains(e.target) &&
        !settingMenuRef.current.contains(e.target)
      ) {
        setOpenSettings(false);
      }

      // update video timline  when user left click the timeline ref
      if (!e.target.contains(timeline.current)) return;
      const rect = timeLineContainer.current.getBoundingClientRect();

      const percent =
        Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;

      videoRef.current.currentTime = videoRef.current.duration * percent;

      timeline.current.style.setProperty("--progress-position", percent);
    },
    [openedSettings],
  );

  const handleWindowDisableSelects = useCallback((event) => {
    event.preventDefault();
  }, []);

  const handleWindowKeyboardDown = useCallback((e) => {
    e.preventDefault();
    switch (e.code) {
      case "ArrowLeft":
        break;
      case "ArrowRight":
        break;
      case "Space":
        if (videoRef.current.paused) {
          videoRef.current.play();
        } else {
          videoRef.current.pause();
        }
        break;
    }
  }, []);

  //  handle  container ref events

  const handleContainerMouseOver = useCallback((e) => {
    // Show the controls UI when mouse is over the container
    controls.current.style.opacity = 1;
  }, []);

  const handleContainerMouseOut = useCallback((e) => {
    // Hide the controls UI when mouse is not out the container and scrubbing event is not fired
    if (isScrubbing.current || audioScrubbing.current) return;

    controls.current.style.opacity = 0;
  }, []);

  const handleContainerMouseMove = useCallback(() => {
    // check if mouse is moving
    clearTimeout(timeOut.current);
    controls.current.style.opacity = 1;
    document.body.style.cursor = "default";

    timeOut.current = setTimeout(() => {
      if (isScrubbing.current || audioScrubbing.current) return;
      document.body.style.cursor = "none";
      controls.current.style.opacity = 0;
    }, 2500);
  }, []);

  const handleContainerMouseDown = useCallback(
    (e) => {
      // play video when user click on the container but not when the settings menu is opened
      if (openedSettings) return;

      if (e.target.contains(togglePlayArea.current)) {
        handlePlayVideo();
      }
    },
    [openedSettings],
  );

  const preventContainerMenuContext = useCallback((e) => {
    // prevent user to show right click menu when user click on container
    e.preventDefault();
  }, []);

  // handle timelineContainer ref events

  const handleTimelineContainerMouseOut = useCallback(() => {
    timeline.current.style.setProperty(
      "--preview-progress",
      previewProgress.current,
    );
  }, []);

  // handle video ref events

  const handleVideoloaded = useCallback(() => {
    // Set video loaded state and calculate the video duration and current time
    // apply video local storage settings and autoplay

    setVideoLoaded(true);
    setVideoState({
      duration: videoRef.current.duration,
      currentTime: videoRef.current.currentTime,
    });

    // Apply video player settings before playing
    firstTimeSetting.current = false;
    for (const [key, value] of Object.entries(videoSettings)) {
      handleChangeVideoSettings(key, value.value);
    }

    // videoRef.current.play().catch((err) => {
    //   setVideoState((prev) => ({ ...prev, paused: true }));
    // });
  }, []);

  const handlePlayVideo = useCallback(() => {
    videoRef.current.paused
      ? videoRef.current.play()
      : videoRef.current.pause();
  }, []);

  const handleVideoPlay = useCallback(() => {
    setVideoState((prev) => ({ ...prev, paused: false }));
  }, []);

  const handleVideoPause = useCallback(() => {
    setVideoState((prev) => ({ ...prev, paused: true }));
  }, []);

  const handleVideoProgress = useCallback(() => {
    // calculate the video buffer size that has been loaded to adjust the loaded progress timeline
    let bufferedTime = 0;

    for (let i = 0; i < videoRef.current.buffered.length; i++) {
      bufferedTime +=
        videoRef.current.buffered.end(i) - videoRef.current.buffered.start(i);
    }

    const percent = Math.max(
      0,
      Math.min(bufferedTime / videoRef.current.duration, 1),
    );

    previewProgress.current = percent;
    timeline.current.style.setProperty("--preview-progress", percent);
  }, []);

  const handleVideoTimeUpdate = useCallback(() => {
    if (videoRef.current && videoRef.current.duration) {
      setVideoState((prev) => ({
        ...prev,
        currentTime: videoRef.current.currentTime,
      }));
      timeline.current.style.setProperty(
        "--progress-position",
        videoRef.current.currentTime / videoRef.current.duration,
      );
    }
  }, []);

  const handleChangeVideoSettings = useCallback((type, value) => {
    // change video settings based on the variant type and value were passed
    switch (type) {
      case "quality":
        if (!isStreamingHls.current) break;
        if (hlsRef.current.levels[value]) {
          hlsRef.current.currentLevel = value;
        } else {
          hlsRef.current.currentLevel = -1;
          setVideoSettings((prev) => ({
            ...prev,
            quality: { ...defaultQuality[0] },
          }));
        }
        break;
      case "playbackSpeed":
        videoRef.current.playbackRate = value;
        break;
    }
  }, []);

  const handleFullScreen = useCallback(() => {
    if (document.fullscreenElement == null) {
      if (container.current.requestFullscreen) {
        container.current.requestFullscreen();
      } else if (container.current.webkitRequestFullscreen) {
        // Safari
        container.current.webkitRequestFullscreen();
      } else if (container.current.msRequestFullscreen) {
        // IE/Edge
        container.current.msRequestFullscreen();
      }
    } else {
      document.exitFullscreen();
    }
  }, []);

  const handleAddScrubbing = useCallback((e) => {
    // Add scrubbing when mouse is over the timeline and mouse left button is down for timelineContainer element
    if (e.buttons !== 1) return;
    isScrubbing.current = true;
    if (isScrubbing.current) {
      timeline.current.style.setProperty("--scale", 1);
      timeline.current.style.height = "100%";
      window.addEventListener("selectstart", handleWindowDisableSelects);
    }
    wasPaused.current = videoRef.current.paused;
    if (!videoRef.current.paused) {
      videoRef.current.pause();
      setVideoState((prev) => ({ ...prev, paused: true }));
    }
  }, []);

  const handleRemoveScrubbing = useCallback((e) => {
    // Remove scrubbing when mouse left button is up for window event
    if (isScrubbing.current) {
      isScrubbing.current = false;
      timeline.current.style.setProperty("--scale", 0);
      timeline.current.style.height = "3px";
      if (!wasPaused.current) {
        videoRef.current.play();
        setVideoState((prev) => ({ ...prev, paused: false }));
      }
      window.removeEventListener("selectstart", handleWindowDisableSelects);
    }
  }, []);

  const handleScrubbingUpdateTimeline = useCallback((e) => {
    // handle adjust video timeline when user is scrubbing and moving cursor
    if (!isScrubbing.current) return;

    const rect = timeLineContainer.current.getBoundingClientRect();

    const percent =
      Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;

    videoRef.current.currentTime = videoRef.current.duration * percent;

    timeline.current.style.setProperty("--progress-position", percent);
  }, []);

  useLayoutEffect(() => {
    if (data) {
      setOpenSettings(false);

      isStreamingHls.current = Hls.isSupported() && data?.stream;

      if (data?.stream && isStreamingHls.current) {
        const hls = new Hls();
        hlsRef.current = hls;
        hls.loadSource(
          `${import.meta.env.VITE_BASE_API_URI}/file/videomaster/${
            data?.stream
          }`,
        );

        hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
          if (data.levels.length > 1) {
            const availableQuality = data.levels
              .map((item, id) => {
                let result;
                if (item.height === 1080) {
                  result = {
                    title: "1080 HD",
                    value: id,
                    res: 1080,
                  };
                } else if (item.height > 1080) {
                  result = {
                    title: `${Math.ceil(
                      (item.width * item.height) / (1920 * 1080),
                    )}K`,
                    value: id,
                    res: item.height,
                  };
                } else {
                  result = {
                    title: `${item.height}p`,
                    value: id,
                    res: item.height,
                  };
                }

                return result;
              })
              .reverse();
            qualityDisplay.current = [...availableQuality, ...defaultQuality];
          } else {
            qualityDisplay.current = defaultQuality;
          }
        });

        hls.attachMedia(videoRef.current);
      } else {
        videoSrc.current = data?.video;
        videoRef.current.src = `${import.meta.env.VITE_BASE_API_URI}${
          import.meta.env.VITE_VIEW_VIDEO_API
        }${data?.video}?type=video`;
        qualityDisplay.current = defaultQuality;
      }
    }

    return () => {
      timeline.current.style.setProperty("--progress-position", 0);
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [data]);

  useEffect(() => {
    if (videoMode === playerMode) {
      videoRef.current.play();
      window.addEventListener("keydown", handleWindowKeyboardDown);
    } else {
      videoRef.current.pause();
    }

    return () => {
      if (videoMode === playerMode) {
        window.removeEventListener("keydown", handleWindowKeyboardDown);
      }
    };
  }, [videoMode]);

  useLayoutEffect(() => {
    container.current.addEventListener("mouseover", handleContainerMouseOver);
    container.current.addEventListener("mousemove", handleContainerMouseMove);

    container.current.addEventListener("mouseout", handleContainerMouseOut);

    container.current.addEventListener(
      "contextmenu",
      preventContainerMenuContext,
    );

    timeLineContainer.current.addEventListener("mousedown", handleAddScrubbing);

    timeLineContainer.current.addEventListener(
      "mouseout",
      handleTimelineContainerMouseOut,
    );

    videoRef.current.addEventListener("progress", handleVideoProgress);

    videoRef.current.addEventListener("timeupdate", handleVideoTimeUpdate);

    videoRef.current.addEventListener("play", handleVideoPlay);

    videoRef.current.addEventListener("pause", handleVideoPause);

    window.addEventListener("mouseup", handleRemoveScrubbing);
    window.addEventListener("mousemove", handleScrubbingUpdateTimeline);

    return () => {
      container.current.removeEventListener(
        "mouseover",
        handleContainerMouseOver,
      );

      container.current.removeEventListener(
        "mouseout",
        handleContainerMouseOut,
      );

      container.current.removeEventListener(
        "mousemove",
        handleContainerMouseMove,
      );

      container.current.removeEventListener(
        "contextmenu",
        preventContainerMenuContext,
      );

      timeLineContainer.current.removeEventListener(
        "mousedown",
        handleAddScrubbing,
      );

      timeLineContainer.current.removeEventListener(
        "mouseout",
        handleContainerMouseDown,
      );

      videoRef.current.removeEventListener("progress", handleVideoProgress);

      videoRef.current.removeEventListener("timeupdate", handleVideoTimeUpdate);

      videoRef.current.removeEventListener("play", handleVideoPlay);

      videoRef.current.removeEventListener("pause", handleVideoPause);

      window.removeEventListener("mouseup", handleRemoveScrubbing);

      window.removeEventListener("mousemove", handleScrubbingUpdateTimeline);
    };
  }, []);

  useLayoutEffect(() => {
    if (videoSettings) {
      // set video local settings based on videoSettings changes
      localStorage.setItem(
        "video_player_settings",
        JSON.stringify(videoSettings),
      );

      // listen event level changed when video is streaming with hls not chunksize
      if (isStreamingHls.current) {
        hlsRef.current.on(Hls.Events.LEVEL_SWITCHED, function (event, data) {
          console.log("Switched to level:", data.level);
          // Xem chất lượng đã thay đổi
          const levels = [...qualityDisplay.current]
            .splice(0, qualityDisplay.current.length - 1)
            .reverse();

          if (videoSettings.quality.value === -1) {
            setVideoSettings((prev) => ({
              ...prev,
              quality: {
                ...prev.quality,
                res: levels[data.level].value,
              },
            }));
          }
        });
      }

      // adjust video settings when videoSettings changed and not the first time settings
      // to prevent duplicate adjust from the callback handleVideoloaded
      if (!firstTimeSetting.current) {
        const key = getObjectChangedKey(
          videoSettings,
          prevVideoSettings.current,
        );
        if (key) {
          handleChangeVideoSettings(key, videoSettings[key].value);
        }
      }

      prevVideoSettings.current = videoSettings;
    }

    return () => {
      // stop listen level changed events
      if (isStreamingHls.current) {
        hlsRef.current.off(Hls.Events.LEVEL_SWITCHED);
      }
    };
  }, [videoSettings]);

  useLayoutEffect(() => {
    videoRef.current.addEventListener("loadedmetadata", handleVideoloaded);
    return () => {
      videoRef.current.removeEventListener("loadedmetadata", handleVideoloaded);
    };
  }, [data, videoSettings]);

  useLayoutEffect(() => {
    container.current.addEventListener("mousedown", handleContainerMouseDown);
    window.addEventListener("mousedown", handleWindowMouseDown);

    return () => {
      window.removeEventListener("mousedown", handleWindowMouseDown);

      container.current.removeEventListener(
        "mousedown",
        handleContainerMouseDown,
      );
    };
  }, [openedSettings]);

  return (
    <div
      className={`bg-[#000000] relative rounded-[12px] ${containerStyle}`}
      ref={container}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div
        className={`absolute inset-0 z-[99] flex flex-col opacity-0 `}
        ref={controls}
      >
        <div className='flex-1' ref={togglePlayArea}></div>
        <div
          className='w-full timeline-container h-[7px]  px-[12px]'
          ref={timeLineContainer}
        >
          <div
            className='w-full h-[3px] bg-[rgba(100,100,100,.5)] cursor-pointer  time-line'
            ref={timeline}
          >
            <div className='thumb-indicator'></div>
          </div>
        </div>
        <div className='w-full flex  h-[48px] px-[12px]'>
          <div className='flex-1 flex items-center'>
            <button
              type='button'
              className='fill-white'
              onClick={handlePlayVideo}
            >
              <div className='size-[36px] 2xsm:size-[48px]'>
                {videoState.paused ? <Play2Icon /> : <PauseIcon />}
              </div>
            </button>

            <button type='button' className='fill-white'>
              <div className='size-[36px] 2xsm:size-[48px]'>
                <NextIcon />
              </div>
            </button>

            <AudioRange
              videoRef={videoRef}
              audioScrubbing={audioScrubbing}
              volume={volume}
              setVolume={setVolume}
            />

            {videoState?.duration && (
              <div
                className='px-[5px] text-[#dddddd] text-[13px] leading-[36px] 2xsm:leading-[48px]'
                style={{ userSelect: "none" }}
              >
                <span>{durationCalc(Math.floor(videoState.currentTime))} </span>
                /<span> {durationCalc(Math.floor(videoState.duration))}</span>
              </div>
            )}
          </div>
          <div className='w-fit'>
            <button
              type='button'
              className={`fill-white  px-[2px] size-[36px] 2xsm:size-[48px]
                transition-transform ${openedSettings && "rotate-90"}`}
              onClick={(e) => {
                setOpenSettings((prev) => !prev);
              }}
              ref={settingsBtn}
            >
              <FillSettingIcon />
            </button>
            <button
              type='button'
              className='fill-white  px-[2px] size-[36px] 2xsm:size-[48px]'
              onClick={() => {
                setVideoMode((prev) =>
                  prev === "normal" ? "theater" : "normal",
                );
              }}
            >
              <TheaterIcon />
            </button>
            <button
              type='button'
              className='fill-white  px-[2px] size-[36px] 2xsm:size-[48px]'
              onClick={handleFullScreen}
            >
              <FullScreenIcon />
            </button>
          </div>
        </div>
      </div>

      <VideoSettingMenu
        settingRef={settingMenuRef}
        openedSettings={openedSettings}
        setOpenSettings={setOpenSettings}
        videoSettings={videoSettings}
        setVideoSettings={setVideoSettings}
        qualityDisplay={qualityDisplay}
      />

      <video
        draggable={false}
        className={`${
          !videoState && "opacity-0"
        } size-full aspect-video object-contain`}
        ref={videoRef}
      ></video>
    </div>
  );
};
export default Video;
