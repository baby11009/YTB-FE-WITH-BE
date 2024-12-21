import { useState, useRef, useLayoutEffect } from "react";
import { ThinArrowIcon, CheckIcon } from "../../../../../Assets/Icons";

const SleepTimer = ({
  settingRef,
  videoSettings,
  setVideoSettings,
  setCurrTreePosition,
}) => {
  const sleepTimerDisplay = useRef([
    { title: "Off", value: false },
    { title: "10 minutes", value: 10 },
    { title: "15 minutes", value: 15 },
    { title: "20 minutes", value: 20 },
    { title: "30 minutes", value: 30 },
    { title: "45 minutes", value: 45 },
    { title: "60 minutes", value: 60 },
    {
      title: "End of video",
      subtitle: "2 min",
      value: "video duration + 2 min",
    },
  ]);

  useLayoutEffect(() => {
    if (settingRef.current) {
      settingRef.current.style.width = "251px";
      settingRef.current.style.height =
        40 * sleepTimerDisplay.current.length + 16 + 53.6 + "px";

      settingRef.current.style.maxHeight = "328px";
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
        {sleepTimerDisplay.current.map((item, id) => (
          <button
            className='w-full h-[40px] flex items-center hover:bg-black-0.1'
            key={item.title}
            onClick={() => {
              setVideoSettings((prev) => ({ ...prev, sleepTimer: item }));
              setOpenSettings(false);
            }}
          >
            <div className='w-[40px] p-[11px]'>
              {videoSettings.sleepTimer.value === item.value && (
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
export default SleepTimer;
