import { motion } from "framer-motion";
import { Comment, CommentInput } from "../../../Component";
import { CloseIcon, SortIcon } from "../../../Assets/Icons";
import { getData } from "../../../Api/getData";
import { useState, useLayoutEffect, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { IsElementEnd } from "../../../util/scrollPosition";
import { formatNumber } from "../../../util/numberFormat";

const CommentBox = ({ handleCloseCmt, showedContent, shortId }) => {
  const queryClient = useQueryClient();

  const [params, setParams] = useState({
    limit: 8,
    page: 1,
    sort: {
      createdAt: -1,
    },

    reset: shortId,
  });
  console.log("🚀 ~ params:", params);

  const { data, isLoading, refetch, isSuccess } = getData(
    `/data/comment/video-cmt/${shortId}`,
    params,
    true,
    false
  );

  const [isEnd, setIsEnd] = useState(false);

  const [commentList, setCommentList] = useState([]);

  const [addNew, setAddNew] = useState(true);

  const scrollRef = useRef();

  useLayoutEffect(() => {
    if (isSuccess) {
      if (addNew) {
        setCommentList(data?.data);
      } else {
        setCommentList((prev) => [...prev, ...data?.data]);
      }
    }
  }, [isSuccess, addNew]);

  useEffect(() => {
    return () => {
      queryClient.removeQueries(shortId);
    };
  }, []);

  useEffect(() => {
    const element = scrollRef.current;

    if (element) {
      element.addEventListener("scroll", (e) => {
        IsElementEnd(setIsEnd, e);
      });
    }
    return () => {
      if (element) {
        element.removeEventListener("scroll", (e) => {
          IsElementEnd(setIsEnd, e);
        });
      }
    };
  }, [scrollRef.current]);
  useEffect(() => {
    if (isEnd && params.page < data.totalPage) {
      setParams((prev) => ({ ...prev, page: prev.page + 1 }));
      setAddNew(!isEnd);
    }
  }, [isEnd]);

  return (
    <motion.div
      className='w-[450px]  h-screen-h-minus-128 min-h-[616px] 
   rounded-r-[12px] flex flex-col cursor-auto'
      initial={{
        width: 0,
      }}
      animate={{
        width: "450px",
        background: "#000000",
      }}
      exit={{
        width: 0,
        background: "#1c1b1b",
      }}
      transition={{
        duration: 0.3,
      }}
    >
      {showedContent && (
        <>
          <div className='px-[16px] py-[4px] flex items-center justify-between '>
            <div className='my-[10px] flex items-center gap-[8px]'>
              <h4 className='text-[20px] leading-[28px] font-bold'>Comment</h4>
              <span className=' text-gray-A'>
                {formatNumber(data?.totalQtt)}
              </span>
            </div>
            <div className='flex gap-[8px]'>
              <button className='w-[40px] h-[40px] flex items-center justify-center'>
                <SortIcon />
              </button>
              <button
                className='w-[40px] h-[40px] rounded-[50%] hover:bg-[rgba(255,255,255,0.2)]
                    flex items-center justify-center'
                onClick={() => handleCloseCmt()}
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          {/* Comment list */}
          <div
            className='px-[16px] flex-1 overflow-y-auto menu-scrollbar overscroll-contain'
            ref={scrollRef}
          >
            {commentList.map((item, id) => (
              <Comment
                data={item}
                videoId={shortId}
                videoUserId={data?.channel_info?._id}
                setAddNewCmt={setAddNew}
                setCmtParams={setParams}
                refetchCmtList={refetch}
                key={id}
              />
            ))}
          </div>
          <div className='p-[16px] border-t-[1px] border-[rgba(255,255,255,0.2)]'>
            <CommentInput
              myChannelImg={data?.channel_info?.avatar}
              videoId={shortId}
              refetchCmtList={refetch}
              setAddNewCmt={setAddNew}
              setCmtParams={setParams}
            />
          </div>
        </>
      )}
    </motion.div>
  );
};
export default CommentBox;
