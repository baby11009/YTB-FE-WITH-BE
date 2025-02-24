import {
  ButtonHorizonSlider,
  ShortHorizonSlider,
  PlaylistCard2,
} from "../../../../Component";
import PlayList from "./Playlist/Playlist";
import CustomVideoCard from "./CustomVideoCard";
import { memo } from "react";

const Other = ({
  videoId,
  playlistId,
  combineData,
  handleSort,
  handleShowMore,
  currentSortId,
  playlistInfo,
  playlistVideos,
  playlistCurrentVideoIndex,
  playlistNextVideoInfo,
  handlePlaylistShowMore,
  handleModifyVideoList,
  setPlaylistStatus,
  playlistStatus,
}) => {
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

  return (
    <div>
      {playlistId && (
        <PlayList
          videoId={videoId}
          playlistInfo={playlistInfo}
          playlistVideos={playlistVideos}
          playlistCurrentVideoIndex={playlistCurrentVideoIndex}
          playlistNextVideoInfo={playlistNextVideoInfo}
          handlePlaylistShowMore={handlePlaylistShowMore}
          handleModifyVideoList={handleModifyVideoList}
          playlistStatus={playlistStatus}
          setPlaylistStatus={setPlaylistStatus}
        />
      )}
      <ButtonHorizonSlider buttonList={buttonList} currentId={currentSortId} />
      {combineData.map((data, id) => (
        <div key={id + 1}>
          {data.videoList?.length > 0 &&
            (data.videoList[0].type === "video" ? (
              <CustomVideoCard
                data={data.videoList[0]}
                index={0}
                size={data.videoList.length}
              />
            ) : (
              <PlaylistCard2
                data={data.videoList[0]}
                containerStyle={"h-[94px]"}
              />
            ))}

          {data.shortList.length > 0 && (
            <ShortHorizonSlider
              cardWidth={(402 - 8) / 3}
              thumbnailHeight={(402 / 3 / 9) * 16}
              shortList={data.shortList}
            />
          )}

          {data.videoList?.length > 1 && (
            <div>
              {data.videoList.slice(1).map((item, index) => {
                if (item.type === "video") {
                  return (
                    <CustomVideoCard
                      key={item?._id}
                      data={item}
                      index={index}
                      size={data.videoList.length}
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
        </div>
      ))}

      {handleShowMore && (
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
export default memo(Other);
