import { Verification, SearchIcon } from "../../../../Assets/Icons";
import { formatNumber } from "../../../../util/numberFormat";
import { SubscribeBtn, Slider } from "../../../../Component";
import { getData } from "../../../../Api/getData";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useAuthContext } from "../../../../Auth Provider/authContext";
import { useLocation, useNavigate } from "react-router-dom";
import InformationBox from "./InformationBox";

const funcList = [
  {
    id: "home",
    title: "Home",
    handleCheckCurr: (feature) => {
      return feature === "home" || !feature;
    },
  },
  {
    id: "videos",
    title: "Videos",
    handleCheckCurr: (feature) => {
      return feature === "videos";
    },
  },
  {
    id: "shorts",
    title: "Shorts",
    handleCheckCurr: (feature) => {
      return feature === "shorts";
    },
  },
  {
    id: "lives",
    title: "Live",
    handleCheckCurr: (feature) => {
      return feature === "lives";
    },
  },
  {
    id: "playlists",
    title: "Playlists",
    handleCheckCurr: (feature) => {
      return feature === "playlists";
    },
  },
  {
    id: "community",
    title: "Community",
    handleCheckCurr: (feature) => {
      return feature === "community";
    },
  },
];

const CustomeButton = ({ data, feature, handleOnClick }) => {
  return (
    <div
      className={`cursor-pointer h-[48px]
            ${
              !data.handleCheckCurr(feature) &&
              "border-b-[3px] border-[transparent] hover:border-gray-71"
            }
            `}
      data-path={data.id}
      onClick={(e) => {
        handleOnClick(e, data.id);
      }}
    >
      {data.title}
    </div>
  );
};

