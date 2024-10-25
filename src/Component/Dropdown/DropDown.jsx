import { useState, useEffect, useRef } from "react";
import { ThinArrowIcon } from "../../Assets/Icons";

const DropDown = ({ title, list = [], handleOnClick, value }) => {
  const [opened, setOpened] = useState(undefined);

  const containerRef = useRef();

  useEffect(() => {
    const handleClickOutScope = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target) &&
        opened !== undefined
      ) {
        setOpened(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutScope);

    return () => {
      window.removeEventListener("mousedown", handleClickOutScope);
    };
  }, [opened]);

  return (
    <div
      className='flex items-center w-full z-[150] mb-[16px]'
      ref={containerRef}
    >
      <div className='border-b-[1px] pb-[8px] relative w-[100%] sm:max-w-[360px]'>
        <button
          className='flex items-center justify-between w-full px-[8px]'
          type='button'
          onClick={() => {
            setOpened((prev) => !prev);
          }}
        >
          <p className='text-[16px]'>{title + " : " + value}</p>
          <div
            className={`${
              opened ? "rotate-[-90deg]" : "rotate-90"
            } transition-transform duration-[0.3s] mt-[3px]`}
          >
            <ThinArrowIcon />
          </div>
        </button>

        <div
          className={`absolute top-[133%] w-full
        rounded-[5px] bg-black-21 z-[100]
         ${
           opened === undefined
             ? "hidden"
             : opened
             ? "animate-slideIn "
             : "animate-slideOut "
         }
      `}
        >
          {list.map((item, id) => (
            <button
              key={id}
              type='button'
              onClick={() => {
                handleOnClick(item);
                setOpened("");
              }}
              className={`block w-full text-left px-[8px] py-[4px] hover:bg-black-0.2 ${
                value === item && "bg-black-0.1"
              }`}
            >
              {item.toString()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default DropDown;
