import { iloda_v1 } from "../../../../../Assets/Images";
import { VideoCard } from "../../../../../Component";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { IsEnd } from "../../../../../util/scrollPosition";
import { getData } from "../../../../../Api/getData";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useParams } from "react-router-dom";

const firstVid = {
  id: 1,
  thumb: iloda_v1,
  type: "video",
  title:
    "Tôi biến VÙNG ĐẤT HOANG thành VƯƠNG QUỐC TRUNG CỔ THỊNH VƯỢNG mỗi tội ... (Manor Lords #1)",
  channel: "iLoda",
  verify: true,
  view: 133000,
  time: "04/15/2024, 12:25:32 AM",
  desc: "➥ Đăng ký kênh để xem thêm Video mỗi ngày: https://bom.to/2ylFGlf ➥ Lịch Live: 2 ca Stream mỗi ngày:- Ca 1: 12h - 15h30- Ca 2: 22h - 3h30 Các buổi Stream sẽ bắt...",
};

const init = {
  limit: 12,
  page: 1,
  sort: { view: -1, createdAt: -1 },
  clearCache: "search",
};
const ChannelSearch = () => {
  const { id } = useParams();

  const location = useLocation();

  const queryClient = useQueryClient();

  const initQuery = useRef();

  const [query, setQuery] = useState();

  const addNew = useRef(true);

  const [dataList, setDataList] = useState([]);

  const { data, isLoading } = getData(
    "/data/all",
    query,
    query ? true : false,
    false,
  );

  const [isEnd, setIsEnd] = useState(false);

  useLayoutEffect(() => {
    if (id) {
      initQuery.current = { ...init, channelEmail: id };
    }
  }, [id]);

  useLayoutEffect(() => {
    const searchQuery = Object.fromEntries(
      new URLSearchParams(location.search),
    );

    setQuery({ ...initQuery.current, search: searchQuery.title });
    addNew.current = true;
  }, [location.search]);

  useLayoutEffect(() => {
    if (data && addNew.current) {
      setDataList([...data.data]);
      addNew.current = false;
    } else if (data) {
      setDataList((prev) => [...prev, ...data.data]);
    }
  }, [data]);

  useEffect(() => {
    const handleOnScroll = () => {
      IsEnd(setIsEnd);
    };

    window.addEventListener("scroll", handleOnScroll);

    return () => {
      window.removeEventListener("scroll", handleOnScroll);
      queryClient.clear();
    };
  }, []);

  useEffect(() => {
    if (isEnd && data && data.data.length > 0) {
      addNew.current = true;
      setQuery((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  }, [isEnd, data]);

  if (!query || isLoading) return;

  return (
    <div>
      {dataList.length > 0 ? (
        dataList.map((data, index) => (
          <div
            className='py-[24px] border-b-[1px] border-black-0.2 overflow-hidden mr-[-32px] xsm:mr-0'
            key={index}
          >
            <VideoCard
              data={data}
              showBtn={true}
              noFunc2={true}
              style={"flex gap-[16px] mx-0 mb-0"}
              thumbStyle={"w-[246px] h-[138px] mb-0 rounded-[8px]"}
              titleStyle={"text-[18px] leading-[26px] font-[400] max-h-[56px]"}
              infoStyle={"flex text-[12px] leading-[18px]"}
            />
          </div>
        ))
      ) : (
        <div className='p-[16px] mx-auto text-[14px] leading-[20px] text-white text-center'>
          This channel has no content that matched {query.search}
        </div>
      )}

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
export default ChannelSearch;
