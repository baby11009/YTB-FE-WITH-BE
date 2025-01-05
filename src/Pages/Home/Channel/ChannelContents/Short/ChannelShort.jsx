import { useState, useEffect, useRef, useCallback } from "react";
import { IsEnd } from "../../../../../util/scrollPosition";
import ShortList from "./ShortList";
import { getData } from "../../../../../Api/getData";
import { useQueryClient } from "@tanstack/react-query";
import { ButtonHorizonSlider } from "../../../../../Component";

const ChannelShort = ({ channelEmail }) => {
  const init = {
    channelEmail: channelEmail,
    limit: 12,
    page: 1,
    type: "short",
    sort: { createdAt: -1 },
    clearCache: "video",
  };

  const queryClient = useQueryClient();

  const [dataList, setDataList] = useState([]);

  const [addNew, setAddNew] = useState(true);

  const [query, setQuery] = useState(init);

  const { data: videosData, isLoading } = getData("/data/videos", query);

  const [isEnd, setIsEnd] = useState(false);

  const currentSortId = useRef("latest");

  const handleSort = useCallback((data) => {
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
  });

  const buttonList = [
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
  ];

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
    if (isEnd && videosData.totalPage > query.page) {
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
    <div className='w-full pb-[40px]'>
      <div className='mt-[16px] mb-[-8px]'>
        {" "}
        <ButtonHorizonSlider
          buttonList={buttonList}
          currentId={currentSortId.current}
        />
      </div>
      <div className='pt-[24px]'>
        {dataList.length > 0 ? (
          <ShortList shortList={dataList} isLoading={isLoading} />
        ) : (
          "Không có dữ liệu"
        )}
      </div>
    </div>
  );
};
export default ChannelShort;
