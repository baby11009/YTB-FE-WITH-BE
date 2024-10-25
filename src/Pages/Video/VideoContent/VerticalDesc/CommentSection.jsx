import { SortIcon } from "../../../../Assets/Icons";
import { CustomeFuncBox, CommentInput, Comment } from "../../../../Component";
import { useState, useRef, useEffect } from "react";
import { MyChannel } from "../../../../Assets/Images";
import { formatNumber } from "../../../../util/numberFormat";

const CommentSection = ({
  refetchVideo,
  cmtData,
  totalCmt,
  cmtParams,
  videoUserId,
  videoId,
  refetchCmtList,
  setAddNewCmt,
  setCmtParams,
}) => {
  const [opened, setOpened] = useState(false);

  const containerRef = useRef();

  const funcList = [
    {
      id: "mới nhất",
      text: "Mới nhất xếp trước",
      handleOnClick: (data) => {
        if (cmtParams?.createdAt !== data.id) {
          setCmtParams((prev) => ({ ...prev, page: 1, createdAt: data.id }));
        }
      },
    },
    {
      id: "cũ nhất",
      text: "Cũ nhất xếp trước",
      handleOnClick: (data) => {
        if (cmtParams?.createdAt !== data.id) {
          setCmtParams((prev) => ({ ...prev, page: 1, createdAt: data.id }));
        }
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
    <div>
      {/* Header */}
      <div className='my-[24px]'>
        <div className='text-[16px] leading-[22px] flex items-center gap-[32px] mb-[12px]'>
          <div>Bình luận {formatNumber(totalCmt)}</div>
          <div
            className='relative cursor-pointer'
            title='Sắp xếp bình luận'
            onClick={(e) => {
              setOpened((prev) => !prev);
              e.stopPropagation();
            }}
            ref={containerRef}
          >
            <div className='flex items-center gap-[8px]'>
              <SortIcon />
              <span className='font-bold'>Sắp xếp theo</span>
            </div>
            {opened && (
              <CustomeFuncBox
                style={"w-[156px] left-0 top-[150%]"}
                setOpened={setOpened}
                funcList1={funcList}
                currentId={cmtParams.createdAt}
              />
            )}
          </div>
        </div>
        <CommentInput
          refetchVideo={refetchVideo}
          myChannelImg={MyChannel}
          showEmoji={true}
          videoId={videoId}
          refetchCmtList={refetchCmtList}
          setAddNewCmt={setAddNewCmt}
          setCmtParams={setCmtParams}
        />
      </div>
      {/* Cmt List */}
      <div>
        {cmtData?.map((item, id) => (
          <Comment
            key={id}
            refetchVideo={refetchVideo}
            data={item}
            videoUserId={videoUserId}
            videoId={videoId}
            refetchCmtList={refetchCmtList}
            setAddNewCmt={setAddNewCmt}
            setCmtParams={setCmtParams}
          />
        ))}
      </div>
    </div>
  );
};
export default CommentSection;
