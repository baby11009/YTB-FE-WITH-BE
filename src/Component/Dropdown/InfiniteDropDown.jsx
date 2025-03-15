import { useState, useEffect, useRef, useCallback } from "react";
import { ThinArrowIcon, SearchIcon } from "../../Assets/Icons";
import { useQueryClient } from "@tanstack/react-query";
import { IsElementEnd } from "../../util/scrollPosition";
import { useAuthContext } from "../../Auth Provider/authContext";

const InfiniteDropDown = ({
  disabled,
  title,
  dataType,
  list,
  displayData,
  isLoading,
  fetchingError,
  value,
  validateError,
  setIsOpened,
  handleSetQueriese,
  handleSetCurr,
  HoverCard,
}) => {
  const [opened, setOpened] = useState(undefined);

  const [dataList, setDataList] = useState([]);
  const [addNewValue, setAddNewValue] = useState(false);

  const [isEnd, setIsEnd] = useState(false);

  const containerRef = useRef();

  const timeOutRef = useRef();

  const refscroll = (e) => {
    if (e) {
      e.addEventListener("scroll", (e) => {
        IsElementEnd(setIsEnd, e);
      });
    }
  };

  const handleSearch = (e) => {
    clearTimeout(timeOutRef.current);

    timeOutRef.current = setTimeout(() => {
      setAddNewValue(true);
      handleSetQueriese(e.target.value);
    }, 600);
  };

  useEffect(() => {
    clearTimeout(timeOutRef.current);
    const handleClickOutScope = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target) &&
        opened !== undefined
      ) {
        setOpened(false);
      }
    };

    if (opened !== undefined) {
      setIsOpened(opened);
    }

    window.addEventListener("mousedown", handleClickOutScope);

    return () => {
      window.removeEventListener("mousedown", handleClickOutScope);
      handleSetQueriese("");
      setDataList([]);
      setAddNewValue(false);
    };
  }, [opened]);

  useEffect(() => {
    if (list) {
      if (addNewValue) {
        setDataList([...list]);
        setAddNewValue(false);
      } else {
        setDataList((prev) => [...prev, ...list]);
      }
    }
  }, [list]);

  useEffect(() => {
    if (isEnd) {
      handleSetQueriese(undefined, 1);
    }
  }, [isEnd]);

  return (
    <div>
      <div
        className='z-[150] border-[1px] rounded-[8px]
    border-[#6b6767] transition-all ease-in hover:border-[white]'
        ref={containerRef}
      >
        <div className='relative pl-[12px]'>
          <button
            disabled={disabled}
            className='flex items-center justify-between w-full  h-[56px] z-[100]'
            type='button'
            onClick={() => {
              setOpened((prev) => !prev);
            }}
          >
            <div className='flex-1 text-left'>
              <div className='text-[12px] leading-[24px] text-gray-A'>
                {title}
              </div>
              <div className='text-[15px]'>{value}</div>
            </div>
            {!disabled && (
              <div
                className={`${
                  opened ? "rotate-[-90deg]" : "rotate-90"
                } transition-transform duration-[0.3s] w-[20px] ml-[16px] mr-[12px]`}
              >
                <ThinArrowIcon />
              </div>
            )}
          </button>

          <div
            className={`absolute left-0 top-[calc(100%+15px)] w-full h-[180px]
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
            <div className='size-full flex flex-col'>
              <div className='flex items-center justify-center ml-[12px] mr-[14px] mb-[12px] py-[8px] border-b-[1px]'>
                <input
                  type='text'
                  className='flex-1 bg-transparent outline-none'
                  onChange={handleSearch}
                />
                <div>
                  <SearchIcon />
                </div>
              </div>
              <div className='flex-1 w-full overflow-y-auto' ref={refscroll}>
                {isLoading && dataList.length === 0 ? (
                  <div className='flex h-full items-center justify-center '>
                    <div
                      className=' animate-spin size-[40px] rounded-[50%] border-[2px] 
                  border-b-transparent border-l-transparent border-white'
                    ></div>
                  </div>
                ) : fetchingError ? (
                  <div>{fetchingError}</div>
                ) : dataList.length !== 0 ? (
                  dataList.map((item, id) => (
                    <button
                      key={id}
                      type='button'
                      className='px-[12px] py-[4px] text-start w-full hover:bg-black-0.2 relative'
                      onClick={() => {
                        handleSetCurr(item);
                      }}
                      // onMouseMove={(e) => {
                      //   handleCursorPositon(e);
                      // }}
                      // onMouseEnter={(e) => {
                      //   setShowHover(<HoverCard data={item} />);
                      // }}
                      // onMouseLeave={() => {
                      //   setShowHover(null);
                      // }}
                    >
                      <span> {item[displayData]}</span>
                    </button>
                  ))
                ) : (
                  <div className='flex items-center justify-center h-full'>
                    Not found any {dataType}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className='text-[12px] font-[500] leading-[16px] h-[16px] m-[8px]
         text-red-FF line-clamp-1 text-ellipsis break-all'
      >
        <span>{validateError}</span>
      </div>
    </div>
  );
};
export default InfiniteDropDown;
