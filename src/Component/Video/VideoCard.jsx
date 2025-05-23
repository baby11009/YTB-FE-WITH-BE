import {
  Verification,
  Setting2Icon,
  BlockIcon,
  AddWLIcon,
  DownloadIcon,
  ShareIcon,
  NoSuggetIcon,
  WatchedIcon,
  DiaryIcon,
  LaterIcon,
  PlayListIcon,
  CloseIcon,
  SaveIcon,
} from "../../Assets/Icons";
import { motion, useAnimate } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CustomeFuncBox } from "..";
import { timeFormat2 } from "../../util/timeforMat";
import { formatNumber } from "../../util/numberFormat";
import { durationCalc } from "../../util/durationCalc";
import { useAuthContext } from "../../Auth Provider/authContext";
import PlaylistModal from "../Modal/PlaylistModal";
import request from "../../util/axios-base-url";

const duration = 12500;

const HoverButton = ({ title, icon }) => {
  const [scope, animate] = useAnimate();

  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (scope.current) {
      if (hovered) {
        animate(
          scope.current,
          {
            backgroundColor: "rgba(0, 0, 0,1)",
          },
          {
            duration: 0,
            type: "tween",
          },
        );
        animate(
          "h3",
          {
            transform: "translateX(0)",
          },
          {
            duration: 0.2,
            delay: 0.4,
            type: "tween",
          },
        );
      } else {
        animate(
          scope.current,
          {
            backgroundColor: "rgba(0, 0, 0,.8)",
          },
          {
            duration: 0,
            type: "tween",
          },
        );
        animate(
          "h3",
          {
            transform: "translateX(100%)",
          },
          {
            duration: 0.3,
            type: "tween",
          },
        );
      }
    }
  }, [hovered]);

  return (
    <motion.button
      className={`m-[8px] w-[28px] h-[28px] bg-[rgba(0,0,0,.8)] rounded-[4px]
      flex items-center justify-center relative z-[10]`}
      ref={scope}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className='block overflow-hidden absolute right-[24px] rounded-l-[4px] 
          text-nowrap text-[12px] leading-[28px] font-[500]'
      >
        <h3 className='translate-x-[100%] bg-[#000000] pl-[8px] pr-[6px]'>
          {title}
        </h3>
      </div>
      <div onMouseEnter={() => setHovered(true)}>{icon}</div>
    </motion.button>
  );
};

