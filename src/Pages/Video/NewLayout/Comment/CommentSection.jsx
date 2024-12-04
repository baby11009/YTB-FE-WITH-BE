import { formatNumber } from "../../../../util/numberFormat";
import { CloseIcon, SortIcon } from "../../../../Assets/Icons";
import { useState, useCallback, useRef, useEffect } from "react";
import { getMousePosition } from "../../../../util/mouse";
import { CustomeFuncBox, CommentInput, Comment } from "../../../../Component";
import { getData } from "../../../../Api/getData";
import { useAuthContext } from "../../../../Auth Provider/authContext";
import connectSocket from "../../../../util/connectSocket";

const CommentSection = ({ videoId, videoUserId, totalCmt, refetch, isEnd }) => {
  const [isInViewPort, SetIsInViewPort] = useState(false);

  const { user } = useAuthContext();

  const [addNew, setAddNew] = useState(true);

  const [commentQuery, setCommentQuery] = useState({
    limit: 8,
    page: 1,
    sort: {
      top: -1,
    },
    reset: user?._id,
    clearCache: "comment",
  });

  const {
    data: cmtData,
    refetch: refetchCmt,
    isSuccess,
    isLoading,
  } = getData(
    `/data/comment/video-cmt/${videoId}`,
    commentQuery,
    videoId && isInViewPort ? true : false,
    false
  );

  const [replyCmtModified, setReplyCmtModified] = useState(null);

  const [cmtList, setCmtList] = useState([]);

  const [opened, setOpened] = useState(false);

  const containerRef = useRef();

  const cmtIdListSet = useRef(new Set());

  const sortBtn = useRef();

  const handleChoseSort = (data) => {
    if (!commentQuery.sort[data.id]) {
      setAddNew(true);
      setCommentQuery((prev) => ({
        ...prev,
        page: 1,
        sort: { [data.id]: -1 },
      }));
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
    if (cmtData) {
      if (addNew) {
        cmtIdListSet.current.clear();
        setCmtList(cmtData?.data);
        cmtData?.data.forEach((item) => cmtIdListSet.current.add(item._id));
        setAddNew(false);
      } else {
        let addlist = [];
        cmtData?.data?.forEach((item) => {
          if (cmtIdListSet.current.has(item?._id)) {
            return;
          }

          addlist.push(item);
          cmtIdListSet.current.add(item?._id);
        });
        setCmtList((prev) => [...prev, ...addlist]);
      }
    }
  }, [cmtData]);

  useEffect(() => {
    if (isEnd && commentQuery.page < cmtData?.totalPage) {
      setCommentQuery((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  }, [isEnd]);

  useEffect(() => {
    const handleScroll = () => {
      const { top, bottom } = containerRef.current.getBoundingClientRect();
      if (top < window.innerHeight && bottom > 0) {
        SetIsInViewPort(true);
      } else {
        SetIsInViewPort(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const socket = connectSocket();

    const updateComment = (data) => {
      if (data) {
        setCmtList((prev) => {
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
        setCmtList((prev) => [data, ...prev]);
        cmtIdListSet.current.add(data._id);
      }
    };

    const deleteCmt = (data) => {
      if (data) {
        setCmtList((prev) => prev.filter((item) => item?._id !== data._id));
        cmtIdListSet.current.delete(data._id);
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
      // Clear socket when unmount
      if (socket && !socket?.connected) {
        socket.off();
      } else if (socket && socket?.connected) {
        socket.disconnect();
      }

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
    };
  }, []);

  return (
    <div ref={containerRef}>
      <div className='mt-[24px] mb-[32px]'>
        <div className='mb-[24px] flex items-center'>
          <strong className='text-[20px] leading-[28px] mr-[32px]'>
            {formatNumber(totalCmt)} Comments
          </strong>
          <div className='relative'>
            <button
              className='flex items-center ripple'
              title='Sort comments'
              ref={sortBtn}
              onMouseUp={(e) => {
                e.stopPropagation();
                setOpened((prev) => !prev);
                sortBtn.current.style.setProperty("--scale", 0);
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                getMousePosition(e, sortBtn.current);
              }}
            >
              <div className='mr-[8px]'>
                <SortIcon />
              </div>
              <span className='text-[14px] leading-[22px] font-[500]'>
                Sort by
              </span>
            </button>
            {opened && (
              <CustomeFuncBox
                style={"w-[156px] left-0 top-[100%]"}
                setOpened={setOpened}
                funcList1={funcList}
                currentId={Object.keys(commentQuery.sort)[0]}
              />
            )}
          </div>
        </div>
        <CommentInput
          imgSize={"size-[40px]"}
          videoId={videoId}
          setAddNewCmt={setAddNew}
          setCmtParams={setCommentQuery}
          refetchVideo={refetch}
        />
      </div>
      {cmtList.length > 0 &&
        cmtList.map((item) => (
          <Comment
            key={item?._id}
            refetchVideo={refetch}
            data={item}
            videoUserId={videoUserId}
            videoId={videoId}
            setCmtParams={setCommentQuery}
            replyCmtModified={replyCmtModified}
          />
        ))}

      {isLoading && (
        <div className='flex items-center justify-center'>
          <div
            className='size-[32px] rounded-[50%] border-[2px] border-l-transparent
             border-b-transparent animate-spin border-gray-A'
          ></div>
        </div>
      )}
    </div>
  );
};
export default CommentSection;
