import { SearchIcon } from "../../../../Assets/Icons";
import { useState, useEffect, useRef } from "react";

const Search = ({ searchValue, setSearchValue }) => {
  const [opened, setOpened] = useState(undefined);

  const containerRef = useRef();

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

  return (
    <div className='relative z-[100]' ref={containerRef}>
      <button
        className={`size-[32px] rounded-[5px] flex items-center justify-center 
            border-[2px]  transition-all duration-[0.2s] ease-in group
            ${
              opened
                ? "border-white-F1"
                : "border-[rgba(255,255,255,0.4)] hover:border-white-F1"
            }
            `}
        onClick={(e) => {
          e.preventDefault();
          setOpened((prev) => !prev);
        }}
      >
        <div
          className={` transition-all duration-[0.2s]
            ${
              opened
                ? "text-white-F1"
                : "text-[rgba(255,255,255,0.4)] group-hover:text-white-F1 "
            }
            `}
        >
          <SearchIcon color={"currentColor"} />
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
        <div className='py-[12px] px-[16px] rounded-[5px] bg-black w-fit sd3 flex items-center gap-[8px]'>
          <input
            type='text'
            className='bg-transparent outline-none border-[2px] rounded-[5px] px-[6px] max-w-[160px] sm:max-w-[190px] h-[32px]'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
export default Search;
