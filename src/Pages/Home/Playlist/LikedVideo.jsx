import Display from "./Display";
import request from "../../../util/axios-base-url";
import { useEffect, useState, useRef } from "react";

import { getData } from "../../../Api/getData";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../../Auth Provider/authContext";
import { IsEnd } from "../../../util/scrollPosition";
import {
  TrashBinIcon,
  AddWLIcon,
  WatchedIcon,
  ShareIcon,
  DownloadIcon,
  SaveIcon,
} from "../../../Assets/Icons";
import { PlaylistModal } from "../../../Component";

const LikedVideo = () => {
  const { setFetchingState, setIsShowing, addToaster } = useAuthContext();

  const queryClient = useQueryClient();

  const [queriese, setQueriese] = useState({
    videoPage: 1,
    videoLimit: 12,
    videoSearch: {},
  });

  const videoIdsset = useRef(new Set());

  const [addNew, setAddNew] = useState(false);

  const [videoList, setVideoList] = useState([]);

  const [playlistInfo, setPlaylistInfo] = useState(undefined);

  const [isEnd, setIsEnd] = useState(false);

  const {
    data: likedVideosData,
    isLoading,
    isSuccess,
    isError,
  } = getData("/user/playlist/liked", queriese, true, false);

  const remvoveFromList = async (_, productData) => {
    try {
      await request
        .post("/user/video-react", {
          videoId: productData?._id,
          type: "like",
        })
        .then((rsp) => {
          if (rsp.data.type === "DELETE") {
            setVideoList((prev) => {
              return prev.filter((item) => item._id !== rsp.data.data.video_id);
            });
          }
        });
    } catch (error) {
      alert("Failed to remove from Liked videos");
      throw error;
    }
  };

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

  const funcList1 = [
    {
      id: 1,
      text: "Add to queue",
      icon: <AddWLIcon />,
    },
    {
      id: 2,
      text: "Save to watch later",
      icon: <WatchedIcon />,
      handleOnClick: async (_, productData) => {
        await request
          .patch("/user/playlist/watchlater", {
            videoIdList: [productData?._id],
          })
          .then((rsp) => {
            addToaster(rsp.data.msg);
          })
          .catch((err) => {
            console.error(err);
          });
      },
    },
    {
      id: 3,
      text: "Save to playlist",
      icon: <SaveIcon />,
      handleOnClick: (_, productData) => {
        setIsShowing(<PlaylistModal videoId={productData?._id} />);
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
      text: "Remove from Liked videos",
      icon: <TrashBinIcon />,
      handleOnClick: remvoveFromList,
    },
  ];

  useEffect(() => {
    if (likedVideosData) {
      setPlaylistInfo((prev) =>
        prev ? { ...prev, ...likedVideosData?.data } : likedVideosData?.data,
      );
      if (addNew) {
        videoIdsset.current.clear();
        setVideoList(likedVideosData?.data?.video_list);
        likedVideosData?.data?.video_list?.forEach((video) => {
          if (!videoIdsset.current.has(video?._id)) {
            videoIdsset.current.add(video?._id);
          }
        });
        setAddNew(false);
      } else {
        const finalData = [];
        likedVideosData?.data?.video_list?.forEach((video) => {
          if (!videoIdsset.current.has(video?._id)) {
            videoIdsset.current.add(video?._id);
            finalData.push(video);
          }
        });
        setVideoList((prev) => [...prev, ...finalData]);
      }
    }
  }, [likedVideosData]);

  useEffect(() => {
    setFetchingState(() => {
      if (isLoading) return "loading";
      if (isError) {
        setTimeout(() => {
          setFetchingState("none");
        }, 1000);
        return "error";
      }
      if (isSuccess) {
        setTimeout(() => {
          setFetchingState("none");
        }, 1000);
        return "success";
      }
    });
  }, [isLoading, isSuccess]);

  useEffect(() => {
    if (isEnd && likedVideosData && queriese.page < likedVideosData.totalPage) {
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
      isLoading={isLoading}
      handleSort={handleSort}
      currSort={queriese.videoSearch?.type}
      noDrag={true}
      funcList1={funcList1}
      funcList2={funcList2}
    />
  );
};
export default LikedVideo;
