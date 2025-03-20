import { useState, useEffect, useRef } from "react";
import { ThinArrowIcon, SearchIcon } from "../../Assets/Icons";

import { IsElementEnd } from "../../util/scrollPosition";

const InfiniteDropDown = ({
  title,
  dataType,
  list,
  displayData,
  isLoading,
  fetchingError,
  value,
  validateError,
  setIsOpened,
  handleSetQueries,
  handleSetCurr,
  HoverCard,
}) => {
  const [opened, setOpened] = useState(undefined);

  const [dataList, setDataList] = useState([]);

  const [addNewValue, setAddNewValue] = useState(false);

  const [isEnd, setIsEnd] = useState(false);

  const containerRef = useRef();

  const timeOutRef = useRef();

  const inputRef = useRef();

  const scrollContainerRef = useRef();

  const handleSearch = (e) => {
    clearTimeout(timeOutRef.current);

    timeOutRef.current = setTimeout(() => {
      setAddNewValue(true);
      handleSetQueries(e.target.value);
      scrollContainerRef.current.scrollTop = 0;
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
      if (!opened) {
        handleSetQueries("");
        setDataList([]);
        inputRef.current && (inputRef.current.value = "");
        setAddNewValue(false);
      }
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
      handleSetQueries(undefined, 1);
    }
  }, [isEnd]);

  useEffect(() => {
    const handleScroll = (e) => {
      IsElementEnd(setIsEnd, e);
    };
    scrollContainerRef.current.addEventListener("scroll", handleScroll);

    return () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div>
      <div
        className='z-[150] border-[1px] rounded-[8px]
      border-[#6b6767] transition-all ease-in hover:border-[white] relative'
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
            <div className='flex-1 text-left'>
              <div className='text-[12px] leading-[20px] text-gray-A'>
                {title}
              </div>
              <div className='text-[14px] leading-[24px] h-[24px] line-clamp-1'>
                {value}
              </div>
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
                  ref={inputRef}
                />
                <div>
                  <SearchIcon />
                </div>
              </div>
              <div
                className='flex-1 w-full overflow-y-auto'
                ref={scrollContainerRef}
              >
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
                  dataList.map((data, id) => (
                    <button
                      key={id}
                      type='button'
                      className='px-[12px] py-[4px] text-start w-full hover:bg-black-0.2 relative'
                      onClick={() => {
                        handleSetCurr(data);
                      }}
                    >
                      {HoverCard ? (
                        <HoverCard data={data} />
                      ) : (
                        <span> {data[displayData]}</span>
                      )}
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
