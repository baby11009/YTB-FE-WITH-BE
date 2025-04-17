import { Short2Icon, CloseIcon } from "../../Assets/Icons";

import { useState } from "react";
import { ShortCard } from "..";

const ShortRow = ({ shortList = [], showQtt, noBtn, container1Style }) => {
  const [showShort, setShowShort] = useState(true);

  return (
    <>
      {showShort ? (
        <div className={`${container1Style} mb-[48px] relative`}>
          <div className='ml-[8px] my-[16px] flex items-center justify-between'>
            <div className='flex gap-[8px]'>
              <Short2Icon />
              <span className='text-[20px] leading-[28px] font-[700]'>
                Shorts
              </span>
            </div>
            {!noBtn ? (
              <div
                className='w-[40px] h-[40px] rounded-[50%] hover:bg-[rgba(255,255,255,0.2)] 
                     flex items-center justify-center cursor-pointer'
                title="Don't care"
                onClick={() => setShowShort(false)}
              >
                <div className='size-[24px]'>
                  <CloseIcon />
                </div>
              </div>
            ) : (
              <div className='px-[16px] rounded-[18px] hover:bg-[#263850] cursor-pointer'>
                <span className=' text-nowrap text-[14px] leading-[36px] font-[500] text-blue-3E'>
                  Watch all
                </span>
              </div>
            )}
          </div>
          <div
            className='grid'
            style={{
              gridTemplateColumns: `repeat(${Math.ceil(
                showQtt,
              )}, minmax(0, 1fr))`,
            }}
          >
            {shortList.map((item) => (
              <ShortCard key={item._id} data={item} />
            ))}
          </div>
        </div>
      ) : (
        <div className='mb-[40px] text-[14px]'>
          <span className='mr-[12px]  leading-[20px] text-gray-A'>
            Desk will be hide in 30 days
          </span>
          <button
            className='text-[14px] leading-[36px] text-blue-3E px-[16px] 
            rounded-[18px] hover:bg-[#263850] font-bold'
            onClick={() => setShowShort(true)}
          >
            Cancel
          </button>
        </div>
      )}
    </>
  );
};
export default ShortRow;
