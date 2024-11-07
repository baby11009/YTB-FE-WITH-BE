import VideoSection from "./VideoSection/VideoSection";
import DescSection from "./VerticalDesc/DescSection";
import OtherSection from "./OtherSection/OtherSection";
import HorizonDescSection from "./HorizonDesc/HorizonDescSection";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { IsEnd, IsElementEnd } from "../../../util/scrollPosition";
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
      createdAt: -1,
    },
    reset: user?._id,
  });

  const [videoParams, setVideoParams] = useState(initVideoParams);

  const [videoDatas, setVideoDatas] = useState([]);

  const [cmtDatas, setCmtDatas] = useState([]);

  const [isEnd, setIsEnd] = useState(false);

  const [isBoxEnd, setIsBoxEnd] = useState(false);

  const [opened, setOpened] = useState("");

  const cmtIdListSet = useRef(new Set());

  const infoBoxRef = useRef();

  const cmtBoxRef = useRef();

  const { data: videoData, refetch } = getData(
    `/data/video/${id}`,
    {
      subscriberId: user?._id,
    },
    true,
    true
  );

  const { data: videosList, isSuccess } = getData(
    `/data/all`,
    videoParams,
    true,
    true
  );

  const { data: cmtList, refetch: refetchCmtList } = getData(
    `/data/comment/video-cmt/${id}`,
    cmtParams,
    true,
    true
  );

  useEffect(() => {
    if (isEnd && videoParams.limit === videosList?.data?.length) {
      setVideoParams((prev) => ({
        ...prev,
        page: prev.page + 1,
        prevPlCount: videoDatas.filter((data) => data.video_list).length,
      }));
      setAddNew(!isEnd);
    }
  }, [isEnd]);

  useEffect(() => {
    if (isBoxEnd && cmtParams.page < cmtList.totalPage) {
      setCmtParams((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  }, [isBoxEnd]);

  useEffect(() => {
    if (isSuccess) {
      if (addNew) {
        setVideoDatas(videosList?.data);
      } else {
        setVideoDatas((prev) => [...prev, ...videosList?.data]);
      }
    }
  }, [isSuccess, videosList]);

  useEffect(() => {
    if (cmtList) {
      let addlist = [];
      cmtList?.data?.forEach((item) => {
        if (cmtIdListSet.current.has(item?._id)) {
          return;
        }
        addlist.push(item);
        cmtIdListSet.current.add(item?._id);
      });
      setCmtDatas((prev) => {
        if (cmtParams.page === 1) {
          return [...addlist, ...prev];
        } else {
          return [...prev, ...addlist];
        }
      });
    }
  }, [cmtList]);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      IsEnd(setIsEnd);
    });

    const element = infoBoxRef.current;
    if (element) {
      element.addEventListener("scroll", (e) => {
        IsElementEnd(setIsBoxEnd, e);
      });
    }

    const socket = connectSocket();
    const updateComment = (data) => {
      if (data) {
        setCmtDatas((prev) => {
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
      socket.on("update-parent-comment", updateComment);
    }

    return () => {
      // Clear socket when unmount
      if (!socket.connected) {
        socket.off();
      }
      if (socket.connected) {
        socket.disconnect();
      }
      if (socket) {
        socket.off("update-parent-comment", updateComment);
      }
      queryClient.clear();

      window.removeEventListener("scroll", () => {
        IsEnd(setIsEnd);
      });
      if (element) {
        element.removeEventListener("scroll", (e) => {
          IsElementEnd(setIsBoxEnd, e);
        });
      }
    };
  }, []);

  useEffect(() => {
    const element = cmtBoxRef.current;

    if (element) {
      element.addEventListener("scroll", (e) => {
        IsElementEnd(setIsBoxEnd, e);
      });
    }

    return () => {
      if (element) {
        element.removeEventListener("scroll", (e) => {
          IsElementEnd(setIsBoxEnd, e);
        });
      }
    };
  }, [cmtBoxRef, opened]);

  useEffect(() => {
    refetch();
    setVideoParams(initVideoParams);
    setCmtParams({
      limit: 8,
      page: 1,
      sort: {
        createdAt: -1,
      },
      userId: user?._id,
    });
    refetchCmtList();
    scrollToTop();
  }, [id]);

  return (
    <div className='flex xl:px-[1.75%] 2xl:px-[2.5%] 3xl:px-[3%] 4xl:px-[3.5%] 5xl:px-[10%]'>
      <div className='flex-1 pl-[16px] pr-[8px] w-full'>
        {/* Video section */}
        <VideoSection url={videoData.data?.video} />
        {/* Other content section */}
        <HorizonDescSection
          sub={true}
          refetchVideo={refetch}
          videoData={videoData?.data}
          cmtData={cmtDatas}
          totalCmt={cmtList?.totalQtt}
          refetch={refetch}
          boxRef={cmtBoxRef}
          refetchCmtList={refetchCmtList}
          cmtParams={cmtParams}
          setCmtParams={setCmtParams}
          opened={opened}
          setOpened={setOpened}
        />
        <OtherSection openedMenu={openedMenu} vidList={videoDatas} />
      </div>
      {/*  */}

      <div className='hidden w-[410px] xl:w-[480px] min-h-screen-w-minus-74 lg:block ml-[8px] '></div>
      <div
        className='hidden lg:inline-block fixed right-0 xl:right-[1.75%] 
          2xl:right-[2.5%] 3xl:right-[3%] 4xl:right-[3.5%] 5xl:right-[10%] top-[56px] ml-[8px]'
      >
        <DescSection
          sub={true}
          videoData={videoData?.data}
          cmtData={cmtDatas}
          totalCmt={videoData?.data?.totalCmt}
          refetch={refetch}
          boxRef={infoBoxRef}
          refetchCmtList={refetchCmtList}
          cmtParams={cmtParams}
          setCmtParams={setCmtParams}
        />
      </div>
    </div>
  );
};
export default VideoPart;
