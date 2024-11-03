import { useEffect, useLayoutEffect, useState, useRef } from "react";
import { GridLayout } from "../../../Component";
import { IsEnd } from "../../../util/scrollPosition";
import { useQueryClient } from "@tanstack/react-query";
import { getData } from "../../../Api/getData";

import CategoryPart from "./CategoryPart";

const categoryList = [
  {
    id: 1,
    title: "Tất cả",
  },
  {
    id: 2,
    title: "Trò chơi",
  },
  {
    id: 3,
    title: "trực tiếp",
  },
  {
    id: 4,
    title: "Âm nhạc",
  },
  {
    id: 5,
    title: "Danh sách kết hợp",
  },
  {
    id: 6,
    title: "Trò chơi hành động phiêu lưu",
  },
  {
    id: 7,
    title: "Nấu ăn",
  },
  {
    id: 8,
    title: "Đọc rap",
  },
  {
    id: 9,
    title: "Mới tải lên gần đây",
  },
  {
    id: 10,
    title: "Đã xem",
  },
  {
    id: 11,
    title: "Đề xuất mới",
  },
];

const videoParams = {
  page: 1,
  limit: 16,
  createdAt: "mới nhất",
  type: "video",
  prevPlCount: 0,
};

const shortParams = {
  page: 1,
  limit: 18,
  createdAt: "mới nhất",
  type: "short",
};

const MainPart = ({ openedMenu }) => {
  const [addNew, setAddNew] = useState(true);

  const queryClient = useQueryClient();

  const [activeIndex, setActiveIndex] = useState(1);

  const [vidPrs, setVidPrs] = useState(videoParams);

  const [shortPrs, setShortPrs] = useState(shortParams);

  const [vidList, setVidList] = useState([]);

  const [shortList, setShortList] = useState([]);

  const [isEnd, setIsEnd] = useState(false);

  const { data: videos } = getData("/data/all", vidPrs, true, true);

  const { data: shorts } = getData("/data/all", shortPrs, true, true);

  useEffect(() => {
    if (isEnd) {

      if (videos?.data?.length > 0) {
        setVidPrs((prev) => ({
          ...prev,
          page: prev.page + 1,
          prevPlCount: vidList.filter((videos) => videos.video_list).length,
        }));
      }

      if (shorts?.data?.length > 0) {
        setShortPrs((prev) => ({
          ...prev,
          page: prev.page + 1,
        }));
      }
    }
    setAddNew(!isEnd);
  }, [isEnd]);

  useLayoutEffect(() => {
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
    if (videos) {
      if (addNew) {
        setVidList(videos?.data);
      } else {
        setVidList((prev) => [...prev, ...videos?.data]);
      }
    }
  }, [videos]);

  useEffect(() => {
    if (shorts) {
      if (addNew) {
        setShortList(shorts?.data);
      } else {
        setShortList((prev) => [...prev, ...shorts?.data]);
      }
    }
  }, [shorts]);

  return (
    <div className=' pb-[40px]'>
      <CategoryPart
        categoryList={categoryList}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />
      <div className='mt-[80px] px-[16px]'>
        <GridLayout
          openedMenu={openedMenu}
          vidList={vidList}
          shortList={shortList}
        />
      </div>
    </div>
  );
};
export default MainPart;
