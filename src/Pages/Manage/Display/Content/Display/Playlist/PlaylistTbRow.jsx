import { CheckBox2, DeleteConfirm } from "../../../../../../Component";
import { formatNumber } from "../../../../../../util/numberFormat";
import { TrashBinIcon, EditIcon } from "../../../../../../Assets/Icons";
import { useAuthContext } from "../../../../../../Auth Provider/authContext";
import { timeFormat3 } from "../../../../../../util/timeforMat";
import { dltData } from "../../../../../../Api/controller";
import PlaylistUpsertModal from "./PlaylistUpsertModal";
import { useCallback } from "react";

const PlaylistTbRow = ({ handleChecked, checked, data, od, refetch }) => {
  const { setIsShowing, setNotifyMessage } = useAuthContext();

  const handleDelete = useCallback(async () => {
    await dltData(
      "/client/playlist",
      data?._id,
      "playlist",
      () => {
        refetch();
      },
      undefined,
      setNotifyMessage,
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
    <div className='text-[12px] font-[500] leading-[48px] text-gray-A flex items-center gap-[12px] py-[12px] h-[200px]'>
      <div className='w-[70px] flex items-center gap-[12px] absolute left-0 bg-black h-[200px] border-r-[2px] '>
        <CheckBox2
          checked={checked}
          setChecked={() => {
            handleChecked(data?._id);
          }}
        />
        <span>{od}</span>
      </div>
      <div className='w-[350px] ml-[80px]'>
        <div className='text-nowrap overflow-hidden text-ellipsis'>
          {data?.title}
        </div>
      </div>
      <div className='w-[350px]'>
        <div className='flex gap-[12px] w-full overflow-auto'>
          {data?.video_list?.map((video, id) => (
            <div className='border-[2px] rounded-[5px]' key={id}>
              <img
                src={`${import.meta.env.VITE_BASE_API_URI}${
                  import.meta.env.VITE_VIEW_THUMB_API
                }${video?.thumb}`}
                className='w-full min-w-[250px] max-h-[200px] h-auto object-contain object-center rounded-[5px] aspect-[16/9]'
              />
            </div>
          ))}
        </div>
      </div>
      <div className='w-[100px] px-[10px]'>{data?.type}</div>
      <div className='w-[120px] relative group px-[10px]'>
        <span>{formatNumber(data?.size)}</span>
        <div className='bg-black-0.2 text-[14px] leading-[20px] font-[500] hidden group-hover:block absolute left-[20%] top-[-35%] px-[12px] py-[2px] rounded-[5px]'>
          {data?.size}
        </div>
      </div>

      <div className='w-[150px] mr-[100px]'>{timeFormat3(data?.createdAt)}</div>

      <div className='w-[100px] absolute right-0 bg-black h-[200px] flex items-center border-l-[2px] px-[12px]'>
        <button
          className='size-[40px] rounded-[50%] hover:bg-black-0.1 active:bg-black-0.2 flex items-center justify-center'
          onClick={showUpsertModal}
        >
          <div className='text-blue-500'>
            <EditIcon />
          </div>
        </button>
        {data.type !== "personal" && (
          <button
            className='size-[40px] rounded-[50%] hover:bg-black-0.1 active:bg-black-0.2 flex items-center justify-center'
            onClick={showDeleteConfirm}
          >
            <div className='text-red-500'>
              <TrashBinIcon />
            </div>
          </button>
        )}
      </div>
    </div>
  );
};
export default PlaylistTbRow;
