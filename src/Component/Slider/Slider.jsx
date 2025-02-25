import {
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
  useEffect,
} from "react";
import { smoothScroll } from "../../util/scrollCustom";
import { ThinArrowIcon } from "../../Assets/Icons";

const Slider = ({
  containerStyle,
  children,
  dragScroll,
  scrollDistance,
  scrollDuration = 300,
  buttonPosition,
  buttonType = 1,
}) => {
  const [scrollPosition, setScrollPosition] = useState();

  const sliderRef = useRef();

  const isDown = useRef();

  const startPosition = useRef();

  const sliderScrollLeft = useRef();

  const enabledScrolling = useRef();

  const isClicked = useRef(false);

  const visibleChildrenCount = useRef();

  const handleScroll = useCallback(
    (direction) => {
      if (isClicked.current) return;
      isClicked.current = true;

      smoothScroll(
        direction,
        sliderRef,
        scrollDuration,
        scrollDistance
          ? scrollDistance
          : visibleChildrenCount.current *
              sliderRef.current?.firstChild.clientWidth, //caculate visible children width to scroll,
      );
      setTimeout(() => {
        isClicked.current = false;
      }, scrollDuration + 20);
    },
    [visibleChildrenCount.current],
  );

  const handleScrollEvent = useCallback((e) => {
    if (sliderRef.current.scrollLeft === 0) {
      setScrollPosition("start");
    } else if (
      sliderRef.current.scrollWidth -
        (Math.ceil(sliderRef.current.scrollLeft) +
          sliderRef.current.clientWidth) <
      3
    ) {
      setScrollPosition("end");
    } else {
      setScrollPosition("middle");
    }
  }, []);

  const handleResizeEvent = useCallback(() => {
    if (!sliderRef.current) return;
    enabledScrolling.current =
      sliderRef.current.scrollWidth > sliderRef.current.clientWidth;
    visibleChildrenCount.current = Math.round(
      sliderRef.current?.clientWidth /
        sliderRef.current?.firstChild.clientWidth,
    );
    if (enabledScrolling.current) {
      handleScrollEvent();
    } else {
      setScrollPosition();
    }
  }, []);

  useEffect(() => {
    handleResizeEvent();
    sliderRef.current.addEventListener("scroll", handleScrollEvent);

    window.addEventListener("resize", handleResizeEvent);
  }, []);

  return (
    <div className={`relative w-full  ${containerStyle ? containerStyle : ""}`}>
      {scrollPosition &&
        scrollPosition !== "start" &&
        (buttonType === 1 ? (
          <div
            className={`absolute flex items-center z-[200] bg-black-21
          rounded-[50%] overflow-hidden translate-x-[-50%] translate-y-[-50%]`}
            style={{
              top: buttonPosition
                ? buttonPosition
                : sliderRef.current?.clientHeight / 2,
            }}
          >
            <button
              className='size-[40px] p-[8px] hover:bg-black-0.2'
              onClick={() => handleScroll("left")}
            >
              <div className='rotate-[180deg] w-[24px]'>
                <ThinArrowIcon />
              </div>
            </button>
          </div>
        ) : (
          <div
            className={`absolute flex items-center left-0 z-[200] bg-black 
         translate-y-[-50%]`}
            style={{
              top: buttonPosition
                ? buttonPosition
                : sliderRef.current?.clientHeight / 2,
            }}
          >
            <button
              className='size-[40px] p-[8px] '
              onClick={() => handleScroll("left")}
            >
              <div className='rotate-[180deg] w-[24px] text-gray-A '>
                <ThinArrowIcon />
              </div>
            </button>
          </div>
        ))}
      <div
        className='overflow-y-hidden hidden-scorllbar 
        overflow-x-auto whitespace-nowrap touch-pan-y'
        ref={sliderRef}
        onMouseDown={(e) => {
          isDown.current = true;
          startPosition.current = e.pageX - sliderRef.current.offsetLeft;
          sliderScrollLeft.current = sliderRef.current.scrollLeft;
        }}
        onMouseUp={(e) => {
          isDown.current = false;
        }}
        onMouseLeave={(e) => {
          isDown.current = false;
        }}
        onMouseMove={(e) => {
          if (!isDown.current || !enabledScrolling.current || !dragScroll)
            return; // Stop execution if mouse is not down or doesn't need to scroll
          e.preventDefault();
          const x = e.pageX - sliderRef.current.offsetLeft;
          const walk = (x - startPosition.current) * 0.55; // Adjust scroll sensitivity
          sliderRef.current.scrollLeft = sliderScrollLeft.current - walk;
        }}
      >
        {children}
      </div>
      {scrollPosition &&
        scrollPosition !== "end" &&
        (buttonType === 1 ? (
          <div
            className={`absolute flex items-center right-0 z-[200] bg-black-21
            rounded-[50%] overflow-hidden translate-x-[50%] translate-y-[-50%]`}
            style={{
              top: buttonPosition
                ? buttonPosition
                : sliderRef.current?.clientHeight / 2,
            }}
          >
            <button
              className='size-[40px] p-[8px] hover:bg-black-0.2 '
              onClick={() => handleScroll("right")}
            >
              <div className=' w-[24px]'>
                <ThinArrowIcon />
              </div>
            </button>
          </div>
        ) : (
          <div
            className={`absolute flex items-center right-0 z-[200] bg-black 
           translate-y-[-50%]`}
            style={{
              top: buttonPosition
                ? buttonPosition
                : sliderRef.current?.clientHeight / 2,
            }}
          >
            <button
              className='size-[40px] p-[8px] '
              onClick={() => handleScroll("right")}
            >
              <div className=' w-[24px] text-gray-A '>
                <ThinArrowIcon />
              </div>
            </button>
          </div>
        ))}
    </div>
  );
};
export default Slider;
