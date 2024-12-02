import VideoCard from "./VideoCard";
import PlayListCard from "../Playlist/PlayListCard";
import { useLayoutEffect } from "react";

const CardRow = ({ vidList, handleResize, showQtt, openedMenu, showBtn }) => {
  useLayoutEffect(() => {
    // Function to update state with current window width
    handleResize();
    window.addEventListener("resize", () => {
      handleResize();
    });

    return () => {
      window.removeEventListener("resize", () => {
        handleResize();
      });
    };
  }, [openedMenu]);

  return (
    <div
      className='grid'
      style={{ gridTemplateColumns: `repeat(${showQtt}, minmax(0, 1fr)` }}
    >
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
    </div>
  );
};
export default CardRow;
