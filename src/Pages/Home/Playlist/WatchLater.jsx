import Display from "./Display";
import request from "../../../util/axios-base-url";
import { useEffect, useState, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../../Auth Provider/authContext";
import { DownloadIcon } from "../../../Assets/Icons";
import { IsEnd } from "../../../util/scrollPosition";

const WatchLater = () => {
  const { setFetchingState } = useAuthContext();

  const queryClient = useQueryClient();

  const [queriese, setQueriese] = useState({
    page: 1,
    limit: 12,
    type: "all",
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
    refetch,
  } = useQuery({
    queryKey: [...Object.values(queriese), "watchlater"],
    queryFn: async () => {
      try {
        const rsp = await request.get("/client/user/watchlater", {
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

  useEffect(() => {
    if (watchLaterData) {
      setPlaylistInfo((prev) =>
        prev ? { ...prev, ...watchLaterData?.data } : watchLaterData?.data
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

  const handleChangePosition = useCallback(
    async (from, to) => {
      try {
        await request
          .patch(`/client/playlist/${playlistInfo?._id}`, {
            move: {
              from,
              to,
            },
          })
          .then((rsp) => {
            setVideoList((prev) => {
              const videos = [...prev];
              const temp = videos[from];
              videos[from] = videos[to];
              videos[to] = temp;

              return videos;
            });
          });
      } catch (error) {
        alert("Failed to move position");
        throw error;
      }
    },
    [playlistInfo?._id]
  );

  const movePosition = useCallback(
    async (data, productId, index) => {
      await handleChangePosition(index, index + data.value);
    },
    [playlistInfo?._id]
  );

  const funcList = [
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
      condition: (id, size) => {
        return id === 0;
      },
    },
    {
      id: 2,
      text: "Move to bottom",
      icon: <DownloadIcon />,
      value: 1,
      handleOnClick: movePosition,
      condition: (id, size) => {
        return id === size - 1;
      },
    },
  ];

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
    };
  }, []);

  return (
    <Display
      title={playlistInfo?.title}
      updatedAt={playlistInfo?.updatedAt}
      size={playlistInfo?.size}
      videoList={videoList}
      handleSort={(type) => {
        if (queriese.type !== type) {
          queryClient.removeQueries({
            queryKey: [...Object.values(queriese), "watchlater"],
            exact: true,
          });
          setQueriese((prev) => ({ ...prev, page: 1, type }));
          setAddNew(true);
        }
      }}
      currSort={queriese.type}
      changePostion={handleChangePosition}
      funcList={funcList}
    />
  );
};
export default WatchLater;
