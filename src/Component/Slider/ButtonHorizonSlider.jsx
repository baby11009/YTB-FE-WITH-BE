import { useState, useRef, useLayoutEffect, useCallback } from "react";
import { ThinArrowIcon } from "../../Assets/Icons";
import { smoothScroll } from "../../util/scrollCustom";

const ButtonHorizonSlider = ({ buttonList, currentId, id }) => {
  const [scrollPosition, setScrollPosition] = useState();

  const sliderRef = useRef();

  const isDown = useRef();

  const startPosition = useRef();

  const sliderScrollLeft = useRef();

  const enabledScrolling = useRef();

  const handleScroll = useCallback((direction) => {
    smoothScroll(direction, sliderRef, 300, 160);
  }, []);

  const handleManageScrollPos = useCallback(() => {
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
  });

  useLayoutEffect(() => {
    enabledScrolling.current =
      sliderRef.current.scrollWidth > sliderRef.current.clientWidth;

    const handleResize = () => {
      if (sliderRef.current.scrollWidth === 0) return;
      enabledScrolling.current =
        sliderRef.current.scrollWidth > sliderRef.current.clientWidth;
      if (enabledScrolling.current) {
        handleManageScrollPos();
      } else {
        setScrollPosition(undefined);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useLayoutEffect(() => {
    if (enabledScrolling.current) {
      setScrollPosition("start");
      sliderRef.current.addEventListener("scroll", handleManageScrollPos);
    }

    return () => {
      sliderRef.current.removeEventListener("scroll", handleManageScrollPos);
    };
  }, [enabledScrolling.current]);

  return (
    <div className='relative'>
      {scrollPosition && scrollPosition !== "start" && (
        <div className='absolute top-0 h-full flex items-center z-[200]'>
          <button
            className='size-[40px] p-[8px] bg-black'
            onClick={() => handleScroll("left")}
          >
            <div className='rotate-[180deg] w-[24px]'>
              <ThinArrowIcon />
            </div>
          </button>
        </div>
      )}
      <div
        className={`overflow-auto hidden-scorllbar flex no-wrap touch-pan-y ${
          !enabledScrolling.current
            ? ""
            : scrollPosition === "start"
            ? "right-mask"
            : scrollPosition === "end"
            ? "left-mask"
            : "left-right-mask"
        }`}
        key={id}
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
          if (!isDown.current || !enabledScrolling.current) return; // Stop execution if mouse is not down or doesn't need to scroll
          e.preventDefault();
          const x = e.pageX - sliderRef.current.offsetLeft;
          const walk = (x - startPosition.current) * 0.55; // Adjust scroll sensitivity
          sliderRef.current.scrollLeft = sliderScrollLeft.current - walk;
        }}
      >
        {buttonList.map((button, index) => (
          <button
            className={`my-[8px] mr-[8px] px-[12px] rounded-[8px] h-[32px] ${
              button.id === currentId
                ? "bg-white-F1 hover:bg-white text-black"
                : "bg-black-0.1 hover:bg-black-0.2 "
            }`}
            key={index}
            onClick={() => {
              if (button.handleOnClick) {
                button.handleOnClick(button);
              }
            }}
          >
            <span className='text-[14px] leading-[20px] font-[500] text-nowrap select-none'>
              {button.title}
            </span>
          </button>
        ))}
      </div>
      {scrollPosition && scrollPosition !== "end" && (
        <div className='absolute top-0 h-full flex items-center right-0  z-[200]'>
          <button
            className='size-[40px] p-[8px] bg-black'
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
export default ButtonHorizonSlider;
