import { useState, useEffect, useRef } from "react";
import { IsEnd, IsTop } from "../../../../../util/scrollPosition";
import { CustomeFuncBox } from "../../../../../Component";
import { SortIcon } from "../../../../../Assets/Icons";
import { motion } from "framer-motion";
import PlaylistList from "./PlaylistList";
import { getData } from "../../../../../Api/getData";
import { useQueryClient } from "@tanstack/react-query";

const ChannelPlaylist = ({ channelEmail }) => {
  const queryClient = useQueryClient();

  const [queries, setQueries] = useState({
    limit: 12,
    page: 1,
    sort: { createdAt: -1 },
    channelEmail,
    videoLimit: 1,
  });

  const { data: playlistData, isLoading } = getData(
    "/data/playlists",
    queries,
    true,
  );
  console.log("🚀 ~ playlistData:", playlistData);

  const [dataList, setDataList] = useState([]);

  const [addNew, setAddNew] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(1);

  const containerRef = useRef();

  const handleFuncClick = (data) => {
    setCurrentIndex(data.id);
    setQueries((prev) => ({ ...prev, sort: data.sort }));
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
      text: "Last video added",
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
      queryClient.clear();
    };
  }, []);

  useEffect(() => {
    if (isEnd && playlistData && playlistData.totalPage > queries.page) {
      setQueries((prev) => ({ ...prev, page: prev.page + 1 }));
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
          Created playlists
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
              style={"right-[5%] top-[150%]"}
              funcList1={funcList}
              currentId={currentIndex}
            />
          )}
        </motion.div>
      </div>

      <PlaylistList playlistList={dataList} isLoading={isLoading} />
    </div>
  );
};
export default ChannelPlaylist;
