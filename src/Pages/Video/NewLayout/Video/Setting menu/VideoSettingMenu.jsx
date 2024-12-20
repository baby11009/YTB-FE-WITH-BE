import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";

import Default from "./Default.jsx";
import Subtitles from "./Subtitles.jsx";
import PlaybackSpeed from "./PlaybackSpeed.jsx";
import SleepTimer from "./SleepTimer.jsx";
import Quality from "./Quality.jsx";

const VideoSettingMenu = ({ settingRef, openedSettings, setOpenSettings }) => {
  const [currTreePosition, setCurrTreePosition] = useState("default");

  const [renderSettingOptions, setRenderSettingOptions] = useState();

  const [videoSettings, setVideoSettings] = useState({
    stableVolume: true,
    ambientMode: false,
    subtitles: {
      title: "Off",
      value: false,
    },
    playbackSpeed: { title: "Normal", value: 1 },
    sleepTimer: { title: "Off", value: false },
    quality: { title: "1080 HD", value: 1080 },
  });

  const settingOptions = {
    default: (
      <Default
        settingRef={settingRef}
        videoSettings={videoSettings}
        setVideoSettings={setVideoSettings}
        setCurrTreePosition={setCurrTreePosition}
      />
    ),
    subtitles: (
      <Subtitles
        settingRef={settingRef}
        videoSettings={videoSettings}
        setVideoSettings={setVideoSettings}
        setCurrTreePosition={setCurrTreePosition}
        setOpenSettings={setOpenSettings}
      />
    ),
    playbackSpeed: (
      <PlaybackSpeed
        settingRef={settingRef}
        videoSettings={videoSettings}
        setVideoSettings={setVideoSettings}
        setCurrTreePosition={setCurrTreePosition}
        setOpenSettings={setOpenSettings}
      />
    ),
    sleepTimer: (
      <SleepTimer
        settingRef={settingRef}
        videoSettings={videoSettings}
        setVideoSettings={setVideoSettings}
        setCurrTreePosition={setCurrTreePosition}
        setOpenSettings={setOpenSettings}
      />
    ),
    quality: (
      <Quality
        settingRef={settingRef}
        videoSettings={videoSettings}
        setVideoSettings={setVideoSettings}
        setCurrTreePosition={setCurrTreePosition}
        setOpenSettings={setOpenSettings}
      />
    ),
  };

  useLayoutEffect(() => {
    setRenderSettingOptions(settingOptions[currTreePosition]);
  }, [currTreePosition, videoSettings]);

  useEffect(() => {
    if (!openedSettings) {
      if (currTreePosition !== "default") {
        setTimeout(() => {
          setCurrTreePosition("default");
        }, 100);
      }
    }
  }, [openedSettings, currTreePosition]);

  return (
    <div
      className={` absolute  overflow-hidden  bg-[rgba(28,28,28,.9)] 
      z-[199] right-[15px] bottom-[75px]  duration-[0.1s] 
      ease-cubic-bezier-[0,0,0.2,1] transition-all rounded-[12px]
      ${openedSettings ? "opacity-[1]" : "opacity-0"}`}
      ref={settingRef}
    >
      <div
        className='overflow-y-hidden size-full flex flex-col duration-[0.1s]
       ease-cubic-bezier-[0,0,0.2,1] transition-all text-white-e'
      >
        {renderSettingOptions}
      </div>
    </div>
  );
};
export default VideoSettingMenu;
