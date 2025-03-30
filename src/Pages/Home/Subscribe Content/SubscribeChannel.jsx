import { ChannelCard, CustomeFuncBox } from "../../../Component";
import { useState, useEffect, useRef } from "react";
import { IsEnd } from "../../../util/scrollPosition";
import { ThinArrowIcon } from "../../../Assets/Icons";
import { getData } from "../../../Api/getData";
const SubscribeChannel = ({ openedMenu }) => {
  const [queries, SetQueries] = useState({
    page: 1,
    limit: 6,
    sort: { createdAt: -1 },
  });

  const channelsSet = useRef(new Set());

  const [opened, setOpened] = useState(false);

  const [addNew, setAddNew] = useState(true);

  const [channelList, setChannelData] = useState([]);

  const [isEnd, setIsEnd] = useState(false);

  const { data, isSuccess } = getData(
    "/user/user/subscribed-channels",
    queries,
    true,
  );

  const handleSort = (data) => {
    if (!queries.sort[data.id]) {
      setAddNew(true);
      SetQueries((prev) => ({
        ...prev,
        page: 1,
        sort: { [`${data.id}`]: data.value },
      }));
    }
  };

  const funcList = [
    {
      id: "createdAt",
      text: "Most recently",
      value: -1,
      handleOnClick: handleSort,
    },
    {
      id: "channel_updatedAt",
      text: "New activity",
      value: -1,
      handleOnClick: handleSort,
    },
    {
      id: "name",
      text: "A-Z",
      value: -1,
      handleOnClick: handleSort,
    },
  ];
  useEffect(() => {
    if (data) {
      if (addNew) {
        channelsSet.current.clear();
        setChannelData(data?.data);
        data?.data.forEach((channel) => {
          channelsSet.current.add(channel?.channel_id);
        });
        setAddNew(false);
      } else {
        const addData = [];
        data?.data.forEach((channel) => {
          if (!channelsSet.current.has(channel?.channel_id)) {
            channelsSet.current.add(channel?.channel_id);
            addData.push(channel);
          }
        });
        setChannelData((prev) => [...prev, ...addData]);
      }
    }
  }, [data]);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      IsEnd(setIsEnd);
    });
    return () => {
      window.removeEventListener("scroll", () => {
        IsEnd(setIsEnd);
      });
    };
  }, []);

  useEffect(() => {
    if (isEnd && data?.totalPage > queries.page) {
      SetQueries((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  }, [isEnd]);

  return (
    <div className='flex justify-center'>
      <div
        className={`w-[214px] xsm:w-[428px] sm:w-[642px] 2md:w-[856px]  
        ${openedMenu ? "1336:w-[1070px]" : "2lg:w-[1070px]"}`}
      >
        <div className='px-[48px] pt-[24px] pb-[4px]'>
          <h2 className='text-[36px] font-bold leading-[50px]'>
            All subscriptions
          </h2>
        </div>
        <div className='px-[48px]'>
          <button
            className='relative flex  items-center pl-[12px] bg-black-0.1 h-[32px] rounded-[8px]'
            onClick={() => {
              setOpened((prev) => !prev);
            }}
          >
            <span className='text-[14px] leading-[20px] font-[500]'>
              New activity
            </span>
            <div className='w-[16px] rotate-90 ml-[5px] mr-[7px]'>
              <ThinArrowIcon />
            </div>
            {opened && (
              <CustomeFuncBox
                style={"w-[256px] left-0 top-[100%]"}
                setOpened={setOpened}
                funcList1={funcList}
                currentId={Object.keys(queries.sort)[0]}
              />
            )}
          </button>
        </div>
        <div className='flex flex-col items-start px-[48px]'>
          {isSuccess &&
            channelList.length > 0 &&
            channelList.map((item) => (
              <ChannelCard key={item?.channel_id} data={item} />
            ))}
        </div>
      </div>
    </div>
  );
};
export default SubscribeChannel;
