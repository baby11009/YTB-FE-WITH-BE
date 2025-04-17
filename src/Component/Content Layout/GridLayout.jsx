import { useState, useEffect, useMemo, Fragment } from "react";
import ShortRow from "../Short/ShortRow";
import CardRow from "../Video/CardRow";
import { chunkArray } from "../../util/func";

const GridLayout = ({ openedMenu, vidList, shortList }) => {
  const [showShortQtt, setShowShortQtt] = useState(1);
  const [showCardQtt, setShowCardQtt] = useState(1);

  const [renderRows, setRenderRows] = useState([]);

  const shortBreakpoints = [
    { max: 426, value: 1 },
    { max: 640, value: 2 },
    { max: 1024, value: 3 },
    { max: 1168, value: 4 },
    { max: 1436, value: 5 },
    { max: 1760, value: openedMenu ? 5 : 6 },
    { max: 2086, value: openedMenu ? 6 : 7 },
    { max: 2256, value: openedMenu ? 7 : 9 },
  ];

  const cardBreakpoints = [
    { max: 640, value: 1 },
    { max: 1024, value: 2 },
    { max: 1280, value: 3 },
    { max: 1536, value: openedMenu ? 3 : 4 },
    { max: 1760, value: 4 },
    { max: 2086, value: openedMenu ? 4 : 5 },
    { max: 2256, value: openedMenu ? 5 : 6 },
  ];

  const handleResize = () => {
    const width = window.innerWidth;

    setShowShortQtt(shortBreakpoints.find((bp) => width < bp.max)?.value || 9);
    setShowCardQtt(cardBreakpoints.find((bp) => width < bp.max)?.value || 6);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [openedMenu]);

  const videoRows = useMemo(
    () => chunkArray(vidList, showCardQtt * 2),
    [showCardQtt, vidList],
  );

  const shortRows = useMemo(
    () => chunkArray(shortList, showShortQtt),
    [showShortQtt, shortList],
  );

  useEffect(() => {
    setRenderRows(
      Array.from(
        { length: Math.max(videoRows.length, shortRows.length) },
        (_, i) => i,
      ),
    );
  }, [videoRows.length, shortRows.length]);

  return (
    <div className='grid'>
      {renderRows.map((row) => (
        <Fragment key={row}>
          <div
            className='grid'
            style={{
              gridTemplateColumns: `repeat(${showCardQtt}, minmax(0, 1fr)`,
            }}
          >
            <CardRow vidList={videoRows[row]} />
          </div>
          {shortRows[row] && (
            <ShortRow showQtt={showShortQtt} shortList={shortRows[row]} />
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default GridLayout;
