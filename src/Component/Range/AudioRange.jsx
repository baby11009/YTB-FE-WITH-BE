import { ThickAudioIcon, MuteAudiIcon, LowAudioIcon } from "../../Assets/Icons";
import {
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  useCallback,
} from "react";

const AudioRange = ({ videoRef, audioScrubbing }) => {
  const [volume, setVolume] = useState();

  const sliderContainer = useRef();

  const slider = useRef();

  const isScrubbing = useRef(false);

  const disableSelect = useCallback((event) => {
    event.preventDefault();
  }, []);

  const handleMouseDown = useCallback((e) => {
    if (e.buttons !== 1) return;
    isScrubbing.current = true;
    audioScrubbing.current = true;
    if (isScrubbing.current) {
      window.addEventListener("selectstart", disableSelect);
    }
  }, []);

  const handleMouseUp = useCallback((e) => {
    if (isScrubbing.current) {
      isScrubbing.current = false;
      audioScrubbing.current = false;
      sliderContainer.current.classList.remove("slide-in");
      window.removeEventListener("selectstart", disableSelect);
    }
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isScrubbing.current) return;
    const rect = sliderContainer.current.getBoundingClientRect();

    const percent =
      Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
    videoRef.current.volume = percent;
    setVolume(percent);
    slider.current.style.setProperty("--value-position", percent);
  }, []);

  const handleMouseEnter = useCallback(() => {
    sliderContainer.current.classList.add("slide-in");
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (isScrubbing.current) return;

    sliderContainer.current.classList.remove("slide-in");
  }, []);

  useEffect(() => {
    slider.current.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);

    slider.current.style.setProperty(
      "--value-position",
      videoRef.current.volume,
    );
    setVolume(videoRef.current.volume);
  }, []);

  return (
    <div
      className='flex items-center'
      //   ref={container}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type='button'
        className='p-[8px] 2xsm:p-[12px] fill-white'
        onClick={(e) => {
          e.preventDefault();

          if (videoRef.current.volume > 0) {
            videoRef.current.volume = 0;
            slider.current.style.setProperty("--value-position", 0);
            setVolume(0);
          } else {
            videoRef.current.volume = 1;
            slider.current.style.setProperty("--value-position", 1);
            setVolume(1);
          }
        }}
      >
        <div className='size-[20px] 2xsm:size-[24px]'>
          {volume === 0 ? (
            <MuteAudiIcon />
          ) : volume > 0.5 ? (
            <ThickAudioIcon />
          ) : (
            <LowAudioIcon />
          )}
        </div>
      </button>
      <div
        className='slider-container slide-out min-h-[36px] flex justify-center items-center overflow-hidden'
        ref={sliderContainer}
      >
        <div className='w-full h-[3px] flex justify-center pl-[4px] pr-[12px] cursor-pointer'>
          <div className='w-full h-full slider' ref={slider}>
            <div className='thumb-indicator'></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AudioRange;
