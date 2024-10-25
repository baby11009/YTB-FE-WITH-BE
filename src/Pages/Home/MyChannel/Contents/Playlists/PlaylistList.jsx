import { useState, useLayoutEffect, useEffect, useRef } from "react";
import { PlaylistCard } from "../../../../../Component";
import { tgbPl as list } from "../../../../../Mock Data/playlistData";

const PlaylistRow = ({ showQtt, plList }) => {
  const [vrArr, setVrArr] = useState([]);

  useLayoutEffect(() => {
    setVrArr(Array.from({ length: showQtt - plList?.length }, (_, i) => i));
  }, [showQtt, plList]);

  return (
    <div className='flex mx-[-8px]'>
      {plList.map((item, index) => (
        <PlaylistCard
          key={index}
          data={item}
          showL3={false}
          containerStyle={"!ml-0 !mr-[4px] !mb-[24px]"}
        />
      ))}
      {vrArr.map((item) => (
        <div className='flex-1' key={item}></div>
      ))}
    </div>
  );
};

const PlaylistList = ({ playlistList, isLoading }) => {
  const containerRef = useRef();

  const [showQtt, setShowQtt] = useState(6);

  const [rows, setRows] = useState(3);

  const handleResize = () => {
    if (containerRef.current.offsetWidth > 1070 && containerRef.current) {
      setShowQtt(6);
    } else if (
      containerRef.current.offsetWidth === 1070 &&
      containerRef.current
    ) {
      setShowQtt(5);
    } else if (
      containerRef.current.offsetWidth === 856 &&
      containerRef.current
    ) {
      setShowQtt(4);
    } else if (
      containerRef.current.offsetWidth === 642 &&
      containerRef.current
    ) {
      setShowQtt(3);
    } else if (
      containerRef.current.offsetWidth === 428 &&
      containerRef.current
    ) {
      setShowQtt(2);
    } else setShowQtt(1);
  };

  useLayoutEffect(() => {
    // Function to update state with current window width
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setRows(Math.ceil(playlistList?.length / showQtt));
  }, [showQtt, playlistList]);

  return (
    <div className='w-full' ref={containerRef}>
      {[...Array(rows)].map((_, index) => (
        <PlaylistRow
          showQtt={showQtt}
          key={index}
          plList={playlistList.slice(index * showQtt, (index + 1) * showQtt)}
        />
      ))}
      {isLoading && (
        <div className='mt-[20px] mb-[40px] flex items-center justify-center'>
          <div
            className='w-[40px] h-[40px] rounded-[50px] border-[3px] border-[rgba(255,255,255,0.4)] 
        border-b-[transparent] border-l-[transparent] animate-spin'
          ></div>
        </div>
      )}
    </div>
  );
};
export default PlaylistList;
