import {
  CloseIcon,
  RandomIcon,
  RepeatIcon,
  Setting2Icon,
  ThinArrowIcon,
  ActiveLoopIcon,
  ActiveShuffleIcon,
} from "../../../../../Assets/Icons";
import { useState, useRef, useEffect } from "react";
import { PlaylistVideoCard } from "../../../../../Component";
import { IsElementEnd } from "../../../../../util/scrollPosition";
import { useAuthContext } from "../../../../../Auth Provider/authContext";

const Playlist = ({
  videoId,
  playlistInfo,
  playlistVideos,
  playlistCurrentVideoIndex,
  playlistNextVideoInfo,
  handlePlaylistShowMore,
  handleModifyVideoList,
  playlistStatus,
  setPlaylistStatus,
}) => {
  const { user } = useAuthContext();

  const [isEnd, setIsEnd] = useState(false);

  const [show, setShow] = useState(true);

  const container = useRef();

  useEffect(() => {
    if (isEnd) {
      handlePlaylistShowMore();
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

  if (!playlistInfo) return;

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
                      {playlistCurrentVideoIndex} / {playlistInfo?.size}
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
                <button
                  className='size-[40px] rounded-[50%] p-[8px] active:bg-black-0.2 '
                  onClick={() => {
                    setPlaylistStatus((prev) => ({
                      ...prev,
                      loop: !prev.loop,
                    }));
                  }}
                >
                  <div className='w-[24px] '>
                    {playlistStatus?.loop ? <ActiveLoopIcon /> : <RepeatIcon />}
                  </div>
                </button>
                <button
                  className='size-[40px] rounded-[50%] p-[8px] active:bg-black-0.2 '
                  onClick={() => {
                    setPlaylistStatus((prev) => ({
                      ...prev,
                      shuffle: !prev.shuffle,
                    }));
                  }}
                >
                  <div className='w-[24px] '>
                    {playlistStatus?.shuffle ? (
                      <ActiveShuffleIcon />
                    ) : (
                      <RandomIcon />
                    )}
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
            {playlistVideos.map((item, index) => (
              <PlaylistVideoCard
                key={item?._id}
                containerStyle={`${
                  index === 0 ? "pt-[8px] pb-[4px]" : "py-[4px]"
                }  pr-[8px] `}
                imgStyle={"h-[56px]"}
                currentId={videoId}
                index={index}
                data={item}
                size={playlistVideos.length}
                playlistInfo={playlistInfo}
                renderSettings={
                  user && playlistInfo.channel_info._id === user._id
                }
                handleModify={handleModifyVideoList}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className='py-[12px] pl-[16px] pr-[6px] border-[1px] border-black-0.2 rounded-[12px] bg-[rgba(34,33,51,0.949)]'>
          <div className='flex items-center'>
            <div className='flex-1'>
              <div className='text-[14px] leading-[20px] text-[#E6E5FF] flex'>
                {playlistNextVideoInfo ? (
                  <>
                    <span className='font-[500] mr-[4px]'>Next: </span>
                    <div className='max-h-[20px] line-clamp-1 text-ellipsis overflow-hidden whitespace-nowrap'>
                      <span className=' whitespace-pre-wrap'>
                        {playlistNextVideoInfo?.title}
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
                    {playlistCurrentVideoIndex} / {playlistInfo.size}
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
