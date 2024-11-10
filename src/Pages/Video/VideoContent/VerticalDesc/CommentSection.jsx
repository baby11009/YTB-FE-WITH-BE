import { SortIcon } from "../../../../Assets/Icons";
import { CustomeFuncBox, CommentInput, Comment } from "../../../../Component";
import { useState, useRef, useEffect, useCallback } from "react";
import { MyChannel } from "../../../../Assets/Images";
import { formatNumber } from "../../../../util/numberFormat";
import { IsElementEnd } from "../../../../util/scrollPosition";
import { useQueryClient } from "@tanstack/react-query";

const CommentSection = ({
  refetchVideo,
  cmtList,
  totalCmt,
  cmtParams,
  videoUserId,
  videoId,
  setCmtAddNew,
  setCmtParams,
  setCmtBoxIsEnd,
  replyCmtModified,
}) => {
  const queryClient = useQueryClient();

  const [opened, setOpened] = useState(false);

  const containerRef = useRef();

  const handleChoseSort = (data) => {
    if (!cmtParams.sort[data.id]) {
      setCmtAddNew(true);
      const boxCmt = document.getElementById("cmtBox");
      boxCmt.scrollTop = 0;
      queryClient.invalidateQueries("comment");
      setCmtParams((prev) => ({ ...prev, page: 1, sort: { [data.id]: -1 } }));
    }
  };

  const funcList = [
    {
      id: "createdAt",
      text: "Newest first",
      handleOnClick: handleChoseSort,
    },
    {
      id: "top",
      text: "Top comments",
      handleOnClick: handleChoseSort,
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

  const scrollRef = useCallback((e) => {
    if (e) {
      e.addEventListener("scroll", (e) => {
        IsElementEnd(setCmtBoxIsEnd, e);
      });
    }
  }, []);

  return (
    <div className='flex flex-col overflow-hidden'>
      {/* Header */}
      <div className='my-[24px]'>
        <div className='text-[16px] leading-[22px] flex items-center justify-between gap-[32px] mb-[12px]'>
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
                style={"w-[156px] right-0 top-[150%]"}
                setOpened={setOpened}
                funcList1={funcList}
                currentId={Object.keys(cmtParams.sort)[0]}
              />
            )}
          </div>
        </div>
        <CommentInput
          refetchVideo={refetchVideo}
          myChannelImg={MyChannel}
          showEmoji={true}
          videoId={videoId}
          setCmtParams={setCmtParams}
        />
      </div>
      {/* Cmt List */}
      <div
        className='flex-1 overflow-y-auto overscroll-y-contain'
        ref={scrollRef}
        id='cmtBox'
      >
        {cmtList?.length > 0 &&
          cmtList?.map((item, id) => (
            <Comment
              key={id}
              refetchVideo={refetchVideo}
              data={item}
              videoUserId={videoUserId}
              videoId={videoId}
              setCmtParams={setCmtParams}
              replyCmtModified={
                item?._id === replyCmtModified?.data?.replied_cmt_id
                  ? replyCmtModified
                  : null
              }
            />
          ))}
      </div>
    </div>
  );
};
export default CommentSection;
