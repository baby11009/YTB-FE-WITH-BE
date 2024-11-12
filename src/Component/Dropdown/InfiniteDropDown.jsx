import { useState, useEffect, useRef, useCallback } from "react";
import { ThinArrowIcon, SearchIcon } from "../../Assets/Icons";
import { useQueryClient } from "@tanstack/react-query";
import { IsElementEnd } from "../../util/scrollPosition";

const InfiniteDropDown = ({
  title,
  value,
  setIsOpened,
  list,
  isLoading,
  isError,
  errorMsg,
  handleSetParams,
  handleSetCurr,
  disabled,
  prsRemoveValue,
  displayData,
}) => {
  const queryClient = useQueryClient();

  const [opened, setOpened] = useState(undefined);

  const [dataList, setDataList] = useState([]);

  const [addNewValue, setAddNewValue] = useState(false);

  const [isEnd, setIsEnd] = useState(false);

  const containerRef = useRef();

  const refscroll = useCallback((e) => {
    if (e) {
      e.addEventListener("scroll", (e) => {
        IsElementEnd(setIsEnd, e);
      });
    }
  }, []);

  const timeOutRef = useRef();

  const handleSearch = (e) => {
    clearTimeout(timeOutRef.current);

    timeOutRef.current = setTimeout(() => {
      setAddNewValue(true);
      handleSetParams(e.target.value);
    }, 600);
  };

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

    if (opened !== undefined) {
      setIsOpened(opened);
    }

    window.addEventListener("mousedown", handleClickOutScope);

    return () => {
      window.removeEventListener("mousedown", handleClickOutScope);
      handleSetParams("");
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
      handleSetParams(undefined, 1);
    }
  }, [isEnd]);

  useEffect(() => {
    return () => {
      if (prsRemoveValue) {
        queryClient.resetQueries([prsRemoveValue]);
      }
    };
  }, []);

  return (
    <div className='flex items-center w-full' ref={containerRef}>
      <div className='border-b-[1px] pb-[8px] relative w-[100%] sm:max-w-[360px]'>
        <button
          className='flex items-center justify-between w-full px-[8px]'
          type='button'
          onClick={() => {
            setOpened((prev) => !prev);
          }}
          disabled={disabled}
        >
          <p className='max-w-[250px] text-[16px] overflow-hidden text-ellipsis text-nowrap'>
            {title + " : " + value}
          </p>
          <div
            className={`${
              opened ? "rotate-[-90deg]" : "rotate-90"
            } transition-transform duration-[0.3s] mt-[3px]`}
          >
            <ThinArrowIcon />
          </div>
        </button>

        <div
          className={`absolute top-[133%] w-full h-[180px]
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
            <div className='flex items-center justify-center ml-[12px] mr-[14px] mb-[8px] py-[4px] border-b-[1px]'>
              <input
                type='text'
                className='flex-1 bg-transparent outline-none'
                onChange={handleSearch}
              />
              <div>
                <SearchIcon />
              </div>
            </div>
            <div className='size-full overflow-auto' ref={refscroll}>
              {isLoading && dataList.length === 0 ? (
                <div className='flex flex-col items-center justify-center '>
                  <div
                    className=' animate-spin size-[40px] rounded-[50%] border-[2px] 
                border-b-transparent border-l-transparent border-white'
                  ></div>
                </div>
              ) : isError ? (
                <div>{errorMsg}</div>
              ) : dataList.length !== 0 ? (
                dataList.map((item, id) => (
                  <button
                    key={id}
                    type='button'
                    className='px-[12px] py-[4px] text-start w-full hover:bg-black-0.2'
                    onClick={() => {
                      handleSetCurr(item);
                    }}
                  >
                    {item[displayData]}
                  </button>
                ))
              ) : (
                <div className='px-[12px]'>Not found any {title}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default InfiniteDropDown;
