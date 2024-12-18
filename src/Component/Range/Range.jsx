import { useState, useLayoutEffect, useRef, useCallback } from "react";

const Range = ({ fieldColor, trackColor, thumbColor }) => {
  const slider = useRef();

  const preventSelection = useCallback((event) => {
    event.preventDefault();
  }, []);

  const handleMouseDown = useCallback((e) => {
    if (e.buttons !== 1) return;
    document.addEventListener("selectstart", preventSelection);
    const { clientX } = e;
    const rect = slider.current.getBoundingClientRect();
    const value = ((clientX - rect.left) / (rect.right - rect.left)) * 100;
    console.log(value);
  }, []);

  useLayoutEffect(() => {
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", preventSelection);
  }, []);

  return (
    <div className='size-full flex justify-center'>
      <div className='w-[calc(100%-6px)] h-full slider' ref={slider}>
        <div className='thumb-indicator'></div>
      </div>
    </div>
  );
};
export default Range;
