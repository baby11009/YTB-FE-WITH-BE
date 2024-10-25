import { SearchIcon, ThinArrowIcon } from "../../../../Assets/Icons";
import { useState, useEffect, useRef } from "react";

const Search = ({
  tagList,
  currTag,
  setCurrTag,
  searchValue,
  setSearchValue,
}) => {
  const [opened, setOpened] = useState(undefined);

  const [openedTag, setOpenedTag] = useState(undefined);

  const containerRef = useRef();

  const inputRef = useRef();

  useEffect(() => {
    const handleClickOutScope = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        if (opened !== undefined) {
          setOpened(false);

          setOpenedTag(undefined);
        }
      }
    };
    window.addEventListener("mousedown", handleClickOutScope);
    return () => {
      window.removeEventListener("mousedown", handleClickOutScope);
    };
  }, [opened, openedTag]);

  return (
    <div className='relative  z-[100]' ref={containerRef}>
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
          if (openedTag) {
            setOpenedTag(undefined);
          }
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
            ref={inputRef}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <div className='relative'>
            <button
              className='size-[32px] border-[2px] rounded-[5px] flex items-center justify-center'
              onClick={() => setOpenedTag((prev) => !prev)}
            >
              <div
                className={`
                transition-transform duraion-[0.25s] ease-in ${
                  openedTag ? "" : "rotate-90 "
                }`}
              >
                <ThinArrowIcon />
              </div>
            </button>
            <div
              className={`absolute right-0 top-[130%] sd3 bg-black rounded-[5px]
               ${
                 openedTag === undefined
                   ? "hidden"
                   : openedTag
                   ? " animate-slideIn"
                   : " animate-slideOut"
               }
              
              `}
            >
              {tagList.map((tag) => (
                <button key={tag}>
                  <div className='flex items-center justify-center gap-[8px] w-[158px] py-[8px]'>
                    <input
                      type='radio'
                      name='tag'
                      id={tag}
                      value={tag}
                      checked={currTag === tag}
                      onChange={(e) => {
                        // handleSearch(tag);
                        // setOpenedTag(false);
                        setCurrTag(tag);
                      }}
                    />
                    <label htmlFor={tag} className=' cursor-pointer'>
                      <span>Search: {tag}</span>
                    </label>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Search;
