import { motion } from "framer-motion";
import { Comment, CommentInput, CustomeFuncBox } from "../../../Component";
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
    clearCache: "comment",
  });

  const [isEnd, setIsEnd] = useState(false);

  const [commentList, setCommentList] = useState([]);

  const [addNew, setAddNew] = useState(false);

  const idListSet = useRef(new Set());

  const [sortOpened, setSortOpened] = useState(false);

  const [replyCmtModified, setReplyCmtModified] = useState(null);

  const { data } = getData(
    `/data/comment/video-cmt/${shortId}`,
    params,
    true,
    false
  );

  const handleChoseSort = (data) => {
    if (!params.sort[data.id]) {
      const boxCmt = document.getElementById("cmtBox");
      boxCmt.scrollTop = 0;
      setParams((prev) => ({ ...prev, page: 1, sort: { [data.id]: -1 } }));
      setAddNew(true);
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

  const refscroll = useCallback((e) => {
    if (e) {
      e.addEventListener("scroll", (e) => {
        IsElementEnd(setIsEnd, e);
      });
    }
  }, []);

  useEffect(() => {
    if (data) {
      if (addNew) {
        idListSet.current.clear();
        setCommentList(data?.data);
        data?.data?.forEach((item) => idListSet.current.add(item?._id));
        setAddNew(false);
      } else {
        let addlist = [];
        data?.data?.forEach((item) => {
          if (idListSet.current.has(item?._id)) {
            return;
          }
          addlist.push(item);
          idListSet.current.add(item?._id);
        });
        setCommentList((prev) => [...prev, ...addlist]);
      }
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

    const addNewCmt = (data) => {
      if (data) {
        setCommentList((prev) => [data, ...prev]);
        idListSet.current.add(data?._id);
      }
    };

    const deleteCmt = (data) => {
      if (data) {
        setCommentList((prev) => prev.filter((item) => item?._id !== data._id));
        idListSet.current.delete(data?._id);
      }
    };
    const modifiedReply = (data, action) => {
      setReplyCmtModified({ data: data, action });
    };
    if (socket) {
      socket.on(`update-parent-comment-${user?._id}`, updateComment);
      socket.on(`update-comment-${user?._id}`, updateComment);
      socket.on(`create-comment-${user?._id}`, addNewCmt);
      socket.on(`delete-comment-${user?._id}`, deleteCmt);
      socket.on(`create-reply-comment-${user?._id}`, (data) => {
        modifiedReply(data, "create");
      });
      socket.on(`update-reply-comment-${user?._id}`, (data) => {
        modifiedReply(data, "update");
      });
      socket.on(`delete-reply-comment-${user?._id}`, (data) => {
        modifiedReply(data, "delete");
      });
    }
    return () => {
      if (socket) {
        socket.off(`update-parent-comment-${user?._id}`, updateComment);
        socket.off(`update-comment-${user?._id}`, updateComment);
        socket.off(`create-comment-${user?._id}`, addNewCmt);
        socket.off(`delete-comment-${user?._id}`, deleteCmt);
        socket.off(`create-reply-comment-${user?._id}`, (data) => {
          modifiedReply(data, "create");
        });
        socket.off(`update-reply-comment-${user?._id}`, (data) => {
          modifiedReply(data, "update");
        });
        socket.off(`delete-reply-comment-${user?._id}`, (data) => {
          modifiedReply(data, "delete");
        });
      }
      queryClient.removeQueries("comment");
    };
  }, []);

  useEffect(() => {
    if (isEnd && params.page < data?.totalPage) {
      setParams((prev) => ({
        ...prev,
        page: Math.floor(commentList.length / prev.limit) + 1,
      }));
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
              <button
                className='w-[40px] h-[40px] flex items-center justify-center rounded-[50%] 
              hover:bg-[rgba(255,255,255,0.2)] relative'
                onClick={() => {
                  setSortOpened((prev) => !prev);
                }}
              >
                <div>
                  <SortIcon />
                </div>
                {sortOpened && (
                  <CustomeFuncBox
                    style={"w-[156px] right-0 top-[100%]"}
                    setOpened={setSortOpened}
                    funcList1={funcList}
                    currentId={Object.keys(params.sort)[0]}
                  />
                )}
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
            id='cmtBox'
          >
            {commentList.map((item, id) => (
              <Comment
                data={item}
                videoId={shortId}
                videoUserId={data?.channel_info?._id}
                setAddNewCmt={setAddNew}
                refetchVideo={handleRefetch}
                key={item?._id}
                replyCmtModified={replyCmtModified}
              />
            ))}
          </div>
          <div className='p-[16px] border-t-[1px] border-[rgba(255,255,255,0.2)]'>
            <CommentInput
              videoId={shortId}
              setAddNewCmt={setAddNew}
              setCmtParams={setParams}
              refetchVideo={handleRefetch}
            />
          </div>
        </>
      )}
    </motion.div>
  );
};
export default CommentBox;
