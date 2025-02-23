import { useState, useLayoutEffect, useEffect, useRef } from "react";
import { PlaylistCard } from "../../../../../Component";

const PlaylistList = ({ playlistList, isLoading }) => {
  const containerRef = useRef();

  const [showQtt, setShowQtt] = useState(6);

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
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className='grid grid-cols-1 xsm:grid-cols-2 sm:grid-cols-3 2md:grid-cols-4 1336:grid-cols-6 '
      // style={{ gridTemplateColumns: `repeat(${showQtt}, minmax(0, 1fr)` }}
      ref={containerRef}
    >
      {playlistList.map((item, id) => (
        <PlaylistCard
          key={id}
          data={item}
          showL3={false}
          containerStyle={"!ml-0 !mr-[4px] !mb-[24px]"}
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
