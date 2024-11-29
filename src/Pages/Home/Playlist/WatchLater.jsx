import Display from "./Display";
import request from "../../../util/axios-base-url";
import { useEffect, useState, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../../Auth Provider/authContext";
import { DownloadIcon } from "../../../Assets/Icons";

const funcList = [
  {
    id: 1,
    text: "Move to top",
    icon: (
      <div className='rotate-[180deg]'>
        <DownloadIcon />
      </div>
    ),
  },
  {
    id: 2,
    text: "Move to bottom",
    icon: <DownloadIcon />,
  },
];
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

  const handleChangePosition = useCallback(async (from, to) => {
    setVideoList((prev) => {
      const videos = [...prev];
      const temp = videos[from];
      videos[from] = videos[to];
      videos[to] = temp;

      return videos;
    });
    await request.patch(`/client/playlist/${playlistInfo._id}`, {
      move: {
        from,
        to,
      },
    });
  });

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

  return (
    <Display
      title={playlistInfo?.title}
      updatedAt={playlistInfo?.updatedAt}
      size={playlistInfo?.size}
      videoList={videoList}
      handleSort={(type) => {
        queryClient.removeQueries({
          queryKey: [...Object.values(queriese), "watchlater"],
          exact: true,
        });
        setQueriese((prev) => ({ ...prev, page: 1, type }));
        setAddNew(true);
      }}
      currSort={queriese.type}
      changePostion={handleChangePosition}
      funcList={funcList}
    />
  );
};
export default WatchLater;
