import { timeFormat3 } from "../../../../../../../util/timeforMat";
import { Pagination } from "../../../../../../../Component";
import {
  YoutubeBlankIcon,
  Share2Icon,
  RemovePL,
} from "../../../../../../../Assets/Icons";
const VideoList = ({ videoList, currPage, totalPage, setQueriese }) => {
  if (!videoList || videoList?.length < 1) return;

  return (
    <div className='mt-[24px]'>
      <div className='w-[80vw] min-w-[600px] max-h-[60vh] overflow-auto scrollbar-3 '>
        <div className='min-w-full w-fit'>
          <div className='bg-black flex sticky top-0 z-[200] border-y-[1px]'>
            <div className='sticky left-0 min-w-[382px] flex-[3_0_382px] py-[8px] box-content bg-black border-r-[1px]'>
              <span>Video</span>
            </div>
            <div className='flex-[0_0_100px] min-w-[100px] px-[12px] py-[8px] box-content'>
              <span>Date</span>
            </div>
            <div className='flex-[1_0_60px] min-w-[60px] px-[12px] py-[8px] text-right box-content'>
              <span>Views</span>
            </div>
            <div className='flex-[1_0_60px] min-w-[60px] px-[12px] py-[8px] text-right box-content'>
              <span>Comments</span>
            </div>
            <div className='flex-[1_0_100px] min-w-[100px] px-[12px] py-[8px] text-right box-content'>
              <span>Likes</span>
            </div>
          </div>

          {videoList?.map((video) => (
            <div
              className='flex border-b-[1px] group hover:bg-black-0.1'
              key={video?._id}
            >
              <div className='sticky left-0 min-w-[382px] flex-[3_0_382px] py-[8px] box-content bg-black group-hover:bg-[#272727] border-r-[1px]'>
                <div className='w-full flex  '>
                  <div className='w-[120px] aspect-video bg-[rgba(110,110,110,.2)] rounded-[5px]'>
                    <img
                      src={`${import.meta.env.VITE_BASE_API_URI}${
                        import.meta.env.VITE_VIEW_THUMB_API
                      }${video?.thumb}`}
                      alt='thumbnail'
                      className='size-full object-contain object-center'
                    />
                  </div>
                  <div className='flex-1 ml-[16px] pr-[12px] overflow-hidden'>
                    <div className='h-[24px] line-clamp-1 text-ellipsis break-all text-[13px] leading-[24px]'>
                      {video.title}
                    </div>
                    <div className='h-[16px] line-clamp-1 text-ellipsis break-all text-[12px] leading-[16px] text-gray-A group-hover:hidden'>
                      {video?.description}213213213133123
                    </div>
                    <div className='hidden group-hover:flex'>
                      <button
                        className='size-[40px] rounded-[50%] hover:bg-black-0.1 active:bg-black-0.2 flex items-center justify-center'
                        onClick={() => {}}
                      >
                        <div className='text-white size-[24px]'>
                          <YoutubeBlankIcon />
                        </div>
                      </button>
                      <button
                        className='size-[40px] rounded-[50%] hover:bg-black-0.1 active:bg-black-0.2 flex items-center justify-center'
                        onClick={() => {}}
                      >
                        <div className='text-white size-[24px]'>
                          <Share2Icon />
                        </div>
                      </button>
                      <button
                        className='size-[40px] rounded-[50%] hover:bg-black-0.1 active:bg-black-0.2 flex items-center justify-center'
                        onClick={() => {}}
                      >
                        <div className='text-white size-[24px]'>
                          <RemovePL />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex-[0_0_100px] min-w-[100px] px-[12px] py-[8px]  box-content'>
                <span>{timeFormat3(video?.createdAt)}</span>
              </div>
              <div className='flex-[1_0_60px] min-w-[60px] px-[12px] py-[8px] text-right box-content'>
                <span>{video?.view}</span>
              </div>
              <div className='flex-[1_0_60px] min-w-[60px] px-[12px] py-[8px] text-right box-content'>
                <span>{video?.totalCmt}</span>
              </div>
              <div className='flex-[1_0_100px] min-w-[100px] px-[12px] py-[8px]  text-right box-content'>
                <span>{video?.like}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Pagination
          currPage={currPage}
          totalPage={totalPage}
          setParams={setQueriese}
        />
      </div>
    </div>
  );
};
export default VideoList;
