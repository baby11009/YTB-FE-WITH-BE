import {
  Verification,
  SearchIcon,
  ThinArrowIcon,
} from "../../../../Assets/Icons";
import { formatNumber } from "../../../../util/numberFormat";
import { SubscribeBtn, Slider } from "../../../../Component";
import { getData } from "../../../../Api/getData";
import { motion } from "framer-motion";
import {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import { useAuthContext } from "../../../../Auth Provider/authContext";
import { useLocation, useNavigate } from "react-router-dom";

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

const CustomeButton = ({ data, feature, handleNavigate }) => {
  return (
    <div
      className={`border-b-[3px] cursor-pointer h-[48px]
            ${
              data.handleCheckCurr(feature)
                ? " border-white-F1"
                : "border-[transparent] hover:border-gray-71"
            }
            `}
      onClick={() => {
        handleNavigate(data.id);
      }}
    >
      {data.title}
    </div>
  );
};

const ChannelInfor = ({ channelEmail, openedMenu, feature }) => {
  const { user } = useAuthContext();

  const location = useLocation();

  const navigate = useNavigate();

  const inputRef = useRef();

  const [focused, setFocused] = useState(false);

  const [channelData, setChannelData] = useState(undefined);

  const { data, refetch } = getData(
    `/data/channels/${channelEmail}`,
    { userId: user?._id, id: channelEmail },
    channelEmail ? true : false,
    false,
  );

  const handleNavigate = useCallback((newPath) => {
    const currFeature = location.pathname.split("/")[3];
    navigate(location.pathname.replace(currFeature, newPath));
  }, []);

  const handlePressEnter = useCallback((e) => {
    if (e.key === "Enter" && inputRef.current.value !== "") {
      const currFeature = location.pathname.split("/")[3];
      const query = new URLSearchParams({
        title: inputRef.current.value,
      }).toString();
      navigate(location.pathname.replace(currFeature, "search") + "?" + query);
    }
  }, []);

  useLayoutEffect(() => {
    if (data) {
      setChannelData(data.data[0]);
    }
  }, [data]);

  useEffect(() => {
    if (focused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focused]);

  if (!channelData) return;

  return (
    <div
      className={`w-[214px] xsm:w-[428px] sm:w-[642px] 2md:w-[856px]
    ${
      openedMenu
        ? "1336:w-[1070px] 2xl:w-[1284px]"
        : " 2lg:w-[1070px] 1-5xl:w-[1284px]"
    } border-b-[1px] border-[rgba(255,255,255,0.2)]`}
    >
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
      <div className='pt-[16px] pb-[4px] flex items-center mb-[12px]'>
        <img
          src={`${import.meta.env.VITE_BASE_API_URI}${
            import.meta.env.VITE_VIEW_AVA_API
          }${channelData?.avatar}`}
          alt=''
          className='hidden sm:inline-block w-[160px] h-[160px] rounded-[50%] mr-[24px]'
        />

        <div className='flex-1 text-[14px] leading-[20px]'>
          <div className='flex items-center gap-[5px] mb-[4px]'>
            <div className='text-[24px] leading-[32px] sm:text-[36px] sm:leading-[50px] font-bold'>
              {channelData?.name}
            </div>
            {channelData?.subscriber > 100000 && <Verification size={"14"} />}
          </div>

          <div className='flex flex-col items-start sm:flex-row sm:items-center text-gray-A'>
            <span className=" after:content-['‧'] after:mx-[4px]">
              @{channelData?.email}
            </span>
            <span className=" after:content-['‧'] after:mx-[4px]">
              {formatNumber(channelData?.subscriber)} subscribers
            </span>
            <span>{formatNumber(channelData?.totalVids)} videos</span>
          </div>

          {channelData?.description && (
            <div className='flex items-center py-[10px] text-gray-A'>
              <span className='t-1-ellipsis flex-1 text-nowrap'>
                {channelData?.description}
              </span>

              <div className='w-[24px] h-[24px] flex items-center justify-center cursor-pointer'>
                <ThinArrowIcon />
              </div>
            </div>
          )}

          <a
            href='https://www.youtube.com/channel/UCHApD6LBIxIusJy7VVgocfA'
            target='_blank'
            className='text-blue-3E py-[4px] t-1-ellipsis'
          >
            youtube.com/channel/UCHApD6LBIxIusJy7VVgocfA
          </a>

          {/* Func Btn */}
          <div className='pt-[10px] pb-[6px] flex flex-col items-start sm:flex-row sm:items-center gap-[8px]'>
            <SubscribeBtn
              sub={
                channelData?.subscription_info?.notify !== null ? true : false
              }
              notify={channelData?.subscription_info?.notify}
              id={channelData?.subscription_info?._id}
              channelId={channelData?._id}
              refetch={refetch}
            />

            <button
              className='leading-[36px] font-bold px-[15px] rounded-[18px]
              border-[1px] border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.2)] hover:border-[transparent]'
            >
              Join
            </button>
          </div>
        </div>
      </div>
      <Slider dragScroll={true} buttonType={2}>
        <div className='flex !mx-0 w-full text-[16px] leading-[48px] font-[500] gap-[24px]'>
          {funcList.map((item) => (
            <CustomeButton
              key={item.id}
              data={item}
              feature={feature}
              handleNavigate={handleNavigate}
            />
          ))}
          <div className='h-[48px] flex items-center !w-fit'>
            <motion.button
              className='w-[40px] h-[40px] rounded-[50%] flex items-center justify-center'
              whileTap={{
                backgroundColor: "rgba(255,255,255,0.2)",
              }}
              transition={{
                duration: 0.3,
              }}
              onClick={(e) => {
                setFocused((prev) => !prev);
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              <SearchIcon color={"#aaaaaa"} />
            </motion.button>

            {focused && (
              <div className='flex flex-col items-center'>
                <input
                  type='text'
                  ref={inputRef}
                  placeholder='Tìm kiếm'
                  className='outline-none bg-[transparent] text-[14px] 
                    leading-[20px] font-normal py-[4px]'
                  onBlur={() => setFocused(false)}
                  onKeyDown={handlePressEnter}
                />
                <div className='relative w-full'>
                  <div className='h-[2px] bg-[#aaaaaa] origin-center'></div>
                  {focused && (
                    <motion.div
                      className='h-[2px] bg-[#ffffff] origin-center absolute top-0 left-[50%] w-[0] '
                      animate={{
                        width: "100%",
                        left: 0,
                      }}
                      transition={{
                        delay: 0.05,
                      }}
                    ></motion.div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Slider>
    </div>
  );
};
export default ChannelInfor;
