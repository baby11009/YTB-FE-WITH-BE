import Display from "./Display";
import request from "../../../util/axios-base-url";
import { useEffect, useState, useRef } from "react";
import { getCookie } from "../../../util/tokenHelpers";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../../Auth Provider/authContext";

const WatchLater = () => {
  const { setFetchingState } = useAuthContext();

  const queryClient = useQueryClient();

  const [queriese, setQueriese] = useState({
    page: 1,
    limit: 12,
    type: "all",
  });

  const videoIdsset = useRef(new Set());

  const [addNew, setAddNew] = useState(false);

  const [videoList, setVideoList] = useState([]);

  const [playlistInfo, setPlaylistInfo] = useState(undefined);
  console.log("🚀 ~ playlistInf:", playlistInfo)

  const {
    data: watchLaterData,
    isLoading,
    isSuccess,
    isError,
    refetch,
  } = useQuery({
    queryKey: [...Object.values(queriese)],
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

  const handleChangePosition = async (from, to) => {
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
  };

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
    <>
      <Display
        title={playlistInfo?.title}
        updatedAt={playlistInfo?.updatedAt}
        size={playlistInfo?.size}
        videoList={videoList}
        handleSort={(type) => {
          queryClient.removeQueries({
            queryKey: Object.values(queriese),
            exact: true,
          });
          setQueriese((prev) => ({ ...prev, page: 1, type }));
          setAddNew(true);
        }}
        currSort={queriese.type}
        changePostion={handleChangePosition}
      />
    </>
  );
};
export default WatchLater;
