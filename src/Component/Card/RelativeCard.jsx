import { Link } from "react-router-dom";
import { formatNumber } from "../../util/numberFormat";

const RelativeCard = ({ data }) => {
  return (
    <Link className='w-[210px] mr-[4px] inline-flex flex-col items-center justify-center'>
      <div className='flex flex-col items-center justify-center'>
        <img
          src={data.img}
          alt=''
          className='w-[103px] h-[103px] rounded-[50%] overflow-hidden'
        />
        <h5 className='my-[4px] text-[14px] leading-[20px] font-[500]'>
          {data.channelName}
        </h5>
        <p className='text-[12px] leading-[18px] text-gray-A'>
          {formatNumber(data.sub)} người đăng ký
        </p>
      </div>
      <div className='mt-[16px]'>
        <button className='px-[12px] text-[12px] leading-[32px] font-[500] rounded-[16px] bg-black-0.1 hover:bg-black-0.2'>
          {data.isSub ? "Đã đăng ký" : "Đăng ký"}
        </button>
      </div>
    </Link>
  );
};

export default RelativeCard;
