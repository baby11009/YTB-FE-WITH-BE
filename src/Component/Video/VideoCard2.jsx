import { Link } from "react-router-dom";
import { formatNumber } from "../../util/numberFormat";
import { timeFormat } from "../../util/timeforMat";
import CustomeFuncBox from "../Box/CustomeFuncBox";
import { durationCalc } from "../../util/durationCalc";
import {
  Setting2Icon,
  AddWLIcon,
  WatchedIcon,
  AddPLIcon,
  DownloadIcon,
  ShareIcon,
} from "../../Assets/Icons";
import { useRef } from "react";
import { getRandomHexColor } from "../../util/func";
import { useAuthContext } from "../../Auth Provider/authContext";

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
    text: "Save to playlist",
    icon: <AddPLIcon />,
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

const randomColor = getRandomHexColor();

const VideoCard2 = ({ index, size, data, funcList2, funcBoxPos }) => {
  const { setShowHover, handleCursorPositon } = useAuthContext();

  const boxContainerRef = useRef();

  return (
    <Link
      className='inline-flex flex-1 py-[8px] cursor-pointer'
      to={`/video/${data?._id}`}
    >
      <div
        className='w-[160px] h-[90px] rounded-[12px] overflow-hidden mr-[8px] relative'
        style={{ backgroundColor: randomColor }}
      >
        <img
          src={`${import.meta.env.VITE_BASE_API_URI}${
            import.meta.env.VITE_VIEW_THUMB_API
          }${data?.thumb}`}
          alt=''
          draggable={false}
          className='object-contain w-full h-full'
        />
        {/* duration */}

        <div
          className='absolute bottom-0 right-0 bg-[rgba(0,0,0,0.6)] text-white px-[4px] py-[1px] 
        mr-[8px] mb-[8px] text-[12px] leading-[18px] rounded-[4px]'
        >
          {durationCalc(data?.duration || 0)}
        </div>

        {/* {data.progress !== 0 && (
          <div className='w-full absolute bottom-0 h-[4px] bg-gray-71'>
            <div
              className='absolute h-full bg-red-FF'
              style={{
                width: data.progress + "%",
              }}
            ></div>
          </div>
        )} */}
      </div>
      <div className='flex-1 w-0 overflow-hidden'>
        <div className='mb-[8px] t-ellipsis text-[16px] leading-[22px] font-[500]'>
          {data?.title}
        </div>
        <div className='flex items-center text-[12px] leading-[18px] text-gray-A text-nowrap'>
          <div>{data?.channel_info.name}</div>
          <div className="hidden 2xsm:block before:content-['•'] before:mx-[4px]">
            {formatNumber(data?.view || 0)} lượt xem
          </div>
          <div className="hidden 2xsm:block before:content-['•'] before:mx-[4px]">
            {timeFormat(data?.postedTime)}
          </div>
        </div>
      </div>
      <div
        className='relative flex items-center justify-center'
        ref={boxContainerRef}
      >
        <button
          className='size-[40px] rounded-[50%] flex items-center justify-center active:bg-black-0.2'
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleCursorPositon(e);
            setShowHover((prev) =>
              prev ? undefined : (
                <CustomeFuncBox
                  style={`translate-x-[-100%]`}
                  setOpened={() => {
                    setShowHover(undefined);
                  }}
                  funcList1={funcList1}
                  funcList2={funcList2 ? funcList2 : undefined}
                  productData={data}
                  productIndex={index}
                  size={size}
                />
              )
            );
          }}
        >
          <Setting2Icon />
        </button>
      </div>
    </Link>
  );
};
export default VideoCard2;
