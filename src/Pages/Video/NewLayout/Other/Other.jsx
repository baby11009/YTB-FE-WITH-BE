import { useRef, useEffect, useState } from "react";
import { HorizonSlider, VideoCard2, PlaylistCard } from "../../../../Component";
import { getData } from "../../../../Api/getData";

const initVideoParams = {
  page: 1,
  limit: 12,
  type: "video",
  watchedVideoIdList: [],
  prevPlCount: 0,
};

const Other = ({ videoId }) => {
  const [addNew, setAddNew] = useState();

  const [videoQuery, setVideoQuery] = useState(undefined);

  const [videoList, setVideoList] = useState([]);

  const videoIdList = useRef(new Set());

  const { data: videoData } = getData(
    `/data/all`,
    videoQuery,
    videoId && videoQuery ? true : false,
    false
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
    setVideoQuery({
      ...initVideoParams,
      reset: videoId,
      watchedVideoIdList: [videoId],
    });
    setAddNew(true);
    setVideoList([]);
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

  return (
    <div>
      <HorizonSlider buttonList={buttonList} currentId={"all"} />
      {videoList.length > 0 && (
        <div>
          {videoList[0].type === "video" ? (
            <VideoCard2 data={videoList[0]} index={0} size={videoList.length} />
          ) : (
            <PlaylistCard data={videoList[0]} />
          )}

          {/* Short */}

          {/* Video */}

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
        </div>
      )}
    </div>
  );
};
export default Other;