const VideoCard = ({
  data,
  showCloseBtn,
  layout,
  style,
  styleInline,
  ctContainerStyle,
  infoStyle,
  titleStyle,
  descStyle,
  thumbStyle,
  thumbSize,
  thumbStyleInline,
  imgStyle,
  noFunc2,
  playlistId,
}) => {
  const { setShowHover, handleCursorPositon, setIsShowing, user, addToaster } =
    useAuthContext();

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/channel/${data?.channel_info?.email}/home`);
  };

  const funcList1 = [
    {
      id: 1,
      text: "Add to queue",
      icon: <AddWLIcon />,
    },
    {
      id: 2,
      text: "Save to watch later",
      icon: <WatchedIcon />,
      renderCondition: !!user,
      handleOnClick: async () => {
        await request
          .patch("/client/playlist/wl", {
            videoIdList: [data?._id],
          })
          .then((rsp) => {
            addToaster(rsp.data.msg);
          })
          .catch((err) => {
            console.error(err);
          });
      },
    },
    {
      id: 3,
      text: "Save to Playlist",
      icon: <SaveIcon />,
      handleOnClick: () => {
        setIsShowing(<PlaylistModal videoId={data?._id} />);
      },
      renderCondition: !!user,
    },
    {
      id: 4,
      text: "Download",
      icon: <DownloadIcon />,
    },
    {
      id: 5,
      text: "Share",
      icon: <ShareIcon />,
    },
  ];

  const funcList2 = [
    {
      id: 1,
      text: "Not interested",
      icon: <BlockIcon />,
    },
    {
      id: 2,
      text: "Don't recommend channel",
      icon: <NoSuggetIcon />,
    },
    {
      id: 3,
      text: "Report",
      icon: <DiaryIcon />,
    },
  ];

  return (
    <div
      className={`relative ${style || "mx-[8px] mb-[40px]"} group box-content`}
      style={styleInline}
    >
      <Link
        to={
          playlistId
            ? `/video?id=${data?._id}&list=${playlistId}`
            : `/video?id=${data?._id}`
        }
      >
        <div
          className={`relative overflow-hidden ${
            thumbStyle || "mb-[12px] rounded-[12px]"
          } `}
          style={thumbStyleInline}
        >
          <div className='aspect-video relative'>
            <img
              src={`${import.meta.env.VITE_BASE_API_URI}${
                import.meta.env.VITE_VIEW_THUMB_API
              }${data?.thumb}?${
                thumbSize ? thumbSize : "width=720&height=404"
              }&format=webp`}
              alt='thumbnail'
              className='size-full object-contain z-[2] relative'
            />
            <div
              className='absolute inset-0 z-[1] bg-no-repeat bg-cover bg-center  blur-[4px] '
              style={{
                backgroundImage: `url('${import.meta.env.VITE_BASE_API_URI}${
                  import.meta.env.VITE_VIEW_THUMB_API
                }${data?.thumb}?${
                  thumbSize ? thumbSize : "width=720&height=404"
                }&fit=cover')`,
              }}
            ></div>
          </div>

          {/* duration */}
          <div
            className='absolute bottom-0 right-0 bg-[rgba(0,0,0,0.6)] text-white px-[4px] py-[1px] 
          mr-[8px] mb-[8px] text-[12px] leading-[18px] rounded-[4px] z-[3]'
          >
            {durationCalc(data?.duration || duration)}
          </div>

          {/* progress bar */}

          {/* <div className='w-full absolute bottom-0 h-[4px] bg-gray-71'>
          <div
            className='absolute h-full bg-red-FF'
            style={{
              width: data.progress || progress + "%",
            }}
          ></div>
        </div> */}

          {user && (
            <div className='absolute right-0 top-0 group-hover:opacity-[1] opacity-0'>
              <HoverButton title={"Watch later"} icon={<LaterIcon />} />
              <HoverButton title={"Add to playlist"} icon={<PlayListIcon />} />
            </div>
          )}
        </div>
      </Link>

      <div className={`flex relative  ${ctContainerStyle}`}>
        <div
          className={`shrink-0 w-[36px] h-[36px] rounded-[50%] overflow-hidden cursor-pointer mr-[12px] ${imgStyle}`}
        >
          <img
            src={`${import.meta.env.VITE_BASE_API_URI}${
              import.meta.env.VITE_VIEW_AVA_API
            }${data?.channel_info?.avatar}?width=68&height=68`}
            alt='avatar'
          />
        </div>

        <div className='flex-1 pr-[24px] overflow-hidden'>
          <div className='flex overflow-hidden'>
            <div
              className={`t-ellipsis  mb-[4px] flex-1  ${
                titleStyle ||
                "line-clamp-2 text-[16px] leading-[22px] max-h-[44px] font-[500] whitespace-normal"
              }`}
              dangerouslySetInnerHTML={{
                __html: data?.title,
              }}
            ></div>
            {showCloseBtn && (
              <div
                className='size-[40px] rounded-[50%] flex items-center justify-center
                 active:bg-black-0.2 cursor-pointer mt-[-6px] mr-[10px]'
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleRemove(5);
                }}
              >
                <CloseIcon />
              </div>
            )}
          </div>
          <div
            className={` text-gray-A ${
              infoStyle ||
              "text-[12px] leading-[18px] sm:text-[14px] sm:leading-[20px]"
            } flex flex-wrap`}
          >
            <div className='flex items-center gap-[4px] mr-[8px]'>
              <Link
                title={data?.channel_info?.name}
                to={`/channel/${data?.channel_info?.email}`}
                className='hover:text-white-F1'
              >
                {data?.channel_info?.name}
              </Link>

              <div className='w-[14px]'>
                <Verification />
              </div>
            </div>

            <div>
              <span>{formatNumber(data?.view)} lượt xem</span>
              <span
                className={`${
                  layout === "horizon" && "hidden"
                } before:content-['•'] before:mx-[4px]`}
              >
                {timeFormat2(data?.createdAt)}
              </span>
            </div>
          </div>

          {data?.description && (
            <div
              className={`t-ellipsis text-[12px] leading-[18px]
                 text-gray-A pt-[8px] mb-[8px] ${descStyle}`}
              dangerouslySetInnerHTML={{
                __html: data?.description,
              }}
            ></div>
          )}
        </div>
        <button
          className='w-[40px] h-[40px] rounded-[50%] flex items-center justify-center 
                  absolute top-0 right-[-16px] translate-y-[-15%] z-[500] active:bg-black-0.2 group-hover:opacity-[1] opacity-0'
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            setShowHover((prev) => {
              if (prev) return undefined;
              handleCursorPositon(e);
              return (
                <CustomeFuncBox
                  style={`w-[270px]`}
                  setOpened={() => {
                    setShowHover(undefined);
                  }}
                  funcList1={funcList1}
                  funcList2={!noFunc2 && funcList2}
                />
              );
            });
          }}
        >
          <Setting2Icon />
        </button>
      </div>
    </div>
  );
};
export default VideoCard;
