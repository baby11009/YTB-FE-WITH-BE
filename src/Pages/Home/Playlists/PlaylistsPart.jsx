import { CustomeFuncBox2, PlaylistCard } from "../../../Component";
import { useState, useEffect, useLayoutEffect } from "react";
import { getData } from "../../../Api/getData";
import { IsEnd } from "../../../util/scrollPosition";

const PlaylistsPart = ({ openedMenu }) => {
  const [activeId, setActiveId] = useState({
    id: 2,
    text: "Newest",
  });

  const [isEnd, setIsEnd] = useState(false);

  const [queriese, setQueriese] = useState({
    page: 1,
    limit: 16,
    videoLimit: 1,
    sort: { createdAt: -1 },
  });

  const { data: playlists } = getData(
    "/user/playlist",
    queriese,
    true,
    false,
  );

  const [dataList, setDataList] = useState([]);

  const handleSetActive = (data) => {
    if (queriese.sort[data.slug]) {
      return;
    }
    setActiveId({
      id: data.id,
      text: data.text,
    });
    setQueriese((prev) => ({ ...prev, sort: { [data.slug]: data?.data } }));
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
    if (isEnd && queriese.page < playlists?.totalPage) {
      setQueriese((prev) => ({ ...prev, page: prev.page + 1 }));
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
        <span className='text-[36px] leading-[50px] font-bold'>Playlist</span>
      </div>
      <div className='pt-[16px] px-[24px]'>
        <CustomeFuncBox2 funcList={funcList} activeId={activeId} />
      </div>
      {dataList.length > 0 && (
        <div className='pt-[24px] mx-[16px] flex '>
          <div
            className={`grid 4xl:grid-cols-7 ${
              openedMenu
                ? "3xl:grid-cols-5 1-5xl:grid-cols-4 1275:grid-cols-3"
                : "3xl:grid-cols-6 1-5xl:grid-cols-5 1275:grid-cols-4"
            } 2lg:grid-cols-4 642:grid-cols-3 xsm:grid-cols-2 grid-cols-1`}
          >
            {dataList.map((item, id) => (
              <PlaylistCard key={id} data={item} showL3={item?.size > 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default PlaylistsPart;
