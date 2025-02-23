import { useState, useEffect, useRef, useCallback } from "react";
import VideoList from "./VideoList";
import { IsEnd } from "../../../../../util/scrollPosition";
import { getData } from "../../../../../Api/getData";
import { useQueryClient } from "@tanstack/react-query";
import { ButtonHorizonSlider } from "../../../../../Component";

const ChannelVideo = ({ channelEmail }) => {
  const init = {
    channelEmail: channelEmail,
    limit: 12,
    page: 1,
    type: "video",
    sort: { createdAt: -1 },
    clearCache: "video",
  };

  const queryClient = useQueryClient();

  const [dataList, setDataList] = useState([]);

  const [addNew, setAddNew] = useState(true);

  const [query, setQuery] = useState(init);

  const { data: videosData, isLoading } = getData("/data/videos", query);

  const currentSortId = useRef("latest");

  const [isEnd, setIsEnd] = useState(false);

  const handleSort = (data) => {
    queryClient.removeQueries({
      queryKey: [...Object.values(query), "/data/videos"],
      exact: true,
    });

    setQuery({
      ...init,
      sort: data.value,
    });

    setAddNew(true);

    currentSortId.current = data.id;
  };

  const buttonList = useRef([
    {
      id: "latest",
      title: "Latest",
      value: { createdAt: -1 },
      handleOnClick: handleSort,
    },
    {
      id: "view",
      title: "Popular",
      value: { view: -1 },
      handleOnClick: handleSort,
    },
    {
      id: "oldest",
      title: "Oldest",
      value: { createdAt: 1 },
      handleOnClick: handleSort,
    },
  ]);
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
    if (isEnd && videosData && videosData.totalPage > query.page) {
      setQuery((prev) => ({ ...prev, page: prev.page + 1 }));
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
      <div className='mt-[16px] mb-[-8px]'>
        <ButtonHorizonSlider
          buttonList={buttonList.current}
          currentId={currentSortId.current}
        />
      </div>
      <div className='pt-[24px]'>
        <VideoList vidList={dataList} isLoading={isLoading} />
      </div>
    </div>
  );
};
export default ChannelVideo;
