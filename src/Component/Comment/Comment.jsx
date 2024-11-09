import CommentCard from "./CommentCard";
import { useState, useEffect } from "react";
import { getData } from "../../Api/getData";
import { useAuthContext } from "../../Auth Provider/authContext";
import { useQueryClient } from "@tanstack/react-query";
import { CurveArrowIcon } from "../../Assets/Icons";
import { useCallback } from "react";

const Comment = ({
  imgSize,
  data,
  videoId,
  videoUserId,
  refetchVideo,
  socket,
}) => {
  const { user } = useAuthContext();

  const queryClient = useQueryClient();

  const [replyCmtsData, setReplyCmtsData] = useState([]);

  const [showReply, setShowReply] = useState(false);

  const [addNewReply, setAddNewReply] = useState(false);

  const [cmtReplyPrs, setCmtReplyPrs] = useState({
    limit: 3,
    page: 1,
    replyId: data?._id,
    userId: user?._id,
    clearCache: `cmt-${data?._id}`,
  });

  const { data: replyCmtList, isLoading } = getData(
    `/data/comment/video-cmt/${videoId}`,
    cmtReplyPrs,
    showReply,
    false
  );

  useEffect(() => {
    if (replyCmtList && showReply) {
      if (addNewReply) {
        setReplyCmtsData(replyCmtList?.data);
      } else {
        setReplyCmtsData((prev) => [...prev, ...replyCmtList?.data]);
      }
    }
  }, [replyCmtList, showReply]);

  useEffect(() => {
    if (!showReply) {
      queryClient.removeQueries(`cmt-${data?._id}`);
      setReplyCmtsData([]);
      setCmtReplyPrs((prev) => ({ ...prev, page: 1 }));
    } else {
      // socket.on(`create-reply-comment-${user?._id}`, (data) => {
      //   console.log(data);
      // });
      // socket.on(`update-reply-comment-${user?._id}`);
      // socket.on(`delete-reply-comment-${user?._id}`);
    }
  }, [showReply]);

  const handleShowMoreReplyCmt = useCallback(() => {
    if (cmtReplyPrs.page < replyCmtList?.totalPage)
      setCmtReplyPrs((prev) => ({ ...prev, page: prev.page + 1 }));
  });

  return (
    <>
      <CommentCard
        showReply={showReply}
        setShowReply={setShowReply}
        imgSize={imgSize}
        data={data}
        videoId={videoId}
        videoUserId={videoUserId}
        refetchVideo={refetchVideo}
      />
      {showReply && (
        <div className='pl-[36px]'>
          <div className={` ${isLoading && "flex justify-center mb-[16px]"} `}>
            {!isLoading &&
              replyCmtsData.map((item, id) => (
                <CommentCard
                  key={id}
                  showReply={showReply}
                  setShowReply={setShowReply}
                  imgSize={imgSize}
                  data={item}
                  videoId={videoId}
                  videoUserId={videoUserId}
                  refetchVideo={refetchVideo}
                />
              ))}
          </div>
          {isLoading && (
            <div
              className='w-[30px] h-[30px] rounded-[50%] border-[3.5px] border-b-[transparent] 
          border-r-[transparent] border-[#717171] animate-spin'
            ></div>
          )}
          {cmtReplyPrs.page < replyCmtList?.totalPage && (
            <button
              className='flex items-center justify-center rounded-[30px] text-blue-3E hover:bg-blue-26 px-[16px]'
              onClick={() => {
                handleShowMoreReplyCmt();
              }}
            >
              <div className='mr-[6px] size-[24px]'>
                <CurveArrowIcon />
              </div>
              <span className='text-[14px] font-[500] leading-[36px]'>
                Show more replies
              </span>
            </button>
          )}
        </div>
      )}
    </>
  );
};
export default Comment;
