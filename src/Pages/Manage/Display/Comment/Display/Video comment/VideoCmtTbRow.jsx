import { CheckBox2, DeleteConfirm } from "../../../../../../Component";
import { TrashBinIcon, EditIcon } from "../../../../../../Assets/Icons";
import { useAuthContext } from "../../../../../../Auth Provider/authContext";
import { timeFormat3 } from "../../../../../../util/timeforMat";
import { dltData } from "../../../../../../Api/controller";
import { useLayoutEffect, useState } from "react";

const VideoCmtTbRow = ({ handleChecked, checked, data, od, refetch }) => {
  
  const { setIsShowing } = useAuthContext();

  const handleDelete = async () => {
    await dltData("/client/comment", data?._id);

    refetch();
  };

  const showDeleteConfirm = () => {
    setIsShowing(
      <DeleteConfirm
        handleDelete={handleDelete}
        type={"Comment"}
        data={data?._id}
      />
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
      <div className='w-[150px] ml-[80px] leading-[18px]'>
        {data?.user_info?.name} ({data?.user_info?.email})
      </div>
      <div className='w-[300px]'>
        <p className='leading-[18px] line-clamp-[9] '>{data?.cmtText}</p>
      </div>
      <div className='w-[300px] rounded-[5px] bg-amber-300'>
        <img
          src={`${import.meta.env.VITE_BASE_API_URI}${
            import.meta.env.VITE_VIEW_THUMB_API
          }${data?.video_info?.thumb}`}
          alt=''
          className='w-full max-h-[200px] h-auto object-contain object-center rounded-[5px] aspect-[16/9]'
        />
      </div>
      <div className='w-[200px] h-[200px] relative group flex items-center '>
        <div
          className='absolute top-[16px] left-0 group-hover:block hidden bg-black text-white-F1 rounded-[5px]
          py-[4px] px-[8px] shadow-[0_0_8px_rgba(255,255,255,0.6)] text-[16px] leading-[18px] z-[1]'
          style={{
            userSelect: "none",
          }}
        >
          <p className='line-clamp-[9]'>{data?.video_info?.title}</p>
        </div>
        <div className='text-nowrap overflow-hidden text-ellipsis relative '>
          {data?.video_info?.title}
        </div>
      </div>
      <div className='w-[150px] mr-[100px]'>{timeFormat3(data?.createdAt)}</div>

      <div className='w-[100px] absolute right-0 bg-black h-[200px] flex items-center border-l-[2px] px-[12px]'>
        <button
          className='size-[40px] rounded-[50%] hover:bg-black-0.1 active:bg-black-0.2 flex items-center justify-center'
          onClick={() => {
            setEditText((prev) => !prev);
          }}
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
export default VideoCmtTbRow;
