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

const initParams = {
  page: 1,
  limit: 16,
  createdAt: "mới nhất",
  prevPlCount: 0,
};

const MainPart = ({ openedMenu }) => {
  const [addNew, setAddNew] = useState(true);

  const queryClient = useQueryClient();

  const [activeIndex, setActiveIndex] = useState(1);

  const [params, setParams] = useState(initParams);

  const [dataList, setDataList] = useState([]);

  const [isEnd, setIsEnd] = useState(false);

  const { data, isError, error } = getData("/data/all", params, true, true);

  useEffect(() => {
    if (isEnd) {
      setParams((prev) => ({
        ...prev,
        page: prev.page + 1,
        prevPlCount: dataList.filter((data) => data.video_list).length,
      }));
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
    if (data) {
      if (addNew) {
        setDataList(data?.data);
      } else {
        setDataList((prev) => [...prev, ...data?.data]);
      }
    }
  }, [data]);

  return (
    <div className=' pb-[40px]'>
      <CategoryPart
        categoryList={categoryList}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />
      <div className='mt-[80px] px-[16px]'>
        <GridLayout openedMenu={openedMenu} vidList={dataList} />
      </div>
    </div>
  );
};
export default MainPart;
