import { useState, useRef, useLayoutEffect } from "react";
import { ThinArrowIcon, CheckIcon } from "../../../../../Assets/Icons";

const Subtitles = ({
  settingRef,
  videoSettings,
  setVideoSettings,
  setCurrTreePosition,
  setOpenSettings,
}) => {
  const subtitlesDisplay = useRef([
    {
      title: "Off",
      value: false,
    },
    {
      title: "English (auto-generated)",
      value: 1,
    },
    {
      title: "Vietnamese (auto-generated)",
      value: 2,
    },
    {
      title: "English ",
      value: 3,
    },
  ]);

  useLayoutEffect(() => {
    if (settingRef.current) {
      settingRef.current.style.width = "251px";
      settingRef.current.style.height =
        40 * subtitlesDisplay.current.length + 16 + 53.6 + "px";

      settingRef.current.style.maxHeight = "237px";
    }
  }, []);

  return (
    <div className='flex flex-col overflow-hidden'>
      <div className='border-b-[2px] border-black-0.2 px-[12px] py-[16px]'>
        <button
          type='button'
          onClick={() => {
            setCurrTreePosition("default");
          }}
          className='flex items-center'
        >
          <div className='w-[20px] rotate-[180deg]'>
            <ThinArrowIcon />
          </div>
          <span className='text-[13px] leading-[17px] font-[500] pl-[8px]'>
            Quality
          </span>
        </button>
      </div>
      <div className='flex-1  overflow-y-auto py-[8px] w-full'>
        {subtitlesDisplay.current.map((item, id) => (
          <button
            className='w-full h-[40px] flex items-center hover:bg-black-0.1'
            key={item.title}
            onClick={() => {
              setVideoSettings((prev) => ({ ...prev, subtitles: item }));
              setOpenSettings(false);
            }}
          >
            <div className='w-[40px] p-[11px]'>
              {videoSettings.subtitles.value === item.value && (
                <div className='w-[18px]'>
                  <CheckIcon />
                </div>
              )}
            </div>

            <span className='text-[13px] leading-[17px] font-[500]'>
              {item.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
export default Subtitles;
