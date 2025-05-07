import { CheckBox2 } from "../../../../Component";
import {
  YoutubeBlankIcon,
  TrashBinIcon,
  EditIcon,
} from "../../../../Assets/Icons";
import { timeFormat3 } from "../../../../util/timeforMat";
import { Link } from "react-router-dom";
import { formatNumber } from "../../../../util/numberFormat";
import { upperCaseFirstChar } from "../../../../util/func";

const PlaylistTbRow = ({ data, handleChecked, checked, handleDelete }) => {
  return (
    <div className='h-[84px] group hover:bg-black-0.1 flex border-b-[1px] border-gray-A'>
      <div className='px-[20px] flex items-center'>
        {data.type === "Playlist" ? (
          <CheckBox2
            checked={checked}
            setChecked={() => {
              handleChecked(data?._id);
            }}
          />
        ) : (
          <div className='size-[20px] rounded-[2px] border-[2px] border-gray-A'></div>
        )}
      </div>

      <div className='flex-[2_0_300px] min-w-[300px] p-[8px_0_8px_12px] flex'>
        <div className='w-full flex relative'>
          <div className='min-w-[120px] aspect-video  rounded-[5px] overflow-hidden z-[2]'>
            {data?.video_info && (
              <img
                src={`${import.meta.env.VITE_BASE_API_URI}${
                  import.meta.env.VITE_VIEW_THUMB_API
                }${data.video_info.thumb}`}
                alt='thumbnail'
                className='size-full object-contain object-center'
              />
            )}
          </div>
          <div className='absolute left-0 w-[120px] aspect-video z-[1] rounded-[5px] overflow-hidden'>
            {data?.video_info && (
              <img
                src={`${import.meta.env.VITE_BASE_API_URI}${
                  import.meta.env.VITE_VIEW_THUMB_API
                }${data.video_info?.thumb}`}
                alt='thumbnail'
                className='size-full object-cover object-center z-[1]'
              />
            )}
            <div className='absolute left-0 top-0 size-full bg-[rgba(0,0,0,.4)] z-[5] backdrop-blur '></div>
          </div>
          <div className='flex-1 ml-[16px] pr-[12px] overflow-hidden'>
            <div
              className=' h-[24px] line-clamp-1 text-ellipsis break-words text-[13px] leading-[24px]'
              style={{ overflowWrap: "anywhere" }}
            >
              {data?.title}
            </div>

            <div className='hidden group-hover:flex'>
              <Link
                className='size-[40px] rounded-[50%] hover:bg-black-0.1 active:bg-black-0.2 flex items-center justify-center'
                to={`./upsert/${data._id}/${
                  data.type === "Playlist" ? "details" : "list"
                }`}
              >
                <div className='text-white size-[24px]'>
                  <EditIcon />
                </div>
              </Link>
              {data.size > 0 && data.type === "Playlist" && (
                <a
                  className='size-[40px] rounded-[50%] hover:bg-black-0.1 active:bg-black-0.2 flex items-center justify-center'
                  href={`http://localhost:5173/video?id=${data.itemList[0]}&list=${data._id}`}
                  target='_blank'
                >
                  <div className='text-white size-[24px]'>
                    <YoutubeBlankIcon />
                  </div>
                </a>
              )}

              {data.type === "Playlist" && (
                <button
                  className='size-[40px] rounded-[50%] hover:bg-black-0.1 active:bg-black-0.2 flex items-center justify-center'
                  onClick={() => handleDelete(data?._id)}
                >
                  <div className='text-white size-[24px]'>
                    <TrashBinIcon />
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className='flex-[1_0_224px] min-w-[224px] px-[12px] py-[8px]  border-x-[1px] border-gray-A'>
        <div className='flex items-center justify-start'>
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
        {data.type}
      </div>
      <div className='flex-[1_0_100px] min-w-[100px] mx-[12px] my-[8px] text-[13px] leading-[24px]'>
        {upperCaseFirstChar(data.privacy)}
      </div>
      <div className='flex-[1_0_100px] min-w-[100px] mx-[12px] my-[8px] text-[13px] leading-[24px]'>
        {timeFormat3(data.createdAt)}
      </div>
      <div className='flex-[1_0_100px] min-w-[100px] mx-[12px] my-[8px]  text-[13px] leading-[24px] '>
        {timeFormat3(data.updatedAt)}
      </div>
      <div className='flex-[1_0_100px] min-w-[100px] mx-[12px] my-[8px]  text-[13px] leading-[24px] text-right'>
        {formatNumber(data.size)}
      </div>
    </div>
  );
};
export default PlaylistTbRow;
