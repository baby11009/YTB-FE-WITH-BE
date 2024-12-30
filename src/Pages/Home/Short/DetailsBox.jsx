import { useRef } from "react";
import { CloseIcon } from "../../../Assets/Icons";
import { formatNumber } from "../../../util/numberFormat";

const DetailsBox = ({ shortData, handleClose }) => {
  const createdDate = useRef(new Date(shortData.createdAt));

  // convert time to get month in text
  const monthName = useRef(
    new Intl.DateTimeFormat("en-US", { month: "long" }).format(
      createdDate.current,
    ),
  );

  return (
    <div
      className='size-full flex flex-col cursor-auto bg-black-21 1156:bg-transparent 
    1156:border-[1px] 1156:border-black-0.2 rounded-[12px]'
    >
      <div className='px-[16px] py-[4px] flex items-center justify-between border-b-[1px] border-black-0.2'>
        <span className='text-[20px] leading-[28px] font-bold my-[10px]'>
          Description
        </span>
        <button
          type='button'
          className='size-[40px] p-[8px] rounded-[50%] hover:bg-black-0.2'
          onClick={handleClose}
        >
          <div className='w-[24px]'>
            <CloseIcon />
          </div>
        </button>
      </div>
      <div className='pt-[16px] px-[16px]'>
        <div
          className='pb-[16px] border-b-[1px] border-black-0.2 
        line-clamp-5 text-ellipsis whitespace-pre-wrap'
        >
          <span className='text-[14px] leading-[20px]'>
            {shortData.description ||
              "Lorem ipsum dolor sit amet iam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur"}
          </span>
        </div>
        <div className='py-[16px] flex items-center justify-evenly'>
          <div className='flex flex-col  items-center'>
            <span className='text-[18px] leading-[26px] font-[500]'>
              {formatNumber(shortData.like)}
            </span>
            <span className='text-[12px] leading-[18px] font-[500] text-gray-A'>
              Likes
            </span>
          </div>
          <div className='flex flex-col  items-center'>
            <span className='text-[18px] leading-[26px] font-[500]'>
              {formatNumber(shortData.view)}
            </span>
            <span className='text-[12px] leading-[18px] font-[500] text-gray-A'>
              Views
            </span>
          </div>
          <div className='flex flex-col  items-center'>
            <span className='text-[18px] leading-[26px] font-[500]'>
              {monthName.current} {createdDate.current.getDay()}
            </span>
            <span className='text-[12px] leading-[18px] font-[500] text-gray-A'>
              {createdDate.current.getFullYear()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DetailsBox;
