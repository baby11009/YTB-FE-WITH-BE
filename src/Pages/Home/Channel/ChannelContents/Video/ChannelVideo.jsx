import TagBlock from "../TagBlock";
import { useState, useEffect } from "react";
import VideoList from "./VideoList";
import { IsEnd } from "../../../../../util/scrollPosition";
import { getData } from "../../../../../Api/getData";
import { useQueryClient } from "@tanstack/react-query";

const ChannelVideo = ({ channelEmail }) => {
  const queryClient = useQueryClient();

  const [dataList, setDataList] = useState([]);

  const [addNew, setAddNew] = useState(true);

  const [params, setParams] = useState({
    channelEmail: channelEmail,
    limit: 12,
    page: 1,
    type: "video",
    sort: { createdAt: -1 },
    clearCache: "video",
  });

  const { data: videosData, isLoading } = getData("/data/videos", params);

  const [activeIndex, setActiveIndex] = useState(1);

  const [isEnd, setIsEnd] = useState(false);

  const handleOnClick = (data) => {
    setActiveIndex(data.id);
    setParams((prev) => ({ ...prev, sort: data.sort }));
  };

  useEffect(() => {
    window.addEventListener("scroll", () => {
      IsEnd(setIsEnd);
    });

    return () => {
      queryClient.clear();
      window.removeEventListener("scroll", () => {
        IsEnd(setIsEnd);
      });
    };
  }, []);

  useEffect(() => {
    if (isEnd && videosData && videosData.totalPage > params.page) {
      setParams((prev) => ({ ...prev, page: prev.page + 1 }));
      setAddNew(false);
    }
  }, [isEnd]);

  useEffect(() => {
    if (videosData?.data) {
      if (addNew) {
        setDataList(videosData?.data);
      } else {
        setDataList((prev) => [...prev, ...videosData?.data]);
      }
    }
  }, [videosData]);

  return (
    <div className='w-full'>
      <TagBlock activeIndex={activeIndex} handleOnClick={handleOnClick} />
      <VideoList vidList={dataList} isLoading={isLoading} />
    </div>
  );
};
export default ChannelVideo;
