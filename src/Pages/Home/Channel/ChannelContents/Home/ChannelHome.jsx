import { PlayIcon } from "../../../../../Assets/Icons";
import {
  VideoCard,
  Slider,
  SmallShortCard,
  RelativeCard,
} from "../../../../../Component";
import {
  iloda,
  zeros,
  levi,
  sangtraan,
  theanh,
  MyChannel,
  vuive,
  bauffs,
} from "../../../../../Assets/Images";
import { shortList2 } from "../../../../../Mock Data/shortData";
import { relativeChannelList } from "../../../../../Mock Data/channelData";
import { getData } from "../../../../../Api/getData";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

const membersList = [
  {
    id: 1,
    img: zeros,
  },
  {
    id: 2,
    img: iloda,
  },
  {
    id: 3,
    img: levi,
  },
  {
    id: 4,
    img: sangtraan,
  },
  {
    id: 5,
    img: theanh,
  },
  {
    id: 6,
    img: MyChannel,
  },
  {
    id: 7,
    img: vuive,
  },
  {
    id: 8,
    img: bauffs,
  },
];

const RowLayout = ({ title, type, children }) => {
  return (
    <div className='border-b-[1px] border-black-0.2'>
      <div
        className={`mt-[24px] mb-[12px] text-[20px] leading-[28px] font-bold flex items-center ${
          type === "channel" && "justify-between"
        } gap-[6px] cursor-pointer`}
      >
        <div className=' text-nowrap t-1-ellipsis'>{title}</div>
        {type === "playlist" ? (
          <div className='flex items-center cursor-pointer px-[16px] rounded-[18px] hover:bg-black-0.2'>
            <div className='ml-[-6px] mr-[6px]'>
              <PlayIcon />
            </div>
            <span className='text-[14px] leading-[36px] font-[500] text-nowrap'>
              Play all
            </span>
          </div>
        ) : (
          type === "channel" && (
            <button
              className='px-[16px] rounded-[18px] text-[14px] leading-[36px] text-[#0000EE] font-[500]
            hover:bg-[#263850]
        '
            >
              Xem tất cả
            </button>
          )
        )}
      </div>
      <div className='pt-[12px] mb-[24px]'>{children}</div>
    </div>
  );
};

const ChannelHome = ({ channelEmail }) => {
  const queryClient = useQueryClient();

  const { data: playlistData } = getData(
    "/data/playlists",
    {
      channelEmail: channelEmail,
      clearCache: "playlist",
    },
    channelEmail ? true : false,
    false,
  );

  const { data: videosData } = getData(
    "/data/videos",
    {
      channelEmail: channelEmail,
      limit: 12,
      sort: { view: -1, createdAt: -1 },
      clearCache: "video",
    },
    channelEmail ? true : false,
    false,
  );

  useEffect(() => {
    return () => {
      if (videosData && playlistData) {
        queryClient.clear();
      }
    };
  }, [channelEmail]);

  useEffect(() => {
    return () => {
      queryClient.clear();
    };
  }, []);

  return (
    <div className='w-full'>
      {/* First vid */}
      {videosData?.data?.length > 0 && (
        <div className='py-[24px] border-b-[1px] border-black-0.2 overflow-hidden mr-[-32px] xsm:mr-0'>
          <div className='w-full  max-w-[862px]'>
            <VideoCard
              data={videosData?.data[0]}
              showBtn={true}
              noFunc2={true}
              style={"flex gap-[16px] mx-0 mb-0"}
              thumbStyle={
                "min-w-[246px] w-[246px] h-[138px] mb-0 rounded-[8px]"
              }
              titleStyle={"text-[18px] leading-[26px] font-[400] max-h-[56px]"}
              infoStyle={"flex text-[12px] leading-[18px] flex-wrap"}
            />
          </div>
        </div>
      )}

      {/* Membership */}

      <div className='py-[16px] border-b-[1px] border-black-0.2 overflow-hidden'>
        <div className='flex flex-wrap items-center '>
          <div className='flex-1 py-[6px] mr-[40px] text-nowrap'>
            <span className='text-[16px] leading-[22px] text-white-F1 block'>
              Our members
            </span>
            <span className='text-[14px] leading-[20px] text-gray-A'>
              Thank you, channel members!
            </span>
          </div>

          <div className='flex items-center py-[6px] mr-[24px]'>
            {membersList.map((item) => (
              <div
                className='w-[36px] h-[36px] rounded-[50%] overflow-hidden mr-[16px]'
                key={item.id}
              >
                <img src={item.img} alt='member' />
              </div>
            ))}
          </div>

          <button
            className='px-[15px] my-[6px] border-[1px] border-black-0.2 rounded-[18px] text-[14px] leading-[36px] text-blue-3E
            hover:border-[transparent] hover:bg-[#263850]
          '
          >
            Join
          </button>
        </div>
      </div>

      {/* Recommend & List  */}

      {videosData?.data?.length > 0 && (
        <RowLayout title={"For you"} type={"video"}>
          <Slider buttonPosition={"35%"} scrollDuration={120}>
            {videosData?.data.map((video, id) => (
              <VideoCard
                key={video._id}
                data={video}
                showBtn={true}
                style={`inline-block mb-[24px]`}
                styleInline={{
                  width: 354 + "px",
                  paddingRight: id !== videosData.data.length - 1 ? "4px" : 0,
                }}
                thumbStyleInline={{
                  borderRadius: 8,
                }}
                descStyle={"!hidden"}
                imgStyle={"hidden"}
                infoStyle={"text-[12px] leading-[18px]"}
                noFuncBox={true}
              />
            ))}
          </Slider>
        </RowLayout>
      )}

      {playlistData?.data?.length > 0 &&
        playlistData?.data.map((playlist) => {
          if (playlist?.itemList?.length > 0) {
            return (
              <RowLayout
                title={playlist?.title}
                type={"playlist"}
                key={playlist?._id}
              >
                <Slider buttonPosition={"35%"} scrollDuration={120}>
                  {playlist?.video_list.map((video, id) => (
                    <VideoCard
                      key={video._id}
                      data={video}
                      showBtn={true}
                      style={`inline-block mb-[24px]`}
                      styleInline={{
                        width: 210 + "px",
                        paddingRight: "4px",
                      }}
                      thumbStyleInline={{
                        borderRadius: 8,
                      }}
                      descStyle={"!hidden"}
                      imgStyle={"hidden"}
                      infoStyle={"text-[12px] leading-[18px]"}
                      noFuncBox={true}
                    />
                  ))}
                </Slider>
              </RowLayout>
            );
          }
        })}

      <RowLayout title={"Short Videos"} type={"video"}>
        <Slider buttonPosition={"35%"} scrollDuration={120}>
          {shortList2.map((item) => (
            <SmallShortCard
              data={item}
              key={item.id}
              style={{
                display: "inline-block",
                width: "210px",
                paddingRight: "2px",
              }}
            />
          ))}
        </Slider>
      </RowLayout>

      {/* Relative */}

      <RowLayout title={"CKG"} type={"channel"}>
        <Slider buttonPosition={"35%"} scrollDuration={120}>
          {relativeChannelList.map((item) => (
            <RelativeCard key={item.id} data={item} />
          ))}
        </Slider>
      </RowLayout>
    </div>
  );
};
export default ChannelHome;
