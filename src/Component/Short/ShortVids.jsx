import { Short2Icon, CloseIcon, ThinArrowIcon } from "../../Assets/Icons";

import { useState, useLayoutEffect } from "react";
import { ShortCard } from "..";

const ShortCardRow = ({ shortList, showQtt }) => {
  const [vrArr, setVrArr] = useState([]);

  useLayoutEffect(() => {
    setVrArr(Array.from({ length: showQtt - shortList?.length }, (_, i) => i));
  }, [showQtt, shortList]);

  return (
    <div className='flex'>
      {shortList?.map((item, index) => {
        return (
          <ShortCard
            key={index}
            data={item}
            funcBoxPos={(index + 1) % showQtt === 0 && "sm:right-[20%]"}
          />
        );
      })}
      {vrArr.map((item) => (
        <div className='flex-1 mx-[8px]' key={item}></div>
      ))}
    </div>
  );
};

const ShortVids = ({
  shortList = [],
  showQtt,
  noBtn,
  container1Style,
}) => {
  const [showShort, setShowShort] = useState(true);

  const [shortRows, setShortRows] = useState(1);

  const [shortRowsArr, setShortRowsArr] = useState(
    Array.from({ length: shortRows }, (_, i) => i),
  );

  useLayoutEffect(() => {
    setShortRowsArr(Array.from({ length: shortRows }, (_, i) => i));
  }, [shortRows]);

  return (
    <>
      {showShort ? (
        <div
          className={`${container1Style} mb-[48px] pb-[17px] border-b-[1px] border-[rgba(255,255,255,0.2)] relative`}
        >
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
          <div className='flex flex-col'>
            {shortRowsArr.map((item) => (
              <ShortCardRow
                key={item}
                shortList={shortList?.slice(
                  item * showQtt,
                  item * showQtt + showQtt,
                )}
                showQtt={showQtt}
              />
            ))}
          </div>
          {!noBtn && shortList?.length > showQtt && (
            <div
              className='absolute bg-black  w-[360px] max-w-[100%] left-[50%] bottom-[0] 
             translate-x-[-50%] translate-y-[50%] '
            >
              <button
                className='w-full flex justify-center items-center gap-[6px]
                  hover:bg-[rgba(255,255,255,0.2)] border-[1px] border-[rgba(255,255,255,0.2)] 
                   hover:border-transparent font-bold  text-[14px] leading-[36px] rounded-[18px] px-[15px]'
                onClick={() =>
                  setShortRows((prev) => (prev > 1 ? prev - 1 : prev + 1))
                }
              >
                <span>{shortRows > 1 ? "Ẩn bớt" : "Hiện thêm"}</span>
                <div
                  className={` ${
                    shortRows > 1 ? "rotate-[-90deg]" : "rotate-90"
                  }`}
                >
                  <ThinArrowIcon />
                </div>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className='mb-[40px] text-[14px]'>
          <span className='mr-[12px]  leading-[20px] text-gray-A'>
            Desk will be hide in 30days
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
export default ShortVids;
