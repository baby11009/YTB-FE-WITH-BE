import { useEffect, useRef } from "react";

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
    <div className='flex flex-col gap-[8px]'>
      <label htmlFor='title'>
        <span className='font-[500]'>{title}</span>
      </label>
      <textarea
        name={name}
        id={name}
        disabled={disabled}
        value={value}
        maxLength={maxLength}
        ref={textAreaRef}
        onChange={(e) => handleOnChange(name, e.target.value)}
        placeholder={placeholder}
        className='bg-transparent outline-none border-[2px] rounded-[5px] resize-none p-[8px]
        focus:border-white-F1 border-gray-A leading-[22px] min-h-[127px] max-h-[255px] overflow-hidden relative'
      ></textarea>
      <div
        className={`self-end text-[14px]  ${
          value.length === maxLength ? "text-red-FF" : "text-gray-A"
        }`}
      >
        {value.length}/{maxLength}
      </div>
      <div className='text-[12px]  font-[500] leading-[16px] h-[16px] mt-[12px] px-[8px]'>
        <span>{errMsg}</span>
      </div>
    </div>
  );
};
export default TextArea;
