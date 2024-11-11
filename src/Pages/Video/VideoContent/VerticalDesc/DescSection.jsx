import VideoInfor from "./VideoInfor";
import CommentSection from "./CommentSection";
import { useState } from "react";
import DetailsBox from "./DetailsBox";

const DescSection = ({
  videoDetails,
  cmtList,
  totalCmt,
  cmtCreatedAt,
  boxRef,
  refetch,
  cmtParams,
  setCmtParams,
  setCmtAddNew,
  setCmtBoxIsEnd,
  replyCmtModified,
}) => {
  const [watchFull, setWatchFull] = useState(false);

  return (
    <div
      className=' w-[410px] xl:w-[480px] h-screen-h-minus-72 overflow-hidden flex flex-col px-[16px] pt-[16px] 
      border-[1px] border-[rgba(255,255,255,.2)] rounded-[12px] bg-[#0a0a0a]'
      ref={boxRef}
    >
      {watchFull ? (
        <DetailsBox setOpened={setWatchFull} data={videoDetails} />
      ) : (
        <>
          {/* Video in4 */}
          <VideoInfor
            videoDetails={videoDetails}
            refetch={refetch}
            setWatchFull={setWatchFull}
          />
          {/* Comment  */}
          <CommentSection
            refetchVideo={refetch}
            cmtList={cmtList}
            totalCmt={totalCmt}
            videoUserId={videoDetails?.channel_info?._id}
            videoId={videoDetails?._id}
            cmtCreatedAt={cmtCreatedAt}
            setCmtAddNew={setCmtAddNew}
            cmtParams={cmtParams}
            setCmtParams={setCmtParams}
            setCmtBoxIsEnd={setCmtBoxIsEnd}
            replyCmtModified={replyCmtModified}
          />
        </>
      )}
    </div>
  );
};
export default DescSection;
