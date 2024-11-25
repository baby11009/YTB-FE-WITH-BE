import { CustomeFuncBox2, PlaylistCard } from "../../../Component";
import { useState, useEffect, useLayoutEffect } from "react";
import { getDataWithAuth } from "../../../Api/getData";
import { IsEnd } from "../../../util/scrollPosition";
import { useQueryClient } from "@tanstack/react-query";

const PlaylistsPart = ({ openedMenu }) => {
  const queryClient = useQueryClient();

  const [activeId, setActiveId] = useState({
    id: 2,
    text: "Newest",
  });

  const [isEnd, setIsEnd] = useState(false);

  const [params, setParams] = useState({
    page: 1,
    limit: 16,
    videoLimit: 1,
    sort: { createdAt: -1 },
  });

  const { data: playlists } = getDataWithAuth(
    "/client/playlist",
    params,
    true,
    true
  );

  const [showQtt, setShowQtt] = useState(4);

  const [dataList, setDataList] = useState([]);

  const handleSetActive = (data) => {
    if (params.sort[data.slug]) {
      return;
    }
    setActiveId({
      id: data.id,
      text: data.text,
    });
    setParams((prev) => ({ ...prev, sort: { [data.slug]: data?.data } }));
  };

  const funcList = [
    {
      id: 1,
      text: "A-Z",
      slug: "title",
      data: 1,
      handleOnClick: handleSetActive,
    },
    {
      id: 2,
      text: "Newest",
      slug: "createdAt",
      data: -1,
      handleOnClick: handleSetActive,
    },
  ];

  const handleResize = () => {
    if (window.innerWidth < 426) {
      setShowQtt(1);
    } else if (window.innerWidth < 640) {
      setShowQtt(2);
    } else if (window.innerWidth < 1168) {
      setShowQtt(3);
    } else if (window.innerWidth < 1280) {
      setShowQtt(4);
    } else if (window.innerWidth < 1436) {
      if (openedMenu) {
        setShowQtt(3);
      } else setShowQtt(4);
    } else if (window.innerWidth < 1760) {
      if (openedMenu) {
        setShowQtt(4);
      } else setShowQtt(5);
    } else if (window.innerWidth < 2086) {
      if (openedMenu) {
        setShowQtt(5);
      } else setShowQtt(6);
    } else setShowQtt(7);
  };

  useEffect(() => {
    handleResize();

    window.addEventListener("resize", () => {
      handleResize();
    });

    return () => {
      window.removeEventListener("resize", () => {
        handleResize();
      });
      queryClient.clear();
    };
  }, [openedMenu]);

  useLayoutEffect(() => {
    document.addEventListener("scroll", () => {
      IsEnd(setIsEnd);
    });

    return () => {
      document.removeEventListener("scroll", () => {
        IsEnd(setIsEnd);
      });
    };
  }, []);

  useEffect(() => {
    if (isEnd && params.page < playlists?.totalPage) {
      setParams((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  }, [isEnd]);

  useEffect(() => {
    if (playlists) {
      setDataList(playlists?.data);
    }
  }, [playlists]);

  return (
    <div>
      <div className='mx-[24px]'>
        <span className='text-[36px] leading-[50px] font-bold  '>Playlist</span>
      </div>
      <div className='pt-[16px] px-[24px]'>
        <CustomeFuncBox2 funcList={funcList} activeId={activeId} />
      </div>
      <div className='pt-[24px] mx-[16px] flex '>
        <div
          className={` grid`}
          style={{ gridTemplateColumns: `repeat(${showQtt}, minmax(0, 1fr))` }}
        >
          {dataList.map((item, id) => (
            <PlaylistCard key={id} data={item} showL3={item?.size > 1} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default PlaylistsPart;
