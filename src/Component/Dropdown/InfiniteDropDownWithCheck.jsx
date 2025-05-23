import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { ThinArrowIcon, SearchIcon } from "../../Assets/Icons";

const InfiniteDropDownWithCheck = ({
  title,
  valueList,
  setIsOpened,
  list,
  displayValue,
  HoverCard,
  isLoading,
  fetchingError,
  handleSetQueries,
  setData,
}) => {
  const [opened, setOpened] = useState(undefined);

  const [dataList, setDataList] = useState([]);

  const [addNewValue, setAddNewValue] = useState(false);

  const [valueListSet, setValueListSet] = useState();

  const containerRef = useRef();

  const boxRef = useRef();

  const inputRef = useRef();

  const timeOutRef = useRef();

  const handleSearch = (e) => {
    clearTimeout(timeOutRef.current);

    timeOutRef.current = setTimeout(() => {
      setAddNewValue(true);
      handleSetQueries(e.target.value);
    }, 600);
  };

  const handleOnChange = (dataId) => {
    let finalList;

    if (valueListSet.has(dataId)) {
      valueListSet.delete(dataId);
      finalList = [...valueListSet];
    } else {
      finalList = [...valueList, dataId];
    }

    setData(finalList, dataId);
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
      handleSetQueries("");
      setDataList([]);
      setAddNewValue(true);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    };
  }, [opened]);

  useEffect(() => {
    const element = boxRef.current;

    const handleScroll = () => {
      const element = boxRef.current;
      if (element) {
        const { scrollTop, scrollHeight, clientHeight } = element;

        if (Math.ceil(scrollTop) + clientHeight >= scrollHeight) {
          handleSetQueries(undefined, 1);
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

  useLayoutEffect(() => {
    setValueListSet(new Set(valueList));
  }, [valueList]);

  return (
    <div>
      <div
        className='relative border-[1px] rounded-[8px]
    border-[#6b6767] transition-all ease-in hover:border-[white]'
        ref={containerRef}
      >
        <div className='relative w-full pl-[12px]'>
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
              <div className='flex items-center justify-center ml-[12px] mr-[14px] mb-[8px] py-[4px] border-b-[1px]'>
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
              <div className='size-full overflow-auto' ref={boxRef}>
                {isLoading && dataList.length === 0 ? (
                  <div className='flex flex-col items-center justify-center '>
                    <div
                      className=' animate-spin size-[40px] rounded-[50%] border-[2px] 
                border-b-transparent border-l-transparent border-white'
                    ></div>
                  </div>
                ) : fetchingError ? (
                  <div className='px-[12px] py-[4px]'>
                    {typeof fetchingError === "string"
                      ? fetchingError
                      : `Failed to fetch ${title}`}
                  </div>
                ) : dataList.length !== 0 ? (
                  dataList.map((data, id) => (
                    <div
                      className='flex items-center gap-[8px] px-[12px] py-[4px] hover:bg-black-0.2 min-w-fit '
                      key={id}
                    >
                      <input
                        type='checkbox'
                        name=''
                        className='cursor-pointer size-[16px]'
                        id={`${title}-${id}`}
                        onChange={(e) => handleOnChange(data._id)}
                        checked={valueListSet.has(data._id)}
                      />
                      <label
                        htmlFor={`${title}-${id}`}
                        className='flex-1 cursor-pointer '
                        onClick={() => {}}
                      >
                        {HoverCard ? (
                          <HoverCard data={data} />
                        ) : displayValue ? (
                          data[displayValue]
                        ) : (
                          data?._id
                        )}
                      </label>
                    </div>
                  ))
                ) : (
                  <div className='px-[12px]'>Not found any {title}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default InfiniteDropDownWithCheck;
