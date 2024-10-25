import { FilterIcon, ThinArrowIcon } from "../../../../Assets/Icons";
import { useState, useRef, useEffect, useLayoutEffect } from "react";

const sortList = [
  {
    title: "Ngày tạo",
    slug: "createdAt",
    valueList: ["mới nhất", "cũ nhất"],
    default: true,
  },
  {
    title: "Type",
    slug: "type",
    valueList: ["short", "video"],
    default: false,
  },
];

const SortRow = ({ data, boxOpened, sortParams, setSortParams }) => {
  const containerRef = useRef();

  const checkBoxRef = useRef();

  const [opened, setOpened] = useState(undefined);

  useLayoutEffect(() => {
    if (!boxOpened) {
      setOpened(undefined);
    }
  }, [boxOpened]);

  useEffect(() => {
    const handleClickOutScope = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        if (opened !== undefined) {
          setOpened(false);
        }
      }
    };
    window.addEventListener("mousedown", handleClickOutScope);
    return () => {
      window.removeEventListener("mousedown", handleClickOutScope);
    };
  }, [opened]);

  const handleOnChecked = () => {
    if (sortParams[data.slug]?.toString()) {
      setSortParams((prev) => {
        const obj = prev;
        delete obj[data.slug];

        return {
          ...obj,
        };
      });
    } else {
      setSortParams((prev) => ({ ...prev, [data.slug]: data.valueList[0] }));
    }
  };

  const handleOnChange = (value) => {
    if (sortParams[data.slug]?.toString()) {
      setSortParams((prev) => ({
        ...prev,
        [data.slug]: value,
      }));
    }
    setOpened(false);
  };

  return (
    <div className='flex items-center px-[12px] py-[8px]'>
      {!data.default && (
        <input
          type='checkbox'
          name={data.title}
          id={data.title}
          ref={checkBoxRef}
          checked={sortParams[data.slug]?.toString() ? true : false}
          onChange={handleOnChecked}
        />
      )}
      <label
        className={`text-nowrap ${
          data.default ? "ml-[21px]" : " ml-[8px]"
        } mr-[16px]`}
        htmlFor={data.title}
        aria-readonly={true}
      >
        {data?.title}
      </label>

      <div ref={containerRef} className='relative ml-auto'>
        <button
          className={`relative flex items-center gap-[16px] after:content-[""] 
          after:h-[2px] after:w-full  after:absolute after:bottom-[-5%]
          ${
            sortParams[data.slug]?.toString()
              ? "after:bg-white"
              : "after:bg-gray-A text-gray-A"
          }
          `}
          disabled={!sortParams[data.slug]?.toString() ? true : false}
          onClick={() => setOpened((prev) => !prev)}
        >
          <h3 className='w-[68px] text-left text-nowrap'>
            {sortParams[data.slug]?.toString() || data.valueList[0].toString()}
          </h3>
          <div
            className={`
                transition-transform duraion-[0.25s] ease-in ${
                  opened ? "" : "rotate-90 "
                }`}
          >
            <ThinArrowIcon color={"currentColor"} />
          </div>
        </button>

        <div
          className={`absolute top-[130%] left-[-10%] rounded-[5px] w-[120%] bg-black sd3 ${
            opened === undefined
              ? "hidden"
              : opened
              ? " animate-slideIn"
              : " animate-slideOut"
          } z-[50] flex`}
        >
          {data.valueList.map((value) => (
            <button
              key={value?.toString()}
              className='w-full p-[6px] hover:bg-black-0.2'
              onClick={() => handleOnChange(value)}
            >
              {value?.toString()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const Filter = ({ params, setParams }) => {
  const [opened, setOpened] = useState(undefined);

  const [sortParams, setSortParams] = useState({});

  const containerRef = useRef();

  useLayoutEffect(() => {
    if (params) {
      setSortParams(params);
    }
  }, [params]);

  useEffect(() => {
    let timeOut;
    if (opened === false) {
      timeOut = setTimeout(() => {
        setOpened(undefined);
      }, 305);
    }
    return () => {
      clearTimeout(timeOut);
    };
  }, [opened]);

  useLayoutEffect(() => {
    const handleClickOutScope = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        if (opened !== undefined) {
          setOpened(false);
        }
      }
    };
    window.addEventListener("mousedown", handleClickOutScope);
    return () => {
      window.removeEventListener("mousedown", handleClickOutScope);
    };
  }, [opened]);

  const handleSort = () => {
    setParams((prev) => ({
      ...sortParams,
      page: 1,
    }));
    setOpened(false);
  };

  return (
    <div className='relative z-[90]' ref={containerRef}>
      <button
        className={`h-[32px] rounded-[5px] flex items-center justify-center gap-[6px] px-[6px]
             border-[2px] transition-all duration-[0.2s] ease-in group
             ${
               opened
                 ? "border-yellow-400"
                 : "border-[rgba(255,255,255,0.4)] hover:border-yellow-400 "
             }
            `}
        onClick={() => setOpened((prev) => !prev)}
      >
        <div
          className={`transition-all duration-[0.2s] flex items-center gap-[8px]
            ${
              opened
                ? "text-yellow-400"
                : "text-[rgba(255,255,255,0.4)] group-hover:text-yellow-400"
            }
            `}
        >
          <div>
            <FilterIcon />
          </div>

          <span>Lọc</span>
        </div>
      </button>
      <div
        className={`absolute top-[130%] translate-x-0 right-0
            ${
              opened === undefined
                ? "hidden"
                : opened
                ? " animate-slideIn"
                : " animate-slideOut"
            }
        `}
      >
        <div className='rounded-[5px] bg-black sd3 py-[6px]'>
          {sortList.map((data, id) => (
            <SortRow
              key={id}
              data={data}
              boxOpened={opened}
              sortParams={sortParams}
              setSortParams={setSortParams}
            />
          ))}
          <div className='w-full flex items-center justify-end px-[12px] py-[8px]'>
            <button className='border-b-[2px]  px-[8px]' onClick={handleSort}>
              Lọc
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Filter;
