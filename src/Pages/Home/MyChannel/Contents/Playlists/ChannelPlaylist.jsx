import { useState, useEffect, useRef } from "react";
import { IsEnd } from "../../../../../util/scrollPosition";
import { CustomeFuncBox, PlaylistCard } from "../../../../../Component";
import { SortIcon } from "../../../../../Assets/Icons";
import { motion } from "framer-motion";
import { getDataWithAuth } from "../../../../../Api/getData";
import { useQueryClient } from "@tanstack/react-query";

const ChannelPlaylist = () => {
  const [params, setParams] = useState({
    page: 1,
    limit: 12,
    sort: { createdAt: -1 },
    videoLimit: 1,
    clearCache: "playlist",
  });

  const { data: playlistData, isLoading } = getDataWithAuth(
    "/client/playlist",
    params,
    true,
    false,
  );

  const [dataList, setDataList] = useState([]);

  const [addNew, setAddNew] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(1);

  const containerRef = useRef();

  const handleFuncClick = (data) => {
    setCurrentIndex(data.id);
    setParams((prev) => ({ ...prev, sort: data.sort }));
  };

  const funcList = [
    {
      id: 1,
      text: "Date added (newest)",
      handleOnClick: handleFuncClick,
      sort: { createdAt: -1 },
    },
    {
      id: 2,
      text: "Last added video",
      handleOnClick: handleFuncClick,
      sort: { updatedAt: -1 },
    },
  ];

  const [opened, setOpened] = useState(false);

  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpened(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);

    window.addEventListener("scroll", () => {
      IsEnd(setIsEnd);
    });

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", () => {
        IsEnd(setIsEnd);
      });
    };
  }, []);

  useEffect(() => {
    if (isEnd && playlistData.totalPage > params.page) {
      setParams((prev) => ({ ...prev, page: prev.page + 1 }));
      setAddNew(false);
    }
  }, [isEnd]);

  useEffect(() => {
    if (playlistData?.data) {
      if (addNew) {
        setDataList(playlistData?.data);
      } else {
        setDataList((prev) => [...prev, ...playlistData?.data]);
      }
    }
  }, [playlistData]);

  return (
    <div>
      <div className='my-[8px] h-[56px] flex items-center justify-between'>
        <motion.div
          className='text-[16px] leading-[22px] cursor-default t-1-ellipsis flex-1'
          whileTap={{
            backgroundColor: "rgba(255,255,255,0.2)",
          }}
        >
          Created playlist
        </motion.div>
        <motion.div
          className='cursor-pointer relative'
          whileTap={{
            backgroundColor: "rgba(255,255,255,0.2)",
          }}
          onClick={() => setOpened((prev) => !prev)}
          ref={containerRef}
        >
          <div className='flex items-center text-[14px] leading-[22px] font-bold'>
            <div className='mr-[8px]'>
              <SortIcon />
            </div>
            <span className='text-nowrap'>Sort by</span>
          </div>
          {opened && (
            <CustomeFuncBox
              setOpened={setOpened}
              style={"right-0 top-[150%]"}
              funcList1={funcList}
              currentId={currentIndex}
            />
          )}
        </motion.div>
      </div>
      <div className='grid grid-cols-1 xsm:grid-cols-2 642:grid-cols-3 856:grid-cols-4 1070:grid-cols-5 1336:grid-cols-6'>
        {dataList.map((playlist, id) => (
          <PlaylistCard
            key={id}
            data={playlist}
            showL3={false}
            containerStyle={"!ml-0 !mr-[4px] !mb-[24px]"}
          />
        ))}
      </div>
      {isLoading && (
        <div className='mt-[20px] mb-[40px] flex items-center justify-center'>
          <div
            className='w-[40px] h-[40px] rounded-[50px] border-[3px] border-[rgba(255,255,255,0.4)] 
        border-b-[transparent] border-l-[transparent] animate-spin'
          ></div>
        </div>
      )}
    </div>
  );
};
export default ChannelPlaylist;
