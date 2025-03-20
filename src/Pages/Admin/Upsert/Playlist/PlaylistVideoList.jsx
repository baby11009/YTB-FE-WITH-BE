import { InfiniteDropDownWithCheck } from "../../../../Component";
import { getData } from "../../../../Api/getData";
import { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { HovVideorCard, Pagination } from "../../../../Component";
import { YoutubeBlankIcon, TrashBinIcon } from "../../../../Assets/Icons";
import { updateData } from "../../../../Api/controller";
import { isTwoArrayEqual } from "../../../../util/func";

const initVideoQueries = {
  search: { exclude: "[]" },
  limit: 10,
  page: 1,
};
const PlaylistVideoList = ({
  id,
  playlistData,
  refetch,
  addToaster,
  queries,
  setQueries,
}) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({ videoIdList: [] });

  const [openedVideoBox, setOpenedVideoBox] = useState(false);

  const [videoQueries, setVideoQueries] = useState(initVideoQueries);

  const totalPage = useRef(1);

  const {
    data: videosData,
    isLoading: isLoadingVideosData,
    error: videosDataError,
  } = getData("/video", videoQueries, openedVideoBox, false);

  const handleUpdateList = async (videoIdList) => {
    await updateData(
      "playlist",
      id,
      { videoIdList: videoIdList },
      "playlist",
      () => {
        refetch();
      },
      undefined,
      addToaster,
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      isTwoArrayEqual(formData.videoIdList, playlistData.playlistInfor.itemList)
    ) {
      alert("Nothing changed");
      return;
    }
    await handleUpdateList(formData.videoIdList);
  };

  useEffect(() => {
    console.log(playlistData);
    totalPage.current = playlistData.videoList.totalPages;
  }, [playlistData]);

  useEffect(() => {
    if (!openedVideoBox) {
      // parse array to make sure express will not converte it into an object if it to many elements
      setVideoQueries((prev) => {
        if (
          isTwoArrayEqual(
            JSON.parse(prev.search.exclude),
            playlistData.playlistInfor.itemList,
          )
        ) {
          return prev;
        } else {
          return {
            ...prev,
            search: {
              exclude: JSON.stringify(playlistData.playlistInfor.itemList),
            },
            page: 1,
          };
        }
      });
    }
  }, [playlistData, openedVideoBox]);

  useEffect(() => {
    if (!openedVideoBox) {
      queryClient.removeQueries({ queryKey: Object.values(videoQueries) });
    }
  }, [openedVideoBox, videoQueries]);

  return (
    <div className='mt-[28px]'>
      <div className='grid grid-cols-1 sm:grid-cols-5 gap-[16px]'>
        <div className='col-span-2'>
          <form onSubmit={handleSubmit}>
            <InfiniteDropDownWithCheck
              title={"Video"}
              valueList={formData.videoIdList}
              setIsOpened={setOpenedVideoBox}
              list={videosData?.data}
              HoverCard={HovVideorCard}
              isLoading={isLoadingVideosData}
              fetchingError={videosDataError?.response?.data?.msg}
              setData={(videoIdList) => {
                setFormData({ videoIdList });
              }}
              handleSetQueries={(value, pageInc) => {
                setVideoQueries((prev) => {
                  const prevClone = {
                    ...prev,
                  };

                  if (value === "" || value) {
                    prevClone.search["title"] = value;
                    prevClone.page = 1;
                  }

                  if (pageInc !== undefined) {
                    prevClone.page = prevClone.page + pageInc;
                  }

                  return prevClone;
                });
              }}
            />

            <div className='flex items-center justify-center mt-[32px]    '>
              <button
                type='submit'
                className='w-full max-w-[120px] btn1 relative'
              >
                <span className='z-[50] text-[16px] relative'>Add</span>
              </button>
            </div>
          </form>
        </div>

        {/* table */}
        <div className='sm:col-span-3 overflow-auto scrollbar-3 h-[50vh] relative px-[2px]'>
          {/* header */}
          <div
            className='flex items-center bg-black sticky top-0 border-[1px]
           border-gray-A h-[40px] z-[10] text-[14px]'
          >
            <div className='flex-[1_0_300px] min-w-[300px] mx-[12px] py-[8px] '>
              Video
            </div>
            <div className='h-full w-[1px] bg-gray-A'></div>
            <div className='flex-[1_0_150px] min-w-[150px] mx-[12px] py-[8px]'>
              Channel
            </div>
          </div>

          {/* body */}
          <div className='min-h-[calc(100%-80px)] border-x-[1px] border-gray-A border-b-[1px]'>
            {playlistData?.videoList?.data.length > 0 &&
              playlistData?.videoList?.data.map((data) => (
                <div
                  key={data._id}
                  className='flex items-center bg-black border-b-[1px] 
                h-[84px] border-gray-A group hover:bg-black-0.1'
                >
                  <div className='flex-[1_0_300px] min-w-[300px] mx-[12px] py-[8px]'>
                    <div className='w-full flex relative'>
                      <div className='w-[120px] aspect-video  rounded-[5px] overflow-hidden z-[2]'>
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
                        <div className=' overflow-hidden'>
                          <div
                            className=' h-[24px] line-clamp-1 text-ellipsis break-all text-[13px] leading-[24px]'
                            dangerouslySetInnerHTML={{
                              __html: data?.title,
                            }}
                          ></div>
                        </div>
                        <div
                          className='h-[16px] line-clamp-1 text-ellipsis break-all
                          text-[12px] leading-[16px] text-gray-A group-hover:hidden'
                          dangerouslySetInnerHTML={{
                            __html: data?.description,
                          }}
                        ></div>
                        <div className='hidden group-hover:flex'>
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
                            onClick={() => {
                              handleUpdateList([data._id]);
                            }}
                          >
                            <div className='text-white size-[24px]'>
                              <TrashBinIcon />
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='h-full w-[1px] bg-gray-A'></div>
                  <div className='flex-[1_0_150px] min-w-[150px] mx-[12px] py-[8px]'>
                    <div className='flex items-center justify-start h-full'>
                      <img
                        src={`${import.meta.env.VITE_BASE_API_URI}${
                          import.meta.env.VITE_VIEW_AVA_API
                        }${data.video_user_info.avatar}`}
                        alt={`${data.video_user_info.email}-avatar`}
                        className='size-[60px] rounded-[50%]'
                      />
                      <div className='h-full ml-[12px]'>
                        <div className='h-[24px] line-clamp-1 text-ellipsis break-all text-[13px] leading-[24px]'>
                          {data.video_user_info.name}
                        </div>
                        <div className='h-[20px] line-clamp-1 text-ellipsis break-all text-[11px] leading-[20px] text-gray-A'>
                          {data.video_user_info.email}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className='w-full bg-black sticky bottom-[0] right-0 py-[4px] z-[10]'>
            <Pagination
              handleSetPage={(pageNum) => {
                setQueries((prev) => ({ ...prev, videoPage: pageNum }));
              }}
              currPage={queries.videoPage}
              totalPage={totalPage.current}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default PlaylistVideoList;
