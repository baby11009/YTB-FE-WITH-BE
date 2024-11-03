import VideoInfor from "./VideoInfor";
import CommentSection from "./CommentSection";
import { useState } from "react";
import DetailsBox from "./DetailsBox";

const DescSection = ({
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
  const [watchFull, setWatchFull] = useState(false);

  return (
    <div
      className=' w-[410px] xl:w-[480px] h-screen-h-minus-72 overflow-y-auto flex flex-col px-[16px] pt-[16px] 
      border-[1px] border-[rgba(255,255,255,.2)] rounded-[12px] bg-[#0a0a0a]'
      ref={boxRef}
    >
      {watchFull ? (
        <DetailsBox setOpened={setWatchFull} data={videoData} />
      ) : (
        <>
          {/* Video in4 */}
          <VideoInfor videoData={videoData} refetch={refetch} setWatchFull={setWatchFull} />
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
        </>
      )}
    </div>
  );
};
export default DescSection;
