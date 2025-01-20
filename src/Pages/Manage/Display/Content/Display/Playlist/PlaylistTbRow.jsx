import { CheckBox2, DeleteConfirm } from "../../../../../../Component";
import { formatNumber } from "../../../../../../util/numberFormat";
import {
  TrashBinIcon,
  EditIcon,
  PlayListIcon,
} from "../../../../../../Assets/Icons";
import { useAuthContext } from "../../../../../../Auth Provider/authContext";
import { timeFormat3 } from "../../../../../../util/timeforMat";
import { dltData } from "../../../../../../Api/controller";
import PlaylistUpsertModal from "./PlaylistUpsertModal";
import { useCallback } from "react";

const type = {
  liked: "Liked videos",
  watch_later: "Watch later",
  history: "History",
  playlist: "Playlist",
};

const PlaylistTbRow = ({ handleChecked, checked, data, od, refetch }) => {
  const { setIsShowing, addToaster } = useAuthContext();

  const handleDelete = useCallback(async () => {
    await dltData(
      "/client/playlist",
      data?._id,
      "playlist",
      () => {
        refetch();
      },
      undefined,
      addToaster,
    );
  });

  const showDeleteConfirm = () => {
    setIsShowing(
      <DeleteConfirm
        handleDelete={handleDelete}
        type={"Playlist"}
        data={data?._id}
      />,
    );
  };

  const showUpsertModal = () => {
    setIsShowing(
      <PlaylistUpsertModal title={"Editing playlist"} id={data?._id} />,
    );
  };
  return (
    <div className='text-[12px] font-[500] leading-[48px] text-gray-A flex  gap-[12px] group hover:bg-black-0.1 '>
      <div className='w-[70px] h-[84px] px-[8px] flex items-center gap-[12px] absolute left-0 bg-black group-hover:bg-black-0.1 border-r-[2px] z-[20]'>
        <CheckBox2
          checked={checked}
          setChecked={() => {
            handleChecked(data?._id);
          }}
        />
        <span>{od}</span>
      </div>
      <div className='flex-1 ml-[100px] flex py-[8px]'>
        <div className='relative w-[120px] h-[68px] border-[1px] rounded-[5px] overflow-hidden mr-[16px]'>
          <img
            src={`${import.meta.env.VITE_BASE_API_URI}${
              import.meta.env.VITE_VIEW_THUMB_API
            }${data?.video_list[0]?.thumb}`}
            className='w-full object-contain object-center rounded-[5px] aspect-[16/9]'
          />
          <div
            className='absolute w-[52px] h-full right-0 top-0 bg-[#000000cc] 
          flex flex-col items-center justify-center'
          >
            <span className='text-[12px] leading-[20px] font-[500] text-white'>
              {data?.size}
            </span>
            <div className='size-[20px]'>
              <PlayListIcon />
            </div>
          </div>
        </div>
        <div>
          <div>
            <span className='text-[13px] leading-[20px] text-white font-[400]  line-clamp-1 text-ellipsis'>
              {data?.title}
            </span>
          </div>
          <div className='flex items-center mt-[8px] invisible group-hover:visible'>
            <button
              className='size-[40px] rounded-[50%] hover:bg-black-0.1 active:bg-black-0.2 flex items-center justify-center'
              onClick={showUpsertModal}
            >
              <div className='text-white'>
                <EditIcon />
              </div>
            </button>

            <button
              className='size-[40px] rounded-[50%] hover:bg-black-0.1 active:bg-black-0.2 flex items-center justify-center'
              onClick={showDeleteConfirm}
            >
              <div className='text-white'>
                <TrashBinIcon />
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className='w-[100px] px-[10px]  my-[8px]'>
        <span className='text-[12px] leading-[20px]  text-white'>
          {type[data?.type]}
        </span>
      </div>
      <div className='w-[150px] px-[10px] my-[8px]'>
        <span className='text-[12px] leading-[20px]  text-white'>
          {formatNumber(data?.size)}
        </span>
      </div>

      <div className='w-[150px] my-[8px]'>
        <span className='text-[12px] leading-[20px]  text-white'>
          {timeFormat3(data?.createdAt)}
        </span>
      </div>
    </div>
  );
};
export default PlaylistTbRow;
