import {
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { GridLayout } from "../../../Component";
import { IsEnd } from "../../../util/scrollPosition";
import { useQueryClient } from "@tanstack/react-query";
import { getData } from "../../../Api/getData";
import { useAuthContext } from "../../../Auth Provider/authContext";
import Filters from "./Filters";

const initVideoQuery = {
  page: 1,
  limit: 16,
  sort: undefined,
  type: "video",
  prevPlCount: 0,
  watchedVideoIdList: [],
  watchedPlIdList: [],
};

const initShortQuery = {
  page: 1,
  limit: 12,
  sort: undefined,
  type: "short",
  watchedVideoIdList: [],
};

const MainPage = () => {
  const { setFetchingState, openedMenu } = useAuthContext();

  const [addNew, setAddNew] = useState(true);

  const queryClient = useQueryClient();

  const [videoQuery, setVideoQuery] = useState(initVideoQuery);

  const [shortQuery, setShortQuery] = useState(initShortQuery);

  const [vidList, setVidList] = useState([]);

  const [shortList, setShortList] = useState([]);

  const [isEnd, setIsEnd] = useState(false);

  const watchedVideoIdSet = useRef(new Set());

  const watchedPlIdSet = useRef(new Set());

  const watchedShortIdSet = useRef(new Set());

  const {
    data: videos,
    isLoading,
    isSuccess,
  } = getData("/data/all", videoQuery, true);

  const { data: shorts } = getData("/data/all", shortQuery, true);

  const setSortQuery = useCallback((data) => {
    queryClient.removeQueries({
      queryKey: [...Object.values(videoQuery), "/data/all"],
      exact: true,
    });
    queryClient.removeQueries({
      queryKey: [...Object.values(shortQuery), "/data/all"],
      exact: true,
    });
    setVideoQuery({
      ...initVideoQuery,
      [data.type === "sort" ? "sort" : "tag"]: data.value,
    });
    setShortQuery({
      ...initShortQuery,
      [data.type === "sort" ? "sort" : "tag"]: data.value,
    });
    setAddNew(true);
  });

  useEffect(() => {
    if (isEnd) {
      if (videos?.data?.length > 0) {
        setVideoQuery((prev) => ({
          ...prev,
          page: prev.page + 1,
          prevPlCount: vidList.filter((videos) => videos.video_list).length,
          watchedVideoIdList: [
            ...prev.watchedVideoIdList,
            ...watchedVideoIdSet.current,
          ],
          watchedPlIdList: [...prev.watchedPlIdList, ...watchedPlIdSet.current],
        }));
      }

      if (shorts?.data?.length > 0) {
        setShortQuery((prev) => ({
          ...prev,
          page: prev.page + 1,
          watchedVideoIdList: [
            ...prev.watchedVideoIdList,
            ...watchedShortIdSet.current,
          ],
        }));
      }
    }
    setAddNew(!isEnd);
  }, [isEnd]);

  useEffect(() => {
    setFetchingState(() => {
      if (isLoading) return "loading";

      if (isSuccess) {
        return "success";
      } else {
        return "error";
      }
    });
  }, [isLoading, isSuccess]);

  useLayoutEffect(() => {
    const handleScroll = () => {
      IsEnd(setIsEnd);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      queryClient.clear();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (videos) {
      if (addNew) {
        watchedPlIdSet.current.clear();
        watchedVideoIdSet.current.clear();
        setVidList(videos?.data);
        videos?.data?.forEach((item) => {
          if (item?.videoCount) {
            watchedPlIdSet.current.add(item._id);
          } else watchedVideoIdSet.current.add(item._id);
        });
      } else {
        setVidList((prev) => [...prev, ...videos?.data]);
        videos?.data?.forEach((item) => {
          if (item?.videoCount && !watchedPlIdSet.current.has(item._id)) {
            watchedPlIdSet.current.add(item._id);
          } else if (!watchedVideoIdSet.current.has(item._id)) {
            watchedVideoIdSet.current.add(item._id);
          }
        });
      }
    }
  }, [videos]);

  useEffect(() => {
    if (shorts) {
      if (addNew) {
        watchedShortIdSet.current.clear();
        setShortList(shorts?.data);
        shorts?.data.forEach((item) => {
          watchedShortIdSet.current.add(item?._id);
        });
      } else {
        setShortList((prev) => [...prev, ...shorts?.data]);
        shorts?.data.forEach((item) => {
          if (!watchedShortIdSet.current.has(item._id)) {
            watchedShortIdSet.current.add(item?._id);
          }
        });
      }
    }
  }, [shorts]);

  return (
    <div className=' pb-[40px]'>
      <div
        className={`h-[56px] left-0 md:left-[74px] ${
          openedMenu && "xl:!left-[227px]"
        } right-0 px-[24px] fixed top-[56px] z-[200] bg-black overflow-hidden`}
      >
        <Filters setSortQuery={setSortQuery} />
      </div>
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
export default MainPage;
