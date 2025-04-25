import { useEffect, useState, useRef, useCallback } from "react";
import { GridLayout } from "../../../Component";
import { IsEnd } from "../../../util/scrollPosition";
import { useQueryClient } from "@tanstack/react-query";
import { getData } from "../../../Api/getData";
import { useAuthContext } from "../../../Auth Provider/authContext";
import { cleanSessionCookies } from "../../../util/other";
import { scrollToTop } from "../../../util/scrollCustom";
import Filters from "./Filters";

const MainPage = () => {
  const { setFetchingState, openedMenu } = useAuthContext();

  const queryClient = useQueryClient();

  const [dataQueries, setDataQueries] = useState({ clearCache: "main" });

  const [vidList, setVidList] = useState([]);

  const [shortList, setShortList] = useState([]);

  const [isEnd, setIsEnd] = useState(false);

  const firstTimeRender = useRef(true);

  const nextCursors = useRef(undefined);

  const addNew = useRef(true);

  const { data, isLoading, isSuccess } = getData("/data/random", dataQueries);

  const handleQueryChange = useCallback((queryData) => {
    // Xóa queries cũ với giá trị mới nhất của prevQueries
    queryClient.removeQueries({ queryKey: ["/data/random"] });

    setDataQueries(() => {
      // Tạo queries mới
      let queries;
      switch (queryData.type) {
        case "search":
          queries = { tag: queryData.id };
          break;
        case "sort":
          queries = { sort: queryData.id };
          break;
        default:
          queries = {};
      }

      scrollToTop();
      addNew.current = true;
      return queries; // Trả về state mới
    });
  }, []);

  useEffect(() => {
    if (data) {
      if (addNew.current) {
        setVidList(data.video);

        setShortList(data.short);

        addNew.current = false;
      } else {
        if (data.video.length) {
          setVidList((prev) => [...prev, ...data.video]);
        }

        if (data.short.length) {
          setShortList((prev) => [...prev, ...data.short]);
        }
      }

      nextCursors.current = data.cursors;
    }
  }, [data]);

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

  useEffect(() => {
    if (isEnd && nextCursors.current) {
      setDataQueries((prev) => ({
        ...prev,
        cursors: nextCursors.current,
      }));
    }
  }, [isEnd]);

  useEffect(() => {
    scrollToTop();
    const handleScroll = () => {
      IsEnd(setIsEnd);
    };

    const handleBeforeUnLoad = () => {
      cleanSessionCookies("random");
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("beforeunload", handleBeforeUnLoad);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (firstTimeRender.current === false) {
        handleBeforeUnLoad();
        queryClient.invalidateQueries("/data/random");
      }

      window.removeEventListener("beforeunload", handleBeforeUnLoad);

      firstTimeRender.current = false;
    };
  }, []);

  return (
    <div className=' pb-[40px]'>
      <div
        className={`h-[56px] left-0 md:left-[74px] ${
          openedMenu && "xl:!left-[227px]"
        } right-0 px-[24px] fixed top-[56px] z-[200] bg-black overflow-hidden`}
      >
        <Filters handleQueryChange={handleQueryChange} />
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
