import { ShortHorizonSlider, PlaylistCard2 } from "../../../../Component";
import PlayList from "./Playlist/Playlist";
import CustomVideoCard from "./CustomVideoCard";
import { memo } from "react";
import Filters from "./Filters";

const Other = ({
  videoId,
  playlistId,
  otherDataList,
  handleQueryChange,
  handleShowMore,
  playlistInfo,
  playlistVideos,
  playlistCurrentVideoIndex,
  playlistNextVideoInfo,
  handlePlaylistShowMore,
  handleModifyVideoList,
  setPlaylistStatus,
  playlistStatus,
  queryBtns,
  currentQuery,
}) => {
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
      <Filters buttonList={queryBtns} currentQuery={currentQuery} />
      {otherDataList.length &&
        otherDataList.map((data, index) => (
          <div key={data?._id || index}>
            {Array.isArray(data) ? (
              <ShortHorizonSlider
                cardWidth={(402 - 8) / 3}
                thumbnailHeight={(402 / 3 / 9) * 16}
                shortList={data}
              />
            ) : data.type === "video" ? (
              <CustomVideoCard data={data} index={index} />
            ) : (
              <PlaylistCard2 data={data} containerStyle={"h-[94px]"} />
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
