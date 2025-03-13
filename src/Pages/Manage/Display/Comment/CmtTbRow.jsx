import { CheckBox2, DeleteConfirm } from "../../../../Component";
import {
  TrashBinIcon,
  Share2Icon,
  YoutubeBlankIcon,
} from "../../../../Assets/Icons";
import { timeFormat3 } from "../../../../util/timeforMat";
import { handleCopyVideoLink } from "../../../../util/func";

const CmtTbRow = ({ checked, data, handleChecked, showDeleteConfirm }) => {
  return (
    <div className='h-[84px] group hover:bg-black-0.1 flex border-b-[1px] border-gray-A'>
      <div
        className='px-[20px] flex items-center
       bg-black group-hover:bg-[#272727] z-[5]'
      >
        <CheckBox2
          checked={checked}
          setChecked={() => {
            handleChecked(data?._id);
          }}
        />
      </div>
      <div
        className='flex-[2_0_400px] min-w-[400px] p-[8px_12px] z-[5] flex bg-black group-hover:bg-[#272727]
          border-r-[1px] border-gray-A'
      >
        <div className='w-full overflow-hidden relative flex flex-col'>
          <div className='overflow-hidden flex-1'>
            <div
              className=' max-h-[68px] overflow-hidden text-ellipsis break-all text-[13px] leading-[24px]'
              dangerouslySetInnerHTML={{
                __html: data?.cmtText,
              }}
            ></div>
          </div>

          <div className='hidden group-hover:flex'>
            <button
              className='size-[40px] rounded-[50%] hover:bg-black-0.1 active:bg-black-0.2 flex items-center justify-center'
              onClick={() => {
                showDeleteConfirm(data._id);
              }}
            >
              <div className='text-white size-[24px]'>
                <TrashBinIcon />
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className='flex-[2_0_400px] min-w-[400px] mx-[12px] my-[8px]'>
        <div className='w-full flex relative'>
          <div className='w-[120px] aspect-video rounded-[5px] overflow-hidden z-[2]'>
            <img
              src={`${import.meta.env.VITE_BASE_API_URI}${
                import.meta.env.VITE_VIEW_THUMB_API
              }${data?.video_info?.thumb}`}
              alt='thumbnail'
              className='size-full object-contain object-center'
            />
          </div>
          <div className='absolute left-0 w-[120px] aspect-video z-[1] rounded-[5px] overflow-hidden'>
            <img
              src={`${import.meta.env.VITE_BASE_API_URI}${
                import.meta.env.VITE_VIEW_THUMB_API
              }${data?.video_info?.thumb}`}
              alt='thumbnail'
              className='size-full object-cover object-center z-[1]'
            />
            <div className='absolute left-0 top-0 size-full bg-[rgba(0,0,0,.4)] z-[5] backdrop-blur '></div>
          </div>
          <div className='flex-1 ml-[16px] pr-[12px] overflow-hidden'>
            <div className=' overflow-hidden'>
              <div
                className=' h-[24px] line-clamp-1 text-ellipsis break-all text-[13px] leading-[24px]'
                dangerouslySetInnerHTML={{
                  __html: data?.video_info?.title,
                }}
              ></div>
            </div>
            <div
              className='h-[16px] line-clamp-1 text-ellipsis break-all
             text-[12px] leading-[16px] text-gray-A group-hover:hidden'
              dangerouslySetInnerHTML={{
                __html: data?.video_info?.description,
              }}
            ></div>
            <div className='hidden group-hover:flex'>
              <button
                className='size-[40px] rounded-[50%] hover:bg-black-0.1 active:bg-black-0.2 flex items-center justify-center'
                onClick={() => {
                  handleCopyVideoLink(
                    data?.video_info?._id,
                    data?.video_info?.type,
                  )
                    .then(() => {
                      addToaster("Link copied to clipboard.");
                    })
                    .catch(() => {
                      addToaster("Failed to copy link");
                    });
                }}
              >
                <div className='text-white size-[24px]'>
                  <Share2Icon />
                </div>
              </button>
              <a
                className='size-[40px] rounded-[50%] hover:bg-black-0.1 active:bg-black-0.2 flex items-center justify-center'
                href={`http://localhost:5173/video?id=${data?.video_info?._id}`}
                target='_blank'
              >
                <div className='text-white size-[24px]'>
                  <YoutubeBlankIcon />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className='flex-[1_0_100px] min-w-[100px] mx-[12px] my-[8px] text-[13px] leading-[24px]'>
        <span>{timeFormat3(data?.createdAt)}</span>
      </div>
      <div className='flex-[1_0_60px] min-w-[60px] mx-[12px] my-[8px] text-[13px] leading-[24px] text-right'>
        <span>{data?.like}</span>
      </div>
      <div className='flex-[1_0_60px] min-w-[60px] mx-[12px] my-[8px] text-[13px] leading-[24px] text-right'>
        <span>{data?.dislike}</span>
      </div>
    </div>
  );
};
export default CmtTbRow;
