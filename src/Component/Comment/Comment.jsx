import CommentCard from "./CommentCard";
import { useState, useEffect } from "react";
import { getData } from "../../Api/getData";
import { useAuthContext } from "../../Auth Provider/authContext";

const Comment = ({
  imgSize,
  data,
  videoId,
  videoUserId,
  setAddNewCmt,
  setCmtParams,
  refetchCmtList,
  refetchVideo,
}) => {
 
  const { user } = useAuthContext();

  const [replyCmtsData, setReplyCmtsData] = useState([]);

  const [showReply, setShowReply] = useState(false);

  const [addNewReply, setAddNewReply] = useState(false);

  const {
    data: replyCmtList,
    isLoading,
    refetch: refetchReply,
    isSuccess,
    isError,
    error,
  } = getData(
    `/data/comment/video-cmt/${videoId}`,
    {
      limit: 8,
      page: 1,
      replyId: data?._id,
      userId: user?._id,
      createdAt: "mới nhất",
    },
    showReply,
    false
  );

  useEffect(() => {
    if (isSuccess && showReply) {
      if (addNewReply) {
        setReplyCmtsData(replyCmtList?.data);
      } else {
        setReplyCmtsData((prev) => [...prev, ...replyCmtList?.data]);
      }
    }
  }, [isSuccess, replyCmtList, showReply]);

  useEffect(() => {
    if (isError) {
      console.log(error);
    }
  }, [isError, error]);

  useEffect(() => {
    if (!showReply) {
      setReplyCmtsData([]);
    }
  }, [showReply]);

  return (
    <>
      <CommentCard
        showReply={showReply}
        setShowReply={setShowReply}
        imgSize={imgSize}
        data={data}
        videoId={videoId}
        videoUserId={videoUserId}
        refetchCmtList={refetchCmtList}
        setAddNewCmt={setAddNewCmt}
        setCmtParams={setCmtParams}
        refetchReply={refetchReply}
        setAddNewReply={setAddNewReply}
        refetchVideo={refetchVideo}
      />
      {showReply && (
        <div
          className={`pl-[36px] ${
            isLoading && "flex justify-center mb-[16px]"
          } `}
        >
          {!isLoading ? (
            replyCmtsData.map((item, id) => (
              <CommentCard
                key={id}
                showReply={showReply}
                setShowReply={setShowReply}
                imgSize={imgSize}
                data={item}
                videoId={videoId}
                videoUserId={videoUserId}
                setAddNewCmt={setAddNewCmt}
                refetchCmtList={refetchCmtList}
                setCmtParams={setCmtParams}
                refetchReply={refetchReply}
                setAddNewReply={setAddNewReply}
                refetchVideo={refetchVideo}
              />
            ))
          ) : (
            <div
              className='w-[30px] h-[30px] rounded-[50%] border-[3.5px] border-b-[transparent] 
            border-r-[transparent] border-[#717171] animate-spin'
            ></div>
          )}
        </div>
      )}
    </>
  );
};
export default Comment;
