import { SortIcon, CloseIcon } from "../../../../Assets/Icons";
import { Comment, CommentInput, CustomeFuncBox } from "../../../../Component";
import { MyChannel } from "../../../../Assets/Images";
import { useRef, useState, useEffect } from "react";
import { formatNumber } from "../../../../util/numberFormat";

const CommentBox = ({
  setOpened,
  boxRef,
  cmtData,
  totalCmt,
  videoId,
  videoUserId,
  refetchCmtList,
  cmtParams,
  setCmtParams,
  setAddNewCmt,
}) => {
  const [openedSort, setOpenedSort] = useState(false);

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
                currentId={cmtParams.createdAt}
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
        ref={boxRef}
      >
        {cmtData?.map((item, id) => (
          <Comment
            key={id}
            verify={true}
            owner={true}
            reply={true}
            data={item}
            videoUserId={videoUserId}
            videoId={videoId}
            refetchCmtList={refetchCmtList}
            setCmtParams={setCmtParams}
            setAddNewCmt={setAddNewCmt}
          />
        ))}
      </div>
      <div className='p-[16px] border-t-[1px] border-[rgba(255,255,255,0.2)]'>
        <CommentInput
          myChannelImg={MyChannel}
          videoId={videoId}
          refetchCmtList={refetchCmtList}
          setAddNewCmt={setAddNewCmt}
          setCmtParams={setCmtParams}
        />
      </div>
    </div>
  );
};
export default CommentBox;
