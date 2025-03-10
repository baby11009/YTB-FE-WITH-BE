import { useRef, useLayoutEffect } from "react";
import { CloseIcon } from "../../Assets/Icons";
const QueryTextInput = ({
  queryData,
  currValue,
  handleExecuteQuery,
  handleClose,
}) => {
  const inputRef = useRef();
  const timeOut = useRef();
  const handleOnInput = (e) => {
    if (timeOut.current) {
      clearTimeout(timeOut.current);
    }
    timeOut.current = setTimeout(() => {
      handleExecuteQuery(queryData.id, e.target.value);
    }, 600);
  };

  useLayoutEffect(() => {
    if (currValue) {
      inputRef.current.value = currValue;
    }
  }, [currValue]);

  return (
    <div className='flex items-end'>
      <button className='flex items-center rounded-[5px] bg-black-0.2 h-[32px]'>
        <span className='ml-[12px] font-[500] leading-[20px] text-[14px]'>
          {queryData.text}
        </span>
        <div
          className='px-[6px] w-[24px]'
          onClick={() => {
            handleClose(queryData);
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
        id={queryData.id}
        placeholder='Searching...'
        autoCorrect="off"
        className='bg-transparent py-[4px] border-b-[2px] outline-none ml-[8px]'
      />
    </div>
  );
};
export default QueryTextInput;
