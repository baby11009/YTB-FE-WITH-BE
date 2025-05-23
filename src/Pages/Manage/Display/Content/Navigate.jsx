import { Link } from "react-router-dom";
import { Slider } from "../../../../Component";
import { useCallback, useState, useLayoutEffect, useRef } from "react";

const funcList = [
  {
    id: 1,
    title: "Video",
    param: "video",
  },
  {
    id: 2,
    title: "Shorts",
    param: "shorts",
  },
  {
    id: 3,
    title: "Playlists",
    param: "playlists",
  },
  {
    id: 4,
    title: "Comunity",
    param: "comunity",
  },
];

const CustomeButton = ({ data, pathParam, handleOnClick }) => {
  return (
    <Link
      to={`/manage/content/${data.param}`}
      onClick={(e) => {
        if (pathParam === data.param) return;
        handleOnClick(e);
      }}
      data-path={data.param}
      className={`border-b-[3px]  cursor-pointer ml-[8px] mr-[32px] border-[transparent] h-[48px] py-[12px]
        ${pathParam !== data.param ? " hover:border-gray-71  text-gray-A" : ""}
        `}
    >
      <span className='text-[15px] leading-[24px] font-[500]'>
        {data.title}
      </span>
    </Link>
  );
};

const Navigate = ({ pathParam }) => {
  const [underlineInfo, setUnderlineInfo] = useState({ width: 0, left: 0 });

  const containerRef = useRef();

  const indicator = useRef();

  const handleOnClick = useCallback((e) => {
    if (!indicator.current.classList.contains("transition-[left]")) {
      indicator.current.classList.add("transition-[left]");
    }
    const childRect = e.target.getBoundingClientRect();
    const parentRect = containerRef.current.getBoundingClientRect();
    setUnderlineInfo({
      width: e.target.offsetWidth,
      left: childRect.left - parentRect.left,
    });
  }, []);

  useLayoutEffect(() => {
    if (containerRef.current) {
      const currChild = containerRef.current.querySelector(
        `[data-path="${pathParam}"]`,
      );

      const childRect = currChild.getBoundingClientRect();
      const parentRect = containerRef.current.getBoundingClientRect();
      setUnderlineInfo({
        width: currChild.offsetWidth,
        left: childRect.left - parentRect.left,
      });
    }
  }, []);

  return (
    <Slider buttonType={2}>
      <div className='flex relative' ref={containerRef}>
        {funcList.map((item) => (
          <CustomeButton
            key={item.id}
            data={item}
            pathParam={pathParam}
            handleOnClick={handleOnClick}
          />
        ))}
        <div
          className='h-[2px] bg-white absolute bottom-0'
          ref={indicator}
          style={{
            width: underlineInfo.width + "px",
            left: underlineInfo.left + "px",
          }}
        ></div>
      </div>
    </Slider>
  );
};
export default Navigate;
