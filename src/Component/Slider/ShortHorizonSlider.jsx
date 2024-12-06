import { Short2Icon, Setting2Icon } from "../../Assets/Icons";
import { short1 } from "../../Assets/Images";
import { Link } from "react-router-dom";
import { formatNumber } from "../../util/numberFormat";
import Slider from "./Slider";
const ShortHorizonSlider = ({ cardWidth, thumbnailHeight, shortList = [] }) => {
  if (shortList.length < 1) {
    return <div>Failed to get shorts </div>;
  }
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
            <Link className='inline-flex ' key={short?._id}>
              <div
                className={` ${
                  index + 1 !== shortList.length && "pr-[4px]"
                } inline-block box-content `}
                style={{
                  width: cardWidth ? cardWidth + "px" : "100%",
                }}
              >
                <img
                  src={`${import.meta.env.VITE_BASE_API_URI}${
                    import.meta.env.VITE_VIEW_THUMB_API
                  }${short?.thumb}`}
                  alt='thumbnail'
                  className='w-auto object-cover object-center rounded-[8px]'
                  style={{
                    height: thumbnailHeight ? thumbnailHeight + "px" : "100%",
                  }}
                />
                <div className='pt-[8px] pr-[36px] relative '>
                  {/* Title */}
                  <div
                    className='max-h-[44px]
                       line-clamp-2 text-ellipsis text-[16px] leading-[22px] font-[500] mb-[4px]'
                  >
                    <span className='whitespace-pre-wrap'>{short?.title}</span>
                  </div>

                  {/* Views */}
                  <span className='text-[14px] leading-[20px] text-gray-A'>
                    {formatNumber(short?.view)} views
                  </span>

                  {/* Setting */}
                  <button className='size-[36px] rounded-[50%] p-[6px] active:bg-black-0.2 absolute right-0 top-[8px] z-[200]'>
                    <div className='w-[24px] '>
                      <Setting2Icon />
                    </div>
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </Slider>
      </div>
    </div>
  );
};
export default ShortHorizonSlider;
