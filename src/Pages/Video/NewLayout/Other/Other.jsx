import {
  useRef,
  useEffect,
  useState,
  useLayoutEffect,
  useCallback,
} from "react";
import {
  ButtonHorizonSlider,
  ShortHorizonSlider,
  VideoCard2,
  PlaylistCard2,
} from "../../../../Component";
import { getData } from "../../../../Api/getData";
import { useQueryClient } from "@tanstack/react-query";
import PlayList from "./Playlist/Playlist";
import CustomVideoCard from "./CustomVideoCard";

const initVideoQuery = {
  page: 1,
  limit: 12,
  type: "video",
  watchedVideoIdList: [],
  sort: undefined,
  prevPlCount: 0,
};

const initShortQuery = {
  page: 1,
  limit: 12,
  type: "short",
  sort: undefined,
};

const Other = ({
  videoId,
  playlistId,
  isEnd,
  showMore,
  setNextVideoPath,
  setPlaylistStatus,
  playlistStatus,
}) => {
  const [firstRender, setFirstRender] = useState(true);

  const currPlaylistId = useRef();

  const queryClient = useQueryClient();

  const [addNew, setAddNew] = useState();

  const [shortAddNew, setShortAddNew] = useState();

  const [videoQuery, setVideoQuery] = useState(undefined);

  const [videoList, setVideoList] = useState([]);

  const videoIdList = useRef(new Set());

  const { data: videoData } = getData(
    `/data/all`,
    videoQuery,
    !!videoQuery,
    false,
  );

  const [shortQuery, setShortQuery] = useState(undefined);

  const [shortList, setShortList] = useState([]);

  const shortIdList = useRef(new Set());

  const { data: shortData, isLoading } = getData(
    `/data/all`,
    shortQuery,
    !!shortQuery,
    false,
  );

  const currentSortId = useRef("all");

  const handleSort = useCallback((data) => {
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
      reset: videoId,
      sort: data.value,
    });
    setShortQuery({
      ...initShortQuery,
      reset: videoId,
      sort: data.value,
    });
    setAddNew(true);
    setShortAddNew(true);
    currentSortId.current = data.id;
  });

  const buttonList = [
    {
      id: "all",
      title: "All",
      value: undefined,
      handleOnClick: handleSort,
    },
    {
      id: "latest",
      title: "Latest",
      value: { createdAt: -1 },
      handleOnClick: handleSort,
    },
    {
      id: "view",
      title: "Popular",
      value: { view: -1 },
      handleOnClick: handleSort,
    },
    {
      id: "oldest",
      title: "Oldest",
      value: { createdAt: 1 },
      handleOnClick: handleSort,
    },
    {
      id: "test1",
      title: "Hello World",
    },
    {
      id: "test2",
      title: "Hello VOHUYTHANH",
    },
    {
      id: "test3",
      title: "THIS IS MY CODE",
    },
  ];

  const handleShowMore = () => {
    setVideoQuery((prev) => ({
      ...prev,
      page: prev.page + 1,
      watchedVideoIdList: [
        ...prev.watchedVideoIdList,
        ...[...videoIdList.current],
      ],
      prevPlCount: videoList.filter((data) => data.video_list).length,
    }));
  };

  useLayoutEffect(() => {
    if (!playlistId || firstRender || playlistId !== currPlaylistId.current) {
      setFirstRender(false);
      currPlaylistId.current = playlistId;

      videoIdList.current.clear();
      setVideoQuery({
        ...initVideoQuery,
        reset: videoId,
        watchedVideoIdList: [videoId],
      });
      setAddNew(true);
      setVideoList([]);

      shortIdList.current.clear();
      setShortQuery({
        ...initShortQuery,
        reset: videoId,
      });
      setShortAddNew(true);
      setShortList([]);
    }
  }, [videoId]);

  useEffect(() => {
    if (videoData) {
      if (addNew) {
        videoIdList.current.clear();
        videoData?.data.forEach((video) => {
          if (!videoIdList.current.has(video?._id)) {
            videoIdList.current.add(video?._id);
          }
        });
        setVideoList(videoData?.data);
        setAddNew(false);
      } else {
        const finalList = [];
        videoData?.data.forEach((video) => {
          if (!videoIdList.current.has(video?._id)) {
            videoIdList.current.add(video?._id);
            finalList.push(video);
          }
        });
        setVideoList((prev) => [...prev, ...finalList]);
      }
    }
  }, [videoData]);

  useEffect(() => {
    if (shortData) {
      if (shortAddNew) {
        shortIdList.current.clear();
        shortData?.data.forEach((short) => {
          if (!shortIdList.current.has(short?._id)) {
            shortIdList.current.add(short?._id);
          }
        });
        setShortList(shortData?.data);
        setShortAddNew(false);
      } else {
        const finalList = [];
        shortData?.data.forEach((short) => {
          if (!shortIdList.current.has(short?._id)) {
            shortIdList.current.add(short?._id);
            finalList.push(short);
          }
        });
        setShortList((prev) => [...prev, ...finalList]);
      }
    }
  }, [shortData]);

  useEffect(() => {
    if (
      !showMore &&
      isEnd &&
      videoData &&
      videoData?.data?.length === videoQuery.limit
    ) {
      handleShowMore();
    }
  }, [isEnd]);

  return (
    <div>
      {playlistId && (
        <PlayList
          playlistId={playlistId}
          videoId={videoId}
          setNextVideoPath={setNextVideoPath}
          playlistStatus={playlistStatus}
          setPlaylistStatus={setPlaylistStatus}
        />
      )}
      <ButtonHorizonSlider
        buttonList={buttonList}
        currentId={currentSortId.current}
      />
      {videoList.length > 0 &&
        (videoList[0].type === "video" ? (
          <CustomVideoCard
            data={videoList[0]}
            index={0}
            size={videoList.length}
          />
        ) : (
          <PlaylistCard2 data={videoList[0]} containerStyle={"h-[94px]"} />
        ))}
      {shortData && shortList.length > 0 && (
        <ShortHorizonSlider
          cardWidth={(402 - 8) / 3}
          thumbnailHeight={(402 / 3 / 9) * 16}
          shortList={shortList}
        />
      )}
      {videoList.length > 0 && (
        <div>
          {videoList.slice(1).map((item, index) => {
            if (item.type === "video") {
              return (
                <CustomVideoCard
                  key={item?._id}
                  data={item}
                  index={index}
                  size={videoList.length}
                />
              );
            }
            return (
              <PlaylistCard2
                key={item?._id}
                data={item}
                containerStyle={"h-[94px]"}
              />
            );
          })}
        </div>
      )}
      {showMore && videoData?.data?.length === videoQuery?.limit && (
        <button
          className='px-[15px] border-[1px] border-black-0.2 hover:bg-blue-26
         hover:border-transparent w-full rounded-[18px]'
          onClick={() => {
            handleShowMore();
          }}
        >
          <div
            className=' whitespace-nowrap overflow-hidden text-ellipsis text-[14px] 
          leading-[36px] font-[500] text-blue-3E'
          >
            Show more
          </div>
        </button>
      )}
    </div>
  );
};
export default Other;
