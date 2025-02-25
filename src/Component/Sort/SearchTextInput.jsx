import { useRef, useLayoutEffect } from "react";
import { CloseIcon } from "../../Assets/Icons";
const SearchTextInput = ({
  searchData,
  currValue,
  handleSearch,
  handleClose,
}) => {
  const inputRef = useRef();
  const timeOut = useRef();
  const handleOnInput = (e) => {
    if (timeOut.current) {
      clearTimeout(timeOut.current);
    }
    timeOut.current = setTimeout(() => {
      handleSearch(searchData.id, e.target.value);
    }, 600);
  };

  useLayoutEffect(() => {
    if (currValue) {
      inputRef.current.value = currValue;
    }
  }, [currValue]);

  return (
    <div className='flex items-center'>
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

      <input
        autoFocus
        type='text'
        autoComplete='off'
        onInput={handleOnInput}
        ref={inputRef}
        id={searchData.id}
        placeholder='Searching...'
        className='bg-transparent py-[4px] border-b-[2px] outline-none ml-[16px]'
      />
    </div>
  );
};
export default SearchTextInput;
