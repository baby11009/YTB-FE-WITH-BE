import VideoInfor from "./VideoInfor";
import CommentSection from "./CommentSection";

const DescSection = ({
  sub,
  videoData,
  cmtData,
  totalCmt,
  cmtCreatedAt,
  setCmtCreatedAt,
  boxRef,
  refetch,
  refetchCmtList,
  cmtParams,
  setCmtParams,
  setAddNewCmt,
}) => {
  const time = "06/14/2024, 11:20:32 AM";

  return (
    <div
      className=' w-[410px] xl:w-[480px] h-screen-h-minus-72 overflow-y-auto flex flex-col px-[16px] pt-[16px] 
      border-[1px] border-[rgba(255,255,255,.2)] rounded-[12px] bg-[#0a0a0a]'
      ref={boxRef}
    >
      {/* Video in4 */}
      <VideoInfor
        sub={sub}
        time={time}
        videoData={videoData}
        refetch={refetch}
      />
      {/* Comment  */}
      <CommentSection
        refetchVideo={refetch}
        cmtData={cmtData}
        totalCmt={totalCmt}
        videoUserId={videoData?.channel_info?._id}
        videoId={videoData?._id}
        refetchCmtList={refetchCmtList}
        cmtCreatedAt={cmtCreatedAt}
        setCmtCreatedAt={setCmtCreatedAt}
        setAddNewCmt={setAddNewCmt}
        cmtParams={cmtParams}
        setCmtParams={setCmtParams}
      />
    </div>
  );
};
export default DescSection;
