import {
  PlayIcon,
  CloseIcon,
  RandomIcon,
  RepeatIcon,
  Setting2Icon,
  ThinArrowIcon,
} from "../../../../../Assets/Icons";
import { useState, useLayoutEffect, useRef, useEffect } from "react";
import { PlaylistVideoCard } from "../../../../../Component";
import { getData } from "../../../../../Api/getData";
import { IsElementEnd } from "../../../../../util/scrollPosition";

const Playlist = ({ playlistId, videoId }) => {
  const [isEnd, setIsEnd] = useState(false);

  const [addNew, setAddNew] = useState(true);

  const [show, setShow] = useState(true);

  const [playlistQuery, setPlaylistQuery] = useState({
    videoLimit: 12,
    videoPage: 1,
    reset: playlistId,
  });

  const [playlistInfo, setPlaylistInfo] = useState(undefined);

  const [videoList, setVideoList] = useState([]);

  const videoIdList = useRef(new Set());

  const currentVideoIndex = useRef(undefined);

  const nextVideo = useRef(undefined);

  const container = useRef();

  const {
    data: playlistDetails,
    refetch,
    isError,
    isLoading,
  } = getData(
    `/data/playlist/${playlistId}`,
    playlistQuery,
    !!playlistId,
    false,
  );

  useLayoutEffect(() => {
    if (playlistDetails) {
      setPlaylistInfo((prev) => {
        if (prev) {
          return { ...prev, ...playlistDetails.data };
        }

        return playlistDetails.data;
      });

      if (addNew) {
        const finalList = [];
        videoIdList.current.clear();
        playlistDetails.data.video_list?.forEach((item) => {
          if (!videoIdList.current.has(item._id)) {
            videoIdList.current.add(item._id);
            finalList.push(item);
          }
        });
        setVideoList([...finalList]);
        setAddNew(false);
      } else {
        const finalList = [];

        playlistDetails.data.video_list?.forEach((item) => {
          if (!videoIdList.current.has(item._id)) {
            videoIdList.current.add(item._id);
            finalList.push(item);
          }
        });

        setVideoList((prev) => [...prev, ...finalList]);
      }
    }
  }, [playlistDetails]);

  useLayoutEffect(() => {
    if (videoId && playlistDetails) {
      currentVideoIndex.current = [...videoIdList.current].indexOf(videoId) + 1;

      nextVideo.current = videoList[currentVideoIndex.current];
    }
  }, [videoId, playlistDetails]);

  useLayoutEffect(() => {
    if (playlistId) {
      setAddNew(true);
    }
  }, [playlistId]);

  useEffect(() => {
    if (
      isEnd &&
      playlistDetails &&
      playlistQuery.videoPage < playlistDetails.totalPages
    ) {
      setPlaylistQuery((prev) => ({ ...prev, videoPage: prev.videoPage + 1 }));
    }
  }, [isEnd]);

  useEffect(() => {
    const handleScorll = (e) => {
      IsElementEnd(setIsEnd, e);
    };

    if (container.current) {
      container.current.addEventListener("scroll", handleScorll);
    }

    return () => {
      if (container.current) {
        container.current.removeEventListener("scroll", handleScorll);
      }
    };
  }, []);

  if (isError) {
    return <div>Failed to load playlist data</div>;
  }

  return (
    <div className='mb-[24px]'>
      {show ? (
        <div className='border-[1px] border-black-0.2 max-h-[419px] overflow-hidden rounded-[12px] flex flex-col'>
          <div className='pt-[12px] pl-[16px] pr-[6px] bg-black-21 '>
            <div className='flex items-center'>
              <div className='flex-1'>
                <div
                  className='max-h-[28px] line-clamp-1 overflow-hidden whitespace-normal
           text-ellipsis text-[20px] leading-[28px] font-bold'
                >
                  <span className=' whitespace-pre-wrap'>
                    {playlistInfo?.title}
                  </span>
                </div>
                <div className='w-fit max-w-full'>
                  <div className='mt-[4px] text-[12px] leading-[15px]  flex'>
                    <div
                      className='flex-1 overflow-hidden text-ellipsis line-clamp-1
                 whitespace-nowrap'
                    >
                      <span className='whitespace-pre-wrap'>
                        {playlistInfo?.channel_info?.name}
                      </span>
                    </div>
                    <div className='px-[4px]'>-</div>
                    <span className='text-gray-A'>
                      {currentVideoIndex.current} / {playlistInfo?.size}
                    </span>
                  </div>
                </div>
              </div>
              <button
                className='size-[40px] rounded-[50%] p-[8px] active:bg-black-0.1 '
                onClick={() => {
                  setShow(false);
                }}
              >
                <div className='w-[24px] '>
                  <CloseIcon />
                </div>
              </button>
            </div>
            <div className='flex'>
              <div className='flex-1 ml-[-8px]'>
                <button className='size-[40px] rounded-[50%] p-[8px] active:bg-black-0.2 '>
                  <div className='w-[24px] '>
                    <RepeatIcon />
                  </div>
                </button>
                <button className='size-[40px] rounded-[50%] p-[8px] active:bg-black-0.2 '>
                  <div className='w-[24px] '>
                    <RandomIcon />
                  </div>
                </button>
              </div>
              <button className='size-[40px] rounded-[50%] p-[8px] active:bg-black-0.2 '>
                <div className='w-[24px] '>
                  <Setting2Icon />
                </div>
              </button>
            </div>
          </div>
          <div className='flex-1 overflow-y-auto pr-[10px]' ref={container}>
            {videoList.map((item, index) => (
              <PlaylistVideoCard
                key={item?._id}
                containerStyle={`${
                  index === 0 ? "pt-[8px] pb-[4px]" : "py-[4px]"
                }  pr-[8px] `}
                imgStyle={"h-[56px]"}
                currentId={videoId}
                index={index}
                data={item}
                size={videoList.length}
                playlistInfo={playlistInfo}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className='py-[12px] pl-[16px] pr-[6px] border-[1px] border-black-0.2 rounded-[12px] bg-[rgba(34,33,51,0.949)]'>
          <div className='flex items-center'>
            <div className='flex-1'>
              <div className='text-[14px] leading-[20px] text-[#E6E5FF] flex'>
                {nextVideo.current ? (
                  <>
                    <span className='font-[500] mr-[4px]'>Next: </span>
                    <div className='max-h-[20px] line-clamp-1 text-ellipsis overflow-hidden whitespace-nowrap'>
                      <span className=' whitespace-pre-wrap'>
                        {nextVideo.current?.title}
                      </span>
                    </div>
                  </>
                ) : (
                  <span className='font-[500] mr-[4px]'>End of playlist </span>
                )}
              </div>
              <div className='w-fit max-w-full'>
                <div className='mt-[4px] text-[12px] leading-[18px] text-[rgba(165,163,204,1.000)]  flex'>
                  <button
                    className='flex-1 overflow-hidden text-ellipsis line-clamp-1
                    whitespace-nowrap'
                  >
                    <span className='whitespace-pre-wrap hover:text-white-F1'>
                      {playlistInfo.title}
                    </span>
                  </button>
                  <div className='px-[4px]'>-</div>
                  <span>
                    {currentVideoIndex.current} / {playlistInfo.size}
                  </span>
                </div>
              </div>
            </div>
            <button
              className='size-[40px] rounded-[50%] p-[8px] active:bg-black-0.2 '
              onClick={() => {
                setShow(true);
              }}
            >
              <div className='w-[24px] rotate-[90deg]'>
                <ThinArrowIcon />
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Playlist;
