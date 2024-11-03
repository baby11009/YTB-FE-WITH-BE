import VideoCard from "./VideoCard";
import PlayListCard from "../Playlist/PlayListCard";
import { useLayoutEffect, useState } from "react";

const CardRow = ({ vidList, handleResize, showQtt, openedMenu, showBtn }) => {
  const [vrArr, setVrArr] = useState([]);

  useLayoutEffect(() => {
    setVrArr(Array.from({ length: showQtt - vidList?.length }, (_, i) => i));
  }, [showQtt, vidList]);

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
              imgStyle={"max-h-[185.3px]"}
            />
          );
        }
        return (
          <VideoCard
            data={item}
            key={index}
            showBtn={showBtn}
            descStyle={"!hidden"}
            funcBoxPos={(index + 1) % showQtt === 0 && "sm:right-[20%]"}
          />
        );
      })}

    </div>
  );
};
export default CardRow;
