import { ShortCard } from "../../../../../Component";
import { useState, useLayoutEffect, useEffect, useRef } from "react";
import { useAuthContext } from "../../../../../Auth Provider/authContext";
const ShortList = ({ shortList, isLoading }) => {
  const { openedMenu } = useAuthContext();

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

  return (
    <div
      className={`grid grid-cols-1 xsm:grid-cols-2 sm:grid-cols-3 2md:grid-cols-4 2lg:grid-cols-5 
      ${
        openedMenu
          ? "1312:grid-cols-4 1360:grid-cols-5  1573:grid-cols-6"
          : "1400:grid-cols-6"
      }`}
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
