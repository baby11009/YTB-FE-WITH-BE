import { motion } from "framer-motion";
import { Comment, CommentInput } from "../../../Component";
import { CloseIcon, SortIcon } from "../../../Assets/Icons";
import { getData } from "../../../Api/getData";
import {
  useState,
  useLayoutEffect,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { IsElementEnd } from "../../../util/scrollPosition";
import { useAuthContext } from "../../../Auth Provider/authContext";

const CommentBox = ({
  handleCloseCmt,
  showedContent,
  shortId,
  handleRefetch,
  totalCmt,
  socket,
}) => {
  const { user } = useAuthContext();

  const queryClient = useQueryClient();

  const [params, setParams] = useState({
    limit: 8,
    page: 1,
    sort: {
      createdAt: -1,
    },
    reset: shortId,
  });

  const { data, refetch } = getData(
    `/data/comment/video-cmt/${shortId}`,
    params,
    true,
    false
  );

  const [isEnd, setIsEnd] = useState(false);

  const [commentList, setCommentList] = useState([]);

  const [addNew, setAddNew] = useState(true);

  const idListSet = useRef(new Set());

  const refscroll = useCallback((e) => {
    if (e) {
      e.addEventListener("scroll", (e) => {
        IsElementEnd(setIsEnd, e);
      });
    }
  }, []);

  useLayoutEffect(() => {
    if (data) {
      let addlist = [];
      data?.data?.forEach((item) => {
        if (idListSet.current.has(item?._id)) {
          return;
        }
        addlist.push(item);
        idListSet.current.add(item?._id);
      });
      setCommentList((prev) => {
        if (params.page === 1) {
          return [...addlist, ...prev];
        } else {
          return [...prev, ...addlist];
        }
      });
    }
  }, [data]);

  useEffect(() => {
    const updateComment = (data) => {
      if (data) {
        setCommentList((prev) => {
          const dataList = [...prev];
          dataList.forEach((item, id) => {
            if (item?._id === data?._id) {
              dataList[id] = { ...dataList[id], ...data };
            }
          });

          return dataList;
        });
      }
    };
    if (socket) {
      socket.on(`update-parent-comment-${user?._id}`, updateComment);
    }
    return () => {
      if (socket) {
        socket.off(`update-parent-comment-${user?._id}`, updateComment);
      }
      queryClient.removeQueries(shortId);
    };
  }, []);

  useEffect(() => {
    if (isEnd && params.page < data.totalPage) {
      setParams((prev) => ({
        ...prev,
        page: Math.floor(commentList.length / prev.limit) + 1,
      }));

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
              <span className=' text-gray-A'>{totalCmt}</span>
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
            ref={refscroll}
          >
            {commentList.map((item, id) => (
              <Comment
                data={item}
                videoId={shortId}
                videoUserId={data?.channel_info?._id}
                setAddNewCmt={setAddNew}
                setCmtParams={setParams}
                refetchVideo={handleRefetch}
                key={id}
              />
            ))}
          </div>
          <div className='p-[16px] border-t-[1px] border-[rgba(255,255,255,0.2)]'>
            <CommentInput
              myChannelImg={data?.channel_info?.avatar}
              videoId={shortId}
              setAddNewCmt={setAddNew}
              setCmtParams={setParams}
              refetchCmtList={() => {
                if (params.page !== 1) {
                  setParams((prev) => ({ ...prev, page: 1 }));
                } else {
                  refetch();
                }
              }}
              refetchVideo={handleRefetch}
            />
          </div>
        </>
      )}
    </motion.div>
  );
};
export default CommentBox;