const ChannelInfor = ({ channelEmail, feature }) => {
  const { user, setIsShowing } = useAuthContext();

  const location = useLocation();

  const navigate = useNavigate();

  const inputRef = useRef();

  const [focused, setFocused] = useState(false);

  const [channelData, setChannelData] = useState(undefined);

  const [underlineInfo, setUnderlineInfo] = useState({ width: 0, left: 0 });

  const navigateContainerRef = useRef();

  const indicator = useRef();

  const { data } = getData(
    `/data/channel/${channelEmail}`,
    { userId: user?._id, id: channelEmail },
    channelEmail ? true : false,
    false,
  );

  const refetchChannelData = (data) => {
    setChannelData((prev) => ({
      ...prev,
      subscription_info: data.data,
    }));
  };

  const handleOnClick = (e, newPath) => {
    const currFeature = location.pathname.split("/")[3];
    const path = currFeature
      ? location.pathname.replace(currFeature, newPath)
      : location.pathname + "/" + newPath;

    navigate(path);
    if (!indicator.current.classList.contains("transition-[left]")) {
      indicator.current.classList.add("transition-[left]");
    }
  };

  const showingInformationBox = () => {
    setIsShowing(
      <InformationBox
        data={channelData}
        handleCloseBox={() => {
          setIsShowing(undefined);
        }}
      />,
    );
  };

  const handlePressEnter = (e) => {
    if (e.key === "Enter" && inputRef.current.value !== "") {
      const currFeature = location.pathname.split("/")[3];
      const query = new URLSearchParams({
        title: inputRef.current.value,
      }).toString();
      console.log(currFeature);
      if (currFeature) {
        navigate(
          location.pathname.replace(currFeature, "search") + "?" + query,
        );
      } else {
        navigate(location.pathname + "/search" + "?" + query);
      }
    }
  };

  useLayoutEffect(() => {
    if (data) {
      setChannelData((prev) => {
        if (prev) {
          return { ...prev, ...data.data[0] };
        }

        return data.data[0];
      });
    }
  }, [data]);

  useEffect(() => {
    if (focused) {
      if (inputRef.current) {
        inputRef.current.focus();
      } else {
        inputRef.current.value = "";
      }
    }
  }, [focused]);

  useEffect(() => {
    if (navigateContainerRef.current) {
      const path = feature || "home";
      let currChild = navigateContainerRef.current.querySelector(
        `[data-path="${path}"]`,
      );

      if (!currChild) {
        currChild =
          navigateContainerRef.current.querySelector(`[data-path="home"]`);
      }
      const childRect = currChild.getBoundingClientRect();
      const parentRect = navigateContainerRef.current.getBoundingClientRect();
      setUnderlineInfo({
        width: currChild.offsetWidth,
        left: childRect.left - parentRect.left,
      });
    }
  }, [feature]);

  return (
    <>
      {/*  Channel Banner */}
      <div className='pt-[16.12%] h-0 relative rounded-[12px] overflow-hidden'>
        <div
          className='absolute top-0 w-full h-full  bg-center bg-cover bg-no-repeat'
          style={{
            backgroundImage: `url('${import.meta.env.VITE_BASE_API_URI}${
              import.meta.env.VITE_VIEW_AVA_API
            }${channelData?.banner}')`,
          }}
        ></div>
      </div>

      {/* Infor */}
      <div className='pt-[16px] pb-[4px] '>
        <div className='flex items-center'>
          <div className='size-[80px] 528:size-[128px] 856:size-[168px] rounded-[50%] mr-[24px] box-content overflow-hidden'>
            {channelData && (
              <img
                src={`${import.meta.env.VITE_BASE_API_URI}${
                  import.meta.env.VITE_VIEW_AVA_API
                }${channelData?.avatar}`}
                alt={`avatar-${channelData?.email}`}
                className='bg-contain'
              />
            )}
          </div>

          <div className='flex-1 text-[12px] leading-[16px] lg:text-[14px] lg:leading-[20px] text-gray-A '>
            {channelData && (
              <>
                <div className='flex items-center'>
                  <span className='text-[24px] leading-[32px] sm:text-[36px] sm:leading-[50px] font-bold text-white-F1'>
                    {channelData?.name}
                  </span>
                  <div className='ml-[8px] w-[14px] inline-block '>
                    <Verification />
                  </div>
                  {channelData?.subscriber > 100000 && (
                    <div className='ml-[8px] w-[14px] inline-block text-white '>
                      <Verification />
                    </div>
                  )}
                </div>
                <div className='flex items-center flex-wrap '>
                  <span className=" after:content-['‧'] after:mx-[4px] text-white-F1 font-[500]">
                    @{channelData?.email}
                  </span>
                  <span className=" after:content-['‧'] after:mx-[4px]">
                    {formatNumber(channelData?.subscriber)} subscribers
                  </span>
                  <span>{formatNumber(channelData?.totalVids)} videos</span>
                </div>
                <div
                  className='hidden 528:flex items-center mt-[12px] cursor-pointer'
                  onClick={showingInformationBox}
                >
                  <span className='t-1-ellipsis text-nowrap'>
                    {channelData?.description.substring(0, 70)}
                  </span>
                  <span className='text-white-F1 font-bold'>...more</span>
                </div>
                <div className='hidden 856:flex items-center gap-[8px]  mt-[12px] mb-[8px]'>
                  <div className='w-fit h-[40px]'>
                    <SubscribeBtn
                      sub={
                        channelData?.subscription_info?.notify ? true : false
                      }
                      notify={channelData?.subscription_info?.notify}
                      id={channelData?.subscription_info?._id}
                      channelId={channelData?._id}
                      refetch={refetchChannelData}
                    />
                  </div>

                  <button
                    className='leading-[36px] font-bold px-[15px] rounded-[18px]
                    border-[1px] border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.2)] hover:border-[transparent]'
                  >
                    Join
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        {channelData && (
          <>
            <div
              className='flex 528:hidden items-center mt-[12px] cursor-pointer text-[12px] leading-[16px]'
              onClick={showingInformationBox}
            >
              <span className='t-1-ellipsis text-nowrap text-gray-A'>
                {channelData?.description}
              </span>
              <span className='text-white-F1 font-bold'>...more</span>
            </div>
            <div className='flex 856:hidden items-center gap-[8px] mt-[12px]'>
              <div className='flex-1'>
                <SubscribeBtn
                  sub={channelData?.subscription_info?.notify ? true : false}
                  notify={channelData?.subscription_info?.notify}
                  id={channelData?.subscription_info?._id}
                  channelId={channelData?._id}
                  refetch={refetchChannelData}
                />
              </div>

              <div className='flex-1'>
                <button
                  className='min-w-fit w-full leading-[36px] font-bold px-[15px] rounded-[18px]
              border-[1px] border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.2)] hover:border-[transparent]'
                >
                  Join
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className='w-full sticky top-[56px] z-[550] bg-black'>
        <Slider dragScroll={true} buttonType={2}>
          <div
            className='flex !mx-0 w-full text-[16px] leading-[48px] font-[500] gap-[24px] relative'
            ref={navigateContainerRef}
          >
            {funcList.map((item) => (
              <CustomeButton
                key={item.id}
                data={item}
                feature={feature}
                handleOnClick={handleOnClick}
              />
            ))}
            <div
              className='h-[2px] bg-white absolute bottom-0'
              ref={indicator}
              style={{
                width: underlineInfo.width + "px",
                left: underlineInfo.left + "px",
              }}
            ></div>
            <div className='h-[48px] flex items-center'>
              <button
                className='w-[40px] h-[40px] rounded-[50%] flex items-center justify-center active:bg-black-0.2'
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setFocused((prev) => true);
                }}
              >
                <SearchIcon color={"#aaaaaa"} />
              </button>

              <div
                className={` ${
                  focused ? "flex" : "hidden"
                } flex-col items-center`}
              >
                <input
                  type='text'
                  ref={inputRef}
                  placeholder='Searching'
                  className='outline-none bg-[transparent] text-[14px] 
                    leading-[20px] font-normal py-[4px]'
                  onBlur={() => {
                    console.log(feature);
                    if (inputRef.current.value === "") {
                      setFocused(false);
                    }
                  }}
                  onKeyDown={handlePressEnter}
                />
                <div className='relative w-full'>
                  <div className='h-[2px] bg-[#aaaaaa] origin-center'></div>

                  <div
                    className={`h-[2px] bg-[#ffffff] origin-center absolute top-0 left-[50%] w-[0] animate-centerSliderIn `}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </Slider>
        <div className='h-[1px] bg-[rgba(255,255,255,0.2)]'></div>
      </div>
    </>
  );
};
export default ChannelInfor;
