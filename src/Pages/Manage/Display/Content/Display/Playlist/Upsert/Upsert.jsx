import { useState, useLayoutEffect, useRef } from "react";
import Details from "./Details";
import VideoList from "./VIdeoList";
import { Slider } from "../../../../../../../Component";

const Upsert = ({ title, id, func }) => {
  const [currFunc, setCurrFunc] = useState(func);

  console.log("🚀 ~ currFunc:", currFunc);

  return (
    <div
      className='bg-black max-w-[1500px] max-h-[95vh] h-[200px] shadow-[0_0_8px_2px_rgba(140,140,140,0.5)] rounded-[5px] 
     p-[16px]  xl:p-[24px]  '
    >
      <h1 className='text-nowrap text-[25px] leading-[32px] font-[600]'>
        Playlist edtting
      </h1>
      <Slider>
        <div>Details</div>
        <div>List</div>
      </Slider>
    </div>
  );
};
export default Upsert;
