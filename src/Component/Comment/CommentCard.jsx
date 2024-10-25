import { llstylish, emoji1, sangtraan, MyChannel } from "../../Assets/Images";
import {
  EmptyLikeIcon,
  LoveIcon,
  ThinArrowIcon,
  Setting2Icon,
  Verification,
  ThickLikeIcon,
} from "../../Assets/Icons";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import InputBox from "./InputBox";
import { timeFormat2 } from "../../util/timeforMat";
import { formatNumber } from "../../util/numberFormat";
import { useAuthContext } from "../../Auth Provider/authContext";
import CustomeFuncBox from "../Box/CustomeFuncBox";
import request from "../../util/axios-base-url";
import { getCookie } from "../../util/tokenHelpers";
import { LikeAndDislikeCmtBtn } from "../../Component";
import EditCommentArea from "./EditCommentArea";

const CommentCard = ({
  showReply,
  setShowReply,
  imgSize,
  data,
  videoUserId,
  videoId,
  setAddNewCmt,
  setAddNewReply,
  setCmtParams,
  refetchReply,
  refetchCmtList,
  refetchVideo,
}) => {
  const { user, setIsShowing } = useAuthContext();

  const [showedInput, setShowedInput] = useState(false);

  const [opened, setOpened] = useState(false);

  const containerRef = useRef();

  const refetchList = useCallback((data) => {
    if (data?.replied_cmt_id || data?.replied_parent_cmt_id) {
      refetchReply();
      setAddNewReply(true);
    }
    setCmtParams((prev) => ({ ...prev, page: 1 }));
    refetchCmtList();
    setAddNewCmt(true);
  });

  const handleOnClick = () => {
    if (!user) {
      alert("Đăng nhập để bình luận");
    } else {
      setShowedInput((prev) => !prev);
    }
  };

  const handleUpdatedCmt = async (value) => {
    if (value === data?.cmtText) {
      alert("Không có gì thay đổi");
      return;
    }
    await request
      .patch(
        `/client/comment/${data?._id}`,
        { cmtText: value },
        {
          headers: {
            Authorization: `${import.meta.env.VITE_AUTH_BEARER} ${getCookie(
              import.meta.env.VITE_AUTH_TOKEN
            )}`,
          },
        }
      )
      .then((rsp) => {
        refetchList();
        setIsShowing(undefined);
      })
      .catch((err) => console.log(err));
  };

  const funcList = [
    {
      id: 1,
      text: "Chỉnh sửa",
      handleOnClick: () => {
        setIsShowing(
          <EditCommentArea
            value={data?.cmtText}
            handleUpdate={handleUpdatedCmt}
          />
        );
      },
    },
    {
      id: 2,
      text: "Xóa",
      handleOnClick: async () => {
        await request
          .delete(`/client/comment/${data?._id}`, {
            headers: {
              Authorization: `${import.meta.env.VITE_AUTH_BEARER} ${getCookie(
                import.meta.env.VITE_AUTH_TOKEN
              )}`,
            },
          })
          .then((rsp) => {
            refetchList(rsp.data?.data);
            refetchVideo();
          })
          .catch((err) => console.log(err));
      },
    },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpened(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className='flex mb-[16px]'>
      <Link className='mr-[12px]' to={`/channel/${5}`}>
        <img
          src={`${import.meta.env.VITE_BASE_API_URI}${
            import.meta.env.VITE_VIEW_AVA_API
          }${data?.user_info?.avatar}`}
          alt=''
          className={`${imgSize || "!size-[24px]"} rounded-[50%]`}
        />
      </Link>
      <div className='flex-1'>
        {/* user in4 */}
        <div className='flex items-center justify-between pb-[2px] bg-['>
          <div className='flex gap-[4px]'>
            <Link className='flex items-center gap-[4px]' to={`/channel/${5}`}>
              <h3
                className={`text-[13px] leading-[20px] ${
                  videoUserId === data?.user_info._id &&
                  "bg-[#888888] px-[6px] rounded-[12px]"
                }`}
              >
                @{data?.user_info?.email}
              </h3>
              {data?.user_info?.subscriber > 100000 && (
                <div>
                  <Verification size={"12"} color={"#ffffff"} />
                </div>
              )}
            </Link>
            <Link>
              <span className='text-[12px] leading-[20px] text-gray-A hover:text-white-F1'>
                {timeFormat2(data?.createdAt)}
              </span>
            </Link>
          </div>
        </div>

        {/* content */}
        <div className='text-[14px] leading-[20px]'>
          {data?.reply_user_info?.email && (
            <span className='break-all text-blue-3E'>
              @{data?.reply_user_info?.email}{" "}
            </span>
          )}
          <span className='break-all'>{data?.cmtText}</span>
        </div>

        {/* func section */}
        <div className='mt-[4px] ml-[-8px] flex'>
          <LikeAndDislikeCmtBtn
            cmtId={data?._id}
            like={data?.like}
            type={data?.react_info?.type}
            refetchList={() => {
              refetchList(data);
            }}
          />

          {/* channel Like */}
          <div className='w-[36px] h-[36px] flex items-center justify-center relative'>
            <img
              src={sangtraan}
              alt='channel image'
              className='w-[14px] h-[14px] rounded-[50%]'
            />
            <div className='w-[15px] h-[15px] absolute bottom-[15%] right-[9%]'>
              <LoveIcon />
            </div>
          </div>

          {/* Reply */}
          <button
            className='ml-[8px] h-[32px] rounded-[20px] px-[10px] text-[13px]
           flex items-center justify-center hover:bg-[rgba(255,255,255,0.2)] text-nowrap'
            onClick={handleOnClick}
          >
            Phản hồi
          </button>
        </div>

        {showedInput && (
          <InputBox
            setShowedInput={setShowedInput}
            myChannelImg={MyChannel}
            imgSize={"w-[24px] h-[24px]"}
            showEmoji={true}
            handleOnClick={handleOnClick}
            videoId={videoId}
            userId={user?._id}
            refetchCmtList={refetchCmtList}
            replyId={data?._id}
            setAddNewCmt={setAddNewCmt}
            setCmtParams={setCmtParams}
            refetchReply={refetchReply}
            setAddNewReply={setAddNewReply}
            refetchVideo={refetchVideo}
          />
        )}

        {/* Reply comment */}
        {data?.replied_cmt_total > 0 && (
          <button
            className='flex items-center gap-[6px] rounded-[30px] px-[16px] hover:bg-[#263850]'
            onClick={() => setShowReply((prev) => !prev)}
          >
            <div
              className={`${
                showReply ? "rotate-[-90deg]" : "rotate-90"
              }  flex items-center`}
            >
              <ThinArrowIcon color={"#3EA6FF"} />
            </div>
            <span className='text-[14px] leading-[36px] text-blue-3E'>
              {data?.replied_cmt_total} phản hồi
            </span>
          </button>
        )}
      </div>

      {user?._id === data?.user_info?._id && (
        <motion.button
          className='size-[40px] rounded-[50%] flex items-center justify-center relative'
          whileTap={{
            backgroundColor: "rgba(255,255,255,0.2)",
          }}
          onClick={(e) => {
            setOpened((prev) => !prev);
            e.stopPropagation();
          }}
          ref={containerRef}
        >
          <Setting2Icon />
          {opened && (
            <CustomeFuncBox
              style={"w-[156px] right-0 top-[100%]"}
              setOpened={setOpened}
              funcList1={funcList}
            />
          )}
        </motion.button>
      )}
    </div>
  );
};
export default CommentCard;
