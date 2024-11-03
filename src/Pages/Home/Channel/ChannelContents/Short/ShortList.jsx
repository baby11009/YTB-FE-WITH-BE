import { ShortCard } from "../../../../../Component";
import { useState, useLayoutEffect, useEffect, useRef } from "react";

const ShortsRow = ({ showQtt, dataList }) => {
  const [vrArr, setVrArr] = useState([]);

  useLayoutEffect(() => {
    setVrArr(Array.from({ length: showQtt - dataList?.length }, (_, i) => i));
  }, [showQtt, dataList]);
  return (
    <div className='flex mx-[-8px]'>
      {dataList.map((item, index) => (
        <ShortCard
          key={index}
          data={item}
          containerStyle={"!mx-[2px] !mb-[20px]"}
        />
      ))}
      {vrArr.map((item) => (
        <div className='flex-1' key={item}></div>
      ))}
    </div>
  );
};

const ShortList = ({ shortList, isLoading }) => {
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
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setRows(Math.ceil(shortList?.length / showQtt));
  }, [showQtt, shortList]);

  return (
    <div
      className='w-full grid'
      style={{ gridTemplateColumns: `repeat(${showQtt},minmax(0,1fr))` }}
      ref={containerRef}
    >
      {shortList.map((item, id) => (
        <ShortCard
          key={id}
          data={item}
          containerStyle={"!mx-[2px] !mb-[20px]"}
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
export default ShortList;
