import Display from "./Display";
import request from "../../../util/axios-base-url";
import { useEffect, useState, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../../Auth Provider/authContext";
import { IsEnd } from "../../../util/scrollPosition";
import { TrashBinIcon } from "../../../Assets/Icons";

const LikedVideo = () => {
  const { setFetchingState } = useAuthContext();

  const queryClient = useQueryClient();

  const [queriese, setQueriese] = useState({
    page: 1,
    limit: 8,
    type: "all",
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
  } = useQuery({
    queryKey: [...Object.values(queriese), "likedvideos"],
    queryFn: async () => {
      try {
        const rsp = await request.get("/client/user/likedvideos", {
          params: queriese,
        });

        return rsp.data;
      } catch (error) {
        alert("Failed to get channel list");
        console.error(error);
      }
    },
    suspense: false,
    cacheTime: 0,
  });

  const remvoveFromList = async (_, productData) => {
    try {
      await request
        .post("/client/react", {
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

  const funcList = [
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
        prev ? { ...prev, ...likedVideosData?.data } : likedVideosData?.data
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
    };
  }, []);

  return (
    <Display
      title={playlistInfo?.title}
      updatedAt={videoList[0]?.updatedAt}
      size={playlistInfo?.size}
      videoList={videoList}
      isLoading={isLoading}
      handleSort={(type) => {
        if (queriese.type !== type) {
          queryClient.removeQueries({
            queryKey: [...Object.values(queriese), "likedvideos"],
            exact: true,
          });
          setQueriese((prev) => ({ ...prev, page: 1, type }));
          setAddNew(true);
        }
      }}
      currSort={queriese.type}
      noDrag={true}
      funcList={funcList}
    />
  );
};
export default LikedVideo;
