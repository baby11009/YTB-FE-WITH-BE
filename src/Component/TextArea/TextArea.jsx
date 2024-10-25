import { useEffect, useRef } from "react";

const TextArea = ({
  title,
  name,
  value,
  defaultValue,
  handleOnChange,
  errMsg,
  placeholder,
}) => {
  const textAreaRef = useRef();

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.addEventListener("blur", (e) => {
        if (!e.target.value && defaultValue) {
          console.log(value);
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

  return (
    <div className='flex flex-col gap-[8px]'>
      <label htmlFor='title'>
        <span className='font-[500]'>{title}</span>
      </label>
      <textarea
        name={name}
        id={name}
        rows={5}
        value={value}
        ref={textAreaRef}
        onChange={(e) => handleOnChange(name, e.target.value)}
        placeholder={placeholder}
        className='bg-transparent outline-none border-[2px] rounded-[5px] resize-none p-[8px]
        focus:border-white-F1 border-gray-A'
      ></textarea>
      <div className='text-[12px] text-red-FF font-[500] leading-[16px] h-[16px] mt-[12px] px-[8px]'>
        <span>{errMsg}</span>
      </div>
    </div>
  );
};
export default TextArea;
