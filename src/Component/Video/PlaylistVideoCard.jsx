import {
  Setting2Icon,
  LaterIcon,
  SaveIcon,
  TrashBinIcon,
  DownloadIcon,
  ShareIcon,
  PlayIcon,
  EqualIcon,
} from "../../Assets/Icons";
import { useAuthContext } from "../../Auth Provider/authContext";
import CustomeFuncBox from "../Box/CustomeFuncBox";
import { useCallback } from "react";
import request from "../../util/axios-base-url";
import { Link } from "react-router-dom";
import PlaylistModal from "../Modal/PlaylistModal";

const PlaylistVideoCard = ({
  containerStyle,
  imgStyle,
  playlistInfo,
  currentId,
  index,
  data,
  size,
  renderSettings, // For your own playlist
  handleModify,
}) => {
  const { handleCursorPositon, setShowHover, addToaster, setIsShowing } =
    useAuthContext();

  const handleSaveToPlaylist = useCallback(() => {
    setIsShowing(<PlaylistModal videoId={data?._id} />);
  }, []);

  const handleAddToWatchLater = useCallback(async () => {
    await request
      .patch("/client/playlist/watchlater", {
        videoIdList: [data?._id],
      })
      .then((rsp) => {
        addToaster(rsp.data.msg);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const removeFromPlaylist = useCallback(async (from, to) => {
    try {
      await request
        .patch(`/client/playlist/${playlistInfo?._id}`, {
          videoIdList: [data?._id],
        })
        .then((rsp) => {
          console.log(rsp.data);
          handleModify(data?._id);
          addToaster(`Remove from ${playlistInfo.title}`);
        });
    } catch (error) {
      alert(`Failed to remove from ${playlistInfo.title}`);
      throw error;
    }
  }, []);

  const removeLikedVideos = useCallback(async () => {
    try {
      await request
        .post("/client/react", {
          videoId: data?._id,
          type: "like",
        })
        .then((rsp) => {
          console.log(rsp.data);
          handleModify(data?._id);
          addToaster(`Remove from ${playlistInfo.title}`);
        });
    } catch (error) {
      alert(`Failed to remove from ${playlistInfo.title}`);
      throw error;
    }
  }, []);

  const funcList = [
    {
      id: 1,
      text: "Save to Watch later",
      icon: <LaterIcon />,
      handleOnClick: handleAddToWatchLater,
      renderCondition:
        playlistInfo.type !== "personal" ||
        playlistInfo.title !== "Watch later",
    },
    {
      id: 2,
      text: "Save to playlist",
      icon: <SaveIcon />,
      handleOnClick: handleSaveToPlaylist,
    },
    {
      id: 3,
      text: "Remove from playlist",
      icon: <TrashBinIcon />,
      handleOnClick: removeFromPlaylist,
      renderCondition:
        playlistInfo.type !== "personal" ||
        playlistInfo.title !== "Liked videos",
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

  const funcList2 = [
    {
      id: 1,
      text: "Remove from Liked videos",
      icon: <TrashBinIcon />,
      handleOnClick: removeLikedVideos,
      renderCondition:
        playlistInfo.type === "personal" &&
        playlistInfo.title === "Liked videos",
    },
  ];

  return (
    <Link
      className={`${containerStyle ? containerStyle : ""} ${
        currentId === data?._id
          ? "bg-[rgba(40,45,51,0.949)]"
          : "hover:bg-black-0.1"
      } box-content flex items-center cursor-grab group`}
      to={`/video?id=${data?._id}&list=${playlistInfo?._id}`}
    >
      <div className='w-[24px] text-center'>
        {currentId === data?._id ? (
          <div className='h-[15px] text-gray-A group-hover:hidden block'>
            <PlayIcon />
          </div>
        ) : (
          <span className='text-[12px] leading-[15px] text-gray-A group-hover:hidden block'>
            {index + 1}
          </span>
        )}

        <div className='h-[24px] text-gray-A group-hover:block hidden'>
          <EqualIcon />
        </div>
      </div>
      <div className='flex-1  flex'>
        <div
          className={`${
            imgStyle ? imgStyle : "h-full"
          } aspect-video rounded-[8px] overflow-hidden relative`}
        >
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
        <div className='px-[8px] flex-1'>
          <div
            className={`max-h-[40px] overflow-hidden line-clamp-2 
          text-ellipsis text-[14px] leading-[20px]  font-[500] mb-[4px]
          ${currentId === data?._id ? "text-[#e5f1ff] " : ""}`}
          >
            <span className=' whitespace-pre-wrap '>{data?.title}</span>
          </div>
          <div
            className={`max-h-[20px] overflow-hidden line-clamp-1
          text-ellipsis text-[12px] leading-[18px] ${
            currentId === data?._id ? "text-[rgb(163,181,204)] " : "text-gray-A"
          } `}
          >
            <span className=' whitespace-pre-wrap '>
              {data?.channel_info?.name}
            </span>
          </div>
        </div>
      </div>

      {renderSettings && (
        <button
          className='size-[40px] rounded-[50%] flex items-center justify-center
         active:bg-black-0.2 group-hover:opacity-[1] opacity-0'
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
                  funcList1={funcList}
                  funcList2={
                    funcList2[0].renderCondition ? funcList2 : undefined
                  }
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
      )}
    </Link>
  );
};
export default PlaylistVideoCard;
