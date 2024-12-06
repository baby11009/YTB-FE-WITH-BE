import { useState, useRef, useLayoutEffect, useCallback } from "react";
import { smoothScroll } from "../../util/scrollCustom";
import { ThinArrowIcon } from "../../Assets/Icons";

const Slider = ({
  children,
  dragScroll,
  scrollDistance,
  scrollDuration = 300,
  buttonPosition,
}) => {
  const [scrollPosition, setScrollPosition] = useState();

  const sliderRef = useRef();

  const isDown = useRef();

  const startPosition = useRef();

  const sliderScrollLeft = useRef();

  const enabledScrolling = useRef();

  const visibleChildrenCount = Math.round(
    sliderRef.current?.clientWidth / sliderRef.current?.firstChild.clientWidth,
  );

  const handleScroll = (direction) => {
    smoothScroll(
      direction,
      sliderRef,
      scrollDuration,
      scrollDistance
        ? scrollDistance
        : visibleChildrenCount * sliderRef.current?.firstChild.clientWidth, //caculate visible children width to scroll,
    );
  };

  useLayoutEffect(() => {
    enabledScrolling.current =
      sliderRef.current.scrollWidth > sliderRef.current.clientWidth;

    if (enabledScrolling.current) {
      setScrollPosition("start");
      sliderRef.current.addEventListener("scroll", (e) => {
        if (e.target.scrollLeft === 0) {
          setScrollPosition("start");
        } else if (
          e.target.scrollWidth -
            (Math.ceil(e.target.scrollLeft) + e.target.clientWidth) >=
            0 &&
          e.target.scrollWidth -
            (Math.ceil(e.target.scrollLeft) + e.target.clientWidth) <
            3
        ) {
          setScrollPosition("end");
        } else {
          setScrollPosition("middle");
        }
      });
    }
  }, []);
  return (
    <div className='relative '>
      {scrollPosition && scrollPosition !== "start" && (
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
      )}
      <div
        className='overflow-y-hidden hidden-scorllbar 
        overflow-x-auto whitespace-nowrap touch-pan-y e'
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
      {scrollPosition && scrollPosition !== "end" && (
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
      )}
    </div>
  );
};
export default Slider;
