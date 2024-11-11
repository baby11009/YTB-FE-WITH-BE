import { SortIcon, CloseIcon } from "../../../../Assets/Icons";
import { Comment, CommentInput, CustomeFuncBox } from "../../../../Component";
import { MyChannel } from "../../../../Assets/Images";
import { useRef, useState, useCallback, useEffect } from "react";
import { formatNumber } from "../../../../util/numberFormat";
import { IsElementEnd } from "../../../../util/scrollPosition";
import { useQueryClient } from "@tanstack/react-query";

const CommentBox = ({
  setOpened,
  setCmtBoxIsEnd,
  cmtList,
  totalCmt,
  videoId,
  videoUserId,
  cmtParams,
  setCmtParams,
  setCmtAddNew,
  refetchVideo,
  replyCmtModified,
}) => {
  const queryClient = useQueryClient();

  const [openedSort, setOpenedSort] = useState(false);

  const containerRef = useRef();

  const handleChoseSort = (data) => {
    if (!cmtParams.sort[data.id]) {
      setCmtAddNew(true);
      const boxCmt = document.getElementById("cmtBox");
      boxCmt.scrollTop = 0;
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

  const scrollRef = useCallback((e) => {
    if (e) {
      e.addEventListener("scroll", (e) => {
        IsElementEnd(setCmtBoxIsEnd, e);
      });
    }
  }, []);

  return (
    <div className='bg-[#000] w-full h-[70vh] rounded-[12px] flex flex-col'>
      <div className='px-[16px] py-[4px] flex items-center justify-between '>
        <div className='my-[10px] flex items-center gap-[8px]'>
          <h4 className='text-[20px] leading-[28px] font-bold'>Bình luận</h4>
          <span className=' text-gray-A'>{formatNumber(totalCmt)}</span>
        </div>
        <div className='flex gap-[8px]'>
          <div
            className='relative cursor-pointer'
            title='Sắp xếp bình luận'
            onClick={(e) => {
              setOpenedSort((prev) => !prev);
              e.stopPropagation();
            }}
            ref={containerRef}
          >
            <div className='flex items-center justify-center gap-[8px] size-[40px] '>
              <SortIcon />
            </div>
            {openedSort && (
              <CustomeFuncBox
                style={"w-[156px] right-0 top-[100%]"}
                setOpened={setOpenedSort}
                funcList1={funcList}
                currentId={Object.keys(cmtParams.sort)[0]}
              />
            )}
          </div>
          <button
            className='w-[40px] h-[40px] rounded-[50%] hover:bg-[rgba(255,255,255,0.2)]
                      flex items-center justify-center'
            onClick={() => setOpened(false)}
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      <div
        className='px-[16px] flex-1 overflow-y-auto menu-scrollbar'
        ref={scrollRef}
        id='cmtBox'
      >
        {cmtList?.map((item, id) => (
          <Comment
            key={item?._id}
            refetchVideo={refetchVideo}
            data={item}
            videoUserId={videoUserId}
            videoId={videoId}
            setCmtParams={setCmtParams}
            replyCmtModified={replyCmtModified}
          />
        ))}
      </div>
      <div className='p-[16px] border-t-[1px] border-[rgba(255,255,255,0.2)]'>
        <CommentInput
          myChannelImg={MyChannel}
          videoId={videoId}
          setAddNewCmt={setCmtAddNew}
          setCmtParams={setCmtParams}
          refetchVideo={refetchVideo}
        />
      </div>
    </div>
  );
};
export default CommentBox;
