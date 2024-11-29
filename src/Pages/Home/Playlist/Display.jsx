import {
  PlayIcon,
  Setting2Icon,
  DownloadIcon,
  PlusIcon,
  RandomIcon,
  CircleMinusIcon,
  EyeIcon,
  SortIcon,
  EqualIcon,
} from "../../../Assets/Icons";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { timeFormat2 } from "../../../util/timeforMat";
import { formatNumber } from "../../../util/numberFormat";
import { CustomeFuncBox, VideoCard2 } from "../../../Component";
import { useAuthContext } from "../../../Auth Provider/authContext";
import { getRandomLinearGradient } from "../../../util/func";

const funcList = [
  {
    id: 1,
    text: "Hiện những video không xem được",
    icon: <EyeIcon />,
  },
  {
    id: 2,
    text: "Thêm video",
    icon: <PlusIcon />,
  },
  {
    id: 3,
    text: "Xóa video đã xem",
    icon: <CircleMinusIcon />,
  },
];

const btnList = [
  {
    id: "all",
    title: "All",
  },
  {
    id: "video",
    title: "Video",
  },
  {
    id: "short",
    title: "Short",
  },
];

const Display = ({
  title,
  updatedAt,
  size,
  videoList,
  handleSort,
  currSort,
  changePostion,
  noDrag,
  funcList,
}) => {
  const { user } = useAuthContext();

  const containerRef = useRef();

  const dragItem = useRef(0);

  const dragOverItem = useRef(0);

  const lightnearColor = useRef(getRandomLinearGradient());

  const [opened, setOpened] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpened(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChangePosition = (e) => {
    if (noDrag) return;
    e.target.style.opacity = 1;
    changePostion(dragItem.current, dragOverItem.current);
    lightnearColor.current = getRandomLinearGradient();
  };

  return (
    <div className='flex justify-center pt-[24px]'>
      <div className='relative w-full'>
        {/* Left side */}
        <div
          className='lg:fixed w-full lg:w-[360px] lg:min-h-[85.5vh] lg:mb-[24px] lg:ml-[24px] lg:rounded-[16px] 
          relative overflow-hidden'
        >
          <div className='p-[24px]'>
            <div className='absolute inset-0 bg-transparent opacity-[0.7] blur-[30px] flex justify-center z-[-1]'>
              <div className='h-[268px] lg:h-[403px] aspect-video'>
                {videoList?.length > 0 ? (
                  <img
                    src={`${import.meta.env.VITE_BASE_API_URI}${
                      import.meta.env.VITE_VIEW_THUMB_API
                    }${videoList[0]?.thumb}`}
                    alt='thumb image'
                    className='rounded-[12px] object-contain r'
                  />
                ) : (
                  <div className='size-full bg-[rgba(0,0,0,0.5)] rounded-[12px]'></div>
                )}
              </div>
              <div
                className='absolute inset-0'
                style={{
                  background: lightnearColor.current,
                }}
              ></div>
            </div>
            <div className='flex flex-col sm:flex-row sm:items-center lg:flex-col lg:items-start '>
              <Link className='inline-block w-full flex-1'>
                <div className='relative cursor-pointer mb-[16px] flex items-center justify-center'>
                  {videoList?.length > 0 ? (
                    <div className='relative rounded-[12px] overflow-hidden group'>
                      <img
                        src={`${import.meta.env.VITE_BASE_API_URI}${
                          import.meta.env.VITE_VIEW_THUMB_API
                        }${videoList[0]?.thumb}`}
                        alt='thumb image'
                        className={`${
                          videoList[0].type === "video"
                            ? "h-[189px]"
                            : "h-[224px]"
                        } object-contain`}
                      />
                      <div
                        className='absolute inset-0 flex items-center justify-center
                       bg-[rgba(0,0,0,0.8)] group-hover:opacity-[1] opacity-0 transition-opacity duration-[.3s]'
                      >
                        <div>
                          <PlayIcon />
                        </div>
                        <span className='ml-[2px] text-[12px] font-[500]'>
                          PHÁT TẤT CẢ
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className='h-[189px] aspect-video bg-[rgba(0,0,0,0.5)] rounded-[12px]'></div>
                  )}
                </div>
              </Link>

              <div className='sm:ml-[24px] lg:ml-0 flex-1'>
                <div className='text-[28px] leading-[38px] font-bold t-ellipsis'>
                  {title}
                </div>

                <div className='flex lg:flex-col mt-[16px]'>
                  <div className=' mb-[12px] flex-1'>
                    <Link className='inline-block text-[14px] leading-[20px] font-[500] mb-[4px]'>
                      {user?.name}
                    </Link>
                    <div
                      className='flex flex-wrap items-center gap-[4px]
                      text-[12px] leading-[18px] text-white-FB3 text-nowrap'
                    >
                      <span>{formatNumber(size)} video</span>
                      <span>Updated {timeFormat2(updatedAt)}</span>
                    </div>
                  </div>

                  <div className='flex items-center'>
                    <button
                      className='size-[36px] rounded-[50%] bg-black-0.1 hover:bg-black-0.2 
                        flex items-center justify-center mr-[8px]'
                    >
                      <DownloadIcon />
                    </button>
                    <div className='relative' ref={containerRef}>
                      <button
                        className='size-[36px] rounded-[50%] bg-black-0.1 hover:bg-black-0.2 
                          flex items-center justify-center'
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setOpened((prev) => !prev);
                        }}
                      >
                        <Setting2Icon />
                        {opened && (
                          <CustomeFuncBox
                            funcList1={funcList}
                            style={"left-0 top-[100%]"}
                            setOpened={setOpened}
                          />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='my-[16px] flex flex-col xsm:flex-row xsm:items-center gap-[8px]'>
              <button
                className='flex-1 flex items-center justify-center px-[16px]
                 bg-[#fff] hover:bg-[#e6e6e6] rounded-[18px]'
              >
                <div className='ml-[-6px] mr-[6px]'>
                  <PlayIcon color={"#212121"} />
                </div>
                <span className='text-[#212121] text-[14px] leading-[36px] font-[500]'>
                  Play all
                </span>
              </button>
              <button
                className='flex-1 flex items-center justify-center px-[16px]
                 bg-black-0.1 hover:bg-black-0.2 rounded-[18px]'
              >
                <div className='ml-[-6px] mr-[6px]'>
                  <RandomIcon />
                </div>
                <span className='text-[14px] leading-[36px] font-[500]'>
                  Shuffle
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className='mr-[24px] lg:pl-[388px]'>
          <div
            className='pl-[36px] mt-[8px]  flex items-center text-[14px] 
            leading-[20px] tracking-[0.5px] font-[500] text-nowrap overflow-x-auto'
          >
            <div className='pr-[16px] mr-[8px] border-r-[1px] border-black-0.2'>
              <button className='flex items-center gap-[8px] leading-[22px]'>
                <div>
                  <SortIcon />
                </div>
                <span>Sort</span>
              </button>
            </div>
            <div className='flex items-center text-[14px] leading-[32px] font-[500]'>
              {btnList.map((item) => (
                <button
                  className={`my-[12px] mr-[12px] px-[12px] rounded-[8px]  transition-colors ease-out duration-300
                      ${
                        currSort === item.id
                          ? "bg-white-F1 hover:bg-white text-black"
                          : "bg-black-0.1 hover:bg-black-0.2"
                      }
                    `}
                  key={item.id}
                  onClick={() => {
                    handleSort(item.id);
                  }}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>
          <div className='flex flex-col'>
            {videoList?.map((item, index) => (
              <div
                className='flex items-center hover:bg-black-0.1 rounded-[12px] cursor-grabbing'
                key={index}
                draggable={!noDrag}
                onDragStart={(e) => {
                  if (noDrag) return;
                  e.target.style.opacity = "0";
                  dragItem.current = index;
                }}
                onDragEnd={handleChangePosition}
                onDragOver={(e) => {
                  if (noDrag) return;
                  dragOverItem.current = index;
                  e.preventDefault();
                }}
              >
                <div
                  className={`w-[36px] flex items-center justify-center ${
                    noDrag &&
                    "text-[14px] leading-[20px] font-[500px] text-gray-A"
                  }`}
                >
                  {noDrag ? index + 1 : <EqualIcon />}
                </div>
                <VideoCard2 data={item} funcList2={funcList} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Display;
