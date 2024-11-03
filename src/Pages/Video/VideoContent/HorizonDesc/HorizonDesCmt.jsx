import { formatNumber } from "../../../../util/numberFormat";
import { timeFormat2 } from "../../../../util/timeforMat";
import { SmCommentCard } from "../../../../Component";
const HorizonDesCmt = ({ setOpened, totalCmt, videoData, firstCmt }) => {
  return (
    <div className='flex flex-col md:flex-row mt-[12px] gap-[12px]'>
      {/* Description */}
      <div
        className='flex-1 overflow-hidden bg-hover-black hover:bg-[rgba(255,255,255,0.2)]
       p-[12px] rounded-[12px] cursor-pointer text-[14px] leading-[20px]'
        onClick={() => setOpened("detail")}
      >
        <div className='w-full mr-[8px]  font-[500] flex gap-[7px] overflow-hidden text-nowrap'>
          {/* Views */}
          <span className=''>
            {formatNumber(videoData?.view)} view{videoData?.view > 2 && "s"}
          </span>

          {/* time */}
          <span>{timeFormat2(videoData?.createdAt)}</span>
        </div>
        {videoData?.description ? (
          <div className='relative'>
            <span className="after:content-['...thêm']">
              {videoData?.description}
            </span>
          </div>
        ) : (
          <p>This video doesn't have a description</p>
        )}
      </div>

      {/* Comment */}
      <div
        className='flex-1 bg-hover-black hover:bg-[rgba(255,255,255,0.2)] p-[12px] text-[14px] 
        leading-[20px] rounded-[12px] cursor-pointer'
        onClick={() => setOpened("cmt")}
      >
        <div className='font-[500]'>
          <span>Comment{totalCmt > 1 && "s"}</span>
          <span className='ml-[4px]'>{formatNumber(totalCmt)}</span>
        </div>
        <div className='mt-[4px]'>
          {totalCmt && totalCmt > 0 ? (
            <SmCommentCard data={firstCmt} />
          ) : (
            <div>There are no comments yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};
export default HorizonDesCmt;
