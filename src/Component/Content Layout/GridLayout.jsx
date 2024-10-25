import { useState, useRef, useEffect, Fragment } from "react";
import ShortVids from "../Short/ShortVids";
import CardRow from "../Video/CardRow";
import { vidList2 as mockList } from "../../Mock Data/videoData";
import { chunkArray } from "../../util/func";

const mockShortList = Array.from({ length: 15 }, (_, i) => i + 1);

const GridLayout = ({ openedMenu, vidList, shortList }) => {
  const [showQtt, setShowQtt] = useState(1);

  const [showCard, setShowCard] = useState(1);

  const [rows, setRows] = useState([]);

  const vidsRowsArr = useRef(Array.from({ length: 2 }, (_, i) => i));

  const handleResizeShort = () => {
    if (window.innerWidth < 426) {
      setShowQtt(1);
    } else if (window.innerWidth < 640) {
      setShowQtt(2);
    } else if (window.innerWidth < 1024) {
      setShowQtt(3);
    } else if (window.innerWidth < 1168) {
      setShowQtt(4);
    } else if (window.innerWidth < 1436) {
      setShowQtt(5);
    } else if (window.innerWidth < 1760) {
      if (openedMenu) {
        setShowQtt(5);
      } else setShowQtt(6);
    } else if (window.innerWidth < 2086) {
      if (openedMenu) {
        setShowQtt(6);
      } else setShowQtt(7);
    } else if (window.innerWidth < 2256) {
      if (openedMenu) {
        setShowQtt(7);
      } else setShowQtt(9);
    } else setShowQtt(9);
  };

  const handleResizeCard = () => {

    if (window.innerWidth < 640) {
      setShowCard(1);
    } else if (window.innerWidth < 1024) {
      setShowCard(2);
    } else if (window.innerWidth < 1280) {
      setShowCard(3);
    } else if (window.innerWidth < 1536) {
      if (openedMenu) {
        setShowCard(3);
      } else {
        setShowCard(4);
      }
    } else if (window.innerWidth < 1760) {
      setShowCard(4);
    } else if (window.innerWidth < 2086) {
      if (openedMenu) {
        setShowCard(4);
      } else {
        setShowCard(5);
      }
    } else if (window.innerWidth < 2256) {
      if (openedMenu) {
        setShowCard(5);
      } else {
        setShowCard(6);
      }
    } else setShowCard(6);
  };

  useEffect(() => {
    setRows(chunkArray(vidList, showCard * 2));
  }, [showCard, vidList]);

  return (
    <>
      {rows.map((row, id) => (
        <Fragment key={id}>
          <div className='flex flex-col'>
            {vidsRowsArr.current &&
              vidsRowsArr.current.map((item, id) => (
                <CardRow
                  key={id}
                  handleResize={handleResizeCard}
                  showQtt={showCard}
                  openedMenu={openedMenu}
                  vidList={(row || mockList)?.slice(
                    item * showCard,
                    item * showCard + showCard
                  )}
                />
              ))}
          </div>
          <ShortVids
            openedMenu={openedMenu}
            handleResize={handleResizeShort}
            showQtt={showQtt}
            shortList={shortList || mockShortList}
          />
        </Fragment>
      ))}
    </>
  );
};
export default GridLayout;
