import { useRef } from "react";
import { CheckBox2 } from "../../../../Component";
import { EditIcon, TrashBinIcon } from "../../../../Assets/Icons";
import { Link } from "react-router-dom";
import { timeFormat3 } from "../../../../util/timeforMat";
import { upperCaseFirstChar } from "../../../../util/func";

const UserTbRow = ({ data, handleChecked, checked, handleDelete }) => {
  const roleColor = useRef({ admin: "text-[#dc3545]", user: "text-[#007bff]" });

  return (
    <div className='h-[76px] group hover:bg-black-0.1 flex border-b-[1px] border-gray-A text-[13px] leading-[24px]'>
      <div className='px-[20px] z-[10] flex items-center'>
        <CheckBox2
          checked={checked}
          setChecked={() => {
            handleChecked(data?._id);
          }}
        />
      </div>
      <div
        className='pl-[12px] flex-[2_0_300px] min-w-[300px] 
        border-r-[1px] border-gray-A z-[10] bg-black group-hover:bg-[#272727] py-[8px] flex'
      >
        <div>
          <img
            src={`${import.meta.env.VITE_BASE_API_URI}${
              import.meta.env.VITE_VIEW_AVA_API
            }${data?.avatar}`}
            alt={`${data?.name}-avatar`}
            className='size-[60px] rounded-[50%]'
          />
        </div>
        <div className='flex-1 ml-[16px] pr-[12px] overflow-hidden'>
          <div className=' overflow-hidden'>
            <div className=' h-[20px] line-clamp-1 text-ellipsis break-all text-[13px] leading-[20px]'>
              {data?.name}
            </div>
          </div>
          <div className=' overflow-hidden group-hover:hidden'>
            <div className=' h-[20px] line-clamp-1 text-ellipsis break-all text-[13px] leading-[20px] text-gray-A'>
              {data?.email}
            </div>
          </div>

          <div className='hidden group-hover:flex'>
            <Link
              className='size-[40px] rounded-[50%] hover:bg-black-0.1 active:bg-black-0.2 flex items-center justify-center'
              to={`./upsert/${data?._id}`}
            >
              <div className='text-white size-[24px]'>
                <EditIcon />
              </div>
            </Link>
            <button
              className='size-[40px] rounded-[50%] hover:bg-black-0.1 active:bg-black-0.2 
            flex items-center justify-center'
              onClick={() => handleDelete(data?._id)}
            >
              <div className='text-white size-[24px]'>
                <TrashBinIcon />
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className='flex-[1_0_150px] min-w-[100px] mx-[12px] py-[8px]'>
        <span>{timeFormat3(data?.createdAt)}</span>
      </div>
      <div
        className={`flex-[1_0_100px] min-w-[100px] mx-[12px] py-[8px] ${
          roleColor.current[data?.role]
        }`}
      >
        <span>{upperCaseFirstChar(data?.role)}</span>
      </div>
      <div className='flex-[1_0_100px] min-w-[100px] mx-[12px] py-[8px]'>
        <span
          className={`${data?.confirmed ? "text-green-500" : "text-red-500"}`}
        >
          {upperCaseFirstChar(data?.confirmed?.toString())}
        </span>
      </div>
    </div>
  );
};
export default UserTbRow;
