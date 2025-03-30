import { Link } from "react-router-dom";
import { formatNumber } from "../../util/numberFormat";
import { useState, useEffect } from "react";
import SubscribeBtn from "../Button/SubscribeBtn";

const ChannelCard = ({ data }) => {
  const [channelData, setChannelData] = useState(data);

  const [rspData, setRspData] = useState(undefined);

  useEffect(() => {
    if (rspData) {
      setChannelData((prev) => ({ ...prev, ...rspData?.data }));
    }
  }, [rspData]);

  return (
    <Link
      className='w-full flex flex-col sm:gap-0 sm:flex-row items-center mt-[24px]'
      to={`/channel/${channelData.email}/home`}
    >
      <div className='flex justify-center mr-[16px]'>
        <img
          src={`${import.meta.env.VITE_BASE_API_URI}${
            import.meta.env.VITE_VIEW_AVA_API
          }${channelData?.avatar}`}
          alt={`avatar-${channelData?.email}`}
          className='size-[136px] rounded-[50%]'
        />
      </div>
      <div className='flex-1  overflow-hidden  flex justify-between items-center '>
        <div className='w-full flex flex-col items-center sm:items-start text-[12px] leading-[18px] text-gray-A pr-0  sm:pr-[16px]'>
          <h3 className='text-[18px] leading-[26px] text-white-F1 t-ellipsis mb-[8px]'>
            {channelData.name}
          </h3>
          <div className='flex items-center flex-wrap mb-[4px]'>
            <span>@{channelData.email}</span>
            <span className="before:content-['•'] before:mx-[4px]">
              {formatNumber(channelData.subscriber)} subscriber
            </span>

            <span className="before:content-['•'] before:mx-[4px]">
              {formatNumber(channelData?.totalVids)} video
            </span>
          </div>
          {channelData.description && (
            <div className='w-full text-ellipsis overflow-hidden line-clamp-3'>
              <p>{channelData.description}</p>
            </div>
          )}
        </div>
      </div>
      <SubscribeBtn
        sub={channelData?.notify === 0 ? false : true}
        notify={channelData?.notify}
        id={channelData?.subcription_id}
        channelId={channelData?.channel_id}
        refetch={(data) => {
          setRspData(data);
        }}
      />
    </Link>
  );
};
export default ChannelCard;
