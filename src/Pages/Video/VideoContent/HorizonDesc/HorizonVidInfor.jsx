import { Link } from "react-router-dom";
import { formatNumber } from "../../../../util/numberFormat";
import { useRef, useEffect } from "react";
import {
  ShareIcon,
  Setting2Icon,
  Verification,
  DownloadIcon,
  SaveIcon,
} from "../../../../Assets/Icons";
import {
  CustomeFuncBox,
  LikeAndDislikeBtn,
  SubscribeBtn,
} from "../../../../Component";

const HorizonVidInfor = ({ opened, setOpened, videoData, refetch }) => {
  const funcList1 = [
    {
      id: 1,
      text: "Share",
      icon: <ShareIcon />,
    },
    {
      id: 2,
      text: "Download",
      icon: <DownloadIcon />,
    },
    {
      id: 5,
      text: "Save",
      icon: <SaveIcon />,
    },
  ];
  const boxRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setOpened("");
      }
    };

    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div className='text-[28px] leading-[38px] font-bold t-ellipsis'>
        {videoData?.title}
      </div>
      <div className='flex flex-col md:flex-row md:items-center justify-between '>
        {/* Left */}
        <div className='flex items-center mt-[12px]'>
          <Link>
            <img
              src={`${import.meta.env.VITE_BASE_API_URI}${
                import.meta.env.VITE_VIEW_AVA_API
              }${videoData?.channel_info?.avatar}`}
              alt=''
              className='w-[40px] h-[40px] rounded-[50%] mr-[12px]'
            />
          </Link>
          <div className='flex flex-col mr-[24px]'>
            <div
              className='flex items-center gap-[4px]'
              title={videoData?.channel_info?.name}
            >
              <Link className='text-[16px] leading-[22px] font-[500] t-1-ellipsis'>
                {videoData?.channel_info?.name}
              </Link>
              <Verification size={"14"} />
            </div>
            <span className='text-[12px] !leading-[18px] text-gray-A t-1-ellipsis'>
              {formatNumber(videoData?.channel_info?.subscriber || 0)}{" "}
              subscribers
            </span>
          </div>

          <SubscribeBtn
            sub={videoData?.subscription_info?.notify !== null ? true : false}
            notify={videoData?.subscription_info?.notify}
            id={videoData?.subscription_info?._id}
            channelId={videoData?.channel_info?._id}
            refetch={refetch}
          />
        </div>

        {/* Right */}
        <div className='flex mt-[12px]'>
          <LikeAndDislikeBtn
            totalLike={videoData?.like}
            videoId={videoData?._id}
            reactState={videoData?.react_info?.type}
            refetch={refetch}
          />
          <div className='flex gap-[8px] ml-[8px]'>
            <div
              className='h-[36px] flex items-center justify-center rounded-[18px]
              bg-hover-black hover:bg-[rgba(255,255,255,0.2)] cursor-pointer px-[16px]'
              title='Share'
            >
              <div className='ml-[-6px] mr-[6px]'>
                <ShareIcon />
              </div>
              <span className='text-[14px] text-nowrap'>Share</span>
            </div>
            <div
              className='h-[36px] flex md:hidden 2md:flex items-center justify-center rounded-[18px]
              bg-hover-black hover:bg-[rgba(255,255,255,0.2)] cursor-pointer px-[16px] '
              title='Download'
            >
              <div className='ml-[-6px] mr-[6px]'>
                <DownloadIcon />
              </div>
              <span className='text-[14px] text-nowrap'>Download</span>
            </div>
            <div
              className='w-[36px] h-[36px] flex items-center justify-center rounded-[50%]
         bg-hover-black hover:bg-[rgba(255,255,255,0.2)] cursor-pointer relative'
              ref={opened === "setting" ? boxRef : undefined}
              onClick={(e) => {
                e.stopPropagation();
                setOpened((prev) => (prev === "setting" ? "" : "setting"));
              }}
            >
              <Setting2Icon />
              {opened === "setting" && (
                <CustomeFuncBox
                  style={"right-0 bottom-[110%]"}
                  setOpened={setOpened}
                  funcList1={funcList1}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HorizonVidInfor;
