import VideoCard from "./VideoCard";
import PlayListCard from "../Playlist/PlayListCard";

const CardRow = ({ vidList, showBtn }) => {
  return (
    <>
      {vidList?.map((item, index) => {
        if (item?.video_list) {
          return <PlayListCard data={item} key={index} />;
        }
        return (
          <VideoCard
            data={item}
            key={index}
            showBtn={showBtn}
            infoStyle={"flex-col "}
            descStyle={"!hidden"}
          />
        );
      })}
    </>
  );
};
export default CardRow;
