import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { ThinArrowIcon } from "../../Assets/Icons";
import { upperCaseFirstChar } from "../../util/func";

const DropDown = ({ title, list = [], handleOnClick, value }) => {
  const [opened, setOpened] = useState(undefined);

  const [displayValue, setDisplayValue] = useState(undefined);

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

  useLayoutEffect(() => {
    setDisplayValue(list.find((item) => item.id === value.toString())?.label);
  }, [value]);

  return (
    <div
      className='z-[150]  border-[1px] rounded-[8px]
       border-[#6b6767] transition-all ease-in hover:border-[white] h-fit'
      ref={containerRef}
    >
      <div className='relative pl-[12px]'>
        <button
          className='flex items-center justify-between w-full  h-[56px] z-[100]'
          type='button'
          onClick={() => {
            setOpened((prev) => !prev);
          }}
        >
          <div className='text-left'>
            <div className='text-[12px] leading-[24px] text-gray-A'>
              {title}
            </div>
            <div className='text-[15px] w-[80px]'>{displayValue}</div>
          </div>
          <div
            className={`${
              opened ? "rotate-[-90deg]" : "rotate-90"
            } transition-transform duration-[0.3s] w-[20px] ml-[16px] mr-[12px]`}
          >
            <ThinArrowIcon />
          </div>
        </button>

        <div
          className={`absolute left-0 top-[102%]  w-full
        rounded-[5px] bg-black-21 transition-all duration-[0.3s] ease-out z-[80]
        ${
          opened
            ? "translate-y-[0] opacity-[1] visible"
            : "translate-y-[-20%] opacity-0 invisible"
        }
      `}
        >
          {list.map((item) => (
            <button
              key={item.id}
              type='button'
              onClick={() => {
                handleOnClick(item.id);
                setOpened("");
              }}
              className={`block w-full text-left px-[8px] py-[4px] hover:bg-black-0.2 ${
                value === item.id && "bg-black-0.1"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default DropDown;
