import { useState, useRef, useEffect, Fragment } from "react";
import ShortVids from "../Short/ShortVids";
import CardRow from "../Video/CardRow";
import { chunkArray } from "../../util/func";

const GridLayout = ({ openedMenu, vidList, shortList }) => {
  const [showQtt, setShowQtt] = useState(1);

  const [showCard, setShowCard] = useState(1);

  const [renderRows, setRenderRows] = useState([]);

  const [videoRows, setVideoRows] = useState([]);

  const [shortRows, setShortRows] = useState([]);

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
    setVideoRows(chunkArray(vidList, showCard * 2));
  }, [showCard, vidList]);

  useEffect(() => {
    setShortRows(chunkArray(shortList, showQtt * 2));
  }, [showQtt, shortList]);

  useEffect(() => {
    setRenderRows(() => {
      const rowLength =
        shortRows.length > videoRows.length
          ? shortRows.length
          : videoRows.length;

      return Array.from({ length: rowLength }, (_, i) => i);
    });
  }, [videoRows, shortRows]);

  return (
    <>
      {renderRows.map((row, index) => (
        <Fragment key={row}>
          <div className='flex flex-col'>
            {vidsRowsArr.current &&
              vidsRowsArr.current.map((item, id) => (
                <CardRow
                  key={id}
                  handleResize={handleResizeCard}
                  showQtt={showCard}
                  openedMenu={openedMenu}
                  vidList={videoRows[row]?.slice(
                    item * showCard,
                    item * showCard + showCard,
                  )}
                />
              ))}
          </div>
          {shortRows[row] && (
            <ShortVids
              openedMenu={openedMenu}
              handleResize={handleResizeShort}
              showQtt={showQtt}
              shortList={shortRows[row]}
            />
          )}
        </Fragment>
      ))}
    </>
  );
};
export default GridLayout;
