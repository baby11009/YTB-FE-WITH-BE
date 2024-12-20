import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";

import {
  StableVolumeIcon,
  AmbientModeIcon,
  Subtitles2Icon,
  PlaybackSpeedIcon,
  SleepTimerIcon,
  QualityIcon,
  ThinArrowIcon,
} from "../../../../../Assets/Icons";

const Default = ({
  settingRef,
  videoSettings,
  setVideoSettings,
  setCurrTreePosition,
}) => {
  const handleChangeDirection = useCallback((data) => {
    setCurrTreePosition(data.slug);
  }, []);

  const handleChangeVideoSettings = useCallback((data) => {
    setVideoSettings((prev) => ({ ...prev, [data.slug]: !prev[data.slug] }));
  }, []);

  const defaultDisplay = useRef([
    {
      title: "Stable Volume",
      icon: <StableVolumeIcon />,
      type: "boolean",
      slug: "stableVolume",
      handleOnClick: handleChangeVideoSettings,
    },
    {
      title: "Ambient mode",
      icon: <AmbientModeIcon />,
      type: "boolean",
      slug: "ambientMode",
      handleOnClick: handleChangeVideoSettings,
    },
    {
      title: "Subtitles/CC",
      icon: <Subtitles2Icon />,
      type: "default",
      slug: "subtitles",
      handleOnClick: handleChangeDirection,
    },
    {
      title: "Playback speed",
      icon: <PlaybackSpeedIcon />,
      type: "default",
      slug: "playbackSpeed",
      handleOnClick: handleChangeDirection,
    },
    {
      title: "Sleep timer",
      icon: <SleepTimerIcon />,
      type: "default",
      slug: "sleepTimer",
      handleOnClick: handleChangeDirection,
    },
    {
      title: "Quality",
      icon: <QualityIcon />,
      type: "default",
      slug: "quality",
      handleOnClick: handleChangeDirection,
    },
  ]);

  useLayoutEffect(() => {
    if (settingRef.current) {
      settingRef.current.style.width = "299px";
      settingRef.current.style.height =
        defaultDisplay.current.length * 40 + 16 + "px";

      settingRef.current.style.maxHeight = "256px";
    }
  }, []);

  return (
    <div className='size-full py-[8px] '>
      <div className='flex flex-col'>
        {defaultDisplay.current.map((item, id) => (
          <button
            key={item.slug}
            className='flex items-center h-[40px] hover:bg-black-0.1'
            onClick={() => {
              item.handleOnClick(item);
            }}
          >
            <div className='px-[10px]'>{item.icon}</div>
            <div className='pr-[15px] text-[13px] leading-[17px] font-[500]'>
              {item.title}
            </div>
            {item.type === "boolean" ? (
              <div className='px-[15px] flex-1 flex items-center justify-end'>
                {/* #e1002d */}
                <div className='pr-[8px]'>
                  <div>
                    <div className='w-[36px] h-[14px] relative mx-[1px] my-[4px]  '>
                      <div className='absolute w-full h-full rounded-[8px] bg-gray-71 opacity-[0.4]'></div>
                      <div
                        className='absolute w-full h-full rounded-[8px] bg-[#e1002d] z-[2] 
                        transition-width ease-linear duration-[0.08s] delay-[0.08s]'
                        style={{
                          width: videoSettings[item.slug] ? "100%" : "0",
                        }}
                      ></div>
                      <div
                        className='absolute size-[20px] rounded-[50%] top-[-3px] left-0 
                          transition-all ease-linear duration-[0.08s] delay-[0.08s] z-[3]'
                        style={{
                          background: videoSettings[item.slug]
                            ? "#ffffff"
                            : "rgba(255,255,255,0.6)",
                          transform: videoSettings[item.slug]
                            ? "translateX(16px)"
                            : "translateX(0)",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className='px-[15px] flex-1 flex items-center justify-end'>
                <div className='text-[12px] leading-[16px] font-[500]'>
                  {videoSettings[item.slug].title}
                </div>
                <div>
                  <ThinArrowIcon />
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
export default Default;
