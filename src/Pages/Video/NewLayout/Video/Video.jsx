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

const Video = ({ data }) => {
  const hlsRef = useRef();

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

  const prevVideoSettings = useRef();

  const qualityDisplay = useRef(defaultQuality);

  const firstTimeSetting = useRef(true);

  const [videoLoaded, setVideoLoaded] = useState(false);

  const [videoState, setVideoState] = useState({ paused: true });

  const [openedSettings, setOpenSettings] = useState(false);

  const [videoSettings, setVideoSettings] = useState(() => {
    if (
      window.localStorage.getItem("video_player_settings") &&
      window.localStorage.getItem("video_player_settings") !== "undefined"
    ) {
      const settings = JSON.parse(
        localStorage.getItem("video_player_settings"),
      );

      prevVideoSettings.current = settings;
      return settings;
    } else {
      localStorage.setItem(
        "video_player_settings",
        JSON.stringify(defaultSettings),
      );
      prevVideoSettings.current = defaultSettings;
      return defaultSettings;
    }
  });

  const handlePlayVideo = useCallback(() => {
    videoRef.current.paused
      ? videoRef.current.play()
      : videoRef.current.pause();
    setVideoState((prev) => ({ ...prev, paused: videoRef.current.paused }));
  }, []);

  const handleChangeVideoSettings = useCallback((type, value) => {
    switch (type) {
      case "quality":
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
    }
  }, []);

  const disableSelect = useCallback((event) => {
    event.preventDefault();
  }, []);

  const handleAddScrubbing = useCallback((e) => {
    if (e.buttons !== 1) return;
    isScrubbing.current = true;
    if (isScrubbing.current) {
      timeline.current.style.setProperty("--scale", 1);
      timeline.current.style.height = "100%";
      window.addEventListener("selectstart", disableSelect);
    }
    wasPaused.current = videoRef.current.paused;
    if (!videoRef.current.paused) {
      videoRef.current.pause();
      setVideoState((prev) => ({ ...prev, paused: true }));
    }
  }, []);

  const handleRemoveScrubbing = useCallback((e) => {
    if (isScrubbing.current) {
      isScrubbing.current = false;
      timeline.current.style.setProperty("--scale", 0);
      timeline.current.style.height = "3px";
      if (!wasPaused.current) {
        videoRef.current.play();
        setVideoState((prev) => ({ ...prev, paused: false }));
      }
      window.removeEventListener("selectstart", disableSelect);
    }
  }, []);

  const handleScrubbingUpdateTimeline = useCallback((e) => {
    if (!isScrubbing.current) return;

    const rect = timeLineContainer.current.getBoundingClientRect();

    const percent =
      Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;

    videoRef.current.currentTime = videoRef.current.duration * percent;

    timeline.current.style.setProperty("--progress-position", percent);
  }, []);

  const handleWindowMouseDown = useCallback(
    (e) => {
      // Click Update Timeline

      if (
        !settingsBtn.current.contains(e.target) &&
        !settingMenuRef.current.contains(e.target)
      ) {
        setOpenSettings(false);
      }

      if (!e.target.contains(timeline.current)) return;
      const rect = timeLineContainer.current.getBoundingClientRect();

      const percent =
        Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;

      videoRef.current.currentTime = videoRef.current.duration * percent;

      timeline.current.style.setProperty("--progress-position", percent);
    },
    [openedSettings],
  );

  const handleMouseOver = useCallback((e) => {
    controls.current.style.opacity = 1;
  }, []);

  const handleMouseOut = useCallback((e) => {
    if (isScrubbing.current || audioScrubbing.current) return;

    controls.current.style.opacity = 0;
  }, []);

  const handleContainerMouseDown = useCallback(
    (e) => {
      if (openedSettings) return;

      if (e.target.contains(togglePlayArea.current)) {
        handlePlayVideo();
      }
    },
    [openedSettings],
  );

  const preventMenuContext = useCallback((e) => {
    e.preventDefault(); // Ngừng sự kiện contextmenu, không hiển thị menu chuột phải
  }, []);

  const handleVideoloaded = useCallback(() => {
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

  const handleVideoProgress = useCallback(() => {
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

  useLayoutEffect(() => {
    if (data) {
      setOpenSettings(false);
      if (data?.stream && Hls.isSupported()) {
        const hls = new Hls();
        hlsRef.current = hls;
        hls.loadSource(
          `${import.meta.env.VITE_BASE_API_URI}/file/videomaster/${
            data?.stream
          }`,
        );
        // hls.currentLevel = -1;

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
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [data]);

  useLayoutEffect(() => {
    container.current.addEventListener("mouseover", handleMouseOver);
    container.current.addEventListener("mouseout", handleMouseOut);
    container.current.addEventListener("contextmenu", preventMenuContext);

    timeLineContainer.current.addEventListener("mousedown", handleAddScrubbing);

    timeLineContainer.current.addEventListener("mouseout", () => {
      timeline.current.style.setProperty(
        "--preview-progress",
        previewProgress.current,
      );
    });

    videoRef.current.addEventListener("progress", handleVideoProgress);

    videoRef.current.addEventListener("timeupdate", handleVideoTimeUpdate);

    window.addEventListener("mouseup", handleRemoveScrubbing);
    window.addEventListener("mousemove", handleScrubbingUpdateTimeline);

    return () => {
      window.removeEventListener("mouseup", handleRemoveScrubbing);
      window.removeEventListener("mousemove", handleScrubbingUpdateTimeline);
    };
  }, []);

  useLayoutEffect(() => {
    if (videoSettings) {
      localStorage.setItem(
        "video_player_settings",
        JSON.stringify(videoSettings),
      );

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
      hlsRef.current.off(Hls.Events.LEVEL_SWITCHED);
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
      className='bg-[#000000] relative  rounded-[12px]'
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

            <AudioRange videoRef={videoRef} audioScrubbing={audioScrubbing} />

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
              className='fill-white  px-[2px] size-[36px] 2xsm:size-[48px]'
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
        } w-full aspect-video object-contain`}
        ref={videoRef}
      ></video>
    </div>
  );
};
export default Video;
