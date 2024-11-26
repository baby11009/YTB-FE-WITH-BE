import VideoCard from "../Video/VideoCard";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ThickGridIcon,
  EmptyGridIcon,
  ListIcon,
  Short2Icon,
  ThinArrowIcon,
} from "../../Assets/Icons";
import ShortCard from "../Short/ShortCard";
import { smoothScroll } from "../../util/scrollCustom";

const HorizonCard = ({ data, layout, setLayout }) => {
  return (
    <div className='pb-[24px] border-b-[1px] border-black-0.2'>
      <div className='my-[14px] flex justify-between'>
        <Link to={`/channel/${data._id}`} className='flex items-center'>
          <div className='size-[32px] rounded-[50%] overflow-hidden mr-[8px]'>
            <img
              src={`${import.meta.env.VITE_BASE_API_URI}${
                import.meta.env.VITE_VIEW_AVA_API
              }${data?.user_info?.avatar}`}
              alt='channel image'
            />
          </div>
          <div>
            <span className='text-[20px] leading-[28px] font-bold'>
              {data?.user_info?.name}
            </span>
          </div>
        </Link>
        {setLayout && (
          <div className='flex items-center'>
            <Link
              className='px-[16px] rounded-[18px] hover:bg-[#263850] cursor-pointer'
              to={`/sub-channels`}
            >
              <span className=' text-nowrap text-[14px] leading-[36px] font-[500] text-blue-3E'>
                Manage
              </span>
            </Link>

            <div
              className='w-[40px] h-[40px] rounded-[50%] hover:bg-black-0.2 flex items-center justify-center cursor-pointer'
              onClick={() => setLayout("grid")}
            >
              {layout === "grid" ? <ThickGridIcon /> : <EmptyGridIcon />}
            </div>
            <div
              className='w-[40px] h-[40px] rounded-[50%] hover:bg-black-0.2 flex items-center justify-center cursor-pointer'
              onClick={() => setLayout("list")}
            >
              <ListIcon />
            </div>
          </div>
        )}
      </div>
      <div className='w-full max-w-[862px]'>
        <VideoCard
          data={data}
          style={"flex gap-[16px] mx-0 mb-0"}
          thumbStyle={"w-[246px] h-[138px] mb-0 rounded-[8px]"}
          titleStyle={"text-[18px] leading-[26px] font-[400] max-h-[56px]"}
          infoStyle={"flex text-[12px] leading-[18px]"}
          funcBoxPos={"sm:right-0 lg:translate-x-[100%]"}
          imgStyle={"hidden"}
        />
      </div>
    </div>
  );
};

const ListLayout = ({ openedMenu, vidList, shortList, layout, setLayout }) => {
  const navigate = useNavigate();
  const [isScroll, setIsScroll] = useState(false);

  const [scrollPosition, setScrollPosition] = useState("begin");

  const scrollContainer = useRef();
  const handleScroll = (direction) => {
    setIsScroll(true);
    smoothScroll(
      direction,
      scrollContainer,
      350,
      scrollContainer.current.clientWidth
    );
  };

  useEffect(() => {
    const handleScroll = (e) => {
      if (e.target.scrollLeft === 0) {
        setScrollPosition("begin");
      } else if (
        Math.ceil(e.target.clientWidth + e.target.scrollLeft) ===
        e.target.scrollWidth
      ) {
        setScrollPosition("end");
      } else {
        setScrollPosition(undefined);
      }
    };
    if (scrollContainer.current) {
      scrollContainer.current.addEventListener("scroll", handleScroll);
      scrollContainer.current.addEventListener("scrollend", () => {
        setIsScroll(false);
      });
    }

    return () => {
      if (scrollContainer.current) {
        scrollContainer.current.removeEventListener("scroll", handleScroll);
        scrollContainer.current.removeEventListener("scrollend", () => {
          setIsScroll(false);
        });
      }
    };
  }, []);

  return (
    <div className='flex flex-col items-center'>
      <div
        className={`w-[214px] xsm:w-[428px] sm:w-[642px] 2md:w-[856px]  
        ${
          openedMenu
            ? "1336:w-[1070px] xl 2xl:w-[1284px]"
            : "2lg:w-[1070px] 1-5xl:w-[1284px]"
        }`}
      >
        <HorizonCard data={vidList[0]} layout={layout} setLayout={setLayout} />
        <div className='mb-[48px] pb-[17px] border-b-[1px] border-[rgba(255,255,255,0.2)]'>
          <div className='ml-[8px] my-[16px] flex items-center justify-between'>
            <div className='flex gap-[8px]'>
              <Short2Icon />
              <span className='text-[20px] leading-[28px] font-[700]'>
                Shorts
              </span>
            </div>

            <button
              className='px-[16px] rounded-[18px] hover:bg-[#263850] cursor-pointer'
              onClick={() => {
                navigate("short");
              }}
            >
              <span className=' text-nowrap text-[14px] leading-[36px] font-[500] text-blue-3E'>
                View all
              </span>
            </button>
          </div>
          <div className='relative'>
            {scrollPosition !== "begin" && (
              <button
                disabled={isScroll}
                className=' bg-black-21 absolute left-[-20px] top-[40%] translate-y-[-30%]
           rounded-[50%] overflow-hidden'
                onClick={() => handleScroll("left")}
              >
                <div className='hover:bg-black-0.2 size-[40px]  flex items-center justify-center ove '>
                  <div className='w-[18px] rotate-[-180deg]'>
                    <ThinArrowIcon />
                  </div>
                </div>
              </button>
            )}

            <div className='flex overflow-hidden' ref={scrollContainer}>
              {shortList.map((short) => (
                <ShortCard
                  key={short?._id}
                  data={short}
                  imgStyle={"h-[315px]"}
                  containerStyle={"pr-[4px] min-w-[210px]  box-content"}
                />
              ))}
            </div>

            {scrollPosition !== "end" && (
              <button
                disabled={isScroll}
                className=' bg-black-21 absolute right-[-20px] top-[40%] translate-y-[-30%]
         rounded-[50%] overflow-hidden'
                onClick={() => handleScroll("right")}
              >
                <div className='hover:bg-black-0.2 size-[40px]  flex items-center justify-center ove '>
                  <div className='w-[18px]'>
                    <ThinArrowIcon />
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>

        {vidList?.slice(1, vidList?.length - 1).map((item) => (
          <HorizonCard key={item._id} data={item} layout={layout} />
        ))}
      </div>
    </div>
  );
};
export default ListLayout;
