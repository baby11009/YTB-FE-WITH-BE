import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import { ShowPasswordIcon, HidePasswordIcon } from "../../Assets/Icons";

const Input = ({
  maxWidth,
  value,
  defaultValue,
  handleOnChange,
  type,
  id,
  label,
  error,
  readOnly = false,
}) => {
  
  const [isFocused, setIsFocused] = useState(false);

  const [actived, setActived] = useState(value !== "" ? true : undefined);

  const [hiddenPass, setHiddenPass] = useState(false);

  const containerRef = useRef();

  const inputRef = useRef();

  const lableRef = useRef();

  const handleTogglePw = () => {
    inputRef.current.type = hiddenPass ? "password" : "text";
    setHiddenPass((prev) => !prev);
  };

  useLayoutEffect(() => {
    inputRef.current.value = value;
    const handleOnBlur = (e) => {
      if (!value && defaultValue) {
        handleOnChange(e.target.name, defaultValue);
      }
    };
    inputRef.current.addEventListener("blur", handleOnBlur);
    return () => {
      inputRef.current.removeEventListener("blur", handleOnBlur);
    };
  }, [value]);

  useEffect(() => {
    const handleClickOutScope = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target) &&
        actived !== undefined &&
        value === "" &&
        !defaultValue
      ) {
        setActived(false);
      }
    };

    if (value !== "") {
      setActived(true);
    }

    window.addEventListener("mousedown", handleClickOutScope);

    return () => {
      window.removeEventListener("mousedown", handleClickOutScope);
    };
  }, [actived, value]);

  useEffect(() => {
    if (
      type === "password" &&
      !actived &&
      inputRef.current.type !== "password"
    ) {
      inputRef.current.type = "password";
      setHiddenPass(false);
    }
  }, [actived]);

  const handleChangeValue = useCallback((e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (e.target.type === "number") {
      value = Number(value);
    }
    handleOnChange(name, value);
  }, []);

  return (
    <div
      className={`w-full relative ${maxWidth || "sm:max-w-[360px]"}`}
      ref={containerRef}
    >
      <div className='border-b-[1px] flex items-center px-[8px]'>
        <input
          type={type || "text"}
          name={id}
          id={id}
          className='bg-transparent outline-none flex-1 pb-[8px] w-full'
          value={value}
          onChange={handleChangeValue}
          onFocus={() => {
            setActived(true);
            setIsFocused(true);
          }}
          aria-autocomplete='none'
          ref={inputRef}
          readOnly={readOnly}
        />

        {type === "password" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleTogglePw();
            }}
            type='button'
            className={`size-[24px] flex items-center justify-center ${
              actived && value ? "visible" : "invisible"
            }`}
          >
            <div>
              {hiddenPass ? <HidePasswordIcon /> : <ShowPasswordIcon />}
            </div>
          </button>
        )}

        <label
          htmlFor={id}
          key={label}
          ref={lableRef}
          className={`cursor-pointer absolute
            ${isFocused ? "transition-all duration-[0.25s] ease-in" : ""}
            ${
              actived
                ? "scale-100 left-0  top-[-24px]"
                : "scale-95 left-[8px] top-0"
            }`}
        >
          {label}
        </label>
      </div>

      <div className='text-[12px] text-red-FF  leading-[16px] h-[16px] my-[6px] px-[8px]'>
        <span>{error}</span>
      </div>
    </div>
  );
};
export default Input;
