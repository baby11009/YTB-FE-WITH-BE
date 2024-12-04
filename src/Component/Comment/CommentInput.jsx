import { useState } from "react";
import InputBox from "./InputBox";
import { useAuthContext } from "../../Auth Provider/authContext";
import { MyChannel } from "../../Assets/Images";

const CommentInput = ({
  refetchVideo,
  showEmoji,
  imgSize,
  videoId,
  setAddNewCmt,
  setCmtParams,
}) => {
  const { user } = useAuthContext();

  const [showedInput, setShowedInput] = useState(false);

  const handleOnClick = (e) => {
    setShowedInput(false);
  };

  const handleShowInput = () => {
    if (!user) {
      alert("Đăng nhập để bình luận");
    } else {
      setShowedInput(true);
    }
  };

  return (
    <>
      {!showedInput ? (
        <div
          className='w-full flex items-center gap-[12px] cursor-text'
          onClick={handleShowInput}
        >
          <div>
            <img
              src={
                user
                  ? `${import.meta.env.VITE_BASE_API_URI}${
                      import.meta.env.VITE_VIEW_AVA_API
                    }${user?.avatar}`
                  : MyChannel
              }
              alt=''
              className={`${imgSize || "size-[24px]"} rounded-[50%] bg-white`}
            />
          </div>
          <div className='flex-1'>
            <div className='text-[14px] leading-[20px] text-gray-A border-b-[1px] border-[rgba(255,255,255,0.2)] pb-[4px]'>
              Viết bình luận...
            </div>
          </div>
        </div>
      ) : (
        <InputBox
          handleOnClick={handleOnClick}
          myChannelImg={`${import.meta.env.VITE_BASE_API_URI}${
            import.meta.env.VITE_VIEW_AVA_API
          }${user?.avatar}`}
          showEmoji={showEmoji}
          videoId={videoId}
          userId={user?._id}
          refetchVideo={refetchVideo}
          setAddNewCmt={setAddNewCmt}
          setCmtParams={setCmtParams}
          setShowedInput={setShowedInput}
        />
      )}
    </>
  );
};
export default CommentInput;
