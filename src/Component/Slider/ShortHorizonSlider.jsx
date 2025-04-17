import { Short2Icon } from "../../Assets/Icons";
import Slider from "./Slider";
import ShortCard2 from "../Short/ShortCard2";
const ShortHorizonSlider = ({ cardWidth, thumbnailHeight, shortList = [] }) => {
  return (
    <div className='mt-[24px] border-t-[1px] border-b-[1px] border-black-0.2 pb-[24px]'>
      <div className='mt-[24px]'>
        <div className='mr-[8px] w-[24px] inline-block'>
          <Short2Icon />
        </div>
        <span className='text-[20px] leading-[28px] font-bold'>Shorts</span>
      </div>
      <div className='mt-[24px]'>
        <Slider
          dragScroll={false}
          scrollDuration={200}
          buttonPosition={thumbnailHeight / 2}
        >
          {shortList.map((short, index) => (
            <ShortCard2
              key={short._id}
              cardWidth={cardWidth}
              thumbnailHeight={thumbnailHeight}
              listLength={shortList.length}
              index={index}
              short={short}
            />
          ))}
        </Slider>
      </div>
    </div>
  );
};
export default ShortHorizonSlider;
