import HorizonVidInfor from "./HorizonVidInfor";
import HorizonDesCmt from "./HorizonDesCmt";
import CommentBox from "./CommentBox";
import DetailsBox from "./DetailsBox";

const HorizonDescSection = ({
  videoDetails,
  cmtList,
  setCmtBoxIsEnd,
  setCmtAddNew,
  cmtParams,
  setCmtParams,
  opened,
  setOpened,
  refetchVideo,
  replyCmtModified,
}) => {
  return (
    <div className='lg:hidden mt-[12px] mb-[24px]'>
      {opened === "cmt" ? (
        <CommentBox
          refetchVideo={refetchVideo}
          setOpened={setOpened}
          cmtList={cmtList}
          totalCmt={videoDetails?.totalCmt}
          videoUserId={videoDetails?.channel_info._id}
          videoId={videoDetails?._id}
          cmtParams={cmtParams}
          setCmtParams={setCmtParams}
          setCmtAddNew={setCmtAddNew}
          setCmtBoxIsEnd={setCmtBoxIsEnd}
          replyCmtModified={replyCmtModified}
        />
      ) : opened === "detail" ? (
        <DetailsBox setOpened={setOpened} data={videoDetails} />
      ) : (
        <>
          {/* Video Information */}
          <HorizonVidInfor
            opened={opened}
            setOpened={setOpened}
            videoDetails={videoDetails}
            refetchVideo={refetchVideo}
          />

          {/* Description & Comment */}
          <HorizonDesCmt
            opened={opened}
            setOpened={setOpened}
            totalCmt={videoDetails?.totalCmt}
            videoDetails={videoDetails}
            firstCmt={cmtList[0]}
          />
        </>
      )}
    </div>
  );
};
export default HorizonDescSection;
