import {
  PlayIcon,
  CloseIcon,
  RandomIcon,
  RepeatIcon,
  Setting2Icon,
  ThinArrowIcon,
} from "../../../../../Assets/Icons";
import { useState } from "react";
const Playlist = () => {
  const [show, setShow] = useState(true);

  return (
    <div className='mb-[24px]'>
      {show ? (
        <div className='border-[1px] border-black-0.2 max-h-[419px] overflow-hidden rounded-[12px]'>
          <div className='pt-[12px] pl-[16px] pr-[6px] bg-black-21 '>
            <div className='flex items-center'>
              <div className='flex-1'>
                <div
                  className='max-h-[28px] line-clamp-1 overflow-hidden whitespace-normal
           text-ellipsis text-[20px] leading-[28px] font-bold'
                >
                  <span className=' whitespace-pre-wrap'>GOOSE GOOSE DUCK</span>
                </div>
                <div className='w-fit max-w-full'>
                  <div className='mt-[4px] text-[12px] leading-[15px]  flex'>
                    <div
                      className='flex-1 overflow-hidden text-ellipsis line-clamp-1
                 whitespace-nowrap'
                    >
                      <span className='whitespace-pre-wrap'>SBTC Clear</span>
                    </div>
                    <div className='px-[4px]'>-</div>
                    <span className='text-gray-A'>1 / 28</span>
                  </div>
                </div>
              </div>
              <button
                className='size-[40px] rounded-[50%] p-[8px] active:bg-black-0.1 '
                onClick={() => {
                  setShow(false);
                }}
              >
                <div className='w-[24px] '>
                  <CloseIcon />
                </div>
              </button>
            </div>
            <div className='flex'>
              <div className='flex-1 ml-[-8px]'>
                <button className='size-[40px] rounded-[50%] p-[8px] active:bg-black-0.2 '>
                  <div className='w-[24px] '>
                    <RepeatIcon />
                  </div>
                </button>
                <button className='size-[40px] rounded-[50%] p-[8px] active:bg-black-0.2 '>
                  <div className='w-[24px] '>
                    <RandomIcon />
                  </div>
                </button>
              </div>
              <button className='size-[40px] rounded-[50%] p-[8px] active:bg-black-0.2 '>
                <div className='w-[24px] '>
                  <Setting2Icon />
                </div>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className='py-[12px] pl-[16px] pr-[6px] border-[1px] border-black-0.2 rounded-[12px] bg-[rgba(34,33,51,0.949)]'>
          <div className='flex items-center'>
            <div className='flex-1'>
              <div className='text-[14px] leading-[20px] text-[#E6E5FF] flex'>
                <span className='font-[500] mr-[4px]'>Next: </span>
                <div className='max-h-[20px] line-clamp-1 text-ellipsis overflow-hidden whitespace-nowrap'>
                  <span className=' whitespace-pre-wrap'>
                    GOOSE GOOSE DUCK #3 | JOHNNY CAP CAP ĐI TỚI ĐÂU LÀ ÁN MẠNG
                    TỚI ĐÓ
                  </span>
                </div>
              </div>
              <div className='w-fit max-w-full'>
                <div className='mt-[4px] text-[12px] leading-[18px] text-[rgba(165,163,204,1.000)]  flex'>
                  <button
                    className='flex-1 overflow-hidden text-ellipsis line-clamp-1
                    whitespace-nowrap'
                  >
                    <span className='whitespace-pre-wrap hover:text-white-F1'>
                      GOOSE GOOSE DUCK
                    </span>
                  </button>
                  <div className='px-[4px]'>-</div>
                  <span>1 / 28</span>
                </div>
              </div>
            </div>
            <button
              className='size-[40px] rounded-[50%] p-[8px] active:bg-black-0.2 '
              onClick={() => {
                setShow(true);
              }}
            >
              <div className='w-[24px] rotate-[90deg]'>
                <ThinArrowIcon />
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Playlist;
