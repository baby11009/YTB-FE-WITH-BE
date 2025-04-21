import SubscribeBtn from "../Button/SubscribeBtn";
import { Verification } from "../../Assets/Icons";
import { useState, useEffect } from "react";
import { formatNumber } from "../../util/numberFormat";
const ChannelCard2 = ({ data }) => {
  const [channelData, setChannelData] = useState(data);

  return (
    <div className='flex'>
      <div className='flex-1 min-w-[240px] max-w-[500px] mr-4'>
        <img
          src={`${import.meta.env.VITE_BASE_API_URI}${
            import.meta.env.VITE_VIEW_AVA_API
          }${channelData?.avatar}?width=176px&height=176px`}
          alt={`avatar-${channelData?.email}`}
          className='size-[136px] rounded-[50%] mx-auto'
        />
      </div>
      <div className='flex-1 flex '>
        <div className='flex-1 pr-4 pb-4'>
          <div className='flex items-center mb-2'>
            <div
              className='line-clamp-2 text-[18px] leading-[26px] max-h-[52px] '
              style={{ overflowWrap: "anywhere" }}
            >
              {data.name}
            </div>
            {data.subscriber > 100000 && (
              <div className='w-[14px] ml-1'>
                <Verification />
              </div>
            )}
          </div>
          <div className='mb-1 text-[12px] leading-[18px] text-gray-A text-wrap'>
            <span> {data.email}</span>
            <span className='mx-1'>•</span>
            <span>{formatNumber(data.subscriber)} subscribers</span>
          </div>
          <div
            className='w-full text-[12px] leading-[18px] max-h-[36px] line-clamp-2 text-gray-A '
            style={{ overflowWrap: "anywhere" }}
          >
            {data.description}
          </div>
        </div>
        <div className='w-fit shrink-0 flex items-center'>
          <SubscribeBtn
            sub={channelData?.subscription_info ? true : false}
            notify={channelData?.subscription_info?.notify}
            id={channelData?.subscription_info?._id}
            channelId={channelData._id}
            refetch={(data) => {
              setChannelData((prev) => {
                if (data.data) {
                  return {
                    ...prev,
                    subscription_info: {
                      _id: data.data._id,
                      notify: data.data.notify,
                    },
                  };
                }

                return {
                  ...prev,
                  subscription_info: null,
                };
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default ChannelCard2;
