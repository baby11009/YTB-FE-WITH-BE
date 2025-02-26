import { useRef, useState, useEffect } from "react";
import { dltData, updateData } from "../../../../Api/controller";
import { CheckBox2 } from "../../../../Component";
import {
  EditIcon,
  DeleteIcon,
  ThinArrowIcon,
  TrashBinIcon,
} from "../../../../Assets/Icons";
import { Link } from "react-router-dom";
import { timeFormat3 } from "../../../../util/timeforMat";
import { upperCaseFirstChar } from "../../../../util/func";
import { useAuthContext } from "../../../../Auth Provider/authContext";

const UserTbRow = ({
  data,
  od,
  limit,
  length,
  page,
  refetch,
  handleChecked,
  checkedList = [],
}) => {
  const { addToaster } = useAuthContext();

  const containerRef = useRef();

  const [opened, setOpened] = useState(false);

  const roleColor = useRef({ admin: "text-[#dc3545]", user: "text-[#007bff]" });

  const handleChangeRole = async (id, role, currRole) => {
    setOpened(false);
    if (role === currRole) {
      alert(`${role} là role hiện tại của user với id ${id}`);
      return null;
    }
    const body = {
      role,
    };

    await updateData(
      "user",
      id,
      body,
      "user",
      () => {
        refetch();
      },
      undefined,
      addToaster,
    );
  };

  useEffect(() => {
    const handleClickOutScope = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpened(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutScope);

    return () => {
      window.removeEventListener("mousedown", handleClickOutScope);
    };
  }, []);

  return (
    <div className='h-[76px] group hover:bg-black-0.1 flex border-b-[1px] border-gray-A text-[13px] leading-[24px]'>
      <div className='sticky left-0 p-[8px_12px_8px_25px] z-[10]'>
        <CheckBox2
          checked={checkedList.includes(data?._id)}
          setChecked={() => {
            handleChecked(data?._id);
          }}
        />
      </div>
      <div
        className='sticky left-[57px] pl-[12px] flex-[2_0_300px] min-w-[300px] 
        border-r-[1px] border-gray-A z-[10] py-[8px] flex'
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
            <div
              className=' h-[20px] line-clamp-1 text-ellipsis break-all text-[13px] leading-[20px]'
              dangerouslySetInnerHTML={{
                __html: data?.name,
              }}
            ></div>
          </div>
          <div className=' overflow-hidden group-hover:hidden'>
            <div
              className=' h-[20px] line-clamp-1 text-ellipsis break-all text-[13px] leading-[20px] text-gray-A'
              dangerouslySetInnerHTML={{
                __html: data?.email,
              }}
            ></div>
          </div>

          <div className='hidden group-hover:flex'>
            <button
              className='size-[40px] rounded-[50%] hover:bg-black-0.1 active:bg-black-0.2 flex items-center justify-center'
              onClick={() => {}}
            >
              <div className='text-white size-[24px]'>
                <EditIcon />
              </div>
            </button>
            <button className='size-[40px] rounded-[50%] hover:bg-black-0.1 active:bg-black-0.2 flex items-center justify-center'>
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
