import { useRef, useEffect, useState } from "react";
import {
  HorizonSlider,
  ShortHorizonSlider,
  VideoCard2,
  PlaylistCard,
} from "../../../../Component";
import { getData } from "../../../../Api/getData";

const initVideoQuery = {
  page: 1,
  limit: 12,
  type: "video",
  watchedVideoIdList: [],
  prevPlCount: 0,
};

const initShortQuery = {
  page: 1,
  limit: 12,
  type: "short",
};

const Other = ({ videoId, isEnd }) => {
  const [addNew, setAddNew] = useState();

  const [videoQuery, setVideoQuery] = useState(undefined);

  const [videoList, setVideoList] = useState([]);

  const videoIdList = useRef(new Set());

  const { data: videoData } = getData(
    `/data/all`,
    videoQuery,
    videoId && videoQuery ? true : false,
    false,
  );

  const [shortQuery, setShortQuery] = useState(undefined);

  const [shortList, setShortList] = useState([]);

  const shortIdList = useRef(new Set());

  const { data: shortData } = getData(
    `/data/all`,
    shortQuery,
    videoId && shortQuery ? true : false,
    false,
  );

  const buttonList = [
    {
      id: "all",
      title: "All",
    },
    {
      id: "from",
      title: "From THAY GIAOBA WITH LOVE",
    },
    {
      id: "from1",
      title: "From THAY GIAOBA WITH LOVE",
    },
    {
      id: "from",
      title: "From THAY GIAOBA WITH LOVE",
    },
  ];

  useEffect(() => {
    videoIdList.current.clear();
    setVideoQuery({
      ...initVideoQuery,
      reset: videoId,
      watchedVideoIdList: [videoId],
    });
    setAddNew(true);
    setVideoList([]);

    shortIdList.current.clear();
    setShortQuery({
      ...initShortQuery,
      reset: videoId,
    });
    setShortList([]);
  }, [videoId]);

  useEffect(() => {
    if (videoData) {
      if (addNew) {
        videoIdList.current.clear();
        videoData?.data.forEach((video) => {
          if (!videoIdList.current.has(video?._id)) {
            videoIdList.current.add(video?._id);
          }
        });
        setVideoList(videoData?.data);
        setAddNew(false);
      } else {
        const finalList = [];
        videoData?.data.forEach((video) => {
          if (!videoIdList.current.has(video?._id)) {
            videoIdList.current.add(video?._id);
            finalList.push(video);
          }
        });
        setVideoList((prev) => [...prev, ...finalList]);
      }
    }
  }, [videoData]);

  useEffect(() => {
    if (shortData) {
      const finalList = [];
      shortData?.data.forEach((short) => {
        if (!shortIdList.current.has(short?._id)) {
          shortIdList.current.add(short?._id);
          finalList.push(short);
        }
      });
      setShortList(finalList);
    }
  }, [shortData]);

  useEffect(() => {
    if (isEnd && videoData && videoData?.data?.length === videoQuery.limit) {
      setVideoQuery((prev) => ({
        ...prev,
        page: prev.page + 1,
        watchedVideoIdList: [
          ...prev.watchedVideoIdList,
          ...[...videoIdList.current],
        ],
        prevPlCount: videoList.filter((data) => data.video_list).length,
      }));
    }
  }, [isEnd]);

  return (
    <div>
      <HorizonSlider buttonList={buttonList} currentId={"all"} />
      {videoList.length > 0 &&
        (videoList[0].type === "video" ? (
          <VideoCard2
            data={videoList[0]}
            index={0}
            size={videoList.length}
            containerStyle={"mt-[8px]"}
          />
        ) : (
          <PlaylistCard data={videoList[0]} />
        ))}

      <ShortHorizonSlider
        cardWidth={(402 - 8) / 3}
        thumbnailHeight={(402 / 3 / 9) * 16}
        shortList={shortList}
      />
      {videoList.length > 0 && (
        <div>
          {videoList.slice(1).map((item, index) => {
            if (item.type === "video") {
              return (
                <VideoCard2
                  key={item?._id}
                  data={item}
                  index={index}
                  size={videoList.length}
                  containerStyle={"mt-[8px]"}
                />
              );
            }
            return <PlaylistCard key={item?._id} data={item} />;
          })}
        </div>
      )}
    </div>
  );
};
export default Other;
