import CommentCard from "./CommentCard";
import { useState, useEffect, useRef } from "react";
import { getData } from "../../Api/getData";
import { useAuthContext } from "../../Auth Provider/authContext";
import { CurveArrowIcon } from "../../Assets/Icons";
import { useCallback } from "react";

const Comment = ({
  imgSize,
  data,
  videoId,
  videoUserId,
  refetchVideo,
  replyCmtModified,
}) => {
  const { user } = useAuthContext();

  const [replyCmtsList, setReplyCmtList] = useState([]);

  const [showReply, setShowReply] = useState(false);

  const [addNewReply, setAddNewReply] = useState(false);

  const replyIdsListSet = useRef(new Set());

  const [firstOpened, setFirstOpened] = useState(true);

  const [cmtReplyPrs, setCmtReplyPrs] = useState({
    limit: 5,
    page: 1,
    replyId: data?._id,
    userId: user?._id,
  });

  const {
    data: replyCmtsData,
    isLoading,
    refetch,
  } = getData(`/data/comment/video-cmt/${videoId}`, cmtReplyPrs, showReply);

  useEffect(() => {
    if (replyCmtsData && showReply) {
      if (addNewReply) {
        setReplyCmtList(replyCmtsData?.data);
        replyCmtsData?.data.forEach((item) =>
          replyIdsListSet.current.add(item?._id)
        );
      } else {
        let addList = [];
        replyCmtsData?.data.forEach((item) => {
          if (!replyIdsListSet.current.has(item?._id)) {
            addList.push(item);
            replyIdsListSet.current.add(item?._id);
          }
        });
        setReplyCmtList((prev) => [...prev, ...addList]);
      }
    }
  }, [replyCmtsData, showReply]);

  useEffect(() => {
    if (!showReply && !firstOpened) {
      setReplyCmtList([]);
      replyIdsListSet.current.clear();
      setCmtReplyPrs({
        limit: 5,
        page: 1,
        replyId: data?._id,
        userId: user?._id,
      });
    } else {
      setFirstOpened(false);
    }
  }, [showReply]);

  useEffect(() => {
    if (replyCmtModified) {
      switch (replyCmtModified.action) {
        case "create":
          setReplyCmtList((prev) => [replyCmtModified.data, ...prev]);
          break;
        case "update":
          setReplyCmtList((prev) => {
            const dataList = [...prev];
            dataList.forEach((item, id) => {
              if (item?._id === replyCmtModified.data?._id) {
                dataList[id] = { ...item, ...replyCmtModified.data };
              }
            });

            return dataList;
          });
          break;
        case "delete":
          setReplyCmtList((prev) =>
            prev.filter((item) => item?._id !== replyCmtModified.data?._id)
          );
          break;
      }
    }
  }, [replyCmtModified]);

  useEffect(() => {
    if (
      replyCmtsList.length < 4 &&
      cmtReplyPrs.page < replyCmtsData?.totalPage
    ) {
      if (cmtReplyPrs.page > 1) {
        setCmtReplyPrs((prev) => ({ ...prev, page: 1 }));
      } else {
        refetch();
      }
    }
  }, [replyCmtsList]);

  const handleShowMoreReplyCmt = useCallback(() => {
    if (cmtReplyPrs.page < replyCmtsData?.totalPage)
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
              replyCmtsList.map((item, id) => (
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
          {cmtReplyPrs.page < replyCmtsData?.totalPage && (
            <button
              className='flex items-center justify-center rounded-[30px] text-blue-3E hover:bg-blue-26 px-[16px] mb-[8px]'
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
