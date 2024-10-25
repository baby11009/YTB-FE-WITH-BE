import {
  v1_iloda,
  v1_sangtraan,
  v1_tgb,
  v1_theanh,
} from "../../../../../Assets/Images";
import { useState, useLayoutEffect, useRef, useEffect } from "react";
import { VideoCard } from "../../../../../Component";

const VideosRow = ({ dataList, showQtt }) => {
  const [vrArr, setVrArr] = useState([]);

  useLayoutEffect(() => {
    setVrArr(Array.from({ length: showQtt - dataList?.length }, (_, i) => i));
  }, [showQtt, dataList]);

  return (
    <div className='flex mx-[-8px]'>
      {dataList.map((item) => {
        return (
          <VideoCard
            data={item}
            key={item._id}
            showBtn={true}
            style={`inline-block flex-1 mx-[8px] mb-[40px]`}
            thumbStyleInline={{
              borderRadius: "12px",
            }}
            descStyle={"!hidden"}
            titleStyle={"text-[14px] leading-[20px] font-[500] max-h-[40px]"}
            noFuncBox={true}
          />
        );
      })}
      {vrArr.map((item) => (
        <div className='flex-1' key={item}></div>
      ))}
    </div>
  );
};

const VideoList = ({ vidList, isLoading }) => {
  const containerRef = useRef();

  const [showQtt, setShowQtt] = useState(4);

  const [rows, setRows] = useState(3);

  const handleResize = () => {
    if (containerRef.current.offsetWidth >= 1070 && containerRef.current) {
      setShowQtt(4);
    } else if (
      containerRef.current.offsetWidth === 856 &&
      containerRef.current
    ) {
      setShowQtt(3);
    } else if (
      containerRef.current.offsetWidth === 642 &&
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
    setRows(Math.ceil(vidList?.length / showQtt));
  }, [showQtt, vidList]);

  return (
    <div className='w-full' ref={containerRef}>
      {[...Array(rows)].map((_, index) => (
        <VideosRow
          showQtt={showQtt}
          key={index}
          dataList={vidList.slice(index * showQtt, (index + 1) * showQtt)}
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
export default VideoList;
