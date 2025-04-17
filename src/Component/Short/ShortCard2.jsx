import { Link } from "react-router-dom";
import { Setting2Icon } from "../../Assets/Icons";
import { formatNumber } from "../../util/numberFormat";

const ShortCard2 = ({ cardWidth, thumbnailHeight,listLength, index, short }) => {
  return (
    <Link to={`/short/${short?._id}`} className='inline-flex ' key={short?._id}>
      <div
        className={` ${
          index + 1 !== listLength && "pr-[4px]"
        } inline-block box-content `}
        style={{
          width: cardWidth ? cardWidth + "px" : "100%",
        }}
      >
        <div
          className='relative rounded-[8px] overflow-hidden'
          style={{
            height: thumbnailHeight ? thumbnailHeight + "px" : "100%",
          }}
        >
          <div
            className='absolute inset-0 z-[1] blur-sm'
            style={{
              backgroundImage: `url('${import.meta.env.VITE_BASE_API_URI}${
                import.meta.env.VITE_VIEW_THUMB_API
              }${short?.thumb}?width=405&heigth=720&fit=cover')`,
            }}
          ></div>
          <img
            src={`${import.meta.env.VITE_BASE_API_URI}${
              import.meta.env.VITE_VIEW_THUMB_API
            }${short?.thumb}?width=405&heigth=720`}
            alt='short'
            className='size-full object-contain relative z-[2]'
          />
        </div>
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
          <button
            className='size-[36px] rounded-[50%] p-[6px] active:bg-black-0.2
       absolute right-0 top-[8px] z-[200]'
          >
            <div className='w-[24px] '>
              <Setting2Icon />
            </div>
          </button>
        </div>
      </div>
    </Link>
  );
};
export default ShortCard2;
