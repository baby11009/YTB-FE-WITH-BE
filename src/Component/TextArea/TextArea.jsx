import {
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
  useCallback,
  memo,
} from "react";

const TextArea = ({
  disabled,
  cannotEmpty = true,
  preventCharactersList,
  title,
  name,
  value = "",
  defaultValue,
  handleOnChange,
  handleSetRealTimeErr,
  handleRemoveRealTimeErr,
  errMsg,
  placeholder,
  maxLength = 255,
}) => {
  const defaultPreventCharacters = useRef(new Set(["<", ">"]));

  const [isErr, setIsErr] = useState(false);

  const [isFocused, setIsFocused] = useState(false);

  const [totalCharacters, setTotalCharacters] = useState(0);

  const textAreaRef = useRef();

  const handleOnInput = useCallback(
    (e) => {
      handleOnChange(name, textAreaRef.current.innerHTML);

      setTotalCharacters(total);
      if (total > maxLength) {
        setIsErr(true);
      } else {
        setIsErr(false);
      }
    },
    [maxLength, isErr],
  );

  const handleOnKeyDown = useCallback((e) => {
    if (
      (preventCharactersList && preventCharactersList.has(e.key)) ||
      defaultPreventCharacters.current.has(e.key)
    ) {
      e.preventDefault();
    }
  }, []);

  const hanldeOnPaste = useCallback((e) => {
    e.preventDefault();

    const urlRegex = /(g;https?:\/\/[^\s]+)/;
    let clipboardText = e.clipboardData.getData("text/plain");

    // Nếu clipboardText chứa URL, thay thế bằng thẻ <a>
    if (urlRegex.test(clipboardText)) {
      clipboardText = clipboardText.replace(
        urlRegex,
        (url) =>
          `<a href="${url}" target="_blank" class="text-blue-3E">${url}</a>`,
      );
    }

    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    range.deleteContents();

    // Chuyển clipboardText thành HTML (sau khi thay thế bằng <a>)
    const div = document.createElement("div");
    div.innerHTML = clipboardText; // Phân tích HTML và tạo các nodes

    const fragment = document.createDocumentFragment();

    // Dán tất cả các node con của div vào range
    while (div.firstChild) {
      fragment.appendChild(div.firstChild);
    }

    range.insertNode(fragment);

    const editableElement = e.target;
    const inputEvent = new Event("input", { bubbles: true });
    editableElement.dispatchEvent(inputEvent);
  }, []);

  useEffect(() => {
    const handleBlur = (e) => {
      if (!textAreaRef.current.innerHTML && defaultValue && cannotEmpty) {
        handleOnChange(name, "");
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
      // Will shrink the height to fit the content if user delete data
      e.target.style.height = "auto";

      // Wait for the next frame to apply the new height
      setTimeout(() => {
        // Update height of the content to equal scrollHeight
        e.target.style.height = e.target.scrollHeight + "px";
      }, 0);
    }

    if (textAreaRef.current) {
      textAreaRef.current.addEventListener("input", handleInput);
    }
  }, []);

  useLayoutEffect(() => {
    if (value) {
      if (!textAreaRef.current.innerHTML) {
        textAreaRef.current.innerHTML = value;
        let text = textAreaRef.current.innerText;

        // if the innetText is \n\n then it means line breaks, count total of the line breaks
        const totalLineBreak = text.match(/\n{2}/g)?.length || 0;

        // Replace \n linebreaks with ↵ to count the number of characters
        let enterAdjustedText = text.replace(/\n/g, "↵");
        // minus with the total line breaks to make sure the line breaks just count as 1 character
        setTotalCharacters(enterAdjustedText.length - totalLineBreak);
      }
    }
  }, [value]);

  useEffect(() => {
    if (totalCharacters) {
      if (totalCharacters > maxLength) {
        handleSetRealTimeErr(
          name,
          `${title} cannot exceed ${maxLength} characters`,
        );
      } else {
        handleRemoveRealTimeErr(name);
      }
    }
  }, [totalCharacters]);

  return (
    // Remember to add the parrents element  overflow hidden
    // to make sure the content will collapse when it overflows or else the width of this textarea will be exceeded
    <div
      className={`w-full overflow-hidden border-[1px] rounded-[8px]  ${
        isErr
          ? "border-red-400"
          : isFocused
          ? "border-white-F1 "
          : "hover:border-white-F1 border-[#6b6767]"
      } transition-all ease-in px-[12px] relative`}
      onClick={() => {
        textAreaRef.current.focus();
      }}
    >
      <div className='mt-[8px] mb-[4px]'>
        <span className='text-[12px] leading-[16px] font-[500]'>{title}</span>
      </div>
      <div
        contentEditable={true}
        ref={textAreaRef}
        key={name}
        aria-label={placeholder}
        onInput={handleOnInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onPaste={hanldeOnPaste}
        onKeyDown={handleOnKeyDown}
        className='text-[15px]
       leading-[24px] min-h-[120px] overflow-hidden outline-none'
      ></div>
      {totalCharacters < 1 && (
        <div className='absolute top-[36px] text-[15px] leading-[24px] text-gray-71'>
          {placeholder}
        </div>
      )}
      <div className='flex justify-between'>
        <div
          className='text-[12px] font-[500] leading-[16px] h-[16px]
         text-red-FF line-clamp-1 text-ellipsis break-all'
        >
          <span>{errMsg}</span>
        </div>
        <div
          className={`self-end text-[14px]  ${
            totalCharacters > maxLength ? "text-red-FF" : "text-gray-A"
          }`}
        >
          {totalCharacters}/{maxLength}
        </div>
      </div>
    </div>
  );
};
export default memo(TextArea);
