import { formatNumber } from "../../../../util/numberFormat";
import { timeFormat, timeFormat2 } from "../../../../util/timeforMat";
import { Link } from "react-router-dom";
import { tgb } from "../../../../Assets/Images";
import {
  Verification,
  BellIcon,
  ThinArrowIcon,
  SaveIcon,
  EmptyLikeIcon,
  DownloadIcon,
  ShareIcon,
  DiaryIcon,
  Setting2Icon,
  CutIcon,
} from "../../../../Assets/Icons";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import {
  CustomeFuncBox,
  SubscribeBtn,
  LikeAndDislikeBtn,
} from "../../../../Component";

const hovVars = {
  hover: {
    backgroundColor: "rgba(255,255,255,0.1)",
    boxShadow: "0 0 0 8px rgba(255,255,255,0.1)",
    transition: {
      duration: 0.15,
      type: "just",
    },
  },
};

const VideoInfor = ({ videoDetails, refetch, setWatchFull }) => {
  const [opened, setOpened] = useState(false);

  const boxRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setOpened(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className='w-full'>
      <motion.div
        className='cursor-pointer rounded-[2px] '
        variants={hovVars}
        whileHover='hover'
        onClick={() => {
          setWatchFull(true);
        }}
      >
        <div
          className='text-[28px] leading-[38px]
       t-ellipsis font-bold'
        >
          {videoDetails?.title}
        </div>
        <div className='mb-[16px] mr-[8px] text-[14px] leading-[20px] font-[500] flex gap-[7px]'>
          {/* Views */}
          <span className=''>{formatNumber(videoDetails?.view)} lượt xem</span>

          {/* time */}
          <span>{timeFormat2(videoDetails?.createdAt)}</span>
        </div>

        {/* description */}
        {videoDetails?.description && (
          <div className=' text-[14px] leading-[20px] max-h-[40px] overflow-hidden'>
            <div
              className='relative after:content-["...thêm"] after:sticky after:w-[40px]
         after:shadow-[-10px_1px_5px_0px_rgba(10,10,10,0.95)] after:left-0  inline-block'
            >
              {videoDetails?.description}
            </div>
          </div>
        )}
      </motion.div>

      <motion.div
        className=' flex items-center justify-between cursor-pointer rounded-[2px] mt-[24px] '
        variants={hovVars}
        whileHover='hover'
      >
        <div className='flex'>
          <Link to={`/channel/${videoDetails?.channel_info?.email}`}>
            <img
              src={`${import.meta.env.VITE_BASE_API_URI}${
                import.meta.env.VITE_VIEW_AVA_API
              }${videoDetails?.channel_info?.avatar}`}
              alt='image'
              className='w-[40px] h-[40px] rounded-[50%] mr-[12px]'
            />
          </Link>
          <div className='flex  flex-col mr-[24px]'>
            <div
              className='flex items-center gap-[4px]'
              title={videoDetails?.channel_info?.name}
            >
              <span className='text-[16px] leading-[22px] font-[500]'>
                {videoDetails?.channel_info?.name}
              </span>
              <Verification size={"14"} />
            </div>

            <span className='text-[12px] !leading-[18px] text-gray-A'>
              {formatNumber(videoDetails?.channel_info?.subscriber || 0)} người
              đăng ký
            </span>
          </div>
        </div>
        <SubscribeBtn
          sub={videoDetails?.subscription_info?.notify !== null ? true : false}
          notify={videoDetails?.subscription_info?.notify}
          id={videoDetails?.subscription_info?._id}
          channelId={videoDetails?.channel_info?._id}
          refetch={refetch}
        />
      </motion.div>

      {/*  function button */}
      <div className='flex items-center mt-[24px]'>
        <div className='flex gap-[8px] ml-[8px]'>
          <LikeAndDislikeBtn
            totalLike={videoDetails?.like}
            videoId={videoDetails?._id}
            reactState={videoDetails?.react_info?.type}
            refetch={refetch}
          />
          <div
            className='w-[36px] h-[36px] flex items-center justify-center rounded-[50%]
         bg-hover-black hover:bg-[rgba(255,255,255,0.2)] cursor-pointer'
            title='Chia sẻ'
          >
            <ShareIcon />
          </div>
          <div
            className='w-[36px] h-[36px] flex items-center justify-center rounded-[50%]
         bg-hover-black hover:bg-[rgba(255,255,255,0.2)] cursor-pointer'
            title='Tải xuống'
          >
            <DownloadIcon />
          </div>
          <div
            className='w-[36px] h-[36px] flex items-center justify-center rounded-[50%]
         bg-hover-black hover:bg-[rgba(255,255,255,0.2)] cursor-pointer'
            title='Tạo đoạn video'
          >
            <CutIcon />
          </div>
          <div
            className='w-[36px] h-[36px]  flex items-center justify-center rounded-[50%]
         bg-hover-black hover:bg-[rgba(255,255,255,0.2)] cursor-pointer '
            title='Lưu'
          >
            <SaveIcon />
          </div>
          <div
            className='w-[36px] h-[36px] flex items-center justify-center rounded-[50%]
         bg-hover-black hover:bg-[rgba(255,255,255,0.2)] cursor-pointer relative'
            ref={boxRef}
            onClick={(e) => {
              e.stopPropagation();
              setOpened((prev) => !prev);
            }}
          >
            <Setting2Icon />
            {opened && (
              <CustomeFuncBox
                style={"w-[169px] right-0 top-[110%]"}
                setOpened={setOpened}
                funcList1={[
                  {
                    id: 1,
                    text: "Báo vi phạm",
                    icon: <DiaryIcon />,
                  },
                ]}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default VideoInfor;
