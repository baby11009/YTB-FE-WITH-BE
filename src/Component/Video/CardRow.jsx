import VideoCard from "./VideoCard";
import PlayListCard from "../Playlist/PlayListCard";

const CardRow = ({ vidList, showBtn }) => {
  return (
    <>
      {vidList?.map((item, index) => {
        if (item?.video_list) {
          return (
            <PlayListCard
              data={item}
              key={index}
              imgStyle={"w-full max-h-[185.3px]"}
            />
          );
        }
        return (
          <VideoCard
            data={item}
            key={index}
            showBtn={showBtn}
            descStyle={"!hidden"}
          />
        );
      })}
    </>
  );
};
export default CardRow;
