import {
  levi_live1,
  tgb_live1,
  tgb_live2,
  sangtraan_live1,
} from "../../../../../Assets/Images";
import { VideoCard } from "../../../../../Component";
import { useState } from "react";
import { useAuthContext } from "../../../../../Auth Provider/authContext";

const mockList = [
  {
    id: 1,
    title:
      "Grand Final -  League of POWER1 |Thầy Giáo Ba, Optimus, Hoàng Luân, Hữu Trung",
    thumb: tgb_live1,
    type: {
      title: "live",
      status: "is live",
    },
    view: 45200,
  },
  {
    id: 2,
    title: "TS vs GAM - TF vs CES !!! VCS",
    thumb: tgb_live2,
    type: {
      title: "live",
      status: "live end",
    },
    time: "02/12/2022, 12:05:24 AM",
    view: 87600,
  },
  {
    id: 3,
    title:
      "🔴 LIVE - Sangtraan | LƯỚT TRẠI GÀ NGỐ!?  - Emoji và huy hiệu hội viên mới !!!",
    thumb: sangtraan_live1,
    type: {
      title: "live",
      status: "live end",
    },
    time: "06/26/2024, 01:05:24 AM",
    view: 17000,
  },
  {
    id: 4,
    title: "(Restream) Bằng cách nào đó chơi 4 tiếng chỉ được trận cuối cùng",
    thumb: levi_live1,
    type: {
      title: "live",
      status: "live end",
    },
    time: "06/22/2024, 12:05:24 AM",
    view: 32000,
  },
];

const LiveList = ({ isEnd }) => {
  const { openedMenu } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 2md:grid-cols-3 2lg:grid-cols-4
      ${openedMenu && "1312:grid-cols-3 1360:id-cols-4"}`}
      >
        {mockList.map((item) => {
          return (
            <VideoCard
              data={item}
              key={item.id}
              showBtn={true}
              style={`inline-block flex-1 mx-[8px] mb-[40px]`}
              thumbStyleInline={{
                borderRadius: "12px",
              }}
              titleStyle={"text-[14px] leading-[20px] font-[500] max-h-[40px]"}
              noFuncBox={true}
            />
          );
        })}
        {mockList.map((item) => {
          return (
            <VideoCard
              data={item}
              key={item.id}
              showBtn={true}
              style={`inline-block flex-1 mx-[8px] mb-[40px]`}
              thumbStyleInline={{
                borderRadius: "12px",
              }}
              titleStyle={"text-[14px] leading-[20px] font-[500] max-h-[40px]"}
              noFuncBox={true}
            />
          );
        })}
        {mockList.map((item) => {
          return (
            <VideoCard
              data={item}
              key={item.id}
              showBtn={true}
              style={`inline-block flex-1 mx-[8px] mb-[40px]`}
              thumbStyleInline={{
                borderRadius: "12px",
              }}
              titleStyle={"text-[14px] leading-[20px] font-[500] max-h-[40px]"}
              noFuncBox={true}
            />
          );
        })}
      </div>

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
export default LiveList;
