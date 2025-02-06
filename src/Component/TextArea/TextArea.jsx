import { useEffect, useRef, useState } from "react";

const TextArea = ({
  disabled,
  cannotEmpty = true,
  title,
  name,
  value = "",
  defaultValue,
  handleOnChange,
  errMsg,
  placeholder,
  maxLength = 255,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const textAreaRef = useRef();

  useEffect(() => {
    const handleBlur = (e) => {
      if (!textAreaRef.current.innerHTML && defaultValue && cannotEmpty) {
        handleOnChange(name, defaultValue);
      }
    };
    if (textAreaRef.current) {
      textAreaRef.current.addEventListener("blur", handleBlur);
    }

    return () => {
      if (textAreaRef.current) {
        textAreaRef.current.removeEventListener("blur", handleBlur);
      }
    };
  }, [defaultValue, cannotEmpty]);

  useEffect(() => {
    function handleInput(e) {
      e.target.style.height = e.target.scrollHeight + "px";
    }

    if (textAreaRef.current) {
      textAreaRef.current.addEventListener("input", handleInput);
    }
  }, []);

  useEffect(() => {
    if (value && !textAreaRef.current.innerHTML) {
      textAreaRef.current.innerHTML = value;
    }
  }, [value]);

  return (
    <div
      className={`w-full overflow-hidden border-[1px] rounded-[8px] ${
        isFocused
          ? "border-white-F1 "
          : "hover:border-white-F1 border-[#6b6767]"
      } transition-all ease-in px-[12px]`}
      onClick={() => {
        textAreaRef.current.focus();
      }}
    >
      <div className='mt-[8px] mb-[4px]'>
        <span className='text-[12px] leading-[16px] font-[500]'>{title}</span>
      </div>
      <div
        contentEditable={true}
        name={name}
        id={name}
        disabled={disabled}
        value={value}
        maxLength={maxLength}
        ref={textAreaRef}
        onInput={(e) => handleOnChange(name, textAreaRef.current.innerHTML)}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className='
        leading-[22px] min-h-[127px] overflow-hidden'
      ></div>
      <div className='flex justify-between'>
        <div
          className='text-[12px] font-[500] leading-[16px] h-[16px]
         text-red-FF line-clamp-1 text-ellipsis break-all'
        >
          <span>{errMsg}</span>
        </div>
        {/* <div
          className={`self-end text-[14px]  ${
            value?.length === maxLength ? "text-red-FF" : "text-gray-A"
          }`}
        >
          {value.length}/{maxLength}
        </div> */}
      </div>
    </div>
  );
};
export default TextArea;
