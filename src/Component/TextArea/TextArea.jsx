import { useEffect, useRef, useState } from "react";

const TextArea = ({
  disabled,
  title,
  name,
  value,
  defaultValue,
  handleOnChange,
  errMsg,
  placeholder,
  maxLength = 255,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const textAreaRef = useRef();

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.addEventListener("blur", (e) => {
        if (!e.target.value && defaultValue) {
          handleOnChange(name, defaultValue);
        }
      });
    }

    return () => {
      if (textAreaRef.current) {
        textAreaRef.current.removeEventListener("blur", (e) => {
          if (!e.target.value && defaultValue) {
            handleOnChange(name, defaultValue);
          }
        });
      }
    };
  }, [defaultValue]);

  useEffect(() => {
    function handleInput(e) {
      e.target.style.height = e.target.scrollHeight + "px";
    }

    if (textAreaRef.current) {
      textAreaRef.current.addEventListener("input", handleInput);
    }
  }, []);

  return (
    <div
      className={`border-[1px] rounded-[8px] ${
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
      <textarea
        name={name}
        id={name}
        disabled={disabled}
        value={value}
        maxLength={maxLength}
        ref={textAreaRef}
        onChange={(e) => handleOnChange(name, e.target.value)}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className='block w-full bg-transparent outline-none  resize-none
        leading-[22px] min-h-[127px] overflow-hidden relative'
      ></textarea>
      <div className='flex justify-between'>
        <div className='text-[12px]  font-[500] leading-[16px] h-[16px] text-red-FF'>
          <span>{errMsg}</span>
        </div>
        <div
          className={`self-end text-[14px]  ${
            value.length === maxLength ? "text-red-FF" : "text-gray-A"
          }`}
        >
          {value.length}/{maxLength}
        </div>
      </div>
    </div>
  );
};
export default TextArea;
