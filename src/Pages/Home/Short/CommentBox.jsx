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
  shortData,
  openedSideMenu,
  handleClose,
  handleUpdateShortData,
  socket,
}) => {
  const { user } = useAuthContext();

  const queryClient = useQueryClient();

  const [queriese, setQueriese] = useState({
    limit: 8,
    page: 1,
    sort: {
      createdAt: -1,
    },
    reset: shortData._id,
    clearCache: "comment",
  });

  const [isEnd, setIsEnd] = useState(false);

  const [commentList, setCommentList] = useState([]);

  const [addNew, setAddNew] = useState(false);

  const idListSet = useRef(new Set());

  const [sortOpened, setSortOpened] = useState(false);

  const [replyCmtModified, setReplyCmtModified] = useState(null);

  const { data } = getData(
    `/data/comment/video-cmt/${shortData._id}`,
    queriese,
    openedSideMenu ? true : false,
    false,
  );

  const handleChoseSort = (data) => {
    if (!queriese.sort[data.id]) {
      const boxCmt = document.getElementById("cmtBox");
      boxCmt.scrollTop = 0;
      setQueriese((prev) => ({ ...prev, page: 1, sort: { [data.id]: -1 } }));
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
      id: "interact",
      text: "Top comments",
      handleOnClick: handleChoseSort,
    },
  ];

  const refscroll = useCallback((e) => {
    if (e) {
      e.addEventListener("scroll", (e) => {
        IsElementEnd(setIsEnd, e);
      });
      e.addEventListener("wheel", (e) => {
        e.stopPropagation();
      });
    }
  }, []);

  useLayoutEffect(() => {
    setQueriese({
      limit: 8,
      page: 1,
      sort: {
        createdAt: -1,
      },
      reset: shortData._id,
      clearCache: "comment",
    });
    setAddNew(true);
  }, [shortData._id]);

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
    const modifiedReply = (data, action) => {
      setReplyCmtModified({ data: data, action });
    };

    const addNewCmt = ({ type, data }) => {
      handleUpdateShortData({
        totalCmt: shortData.totalCmt + 1,
      });

      if (type === "NORMAL") {
        setCommentList((prev) => [data, ...prev]);
        idListSet.current.add(data?._id);

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
      handleUpdateShortData({
        totalCmt: shortData.totalCmt - (1 + data.replied_cmt_total || 0),
      });

      if (type === "NORMAL") {
        setCommentList((prev) => prev.filter((item) => item?._id !== data._id));
        idListSet.current.delete(data?._id);
        handleUpdateShortData({
          totalCmt: shortData.totalCmt - (1 + data.replied_cmt_total || 0),
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
      handleUpdateShortData({
        totalCmt: shortData.totalCmt - 1,
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
  }, [shortData]);

  useEffect(() => {
    if (isEnd && queriese.page < data?.totalPage) {
      setQueriese((prev) => ({
        ...prev,
        page: Math.floor(commentList.length / prev.limit) + 1,
      }));
    }
  }, [isEnd]);

  useEffect(() => {
    return () => {
      queryClient.removeQueries("comment");
    };
  }, []);
  return (
    <div
      className='size-full flex flex-col cursor-auto bg-black-21 1156:bg-transparent 
    1156:border-[1px] 1156:border-black-0.2 rounded-[12px]'
    >
      <div className='px-[16px] py-[4px] flex items-center justify-between '>
        <div className='my-[10px] flex items-center gap-[8px]'>
          <h4 className='text-[20px] leading-[28px] font-bold'>Comment</h4>
          <span className=' text-gray-A'>{shortData.totalCmt}</span>
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
                currentId={Object.keys(queriese.sort)[0]}
              />
            )}
          </button>
          <button
            className='w-[40px] h-[40px] rounded-[50%] hover:bg-[rgba(255,255,255,0.2)]
                    flex items-center justify-center'
            onClick={() => handleClose()}
          >
            <div className='w-[24px]'>
              <CloseIcon />
            </div>
          </button>
        </div>
      </div>

      {/* Comment list */}
      <div
        className='px-[16px] flex-1 overflow-y-auto menu-scrollbar overscroll-contain'
        ref={refscroll}
        id='cmtBox'
      >
        {commentList.map((item) => (
          <Comment
            key={item?._id}
            data={item}
            videoId={shortData._id}
            videoUserId={data?.channel_info?._id}
            setAddNewCmt={setAddNew}
            replyCmtModified={
              replyCmtModified &&
              replyCmtModified.data.replied_parent_cmt_id === item._id
                ? replyCmtModified
                : undefined
            }
          />
        ))}
      </div>
      <div className='p-[16px] border-t-[1px] border-[rgba(255,255,255,0.2)]'>
        <CommentInput
          videoId={shortData._id}
          setAddNewCmt={setAddNew}
          setCmtParams={setQueriese}
        />
      </div>
    </div>
  );
};
export default CommentBox;
