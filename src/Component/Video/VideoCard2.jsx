import { Link } from "react-router-dom";
import { formatNumber } from "../../util/numberFormat";
import { timeFormat2 } from "../../util/timeforMat";
import CustomeFuncBox from "../Box/CustomeFuncBox";
import { durationCalc } from "../../util/durationCalc";
import { Setting2Icon } from "../../Assets/Icons";
import { useAuthContext } from "../../Auth Provider/authContext";

const VideoCard2 = ({
  index,
  size,
  data,
  funcList1,
  funcList2,
  playlistId,
  containerStyle,
}) => {
  const { setShowHover, handleCursorPositon } = useAuthContext();

  return (
    <Link
      className={`inline-flex flex-1 cursor-pointer w-full group relative box-content ${
        containerStyle ? containerStyle : "py-[8px] h-[90px] "
      }`}
      to={
        playlistId
          ? `/video?id=${data?._id}&list=${playlistId}`
          : `/video?id=${data?._id}`
      }
    >
      <div className='h-full aspect-video rounded-[12px] overflow-hidden mr-[8px] relative '>
        <div className='aspect-video relative'>
          <img
            src={`${import.meta.env.VITE_BASE_API_URI}${
              import.meta.env.VITE_VIEW_THUMB_API
            }${data?.thumb}?width=336&height=188&format=webp`}
            alt='thumbnail'
            className='size-full object-contain z-[2] relative'
          />
          <div
            className='absolute inset-0 z-[1] bg-no-repeat bg-cover bg-center  blur-[8px] '
            style={{
              backgroundImage: `url('${import.meta.env.VITE_BASE_API_URI}${
                import.meta.env.VITE_VIEW_THUMB_API
              }${data?.thumb}?width=336&height=188&fit=cover')`,
            }}
          ></div>
        </div>
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
        <div className='flex items-center flex-wrap text-[12px] leading-[18px] text-gray-A text-nowrap'>
          <div>{data?.channel_info?.name}</div>
          <div className="hidden 2xsm:block before:content-['•'] before:mx-[4px]">
            {formatNumber(data?.view || 0)} lượt xem
          </div>
          <div className="hidden 2xsm:block before:content-['•'] before:mx-[4px]">
            {timeFormat2(data.createdAt)}
          </div>
        </div>
      </div>
      <div className='relative flex justify-center z-[200]'>
        <button
          className='size-[40px] rounded-[50%] flex items-center justify-center active:bg-black-0.2'
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleCursorPositon(e);
            setShowHover((prev) =>
              prev ? undefined : (
                <CustomeFuncBox
                  setOpened={() => {
                    setShowHover(undefined);
                  }}
                  funcList1={funcList1}
                  funcList2={funcList2 ? funcList2 : undefined}
                  productData={data}
                  productIndex={index}
                  size={size}
                />
              ),
            );
          }}
        >
          <Setting2Icon />
        </button>
      </div>

      {/* bg active */}
      <div className='absolute inset-0  m-[-4px] rounded-[5px] group-active:bg-black-0.1'></div>
    </Link>
  );
};
export default VideoCard2;
