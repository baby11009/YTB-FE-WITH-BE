import Display from "./Display";
import request from "../../../util/axios-base-url";
import { useEffect, useState, useRef } from "react";
import { getCookie } from "../../../util/tokenHelpers";
import { useQuery } from "@tanstack/react-query";

const WatchLater = () => {
  const [queriese, setQueriese] = useState({
    page: 1,
    limit: 12,
    type: "all",
  });

  const videoIdsset = useRef(new Set());

  const [addNew, setAddNew] = useState(false);

  const [videoList, setVideoList] = useState([]);
  console.log("🚀 ~ videoList:", videoList);

  const { data: watchLaterData } = useQuery({
    queryKey: [...Object.values(queriese)],
    queryFn: async () => {
      try {
        const rsp = await request.get("/client/user/watchlater", {
          headers: {
            Authorization: `${import.meta.env.VITE_AUTH_BEARER} ${getCookie(
              import.meta.env.VITE_AUTH_TOKEN
            )}`,
          },
          params: queriese,
        });

        return rsp.data;
      } catch (error) {
        alert("Failed to get channel list");
        console.error(error);
      }
    },
    suspense: true,
    cacheTime: 0,
  });

  useEffect(() => {
    if (watchLaterData) {
      if (addNew) {
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
  console.log("🚀 ~ watchLaterData:", watchLaterData);

  return (
    <Display
      title={watchLaterData?.data?.title}
      updatedAt={watchLaterData?.data?.updatedAt}
      size={watchLaterData?.data?.size}
      videoList={videoList}
    />
  );
};
export default WatchLater;
