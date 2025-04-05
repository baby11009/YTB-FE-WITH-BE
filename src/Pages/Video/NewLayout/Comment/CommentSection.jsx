import { formatNumber } from "../../../../util/numberFormat";
import { SortIcon } from "../../../../Assets/Icons";
import { useState, useRef, useEffect } from "react";
import { getMousePosition } from "../../../../util/mouse";
import { CustomeFuncBox, CommentInput, Comment } from "../../../../Component";
import { getData } from "../../../../Api/getData";
import { useAuthContext } from "../../../../Auth Provider/authContext";

const CommentSection = ({ videoData, videoUserId, updateVideoData, isEnd }) => {
  const [isInViewPort, SetIsInViewPort] = useState(false);

  const { user, socket } = useAuthContext();

  const [addNew, setAddNew] = useState(true);

  const [commentQuery, setCommentQuery] = useState(undefined);

  const { data: cmtData, isLoading } = getData(
    `/data/comment/video-cmt/${videoData._id}`,
    commentQuery,
    videoData && isInViewPort && commentQuery ? true : false,
    false,
  );

  const [replyCmtModified, setReplyCmtModified] = useState(null);

  const [commentList, setCommentList] = useState([]);

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
      setCommentList([]);
    }
  };

  const funcList = [
    {
      id: "createdAt",
      text: "Newest first",
      handleOnClick: handleChoseSort,
    },
    {
      id: "interact",
      text: "Top comments",
      handleOnClick: handleChoseSort,
    },
  ];

  useEffect(() => {
    if (cmtData) {
      if (addNew) {
        cmtIdListSet.current.clear();
        setCommentList(cmtData?.data);
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
        setCommentList((prev) => [...prev, ...addlist]);
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
    if (videoData._id) {
      setCommentQuery({
        limit: 8,
        page: 1,
        sort: {
          top: -1,
        },
        reset: user?._id,
        clearCache: "comment",
      });
      setAddNew(true);
    }
  }, [videoData._id]);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { top } = containerRef.current.getBoundingClientRect();
        if (top < window.innerHeight) {
          SetIsInViewPort(true);
        } else {
          SetIsInViewPort(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const modifiedReply = (data, action) => {
      setReplyCmtModified({ data: data, action });
    };

    const addNewCmt = ({ type, data }) => {
      updateVideoData({
        totalCmt: videoData.totalCmt + 1,
      });

      if (type === "NORMAL") {
        setCommentList((prev) => [data, ...prev]);
        cmtIdListSet.current.add(data?._id);

        return;
      }

      setCommentList((prev) => {
        const dataList = [...prev];

        for (const index in dataList) {
          if (dataList[index]._id === data?.replied_parent_cmt_id) {
            dataList[index] = {
              ...dataList[index],
              replied_cmt_total: dataList[index].replied_cmt_total + 1,
            };
          }
          break;
        }

        return dataList;
      });
      modifiedReply(data, "CREATE");
    };

    const updateComment = ({ type, data }) => {
      if (type === "NORMAL") {
        setCommentList((prev) => {
          const listClone = [...prev];

          for (const index in listClone) {
            if (listClone[index]._id === data._id) {
              listClone[index] = { ...listClone[index], ...data };
              break;
            }
          }

          return listClone;
        });

        return;
      }

      modifiedReply(data, "UPDATE");
    };

    const deleteCmt = ({ type, data }) => {
      updateVideoData({
        totalCmt: videoData.totalCmt - (1 + data.replied_cmt_total || 0),
      });

      if (type === "NORMAL") {
        setCommentList((prev) => prev.filter((item) => item?._id !== data._id));
        cmtIdListSet.current.delete(data?._id);
        updateVideoData({
          totalCmt: videoData.totalCmt - (1 + data.replied_cmt_total || 0),
        });

        return;
      }

      setCommentList((prev) => {
        const listClone = [...prev];
        for (const index in listClone) {
          if (listClone[index]._id === data.replied_parent_cmt_id) {
            listClone[index] = {
              ...listClone[index],
              replied_cmt_total: listClone[index].replied_cmt_total - 1,
            };
            break;
          }
        }
        return listClone;
      });
      modifiedReply(data, "DELETE");
      updateVideoData({
        totalCmt: videoData.totalCmt - 1,
      });
    };

    const socketEvents = {
      [`create-comment-${user?._id}`]: addNewCmt,
      [`update-comment-${user?._id}`]: updateComment,
      [`delete-comment-${user?._id}`]: deleteCmt,
    };

    if (socket) {
      Object.entries(socketEvents).forEach(([key, value]) => {
        socket.on(key, value);
      });
    }

    return () => {
      if (socket) {
        Object.entries(socketEvents).forEach(([key, value]) => {
          socket.off(key, value);
        });
      }
    };
  }, [videoData]);

  return (
    <div ref={containerRef}>
      <div className='mt-[24px] mb-[32px]'>
        <div className='mb-[24px] flex items-center'>
          <strong className='text-[20px] leading-[28px] mr-[32px]'>
            {formatNumber(videoData.totalCmt)} Comments
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
          videoId={videoData._id}
          setAddNewCmt={setAddNew}
          setCmtParams={setCommentQuery}
        />
      </div>
      {commentList.length > 0 &&
        commentList.map((item) => (
          <Comment
            key={item?._id}
            data={item}
            videoUserId={videoUserId}
            videoId={videoData._id}
            replyCmtModified={
              replyCmtModified &&
              replyCmtModified.data.replied_parent_cmt_id === item._id
                ? replyCmtModified
                : undefined
            }
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
