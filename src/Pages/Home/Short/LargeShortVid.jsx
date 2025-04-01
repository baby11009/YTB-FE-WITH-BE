import {
  LikeIcon,
  DisLikeIcon,
  CommentIcon,
  ThickShareIcon,
  Setting2Icon,
  LoadShortImgIcon,
  DescriptionIcon,
  SubtitlesIcon,
  AddPLIcon,
  NoSuggetIcon,
  DiaryIcon,
  FeedBackIcon,
  MuteAudiIcon,
  LowAudioIcon,
  PlayIcon,
  ThickAudioIcon,
  StopIcon,
  PauseIcon,
  ShortFullScreenIcon,
  ShortFullScreenExitIcon,
} from "../../../Assets/Icons";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { formatNumber } from "../../../util/numberFormat";
import { useAuthContext } from "../../../Auth Provider/authContext";
import { CustomeFuncBox } from "../../../Component";
import request from "../../../util/axios-base-url";
import { Link } from "react-router-dom";
import Hls from "hls.js";

const ConfirmUnsubscribe = ({
  handleUnsubscribe,
  channelEmail,
  handleCancel,
}) => {
  return (
    <div className=' max-w-[688px] bg-black-21 rounded-[10px]'>
      <div className='mt-[24px]'>
        <div className='px-[24px] mt-[4px] mb-[24px] text-nowrap'>
          Unsubscribe from {channelEmail} ?
        </div>
        <div className='flex justify-end items-center py-[8px]'>
          <button
            onClick={() => {
              handleCancel();
            }}
            className='px-[16px] leading-[36px] text-[14px] font-[500] rounded-[18px] hover:bg-black-0.1'
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              await handleUnsubscribe();
              handleCancel();
            }}
            className='px-[16px] leading-[36px] text-[14px] font-[500] rounded-[18px] text-blue-3E hover:bg-[#263850'
          >
            Unsubscribe
          </button>
        </div>
      </div>
    </div>
  );
};

const CustomeButton = ({
  Icon,
  text,
  title,
  handleOnClick,
  buttonCss,
  iconCss,
}) => {
  return (
    <div className='flex flex-col items-center w-[48px] '>
      <button
        className={`w-[48px] h-[48px] rounded-[50%] flex items-center justify-center
          ${
            buttonCss
              ? buttonCss
              : "bg-hover-black hover:bg-[rgba(255,255,255,0.2)]"
          }
          `}
        title={title}
        onClick={() => {
          if (handleOnClick) {
            handleOnClick();
          }
        }}
      >
        <div className={`${iconCss ? iconCss : ""}`}>
          <Icon />
        </div>
      </button>
      {text && (
        <span className='mt-[4px] text-[14px] leading-[20px] cursor-default overflow-hidden t-1-ellipsis'>
          {text}
        </span>
      )}
    </div>
  );
};

const funcList = [
  {
    id: 1,
    text: "Thông tin mô tả",
    icon: <DescriptionIcon />,
  },
  {
    id: 2,
    text: "Lưu vào danh sách phát",
    icon: <AddPLIcon />,
  },
  {
    id: 3,
    text: "Phụ đề",
    icon: <SubtitlesIcon />,
  },
  {
    id: 4,
    text: "Không đề xuất kênh này",
    icon: <NoSuggetIcon />,
  },
  {
    id: 5,
    text: "Báo cáo vi phạm",
    icon: <DiaryIcon />,
  },
  {
    id: 6,
    text: "Gửi ý kiến phản hồi",
    icon: <FeedBackIcon />,
  },
];

