import { CheckBox2, DeleteConfirm } from "../../../../../../Component";
import { formatNumber } from "../../../../../../util/numberFormat";
import {
  TrashBinIcon,
  EditIcon,
  PlayListIcon,
  MyChannel2Icon,
} from "../../../../../../Assets/Icons";
import { useAuthContext } from "../../../../../../Auth Provider/authContext";
import { timeFormat3 } from "../../../../../../util/timeforMat";
import { dltData } from "../../../../../../Api/controller";
import PlaylistUpsertModal from "./Upsert/PlaylistUpsertModal";
import { useCallback } from "react";
import Upsert from "./Upsert/Upsert";

const type = {
  liked: "Liked videos",
  watch_later: "Watch later",
  history: "History",
  playlist: "Playlist",
};

const PlaylistTbRow = ({
  handleChecked,
  checked,
  data,
  od,
  refetch,
  horizonScrollVisible,
}) => {
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

  const showUpsertModal = useCallback((func) => {
    setIsShowing(<Upsert id={data?._id} func={func} />);
  }, []);
  return (
    <div className=' h-[84px] group hover:bg-black-0.1 flex border-b-[1px] border-gray-A'>
      <div
        className={`sticky left-0 pl-[24px] flex-1 min-w-[382px] py-[8px] z-[5] flex bg-black group-hover:bg-[#272727]
         border-r-[1px] ${
           horizonScrollVisible ? "border-gray-A" : "border-[transparent]"
         }`}
      >
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
              onClick={() => {
                showUpsertModal("detail");
              }}
            >
              <div className='text-white size-[24px]'>
                <EditIcon />
              </div>
            </button>
            <button
              className='size-[40px] rounded-[50%] hover:bg-black-0.1 active:bg-black-0.2 flex items-center justify-center'
              onClick={() => {
                showUpsertModal("list");
              }}
            >
              <div className='text-white size-[24px]'>
                <MyChannel2Icon />
              </div>
            </button>
            <button
              className='size-[40px] rounded-[50%] hover:bg-black-0.1 active:bg-black-0.2 flex items-center justify-center'
              onClick={showDeleteConfirm}
            >
              <div className='text-white size-[24px]'>
                <TrashBinIcon />
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className='w-[100px] px-[12px] py-[8px]'>
        <span className='text-[12px] leading-[20px] text-white'>
          {type[data?.type]}
        </span>
      </div>

      <div className='w-[180px] px-[12px] py-[8px]'>
        <span className='text-[12px] leading-[20px]  text-white'>
          {timeFormat3(data?.createdAt)}
        </span>
      </div>

      <div className='w-[130px] px-[12px] py-[8px] text-right'>
        <span className='text-[12px] leading-[20px]  text-white '>
          {formatNumber(data?.size)}
        </span>
      </div>
      <div
        className={`sticky right-0 w-[80px]  pl-[12px] pr-[24px] py-[12px] flex  justify-center
       bg-black group-hover:bg-[#272727] border-l-[1px] ${
         horizonScrollVisible ? "border-gray-A" : "border-[transparent]"
       }`}
      >
        <CheckBox2
          checked={checked}
          setChecked={() => {
            handleChecked(data?._id);
          }}
        />
      </div>
    </div>
  );
};
export default PlaylistTbRow;
