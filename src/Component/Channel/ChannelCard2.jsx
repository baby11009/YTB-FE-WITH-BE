import SubscribeBtn from "../Button/SubscribeBtn";
import { useState, useEffect } from "react";
const ChannelCard2 = ({ data }) => {

  const [channelData, setChannelData] = useState(data);

  const [rspData, setRspData] = useState(undefined);

  useEffect(() => {
    if (rspData) {
      setChannelData((prev) => ({ ...prev, ...rspData?.data }));
    }
  }, [rspData]);
  return (
    <div className='flex'>
      <div className='flex-1 min-w-[240px] max-w-[500px]'>
        <img
          src={`${import.meta.env.VITE_BASE_API_URI}${
            import.meta.env.VITE_VIEW_AVA_API
          }${channelData?.avatar}?width=176px&height=176px`}
          alt={`avatar-${channelData?.email}`}
          className='size-[136px] rounded-[50%] mx-auto'
        />
      </div>
      <div className='flex-1'>
        <div>{data.name}</div>
        <div className='w-fit'>
          <SubscribeBtn
            sub={channelData?.subscription_info ? true : false}
            notify={channelData?.subscription_info?.notify}
            id={channelData?.subscription_info?._id}
            channelId={channelData._id}
            refetch={(data) => {
              setRspData(data);
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default ChannelCard2;
