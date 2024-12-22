import { ThickAudioIcon, MuteAudiIcon, LowAudioIcon } from "../../Assets/Icons";
import {
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  useCallback,
} from "react";

const AudioRange = ({ videoRef, audioScrubbing, volume, setVolume }) => {
  // const [volume, setVolume] = useState();

  const container = useRef();

  const sliderContainer = useRef();

  const slider = useRef();

  const isScrubbing = useRef(false);

  const isLeaved = useRef();

  const disableSelect = useCallback((event) => {
    event.preventDefault();
  }, []);

  const handleAddScrubbing = useCallback((e) => {
    if (e.buttons !== 1) return;
    isScrubbing.current = true;
    audioScrubbing.current = true;
    if (isScrubbing.current) {
      window.addEventListener("selectstart", disableSelect);
    }
  }, []);

  const handleRemoveScrubbing = useCallback((e) => {
    if (isScrubbing.current) {
      isScrubbing.current = false;
      audioScrubbing.current = false;
      if (isLeaved.current) {
        sliderContainer.current.classList.remove("slide-in");
      }
      window.removeEventListener("selectstart", disableSelect);
    }
  }, []);

  const hanldeScrubbingUpdateValue = useCallback((e) => {
    if (!isScrubbing.current) return;
    const rect = sliderContainer.current.getBoundingClientRect();

    const percent =
      Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
    setVolume(percent);
  }, []);

  const hanldeClickUpdateValue = useCallback((e) => {
    if (!sliderContainer.current.contains(e.target)) return;
    const rect = sliderContainer.current.getBoundingClientRect();

    const percent =
      Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;

    setVolume(percent);
  }, []);

  const handleToggleMuted = useCallback((e) => {
    setVolume((prev) => (prev === 0 ? 1 : 0));
  }, []);

  const handleMouseEnter = useCallback(() => {
    sliderContainer.current.classList.add("slide-in");
    isLeaved.current = false;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isLeaved.current = true;
    if (isScrubbing.current) return;

    sliderContainer.current.classList.remove("slide-in");
  }, []);

  useEffect(() => {
    slider.current.addEventListener("mousedown", handleAddScrubbing);

    window.addEventListener("mousedown", hanldeClickUpdateValue);
    window.addEventListener("mouseup", handleRemoveScrubbing);
    window.addEventListener("mousemove", hanldeScrubbingUpdateValue);

    slider.current.style.setProperty(
      "--value-position",
      videoRef.current.volume,
    );
    setVolume(videoRef.current.volume);

    return () => {
      window.removeEventListener("mousedown", hanldeClickUpdateValue);
      window.removeEventListener("mouseup", handleRemoveScrubbing);
      window.removeEventListener("mousemove", hanldeScrubbingUpdateValue);
    };
  }, []);

  useEffect(() => {
    slider.current.style.setProperty("--value-position", volume);
    videoRef.current.volume = volume;
  }, [volume]);

  return (
    <div
      className='flex items-center'
      ref={container}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type='button'
        className='p-[8px] 2xsm:p-[12px] fill-white'
        onClick={handleToggleMuted}
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
