import { CheckBox2, DeleteConfirm } from "../../../../../../Component";
import { formatNumber } from "../../../../../../util/numberFormat";
import { TrashBinIcon, EditIcon } from "../../../../../../Assets/Icons";
import { useAuthContext } from "../../../../../../Auth Provider/authContext";
import { timeFormat3 } from "../../../../../../util/timeforMat";
import { dltData } from "../../../../../../Api/controller";
import VideoUpsertModal from "./VideoUpsertModal";

const VideoTbRow = ({ handleChecked, checked, data, od, refetch }) => {
  const { setIsShowing, addToaster } = useAuthContext();

  const handleDelete = async () => {
    await dltData(
      "/client/video",
      data?._id,
      "video",
      () => {
        refetch();
      },
      undefined,
      addToaster,
    );
  };

  const showDeleteConfirm = () => {
    setIsShowing(
      <DeleteConfirm
        handleDelete={handleDelete}
        type={"Video"}
        data={data?._id}
      />,
    );
  };

  const showUpsertModal = () => {
    setIsShowing(<VideoUpsertModal title={"Editing video"} id={data?._id} />);
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
      <div className='w-[300px] ml-[80px] rounded-[5px] bg-amber-300'>
        <img
          src={`${import.meta.env.VITE_BASE_API_URI}${
            import.meta.env.VITE_VIEW_THUMB_API
          }${data?.thumb}`}
          alt=''
          className='w-full max-h-[200px] h-auto object-contain object-center rounded-[5px] aspect-[16/9]'
        />
      </div>
      <div className='w-[350px]'>
        <div className='text-nowrap overflow-hidden text-ellipsis'>
          {data?.title}
        </div>
      </div>
      <div className='w-[100px] relative group'>
        <span>{formatNumber(data?.view)}</span>
        <div className='bg-black-0.2 text-[14px] leading-[20px] font-[500] hidden group-hover:block absolute left-[20%] top-[-35%] px-[12px] py-[2px] rounded-[5px]'>
          {data?.view}
        </div>
      </div>
      <div className='w-[100px] relative group'>
        <span>{formatNumber(data?.like)}</span>
        <div className='bg-black-0.2 text-[14px] leading-[20px] font-[500] hidden group-hover:block absolute left-[20%] top-[-35%] px-[12px] py-[2px] rounded-[5px]'>
          {data?.like}
        </div>
      </div>
      <div className='w-[100px] relative group'>
        <span>{formatNumber(data?.dislike)}</span>
        <div className='bg-black-0.2 text-[14px] leading-[20px] font-[500] hidden group-hover:block absolute left-[20%] top-[-35%] px-[12px] py-[2px] rounded-[5px]'>
          {data?.dislike}
        </div>
      </div>
      <div className='w-[100px] relative group'>
        <span>{formatNumber(data?.totalCmt)}</span>
        <div className='bg-black-0.2 text-[14px] leading-[20px] font-[500] hidden group-hover:block absolute left-[20%] top-[-35%] px-[12px] py-[2px] rounded-[5px]'>
          {data?.totalCmt}
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
        <button
          className='size-[40px] rounded-[50%] hover:bg-black-0.1 active:bg-black-0.2 flex items-center justify-center'
          onClick={showDeleteConfirm}
        >
          <div className='text-red-500'>
            <TrashBinIcon />
          </div>
        </button>
      </div>
    </div>
  );
};
export default VideoTbRow;
