import { useRef, useLayoutEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const NavigateBar = ({ func }) => {
  const navigate = useNavigate();

  const location = useLocation();

  const [indicatorInfo, setIndicatorInfo] = useState({ left: 0, width: 0 });

  const navigationContainerRef = useRef();

  const navigations = useRef([
    { id: "details", display: "Detail" },
    { id: "list", display: "Video list" },
  ]);

  const handleChangeNavigation = (path) => {
    const indicator =
      navigationContainerRef.current.querySelector("#indicator");

    if (!indicator.classList.contains("transition-[left]")) {
      indicator.classList.add("transition-[left]");
    }
    const pathNameArr = location.pathname.split("/");
    const currPath = pathNameArr[5];

    if (currPath === path) return;

    if (!currPath) {
      pathNameArr.push(path);
    } else {
      pathNameArr[5] = path;
    }
    const finalPath = pathNameArr.join("/");
    navigate(finalPath);
  };

  useLayoutEffect(() => {
    if (!navigationContainerRef.current) return;

    let currChild;
    if (func === "list") {
      currChild =
        navigationContainerRef.current.querySelector(`[data-path="list"]`);
    } else {
      currChild = navigationContainerRef.current.querySelector(
        `[data-path="details"]`,
      );
    }

    const childRect = currChild.getBoundingClientRect();

    const parentRect = navigationContainerRef.current.getBoundingClientRect();

    setIndicatorInfo({
      width: currChild.offsetWidth,
      left: childRect.left - parentRect.left,
    });
  }, [func]);

  return (
    <div
      className={`h-[40px] w-full pt-[8px] relative
     `}
      ref={navigationContainerRef}
    >
      {navigations.current.map((navigation) => (
        <button
          key={navigation.id}
          data-path={navigation.id}
          onClick={() => handleChangeNavigation(navigation.id)}
          className={`h-[32px] mx-[8px] border-b-[2px] border-transparent ${
            func !== navigation.id ? "hover:border-gray-A" : ""
          }`}
        >
          <span className='font-[500]'>{navigation.display}</span>
        </button>
      ))}
      <div
        className='absolute bg-white h-[2px] bottom-0 ease-out'
        id='indicator'
        style={{
          left: indicatorInfo.left + "px",
          width: indicatorInfo.width + "px",
        }}
      ></div>
    </div>
  );
};
export default NavigateBar;