const LargeShortVid = ({
  shortData,
  refetch,
  setRefetch,
  volume,
  setVolume,
  handleRefetchShortData,
  handleSetCurrentShort,
  fullScreen,
  handleToggleFullScreen,
  handleToggleSideMenu,
}) => {
  const { setIsShowing, modalContainerRef, user } = useAuthContext();

  const hlsRef = useRef();

  const videoRef = useRef();

  const containRef = useRef();

  const controlRef = useRef();

  const timelineContainerRef = useRef();

  const timelineRef = useRef();

  const isScrubbing = useRef();

  const wasPaused = useRef();

  const [opened, setOpened] = useState(false);

  const [videoState, setVideoState] = useState({ paused: true });

  const handleStreamingVideo = () => {
    if (Hls.isSupported() && shortData?.stream) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(
        `${import.meta.env.VITE_BASE_API_URI}/file/videomaster/${
          shortData?.stream
        }`,
      );
      hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
        console.log("video resolution levels", data.levels.length);
      });

      hls.attachMedia(videoRef.current);
    } else {
      videoRef.current.src = `${import.meta.env.VITE_BASE_API_URI}${
        import.meta.env.VITE_VIEW_VIDEO_API
      }${shortData?.video}?type=video`;
    }
  };

  const fetchData = async () => {
    await request
      .get(`/data/video/${shortData._id}`)
      .then(({ data }) => {
        handleRefetchShortData(data.data);
      })
      .catch((err) => {
        alert(err.response.data.msg);
      })
      .finally(() => {
        setRefetch(false);
      });
  };

  const handleToggleReact = async (type) => {
    if (!user) {
      alert(`Signed in to ${type} the short`);
      return;
    }
    await request
      .post("/user/video-react", { videoId: shortData._id, type: type })
      .then(() => {
        setRefetch(true);
      });
  };

  const handleSubscribe = async () => {
    if (!user) {
      alert(`Please login to subscribe to ${shortData?.channel_info?.email}`);
      return;
    }
    await request
      .post("/user/subscription", {
        userId: user?._id,
        channelId: shortData?.channel_info?._id,
      })
      .then(() => {
        setRefetch(true);
      })
      .catch((err) => console.log(err));
  };

  const handleUnsubscribe = async () => {
    if (!user) {
      alert("Please sign in to start subscription");
      return;
    }

    await request
      .delete(`/user/subscription/${shortData.channel_info._id}`)
      .then(() => {
        setRefetch(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleTogglePlayPause = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  const handleVideoPlay = (e) => {
    setVideoState((prev) => ({ ...prev, paused: false }));
  };

  const handleVideoPause = (e) => {
    setVideoState((prev) => ({ ...prev, paused: true }));
  };

  const handleVideoEnd = (e) => {
    videoRef.current.play();
  };

  const handleVideoTimeUpdate = (e) => {
    const percent =
      videoRef.current.currentTime / videoRef.current.duration || 0;
    timelineRef.current.style.setProperty("--progress-position", percent);
  };

  const handleTimelineContainerMouseOver = (e) => {
    // Show thumb indicator
    timelineRef.current.style.setProperty("--scale", 1);
  };

  const handleTimelineContainerMouseOut = (e) => {
    // hidden thumb indicator
    timelineRef.current.style.setProperty("--scale", 0);

    timelineRef.current.style.setProperty("--preview-progress", 0);
  };

  const handleTimelineContainerMouseMove = (e) => {
    const rect = timelineContainerRef.current.getBoundingClientRect();
    const percent =
      Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;

    timelineRef.current.style.setProperty("--preview-progress", percent);
  };

  const handleWindowDisableSelects = (event) => {
    event.preventDefault();
  };

  const handleTimelineMouseDown = (e) => {
    // handle when user want to seek to timeline
    if (e.buttons !== 1) return;
    // add scrubbing event when user left click
    isScrubbing.current = true;

    if (isScrubbing.current) {
      window.addEventListener("selectstart", handleWindowDisableSelects);
    }

    wasPaused.current = videoRef.current.paused;
    if (!videoRef.current.paused) {
      videoRef.current.pause();
    }
  };

  const handleWindowMouseUp = () => {
    // remove scrubbing if mouse is out of timeline position
    if (isScrubbing.current) {
      isScrubbing.current = false;

      if (!wasPaused.current) {
        videoRef.current.play();
      }
      window.removeEventListener("selectstart", handleWindowDisableSelects);
    }
  };

  const handleWindowMouseMove = (e) => {
    // seek to the timeline that user end scrubbing
    if (!isScrubbing.current) return;

    const rect = timelineContainerRef.current.getBoundingClientRect();

    const percent =
      Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;

    videoRef.current.currentTime = videoRef.current.duration * percent;

    timelineRef.current.style.setProperty("--progress-position", percent);
  };

  const handleWindowMouseDown = (e) => {
    //update video timline  when user left click the timeline ref

    if (!(e.target === timelineRef.current)) return;
    const rect = timelineContainerRef.current.getBoundingClientRect();
    const percent =
      Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
    videoRef.current.currentTime = videoRef.current.duration * percent;
    timelineRef.current.style.setProperty("--progress-position", percent);
  };

  const isElementInView = (element, threshold = 1) => {
    return new Promise((resolve) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.intersectionRatio >= threshold) {
            resolve(true);
          } else {
            resolve(false);
          }
          observer.disconnect();
        },
        { threshold: [threshold] },
      );
      observer.observe(element);
    });
  };

  const checkVisibility = async () => {
    if (containRef.current) {
      const isInView = await isElementInView(controlRef.current);

      if (!isInView && !videoRef.current.paused) {
        videoRef.current.pause();
      } else if (isInView) {
        handleSetCurrentShort();
        videoRef.current.play().catch((err) => {});
      }
    }
  };

  useLayoutEffect(() => {
    if (refetch) {
      fetchData();
    }
  }, [refetch]);

  useLayoutEffect(() => {
    handleStreamingVideo();

    timelineRef.current.style.setProperty("--scale", 0);

    videoRef.current.addEventListener("play", handleVideoPlay);

    videoRef.current.addEventListener("pause", handleVideoPause);

    videoRef.current.addEventListener("timeupdate", handleVideoTimeUpdate);

    videoRef.current.addEventListener("ended", handleVideoEnd);

    timelineContainerRef.current.addEventListener(
      "mouseover",
      handleTimelineContainerMouseOver,
    );

    timelineContainerRef.current.addEventListener(
      "mouseout",
      handleTimelineContainerMouseOut,
    );

    timelineContainerRef.current.addEventListener(
      "mousemove",
      handleTimelineContainerMouseMove,
    );

    timelineRef.current.addEventListener("mousedown", handleTimelineMouseDown);

    window.addEventListener("mouseup", handleWindowMouseUp);

    window.addEventListener("mousemove", handleWindowMouseMove);

    window.addEventListener("mousedown", handleWindowMouseDown);

    checkVisibility();

    window.addEventListener("scroll", checkVisibility);

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }

      videoRef.current.removeEventListener("play", handleVideoPlay);

      videoRef.current.removeEventListener("pause", handleVideoPause);

      videoRef.current.removeEventListener("timeupdate", handleVideoTimeUpdate);

      timelineContainerRef.current.removeEventListener(
        "mouseover",
        handleTimelineContainerMouseOver,
      );

      timelineContainerRef.current.removeEventListener(
        "mouseout",
        handleTimelineContainerMouseOut,
      );

      timelineRef.current.style.setProperty("--scale", 1);

      window.removeEventListener("mouseup", handleWindowMouseUp);

      window.removeEventListener("mousemove", handleWindowMouseMove);

      window.removeEventListener("mousedown", handleWindowMouseDown);

      window.removeEventListener("scroll", checkVisibility);
    };
  }, []);

  useEffect(() => {
    videoRef.current.volume = volume;
  }, [volume]);

  return (
    <div
      className='flex w-[calc(56.25vh-54px)] h-[calc(100vh-96px)]  box-content px-[12px] pb-[16px]'
      ref={containRef}
    >
      <div className='relative h-full'>
        <video
          className='h-full object-cover object-center rounded-[12px]'
          ref={videoRef}
        ></video>

        {/* Overlay */}
        <div className='absolute z-[99] left-0 w-full h-full flex top-0'>
          <div
            className={`min-w-full h-full rounded-[12px] flex flex-col ${
              videoState.paused ? "opacity-[1]" : " opacity-0 hover:opacity-[1]"
            }`}
            ref={controlRef}
          >
            <div className='flex-1 flex flex-col'>
              <div className='px-[16px] pt-[16px] pb-[32px] flex items-center gap-[16px]'>
                <button
                  className='size-[48px] rounded-[50%] bg-[rgba(0,0,0,0.3)] hover:bg-[rgba(40,40,40,0.6)] p-[12px]'
                  onClick={handleTogglePlayPause}
                >
                  <div className='w-[24px]'>
                    {videoState.paused ? <PlayIcon /> : <StopIcon />}
                  </div>
                </button>
                <div className='flex-1'>
                  <div
                    className='w-[48px] h-[48px] rounded-[50px] bg-[rgba(0,0,0,0.3)] hover:bg-[rgba(40,40,40,0.6)] 
                    transition-[width] duration-[0.25s] ease-linear group hover:w-full flex items-center'
                  >
                    <button
                      className='size-[48px] p-[12px]'
                      onClick={() => setVolume((prev) => (prev > 0 ? 0 : 1))}
                    >
                      <div className='w-[24px]'>
                        {volume === 0 ? (
                          <MuteAudiIcon />
                        ) : volume < 0.5 ? (
                          <LowAudioIcon />
                        ) : (
                          <ThickAudioIcon />
                        )}
                      </div>
                    </button>
                    <div
                      className='w-0 h-full overflow-hidden opacity-0 group-hover:opacity-[1] group-hover:flex-1 
                        flex items-center justify-center pr-[12px]'
                    >
                      <input
                        type='range'
                        max={1}
                        min={0}
                        step={0.01}
                        className='cursor-pointer cs-range'
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                </div>
                <button
                  className='size-[48px] rounded-[50%] bg-[rgba(0,0,0,0.3)] hover:bg-[rgba(40,40,40,0.6)] p-[12px]'
                  onClick={handleToggleFullScreen}
                >
                  <div className='w-[24px]'>
                    {fullScreen ? (
                      <ShortFullScreenExitIcon />
                    ) : (
                      <ShortFullScreenIcon />
                    )}
                  </div>
                </button>
              </div>
              <div className='flex-1 relative' onClick={handleTogglePlayPause}>
                <div className='absolute left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%]'>
                  {videoState.paused ? (
                    <div
                      key={"play"}
                      className={` animate-buttonPing
                size-[60px] bg-[rgba(0,0,0,0.5)] rounded-[50%] origin-center 
                flex items-center justify-center`}
                    >
                      <div className='w-[36px]'>
                        <PlayIcon />
                      </div>
                    </div>
                  ) : (
                    <div
                      key={"pause"}
                      className={`  animate-buttonPing
                  size-[60px] bg-[rgba(0,0,0,0.5)] rounded-[50%]  origin-center 
                  flex items-center justify-center  `}
                    >
                      <div className='w-[36px]'>
                        <PauseIcon />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className='absolute bottom-0 w-full px-[8px]'>
                <div
                  className=' w-full h-[3px] timeline-container cursor-pointer'
                  ref={timelineContainerRef}
                >
                  <div
                    className='w-full h-[3px] bg-[rgba(255,255,255,0.3)] cursor-pointer time-line'
                    ref={timelineRef}
                  >
                    <div className='thumb-indicator'></div>
                  </div>
                </div>
              </div>
            </div>
            <div className='px-[16px] pt-[16px] mb-[24px]'>
              <div className='pt-[8px] flex items-center'>
                <Link>
                  <img
                    src={`${import.meta.env.VITE_BASE_API_URI}${
                      import.meta.env.VITE_VIEW_AVA_API
                    }${shortData?.channel_info?.avatar}`}
                    alt=''
                    className='size-[32px] rounded-[50%] bg-[#ccc]'
                  />
                </Link>
                <Link className='px-[8px]'>
                  <span className='leading-[20px] text-[14px] font-[500]'>
                    {shortData?.channel_info?.email}
                  </span>
                </Link>
                {shortData?.subscription_info ? (
                  <button
                    className=' hover:bg-[rgba(255,255,255,0.2)]
                  bg-hover-black text-[12px] leading-[32px] font-[550] px-[12px] rounded-[16px]'
                    onClick={() => {
                      setIsShowing(
                        <ConfirmUnsubscribe
                          handleUnsubscribe={handleUnsubscribe}
                          channelEmail={shortData?.channel_info?.email}
                          handleCancel={() => {
                            setIsShowing(undefined);
                          }}
                          modalContainerRef={modalContainerRef}
                        />,
                      );
                    }}
                  >
                    <span>Subscribed</span>
                  </button>
                ) : (
                  <button
                    className=' hover:bg-[#e6e6e6] text-black
                bg-white text-[12px] leading-[32px] font-[550] px-[12px] rounded-[16px]'
                    onClick={async () => {
                      await handleSubscribe();
                    }}
                  >
                    <span>Subscribe</span>
                  </button>
                )}
              </div>
              <div
                className='pt-[8px] line-clamp-3 text-ellipsis whitespace-pre-wrap cursor-pointer'
                onClick={() => {
                  handleToggleSideMenu("details");
                }}
              >
                <span className='text-[14px] leading-[20px]'>
                  {shortData.title}
                </span>
              </div>
            </div>
          </div>
          <div className='flex flex-col justify-end items-center px-[12px] pt-[12px] w-fit gap-[16px]'>
            <CustomeButton
              text={formatNumber(shortData?.like)}
              Icon={LikeIcon}
              title='I like this video'
              buttonCss={
                shortData?.react_info?.type === "like"
                  ? "bg-white-F1 hover:bg-white-D9"
                  : undefined
              }
              iconCss={
                shortData?.react_info?.type === "like"
                  ? "text-black"
                  : undefined
              }
              handleOnClick={() => {
                handleToggleReact("like");
              }}
            />
            <CustomeButton
              text={formatNumber(shortData?.dislike)}
              Icon={DisLikeIcon}
              title="I don't like this video"
              buttonCss={
                shortData?.react_info?.type === "dislike"
                  ? "bg-white-F1 hover:bg-white-D9"
                  : undefined
              }
              iconCss={
                shortData?.react_info?.type === "dislike"
                  ? "text-black"
                  : undefined
              }
              handleOnClick={() => {
                handleToggleReact("dislike");
              }}
            />
            <CustomeButton
              text={formatNumber(shortData?.totalCmt)}
              Icon={CommentIcon}
              title={"Comment"}
              handleOnClick={() => {
                handleToggleSideMenu("comment");
              }}
            />
            <CustomeButton text='Share' Icon={ThickShareIcon} title={"Share"} />
            <div className='relative'>
              <CustomeButton
                Icon={Setting2Icon}
                handleOnClick={() => {
                  setOpened((prev) => !prev);
                }}
              />
              {opened && (
                <CustomeFuncBox
                  style={"w-[241px] left-0 bottom-[100%]"}
                  setOpened={setOpened}
                  funcList1={funcList}
                />
              )}
            </div>
            <div className='w-[40px] h-[40px] border-[1px] border-white rounded-[6px] flex items-center justify-center'>
              <LoadShortImgIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LargeShortVid;
