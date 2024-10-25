import { useState, useEffect, useRef } from "react";
import { ThinArrowIcon, SearchIcon } from "../../Assets/Icons";
import { useQueryClient } from "@tanstack/react-query";

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
}) => {
  const queryClient = useQueryClient();

  const [opened, setOpened] = useState(undefined);

  const [dataList, setDataList] = useState([]);

  const [addNewValue, setAddNewValue] = useState(false);

  const containerRef = useRef();

  const boxRef = useRef();

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

    if (!opened && boxRef.current) {
      boxRef.current.scrollTop = 0;
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
    const element = boxRef.current;

    const handleScroll = () => {
      const element = boxRef.current;
      if (element) {
        const { scrollTop, scrollHeight, clientHeight } = element;
        if (Math.ceil(scrollTop) + clientHeight >= scrollHeight) {
          handleSetParams(undefined, 1);
        }
      }
    };

    if (element) {
      element.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (element) {
        element.removeEventListener("scroll", handleScroll);
      }
    };
  }, [boxRef.current]);

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
            <div className='size-full overflow-auto' ref={boxRef}>
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
                    {item?.email || item?._id}
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
