import { CloseIcon, ThinArrowIcon } from "../../Assets/Icons";
import { useState, useEffect, useRef } from "react";
import { upperCaseFirstChar } from "../../util/func";

const SearchSelection = ({
  searchData,
  currValue,
  handleSearch,
  handleClose,
}) => {
  const [opened, setOpened] = useState(false);

  const selectBox = useRef();

  useEffect(() => {
    const handleClickOutSide = (e) => {
      if (selectBox.current && !selectBox.current.contains(e.target)) {
        setOpened(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutSide);

    return () => {
      window.removeEventListener("mousedown", handleClickOutSide);
    };
  }, []);

  return (
    <div className='flex items-end' ref={selectBox}>
      <button className='flex items-center rounded-[5px] bg-black-0.2 h-[32px]'>
        <span className='ml-[12px] font-[500] leading-[20px] text-[14px]'>
          {searchData.text}
        </span>
        <div
          className='px-[6px] w-[24px]'
          onClick={() => {
            handleClose(searchData);
          }}
        >
          <CloseIcon />
        </div>
      </button>
      <div className='ml-[8px] relative'>
        <div
          className='border-b-[1px] text-[16px] leading-[20px] pb-[5px] cursor-pointer '
          onClick={() => {
            setOpened((prev) => !prev);
          }}
        >
          <span className='select-none inline-block min-w-[100px] h-[20px]'>
            {currValue !== "" && currValue !== undefined
              ? upperCaseFirstChar(currValue.toString())
              : ""}
          </span>
          <div
            className={`w-[16px] inline-block ml-[8px] ${
              opened ? "rotate-[90deg] " : "rotate-[-90deg]"
            } transition-[transform] ease-in duration-[.2s]`}
          >
            <ThinArrowIcon />
          </div>
        </div>

        <div
          className={`absolute left-0  w-[200px] pt-[8px] ${
            opened
              ? "opacity-[1] top-[100%] visible"
              : "opacity-[0] top-[20%] invisible "
          } transition-all origin-top ease-in duration-[.2s]`}
        >
          <div className='size-full bg-[#1f1f1f] rounded-[12px]'>
            <ul>
              {searchData.options.map((item) => (
                <li
                  key={item.id}
                  className='h-[32px] px-[16px] hover:bg-black-0.2 cursor-pointer'
                  onClick={() => {
                    setOpened(false);
                    handleSearch(searchData.id, item.id);
                  }}
                >
                  <span className='text-[14px] leading-[20px] font-[500] '>
                    {item.display}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SearchSelection;
