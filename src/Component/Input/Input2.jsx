import { HidePasswordIcon, ShowPasswordIcon } from "../../Assets/Icons";
import { useRef, useState } from "react";

const Input2 = ({
  label,
  icon,
  type,
  placeholder,
  value,
  setValue,
  errorMsg,
}) => {
  const [showPwd, setShowPwd] = useState(false);

  const inputRef = useRef();

  const handleToggleShowPwd = (e) => {
    inputRef.current.type =
      inputRef.current.type === "password" ? "text" : "password";
    setShowPwd((prev) => !prev);
  };

  return (
    <div className='flex flex-col'>
      <label htmlFor={label} className='text-[18px] leading-[20px] font-bold'>
        {label}
      </label>
      <div className='flex items-center gap-[8px] p-[12px]  bg-[#2b2b2b] rounded-[10px] mt-[12px]'>
        <div className='font-bold text-[21px] leading-[21px]'>{icon}</div>
        <input
          type={type || "text"}
          name=''
          id={label}
          className='w-full bg-transparent  outline-none'
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoComplete='off'
          ref={inputRef}
        />
        {type === "password" && (
          <div
            className='size-[24px] flex items-center justify-center cursor-pointer'
            onClick={handleToggleShowPwd}
          >
            {showPwd ? <HidePasswordIcon /> : <ShowPasswordIcon />}
          </div>
        )}
      </div>
      <div className='my-[8px] mb-[12px] text-red-FF text-[14px] leading-[16px] h-[16px]'>
        {errorMsg || ""}
      </div>
    </div>
  );
};
export default Input2;
