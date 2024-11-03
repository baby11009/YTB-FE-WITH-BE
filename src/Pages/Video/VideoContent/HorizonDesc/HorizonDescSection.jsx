import HorizonVidInfor from "./HorizonVidInfor";
import HorizonDesCmt from "./HorizonDesCmt";
import CommentBox from "./CommentBox";
import DetailsBox from "./DetailsBox";

const HorizonDescSection = ({
  videoData,
  cmtData,
  totalCmt,
  boxRef,
  refetch,
  refetchCmtList,
  setAddNewCmt,
  cmtParams,
  setCmtParams,
  opened,
  setOpened,
}) => {
  return (
    <div className='lg:hidden mt-[12px] mb-[24px]'>
      {opened === "cmt" ? (
        <CommentBox
          setOpened={setOpened}
          cmtData={cmtData}
          totalCmt={totalCmt}
          videoUserId={videoData?.channel_info._id}
          videoId={videoData?._id}
          refetchCmtList={refetchCmtList}
          cmtParams={cmtParams}
          setCmtParams={setCmtParams}
          setAddNewCmt={setAddNewCmt}
          boxRef={boxRef}
        />
      ) : opened === "detail" ? (
        <DetailsBox setOpened={setOpened} data={videoData} />
      ) : (
        <>
          {/* Video Information */}

          <HorizonVidInfor
            opened={opened}
            setOpened={setOpened}
            videoData={videoData}
            refetch={refetch}
          />

          {/* Description & Comment */}
          <HorizonDesCmt
            opened={opened}
            setOpened={setOpened}
            totalCmt={totalCmt}
            videoData={videoData}
            firstCmt={cmtData[0]}
          />
        </>
      )}
    </div>
  );
};
export default HorizonDescSection;
