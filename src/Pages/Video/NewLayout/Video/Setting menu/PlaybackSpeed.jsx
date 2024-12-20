import { useState, useRef, useLayoutEffect } from "react";
import { ThinArrowIcon, CheckIcon } from "../../../../../Assets/Icons";
const PlaybackSpeed = ({
  settingRef,
  videoSettings,
  setVideoSettings,
  setCurrTreePosition,
  setOpenSettings,
}) => {
  const playbackDisplay = useRef([
    { title: 0.25, value: 0.25 },
    { title: 0.5, value: 0.5 },
    { title: 0.75, value: 0.75 },
    { title: "Normal", value: 1 },
    { title: 1.25, value: 1.25 },
    { title: 1.5, value: 1.5 },
    { title: 1.75, value: 1.75 },
    { title: 2, value: 2 },
  ]);

  useLayoutEffect(() => {
    if (settingRef.current) {
      settingRef.current.style.width = "251px";
      settingRef.current.style.height =
        40 * playbackDisplay.current.length + 16 + "px";

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
      <div className='flex-1 overflow-y-scroll w-full'>
        {playbackDisplay.current.map((item, id) => (
          <button
            className='w-full h-[40px] flex items-center hover:bg-black-0.1'
            key={item.title}
            onClick={() => {
              setVideoSettings((prev) => ({ ...prev, playbackSpeed: item }));
              setOpenSettings(false);
            }}
          >
            <div className='w-[40px] p-[11px]'>
              {videoSettings.playbackSpeed.value === item.value && (
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
export default PlaybackSpeed;
