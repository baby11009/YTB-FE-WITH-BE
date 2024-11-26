import {
  ThickGridIcon,
  EmptyGridIcon,
  ListIcon,
} from "../../../../Assets/Icons";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { GridLayout, ListLayout } from "../../../../Component";
import request from "../../../../util/axios-base-url";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "../../../../util/tokenHelpers";
import { IsEnd } from "../../../../util/scrollPosition";
import { useSearchParams } from "react-router-dom";

const AllContent = ({ openedMenu }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [layout, setLayout] = useState("grid");

  const [isEnd, setIsEnd] = useState(false);

  const [videoQueriese, setVideoQueriese] = useState({
    page: 1,
    limit: 12,
    type: "video",
  });

  const [shortQueriese, setShortQueriese] = useState({
    page: 1,
    limit: 12,
    type: "short",
  });

  const [videoList, setVideoList] = useState([]);

  const [shortList, setShortList] = useState([]);

  const [videoAddNew, setVideoAddNew] = useState(true);

  const videoIdsSet = useRef(new Set());

  const shortIdsSet = useRef(new Set());

  const { data: videoData } = useQuery({
    queryKey: [...Object.values(videoQueriese)],
    queryFn: async () => {
      try {
        const rsp = await request.get(
          "/client/user/subscribed-channels-videos",
          {
            headers: {
              Authorization: `${import.meta.env.VITE_AUTH_BEARER} ${getCookie(
                import.meta.env.VITE_AUTH_TOKEN
              )}`,
            },
            params: videoQueriese,
          }
        );

        return rsp.data;
      } catch (error) {
        alert("Failed to get channel list");
        console.error(error);
      }
    },
    suspense: true,
    cacheTime: 0,
  });

  const { data: shortData } = useQuery({
    queryKey: [...Object.values(shortQueriese)],
    queryFn: async () => {
      try {
        const rsp = await request.get(
          "/client/user/subscribed-channels-videos",
          {
            headers: {
              Authorization: `${import.meta.env.VITE_AUTH_BEARER} ${getCookie(
                import.meta.env.VITE_AUTH_TOKEN
              )}`,
            },
            params: shortQueriese,
          }
        );

        return rsp.data;
      } catch (error) {
        alert("Failed to get channel list");
        console.error(error);
      }
    },
    suspense: true,
    cacheTime: 0,
  });

  useEffect(() => {
    if (videoData) {
      if (videoAddNew) {
        videoIdsSet.current.clear();
        videoData?.data.forEach((item) => videoIdsSet.current.add(item._id));
        setVideoList(videoData?.data);
        setVideoAddNew(false);
      } else {
        const finalData = [];
        videoData?.data.forEach((video) => {
          if (!videoIdsSet.current.has(video?._id)) {
            videoIdsSet.current.add(video?._id);
            finalData.push(video);
          }
        });
        setVideoList((prev) => [...prev, ...finalData]);
      }
    }
  }, [videoData]);

  useEffect(() => {
    if (shortData) {
      shortIdsSet.current.clear();
      shortData?.data.forEach((item) => shortIdsSet.current.add(item._id));
      setShortList(shortData?.data);
    }
  }, [shortData]);

  useEffect(() => {
    setLayout(searchParams.get("layout"));
  }, [searchParams]);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      IsEnd(setIsEnd);
    });
    return () => {
      window.removeEventListener("scroll", () => {
        IsEnd(setIsEnd);
      });
    };
  }, []);

  useEffect(() => {
    if (isEnd) {
      if (videoData?.totalPage > videoQueriese.page) {
        setVideoQueriese((prev) => ({ ...prev, page: prev.page + 1 }));
      }
    }
  }, [isEnd]);

  return (
    <div>
      {layout === "grid" && (
        <div className='pt-[24px] m-[24px] flex items-center justify-between'>
          <span className='text-[20px] leading-[20px] font-bold'>Latest</span>
          <div className='flex items-center h-[20px]'>
            <Link
              className='px-[16px] rounded-[18px] hover:bg-[#263850] cursor-pointer'
              to={`/sub-channels`}
            >
              <span className=' text-nowrap text-[14px] leading-[36px] font-[500] text-blue-3E'>
                Manage
              </span>
            </Link>

            <div
              className='w-[40px] h-[40px] rounded-[50%] hover:bg-black-0.2 flex items-center justify-center cursor-pointer'
              onClick={() => setSearchParams({ layout: "grid" })}
            >
              {layout === "grid" ? <ThickGridIcon /> : <EmptyGridIcon />}
            </div>
            <div
              className='w-[40px] h-[40px] rounded-[50%] hover:bg-black-0.2 flex items-center justify-center cursor-pointer'
              onClick={() => setSearchParams({ layout: "list" })}
            >
              <ListIcon />
            </div>
          </div>
        </div>
      )}

      <div className='mx-[16px]'>
        {layout === "grid" ? (
          <GridLayout
            openedMenu={openedMenu}
            vidList={videoList}
            shortList={shortList}
          />
        ) : (
          <ListLayout
            openedMenu={openedMenu}
            vidList={videoList}
            shortList={shortList}
            layout={layout}
            setLayout={(layout) => {
              setSearchParams({ layout });
            }}
          />
        )}
      </div>
    </div>
  );
};
export default AllContent;
