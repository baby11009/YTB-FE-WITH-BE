import { timeFormat3 } from "../../../../../../../util/timeforMat";
import { Pagination } from "../../../../../../../Component";
import {
  YoutubeBlankIcon,
  Share2Icon,
  RemovePL,
} from "../../../../../../../Assets/Icons";
import { useAuthContext } from "../../../../../../../Auth Provider/authContext";
import { updateData } from "../../../../../../../Api/controller";
const VideoList = ({
  playlistId,
  videoList,
  currPage,
  totalPage,
  setPage,
  refetch,
}) => {
  const { addToaster } = useAuthContext();

  const handleCopyVideoLink = (videoId, type) => {
    let url;
    switch (type) {
      case "video":
        url = `http://localhost:5173/video?id=${videoId}`;
        break;
      case "short":
        url = `http://localhost:5173/short/${videoId}`;
        break;
    }
    navigator.clipboard
      .writeText(url)
      .then(() => {
        addToaster("Link copied to clipboard.");
      })
      .catch(() => {
        addToaster("Failed to copy link");
      });
  };

  const handleRemoveVideo = async (videoId) => {
    await updateData(
      "/client/playlist",
      playlistId,
      { videoIdList: [videoId] },
      "playlist",
      () => {
        refetch();
      },
      undefined,
      addToaster,
    );
  };

  return (
    <div className='mt-[24px]'>
      <div className='w-[80vw] min-w-[600px] max-h-[60vh] min-h-[40vh] overflow-auto scrollbar-3  transition-all '>
        <div className='min-w-full w-fit'>
          <div className='bg-black flex sticky top-0 z-[200] border-y-[1px]'>
            <div className='sticky left-0 min-w-[400px] flex-[2_0_400px] py-[8px]  bg-black border-r-[1px]'>
              <span>Video</span>
            </div>
            <div className='flex-[0_0_100px] min-w-[100px] mx-[12px] my-[8px] '>
              <span>Date</span>
            </div>
            <div className='flex-[1_0_60px] min-w-[60px] mx-[12px] my-[8px] text-right '>
              <span>Views</span>
            </div>
            <div className='flex-[1_0_60px] min-w-[60px] mx-[12px] my-[8px] text-right '>
              <span>Comments</span>
            </div>
            <div className='flex-[1_0_100px] min-w-[100px] mx-[12px] my-[8px] text-right '>
              <span>Likes</span>
            </div>
          </div>

          {videoList &&
            videoList.length > 0 &&
            videoList?.map((video) => (
              <div
                className='flex border-b-[1px] group hover:bg-black-0.1'
                key={video?._id}
              >
                <div className='sticky left-0 min-w-[400px] flex-[2_0_400px] py-[8px]  bg-black group-hover:bg-[#272727] border-r-[1px]'>
                  <div className='w-full flex  '>
                    <div className='w-[120px] aspect-video bg-[rgba(0,0,0,0.5)] rounded-[5px]'>
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
                        {video?.description}
                      </div>
                      <div className='hidden group-hover:flex'>
                        <a
                          className='size-[40px] rounded-[50%] hover:bg-black-0.1 active:bg-black-0.2 flex items-center justify-center'
                          href={
                            video?.type === "short"
                              ? `http://localhost:5173/short/${video._id}`
                              : `http://localhost:5173/video?id=${video._id}`
                          }
                          target='_blank'
                        >
                          <div className='text-white size-[24px]'>
                            <YoutubeBlankIcon />
                          </div>
                        </a>
                        <button
                          className='size-[40px] rounded-[50%] hover:bg-black-0.1 active:bg-black-0.2 flex items-center justify-center'
                          onClick={() => {
                            handleCopyVideoLink(video._id, video?.type);
                          }}
                        >
                          <div className='text-white size-[24px]'>
                            <Share2Icon />
                          </div>
                        </button>
                        <button
                          className='size-[40px] rounded-[50%] hover:bg-black-0.1 active:bg-black-0.2 flex items-center justify-center'
                          onClick={() => {
                            handleRemoveVideo(video._id);
                          }}
                        >
                          <div className='text-white size-[24px]'>
                            <RemovePL />
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='flex-[0_0_100px] min-w-[100px] mx-[12px] my-[8px] text-[12px] leading-[20px]'>
                  <span>{timeFormat3(video?.createdAt)}</span>
                </div>
                <div className='flex-[1_0_60px] min-w-[60px] mx-[12px] my-[8px] text-right  text-[12px] leading-[20px]'>
                  <span>{video?.view}</span>
                </div>
                <div className='flex-[1_0_60px] min-w-[60px] mx-[12px] my-[8px] text-right  text-[12px] leading-[20px]'>
                  <span>{video?.totalCmt}</span>
                </div>
                <div className='flex-[1_0_100px] min-w-[100px] mx-[12px] my-[8px]  text-right  text-[12px] leading-[20px]'>
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
          handleSetPage={setPage}
        />
      </div>
    </div>
  );
};
export default VideoList;
