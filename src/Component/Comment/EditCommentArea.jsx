import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { useAuthContext } from "../../Auth Provider/authContext";

const EditCommentArea = ({ value, handleUpdate }) => {
  const [commentValue, setCommentValue] = useState(value);

  const { setIsShowing } = useAuthContext();

  const containerRef = useRef();

  useLayoutEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsShowing(undefined);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className='w-[90vw] sm:w-[80vw] md:w-[70vw] lg:-[65vw] max-w-[740px] 3xl:max-w-[1200px] h-[75vh]
       bg-black rounded-[5px] flex flex-col gap-[20px] p-[20px]'
      ref={containerRef}
    >
      <textarea
        className='outline-none bg-transparent border-[2px] rounded-[5px] resize-none flex-1 px-[10px]'
        onChange={(e) => setCommentValue(e.target.value)}
        value={commentValue}
      ></textarea>
      <div className='flex justify-end gap-[16px]'>
        <button
          onClick={() => setIsShowing(undefined)}
          className='h-[36px] rounded-[20px] px-[16px] text-[14px] flex 
                items-center justify-center hover:bg-[rgba(255,255,255,0.2)]'
        >
          Hủy
        </button>
        <button
          onClick={() => handleUpdate(commentValue)}
          className={`h-[36px] rounded-[20px] px-[16px] text-[14px] 
                flex items-center justify-center text-nowrap
                ${
                  !commentValue || commentValue === value
                    ? "bg-[rgba(255,255,255,0.1)] text-gray-71"
                    : " bg-blue-3E text-black hover:bg-[#65b8ff] "
                }
                
                `}
          disabled={!commentValue || commentValue === value}
        >
          Chỉnh sửa
        </button>
      </div>
    </div>
  );
};
export default EditCommentArea;
