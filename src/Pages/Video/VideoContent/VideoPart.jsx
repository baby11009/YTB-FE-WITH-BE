import VideoSection from "./VideoSection/VideoSection";
import DescSection from "./VerticalDesc/DescSection";
import OtherSection from "./OtherSection/OtherSection";
import HorizonDescSection from "./HorizonDesc/HorizonDescSection";
import { useState, useEffect, useRef } from "react";
import { IsEnd } from "../../../util/scrollPosition";
import { useParams } from "react-router-dom";
import { getData } from "../../../Api/getData";
import { useAuthContext } from "../../../Auth Provider/authContext";
import { useQueryClient } from "@tanstack/react-query";
import { scrollToTop } from "../../../util/scrollCustom";
import connectSocket from "../../../util/connectSocket";

const initVideoParams = {
  page: 1,
  limit: 12,
  createdAt: "mới nhất",
  prevPlCount: 0,
};

const VideoPart = ({ openedMenu }) => {
  const queryClient = useQueryClient();

  const { id } = useParams();

  const { user } = useAuthContext();

  const [addNew, setAddNew] = useState(true);

  const [cmtParams, setCmtParams] = useState({
    limit: 8,
    page: 1,
    sort: {
      top: -1,
    },
    reset: user?._id,
    clearCache: "comment",
  });

  const [cmtAddNew, setCmtAddNew] = useState(false);

  const [cmtBoxIsEnd, setCmtBoxIsEnd] = useState(false);

  const [videoParams, setVideoParams] = useState(initVideoParams);

  const [videoList, setVideoList] = useState([]);

  const [cmtList, setCmtList] = useState([]);

  const [isEnd, setIsEnd] = useState(false);

  const [opened, setOpened] = useState("");

  const [replyCmtModified, setReplyCmtModified] = useState(null);

  const cmtIdListSet = useRef(new Set());

  const infoBoxRef = useRef();

  const { data: videoDetails, refetch } = getData(
    `/data/video/${id}`,
    {
      subscriberId: user?._id,
    },
    true,
    true
  );

  const { data: videoData } = getData(`/data/all`, videoParams, true, false);

  const { data: cmtData, refetch: refetchCmt } = getData(
    `/data/comment/video-cmt/${id}`,
    cmtParams,
    true,
    false
  );

  useEffect(() => {
    if (videoData) {
      if (addNew) {
        setVideoList(videoData?.data);
      } else {
        setVideoList((prev) => [...prev, ...videoData?.data]);
      }
    }
  }, [videoData]);

  useEffect(() => {
    if (cmtData) {
      if (cmtAddNew) {
        cmtIdListSet.current.clear();
        setCmtList(cmtData?.data);
        cmtData?.data.forEach((item) => cmtIdListSet.current.add(item._id));
        setCmtAddNew(false);
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
    if (isEnd && videoParams.limit === videoData?.data?.length) {
      setVideoParams((prev) => ({
        ...prev,
        page: prev.page + 1,
        prevPlCount: videoList.filter((data) => data.video_list).length,
      }));
      setAddNew(!isEnd);
    }
  }, [isEnd]);

  useEffect(() => {
    if (cmtBoxIsEnd && cmtParams.page < cmtData?.totalPage) {
      setCmtParams((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  }, [cmtBoxIsEnd]);

  useEffect(() => {
    if (cmtList.length < 4 && cmtParams.page < cmtData?.totalPage) {
      if (cmtParams.page === 1) {
        refetchCmt();
      } else {
        setCmtParams((prev) => ({ ...prev, page: 1 }));
      }
    }
  }, [cmtList]);

  useEffect(() => {
    refetch();
    setVideoParams(initVideoParams);
    setCmtParams({
      limit: 8,
      page: 1,
      sort: {
        top: -1,
      },
      userId: user?._id,
      clearCache: "comment",
    });
    refetchCmt();
    setCmtAddNew(true);
    cmtIdListSet.current.clear();
    scrollToTop();
    const boxCmt = document.getElementById("cmtBox");
    boxCmt.scrollTop = 0;
  }, [id]);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      IsEnd(setIsEnd);
    });

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
      window.removeEventListener("scroll", () => {
        IsEnd(setIsEnd);
      });

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
    <div className='flex xl:px-[1.75%] 2xl:px-[2.5%] 3xl:px-[3%] 4xl:px-[3.5%] 5xl:px-[10%]'>
      <div className='flex-1 pl-[16px] pr-[8px] w-full'>
        {/* Video section */}
        <VideoSection url={videoDetails?.data?.video} />
        {/* Other content section */}
        <HorizonDescSection
          refetchVideo={refetch}
          videoDetails={videoDetails?.data}
          cmtList={cmtList}
          setCmtBoxIsEnd={setCmtBoxIsEnd}
          cmtParams={cmtParams}
          setCmtParams={setCmtParams}
          opened={opened}
          setCmtAddNew={setCmtAddNew}
          setOpened={setOpened}
          replyCmtModified={replyCmtModified}
        />
        <OtherSection openedMenu={openedMenu} vidList={videoList} />
      </div>
      {/*  */}

      <div className='hidden w-[410px] xl:w-[480px] min-h-screen-w-minus-74 lg:block ml-[8px] '></div>
      <div
        className='hidden lg:inline-block fixed right-0 xl:right-[1.75%] 
          2xl:right-[2.5%] 3xl:right-[3%] 4xl:right-[3.5%] 5xl:right-[10%] top-[56px] ml-[8px]'
      >
        <DescSection
          videoDetails={videoDetails?.data}
          cmtList={cmtList}
          totalCmt={videoDetails?.data?.totalCmt}
          refetch={refetch}
          boxRef={infoBoxRef}
          cmtParams={cmtParams}
          setCmtParams={setCmtParams}
          setCmtBoxIsEnd={setCmtBoxIsEnd}
          setCmtAddNew={setCmtAddNew}
          replyCmtModified={replyCmtModified}
        />
      </div>
    </div>
  );
};
export default VideoPart;
