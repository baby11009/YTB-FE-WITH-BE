import { CheckBox2 } from "../../../../Component";
import {
  EditIcon,
  TrashBinIcon,
  YoutubeBlankIcon,
} from "../../../../Assets/Icons";
import { Link } from "react-router-dom";
import { timeFormat3 } from "../../../../util/timeforMat";
import { formatNumber } from "../../../../util/numberFormat";

const VideoTbRow = ({ data, handleChecked, checked, handleDelete }) => {
  return (
    <div className='h-[84px] group hover:bg-black-0.1 flex border-b-[1px] border-gray-A'>
      <div
        className='px-[20px] flex items-center
     '
      >
        <CheckBox2
          checked={checked}
          setChecked={() => {
            handleChecked(data?._id);
          }}
        />
      </div>

      <div
        className='flex-[2_0_400px] min-w-[400px] p-[8px_0_8px_12px] flex
       '
      >
        <div className='w-full flex relative'>
          <div className='min-w-[120px] aspect-video  rounded-[5px] overflow-hidden z-[2]'>
            <img
              src={`${import.meta.env.VITE_BASE_API_URI}${
                import.meta.env.VITE_VIEW_THUMB_API
              }${data?.thumb}`}
              alt='thumbnail'
              className='size-full object-contain object-center'
            />
          </div>
          <div className='absolute left-0 w-[120px] aspect-video z-[1] rounded-[5px] overflow-hidden'>
            <img
              src={`${import.meta.env.VITE_BASE_API_URI}${
                import.meta.env.VITE_VIEW_THUMB_API
              }${data?.thumb}`}
              alt='thumbnail'
              className='size-full object-cover object-center z-[1]'
            />
            <div className='absolute left-0 top-0 size-full bg-[rgba(0,0,0,.4)] z-[5] backdrop-blur '></div>
          </div>
          <div className='flex-1 ml-[16px] pr-[12px] overflow-hidden'>
            <div
              className=' h-[24px] line-clamp-1 text-ellipsis break-words text-[13px] leading-[24px]'
              style={{ overflowWrap: "anywhere" }}
            >
              {data?.title}
            </div>

            <div
              className='h-[32px] line-clamp-2 text-ellipsis break-all
              text-[12px] leading-[16px] text-gray-A group-hover:hidden'
              style={{ overflowWrap: "anywhere" }}
              dangerouslySetInnerHTML={{
                __html: data?.description,
              }}
            ></div>
            <div className='hidden group-hover:flex'>
              <Link
                className='size-[40px] rounded-[50%] hover:bg-black-0.1 active:bg-black-0.2 flex items-center justify-center'
                to={`./upsert/${data._id}`}
              >
                <div className='text-white size-[24px]'>
                  <EditIcon />
                </div>
              </Link>
              <a
                className='size-[40px] rounded-[50%] hover:bg-black-0.1 active:bg-black-0.2 flex items-center justify-center'
                href={`http://localhost:5173/video?id=${data._id}`}
                target='_blank'
              >
                <div className='text-white size-[24px]'>
                  <YoutubeBlankIcon />
                </div>
              </a>
              <button
                className='size-[40px] rounded-[50%] hover:bg-black-0.1 active:bg-black-0.2 flex items-center justify-center'
                onClick={() => handleDelete(data?._id)}
              >
                <div className='text-white size-[24px]'>
                  <TrashBinIcon />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='flex-[1_0_224px] min-w-[224px] px-[12px] py-[8px]  border-x-[1px] border-gray-A'>
        <div className='flex items-center justify-start h-full'>
          <img
            src={`${import.meta.env.VITE_BASE_API_URI}${
              import.meta.env.VITE_VIEW_AVA_API
            }${data.user_info.avatar}`}
            alt={`${data.user_info.email}-avatar`}
            className='size-[60px] rounded-[50%]'
          />
          <div className='h-full ml-[12px]'>
            <div className='h-[24px] line-clamp-1 text-ellipsis break-all text-[13px] leading-[24px]'>
              {data.user_info.name}
            </div>
            <div className='h-[20px] line-clamp-1 text-ellipsis break-all text-[11px] leading-[20px] text-gray-A'>
              {data.user_info.email}
            </div>
          </div>
        </div>
      </div>
      <div className='flex-[1_0_100px] min-w-[100px] mx-[12px] my-[8px] text-[13px] leading-[24px]'>
        {timeFormat3(data.createdAt)}
      </div>
      <div className='flex-[1_0_100px] min-w-[100px] mx-[12px] my-[8px]  text-[13px] leading-[24px] text-right '>
        {formatNumber(data.view)}
      </div>
      <div className='flex-[1_0_100px] min-w-[100px] mx-[12px] my-[8px]  text-[13px] leading-[24px] text-right'>
        {formatNumber(data.totalCmt)}
      </div>
      <div className='flex-[1_0_60px] min-w-[60px] mx-[12px] my-[8px]  text-[13px] leading-[24px] text-right'>
        {formatNumber(data.like)}
      </div>
      <div className='flex-[1_0_60px] min-w-[60px] mx-[12px] my-[8px]  text-[13px] leading-[24px] text-right'>
        {formatNumber(data.dislike)}
      </div>
    </div>
  );
};
export default VideoTbRow;
