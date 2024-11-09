import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { EmojiIcon } from "../../Assets/Icons";
import { createData } from "../../Api/controller";

const InputBox = ({
  setShowedInput,
  handleOnClick,
  myChannelImg,
  imgSize,
  showEmoji,
  videoId,
  userId,
  replyId,
  setCmtParams,
  setAddNewReply,
  refetchVideo,
  refetchReply,
}) => {
  const [focused, setFocused] = useState(false);

  const [cmtText, setCmtText] = useState("");

  const inputRef = useRef();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleCreateCmt = async () => {
    let data = {
      videoId,
      userId,
      cmtText,
    };
    if (replyId) {
      data.replyId = replyId;
    }
    await createData("/client/comment", data, "comment", () => {
      if (refetchReply && setAddNewReply) {
        refetchReply();
        setAddNewReply(true);
      }
      setCmtParams((prev) => ({ ...prev, page: 1 }));
      if (refetchVideo) {
        refetchVideo();
      }
      setCmtText("");
      setShowedInput(false);
    });
  };

  return (
    <div className='w-full flex gap-[12px]'>
      <div>
        <img
          src={myChannelImg}
          alt=''
          className={`${imgSize || "w-[40px] h-[40px]"} rounded-[50%] bg-white`}
        />
      </div>
      <div className='flex-1'>
        <div className='pb-[8px]'>
          <div className='mb-[3.5px]'>
            <input
              type='text'
              placeholder='Viết bình luận...'
              className='bg-[transparent] text-[14px] leading-[20px] placeholder:text-gray-A outline-none w-full'
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              ref={inputRef}
              onChange={(e) => {
                setCmtText(e.target.value);
              }}
              value={cmtText}
            />
          </div>
          <div className='relative'>
            <div className='border-b-[1px] border-[#717171] origin-center'></div>
            {focused && (
              <motion.div
                className='h-[1px] bg-[#ffffff] origin-center absolute left-[50%] w-[0] '
                animate={{
                  width: "100%",
                  left: 0,
                }}
              ></motion.div>
            )}
          </div>
        </div>
        <div className='flex  items-center'>
          {showEmoji && (
            <div>
              <button
                className='w-[40px] h-[40px] rounded-[50%] flex 
            items-center justify-center hover:bg-[rgba(255,255,255,0.2)]'
              >
                <EmojiIcon />
              </button>
            </div>
          )}
          <div className='flex-1 flex gap-[8px] justify-end'>
            <button
              className='h-[36px] rounded-[20px] px-[16px] text-[14px] flex 
                items-center justify-center hover:bg-[rgba(255,255,255,0.2)]'
              onClick={() => {
                handleOnClick();
                setCmtText("");
              }}
            >
              Hủy
            </button>
            <button
              className={`h-[36px] rounded-[20px] px-[16px] text-[14px] 
                flex items-center justify-center text-nowrap
                ${
                  cmtText !== ""
                    ? "bg-blue-3E text-black hover:bg-[#65b8ff]"
                    : "bg-[rgba(255,255,255,0.1)] text-gray-71 "
                }
                `}
              disabled={!cmtText}
              onClick={() => handleCreateCmt()}
            >
              Bình luận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default InputBox;
