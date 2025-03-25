import Display from "./Display";
import request from "../../../util/axios-base-url";
import { useEffect, useState, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../../Auth Provider/authContext";
import {
  DownloadIcon,
  AddWLIcon,
  ShareIcon,
  SaveIcon,
  TrashBinIcon,
} from "../../../Assets/Icons";
import { IsEnd } from "../../../util/scrollPosition";
import { PlaylistModal } from "../../../Component";
import { getData } from "../../../Api/getData";

const WatchLater = () => {
  const { setFetchingState, addToaster, setIsShowing } = useAuthContext();

  const queryClient = useQueryClient();

  const [queriese, setQueriese] = useState({
    videoPage: 1,
    videoLimit: 12,
    videoSearch: {},
  });

  const videoIdsset = useRef(new Set());

  const [addNew, setAddNew] = useState(true);

  const [videoList, setVideoList] = useState([]);

  const [playlistInfo, setPlaylistInfo] = useState(undefined);

  const [isEnd, setIsEnd] = useState(false);

  const {
    data: watchLaterData,
    isLoading,
    isSuccess,
    isError,
  } = getData("/user/playlist/watch_later", queriese, true, false);

  const handleSort = (type) => {
    if (queriese.videoSearch?.type == type) {
      return;
    }

    queryClient.removeQueries();

    let videoSearch = { type };
    if (!type) {
      videoSearch = {};
    }
    setQueriese((prev) => ({ ...prev, videoPage: 1, videoSearch }));
    setAddNew(true);
  };

  const handleChangePosition = async (from, to) => {
    try {
      await request
        .patch(`/user/playlist/${playlistInfo?._id}`, {
          move: {
            from: from._id,
            to: to._id,
          },
        })
        .then((rsp) => {
          setVideoList((prev) => {
            const videos = [...prev];
            const temp = videos[from.index];
            videos[from.index] = videos[to.index];
            videos[to.index] = temp;

            return videos;
          });
        });
    } catch (error) {
      alert("Failed to move position");
      throw error;
    }
  };

  const movePosition = async (buttonData, productData, index) => {
    if (buttonData.id === 2) {
      await handleChangePosition(
        {
          _id: productData._id,
          index: index,
        },
        {
          _id: productData.nextVideoId,
          index: index + 1,
        },
      );
    } else {
      await handleChangePosition(
        {
          _id: productData._id,
          index: index,
        },
        {
          _id: productData.prevVideoId,
          index: index - 1,
        },
      );
    }
  };

  const funcList1 = [
    {
      id: 1,
      text: "Add to queue",
      icon: <AddWLIcon />,
    },
    {
      id: 2,
      text: "Save to playlist",
      icon: <SaveIcon />,
      handleOnClick: (_, productData) => {
        setIsShowing(<PlaylistModal videoId={productData?._id} />);
      },
    },
    {
      id: 3,
      text: "Remove from watch later",
      icon: <TrashBinIcon />,
      handleOnClick: async (_, productData) => {
        await request
          .patch("/user/playlist/wl", {
            videoIdList: [productData?._id],
          })
          .then(() => {
            setVideoList((prev) => {
              return prev.filter((item) => item._id !== productData?._id);
            });
            addToaster("Remove from Watch later");
          })
          .catch((err) => {
            console.error(err);
          });
      },
    },
    {
      id: 4,
      text: "Download",
      icon: <DownloadIcon />,
    },
    {
      id: 5,
      text: "Share",
      icon: <ShareIcon />,
    },
  ];

  const funcList2 = [
    {
      id: 1,
      text: "Move to top",
      icon: (
        <div className='rotate-[180deg]'>
          <DownloadIcon />
        </div>
      ),
      value: -1,
      handleOnClick: movePosition,
      renderCondition: (id) => {
        return id === 0;
      },
    },
    {
      id: 2,
      text: "Move to bottom",
      icon: <DownloadIcon />,
      value: 1,
      handleOnClick: movePosition,
      renderCondition: (id, size) => {
        return id === size - 1;
      },
    },
  ];

  useEffect(() => {
    if (watchLaterData) {
      setPlaylistInfo((prev) =>
        prev ? { ...prev, ...watchLaterData?.data } : watchLaterData?.data,
      );
      if (addNew) {
        videoIdsset.current.clear();
        setVideoList(watchLaterData?.data?.video_list);
        watchLaterData?.data?.video_list?.forEach((video) => {
          if (!videoIdsset.current.has(video?._id)) {
            videoIdsset.current.add(video?._id);
          }
        });
        setAddNew(false);
      } else {
        const finalData = [];
        watchLaterData?.data?.video_list?.forEach((video) => {
          if (!videoIdsset.current.has(video?._id)) {
            videoIdsset.current.add(video?._id);
            finalData.push(video);
          }
        });
        setVideoList((prev) => [...prev, ...finalData]);
      }
    }
  }, [watchLaterData]);

  useEffect(() => {
    setFetchingState(() => {
      if (isLoading) return "loading";
      if (isError) {
        return "error";
      }
      if (isSuccess) {
        return "success";
      }
    });
  }, [isLoading, isSuccess]);

  useEffect(() => {
    if (isEnd && watchLaterData && queriese.page < watchLaterData.totalPage) {
      setQueriese((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  }, [isEnd]);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      IsEnd(setIsEnd);
    });

    return () => {
      window.removeEventListener("scroll", () => {
        IsEnd(setIsEnd);
      });
      queryClient.clear();
    };
  }, []);

  return (
    <Display
      playlistId={playlistInfo?._id}
      title={playlistInfo?.title}
      updatedAt={playlistInfo?.updatedAt}
      size={playlistInfo?.size}
      videoList={videoList}
      handleSort={handleSort}
      currSort={queriese.videoSearch?.type}
      changePostion={handleChangePosition}
      funcList1={funcList1}
      funcList2={funcList2}
    />
  );
};
export default WatchLater;
