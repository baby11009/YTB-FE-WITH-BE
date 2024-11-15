import {
  Verification,
  LiveIcon,
  Setting2Icon,
  BlockIcon,
  AddWLIcon,
  AddPLIcon,
  DownloadIcon,
  ShareIcon,
  NoSuggetIcon,
  WatchedIcon,
  DiaryIcon,
  LaterIcon,
  PlayListIcon,
  CloseIcon,
} from "../../Assets/Icons";
import { motion, useAnimate } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CustomeFuncBox } from "..";
import { timeFormat2 } from "../../util/timeforMat";
import { formatNumber } from "../../util/numberFormat";
import { durationCalc } from "../../util/durationCalc";
import { getRandomHexColor } from "../../util/func";
import { useAuthContext } from "../../Auth Provider/authContext";
import request from "../../util/axios-base-url";
import { useInsertionEffect } from "react";
import InsertPlaylist from "../Modal/InsertPlaylist";

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
          }
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
          }
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
          }
        );
        animate(
          "h3",
          {
            transform: "translateX(100%)",
          },
          {
            duration: 0.3,
            type: "tween",
          }
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
  showBtn,
  showCloseBtn,
  layout,
  style,
  styleInline,
  ctContainerStyle,
  infoStyle,
  titleStyle,
  descStyle,
  thumbStyle,
  thumbStyleInline,
  imgStyle,
  noFunc2,
  funcBoxPos,
}) => {
  const { setShowHover, handleCursorPositon, setIsShowing, user } =
    useAuthContext();

  const containRef = useRef();

  const bgColorRef = useRef(getRandomHexColor());

  const [showed, setShowed] = useState(false);

  const [opened, setOpened] = useState(false);

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/channel/${data?.user_info?.email}`);
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
    },
    {
      id: 3,
      text: "Add to Playlist",
      icon: <AddPLIcon />,
      handleOnClick: () => {
        setIsShowing(<InsertPlaylist videoId={data?._id} />);
      },
      condition: user ? false : true,
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
    <Link
      to={`/video/${data?._id || 5}`}
      className={`flex-1 relative ${style || "mx-[8px] mb-[40px]"}`}
      style={styleInline}
      onMouseOver={() => {
        if (!opened) {
          setShowed(true);
        }
      }}
      onMouseOut={() => {
        if (!opened) {
          setShowed(false);
        }
      }}
    >
      <div
        className={`relative overflow-hidden ${
          thumbStyle || "mb-[12px] rounded-[12px]"
        } `}
        style={thumbStyleInline}
      >
        <div
          className={`w-full  ${thumbStyle ? "h-full" : "h-[185.31px]"}`}
          style={{ backgroundColor: bgColorRef.current }}
        >
          <img
            src={`${import.meta.env.VITE_BASE_API_URI}${
              import.meta.env.VITE_VIEW_THUMB_API
            }${data?.thumb}`}
            alt=''
            className='object-contain w-full h-full'
          />
        </div>

        {/* duration */}
        <div
          className='absolute bottom-0 right-0 bg-[rgba(0,0,0,0.6)] text-white px-[4px] py-[1px] 
          mr-[8px] mb-[8px] text-[12px] leading-[18px] rounded-[4px]'
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

        {/* Hover things */}
        {showed && showBtn && (
          <div className='absolute right-0 top-0'>
            <HoverButton title={"Xem sau"} icon={<LaterIcon />} />
            <HoverButton
              title={"Thêm vào danh sách chờ"}
              icon={<PlayListIcon />}
            />
          </div>
        )}
      </div>

      <div className={` flex-1 flex  ${ctContainerStyle}`}>
        <div
          className={`w-[36px] h-[36px] rounded-[50%] overflow-hidden cursor-pointer mr-[12px] ${imgStyle}`}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleNavigate(5);
          }}
        >
          <img
            src={`${import.meta.env.VITE_BASE_API_URI}${
              import.meta.env.VITE_VIEW_AVA_API
            }${data?.user_info?.avatar}`}
            alt='avatar'
          />
        </div>

        <div className='flex-1 flex relative'>
          <div className={`pr-[24px] flex-1`}>
            <div className='flex'>
              <h4
                className={`t-ellipsis mb-[4px] flex-1 ${
                  titleStyle ||
                  "text-[16px] leading-[22px] max-h-[44px] font-[500]"
                }`}
              >
                {data.title}
              </h4>
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
              {showed && (
                <div
                  className='w-[40px] h-[40px] rounded-[50%] flex items-center justify-center 
                  absolute right-0 translate-x-[30%] translate-y-[-15%] z-[500] active:bg-black-0.2'
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCursorPositon(e);
                    setShowHover((prev) =>
                      prev ? undefined : (
                        <CustomeFuncBox
                          style={`w-[270px] right-[20%]  top-[100%] ${
                            funcBoxPos ? funcBoxPos : "sm:left-[-20%]"
                          }`}
                          setOpened={setOpened}
                          funcList1={funcList1}
                          funcList2={!noFunc2 && funcList2}
                        />
                      )
                    );
                  }}
                  ref={containRef}
                >
                  <Setting2Icon />
                </div>
              )}
            </div>
            <div
              className={` text-gray-A ${
                infoStyle ||
                "text-[12px] leading-[18px] sm:text-[14px] sm:leading-[20px]"
              }`}
            >
              <div className='flex items-center gap-[4px] mr-[8px]'>
                <div
                  title={data?.user_info?.name}
                  className='hover:text-white-F1'
                >
                  {data?.user_info?.name}
                </div>

                <div>
                  <Verification size={"14"} />
                </div>
              </div>

              <div className='flex flex-wrap items-center'>
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

            {data.desc && (
              <div
                className={`t-ellipsis text-[12px] leading-[18px]
                 text-gray-A pt-[8px] mb-[8px] ${descStyle}`}
              >
                {data.desc}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
export default VideoCard;
