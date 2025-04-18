import { SubscribeBtn } from "../../../../Component";
import { Link } from "react-router-dom";
import {
  Verification,
  ShareIcon,
  DownloadIcon,
  SaveIcon,
  DiaryIcon,
  CutIcon,
  Setting2Icon,
  ThinArrowIcon,
} from "../../../../Assets/Icons";
import { formatNumber } from "../../../../util/numberFormat";
import {
  LikeAndDislikeBtn,
  CustomeFuncBox,
  PlaylistModal,
} from "../../../../Component";
import { useAuthContext } from "../../../../Auth Provider/authContext";
import { timeFormat2 } from "../../../../util/timeforMat";
import { useRef, useState, useLayoutEffect } from "react";
import { getMousePosition } from "../../../../util/mouse";

const Description = ({ data, refetch }) => {
  const { setShowHover, handleCursorPositon, user, setIsShowing } =
    useAuthContext();

  const funcList = [
    {
      id: 1,
      text: "Download",
      icon: <DownloadIcon />,
    },
    {
      id: 2,
      text: "Clip",
      icon: <CutIcon />,
      renderCondition: () => {
        return !!user;
      },
    },
    {
      id: 3,
      text: "Save",
      icon: <SaveIcon />,
      handleOnClick: () => {
        setIsShowing(<PlaylistModal videoId={data?._id} />);
      },
      renderCondition: () => {
        return !!user;
      },
    },
    {
      id: 4,
      text: "Report",
      icon: <DiaryIcon />,
      renderCondition: () => {
        return !!user;
      },
    },
  ];

  const [showMore, setShowMore] = useState(false);

  const time = useRef();

  const descriptionRef = useRef();

  const showMoreBtn = useRef();

  useLayoutEffect(() => {
    if (data) {
      time.current = timeFormat2(data?.createdAt);
    }
  }, [data]);

  useLayoutEffect(() => {
    if (showMore) {
      descriptionRef.current.style.height = "auto";
    } else {
      descriptionRef.current.style.height = "104px";
    }
  }, [showMore]);

  return (
    <div className='mt-[12px] mb-[24px]'>
      <div
        className='text-[20px] leading-[28px] font-bold text-ellipsis overflow-hidden line-clamp-2 break-words'
        dangerouslySetInnerHTML={{
          __html: data?.title,
        }}
      ></div>
      <div className='flex items-center flex-wrap'>
        <div className='flex-1 mt-[12px] mr-[12px] flex items-center'>
          {data && (
            <Link to={`/channel/${data?.channel_info?.email}`}>
              <img
                src={`${import.meta.env.VITE_BASE_API_URI}${
                  import.meta.env.VITE_VIEW_AVA_API
                }${data?.channel_info?.avatar}`}
                alt=''
                className='min-w-[40px] h-[40px] rounded-[50%] mr-[12px]'
              />
            </Link>
          )}
          <div className='flex flex-col mr-[24px]'>
            <div
              className='flex items-center gap-[4px]'
              title={data?.channel_info?.name}
            >
              <Link
                className='text-[16px] leading-[22px] font-[500] t-1-ellipsis'
                to={`/channel/${data?.channel_info?.email}`}
              >
                {data?.channel_info?.name}
              </Link>
              {data?.channl_info?.subscriber > 100000 && (
                <div className='w-[14px]'>
                  <Verification />
                </div>
              )}
            </div>
            <span className='text-[12px] !leading-[18px] text-gray-A t-1-ellipsis'>
              {formatNumber(data?.channel_info?.subscriber || 0)} subscribers
            </span>
          </div>
          <div className='w-fit h-[40px]'>
            <SubscribeBtn
              sub={data?.subscription_info !== null ? true : false}
              notify={data?.subscription_info?.notify}
              id={data?.subscription_info?._id}
              channelId={data?.channel_info?._id}
              refetch={refetch}
            />
          </div>
        </div>
        <div className='flex-1  mt-[12px] flex 2xsm:justify-end'>
          <LikeAndDislikeBtn
            totalLike={data?.like}
            videoId={data?._id}
            reactState={data?.react_info?.type}
            refetch={refetch}
          />
          <div
            className='h-[36px] flex items-center justify-center rounded-[18px]
              bg-hover-black hover:bg-[rgba(255,255,255,0.2)] cursor-pointer px-[16px] ml-[8px]'
            title='Share'
          >
            <div className='ml-[-6px] mr-[6px]'>
              <ShareIcon />
            </div>
            <span className='text-[14px] text-nowrap'>Share</span>
          </div>
          <button
            className='w-[36px] h-[36px] flex items-center justify-center rounded-[50%]
                bg-hover-black hover:bg-[rgba(255,255,255,0.2)] ml-[8px] rotate-[90deg]'
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setShowHover((prev) => {
                if (prev) return undefined;
                handleCursorPositon(e);
                return (
                  <CustomeFuncBox
                    setOpened={() => {
                      setShowHover(undefined);
                    }}
                    funcList1={funcList}
                  />
                );
              });
            }}
          >
            <Setting2Icon />
          </button>
        </div>
      </div>

      <div className='mt-[12px] mr-[12px] bg-black-0.1 rounded-[12px]'>
        <div
          className='p-[12px] text-[14px] leading-[20px] font-[500] h-[104px] flex flex-col'
          ref={descriptionRef}
        >
          <div>
            <span>{data?.view} views </span>
            <span>{time.current}</span>
          </div>
          <div
            className='break-words flex-1 overflow-hidden'
            dangerouslySetInnerHTML={{ __html: data?.description }}
          ></div>
          {descriptionRef?.current?.children[1]?.scrollHeight > 60 && (
            <div>
              <button
                className={`${showMore ? "mt-[20px]" : ""} ripple`}
                ref={showMoreBtn}
                onMouseUp={(e) => {
                  e.stopPropagation();
                  setShowMore((prev) => !prev);
                  showMoreBtn.current.style.setProperty("--scale", 0);
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  getMousePosition(e, showMoreBtn.current);
                }}
              >
                <span>{showMore ? "Show less" : "...more"}</span>
              </button>
            </div>
          )}
        </div>
      </div>
      {data?.tag_info?.length > 0 && (
        <div className='mt-[8px] flex flex-wrap sm:flex-nowrap'>
          {data?.tag_info.slice(0, 2).map((tag) => (
            <button
              key={tag.slug}
              className='basis-[50%] min-w-[260px] my-[8px] mr-[16px] h-[100px] flex items-center bg-black-0.1 rounded-[12px] '
            >
              <div className='w-[56px] rounded-[50%] overflow-hidden mx-[16px]'>
                <img
                  src={`${import.meta.env.VITE_BASE_API_URI}${
                    import.meta.env.VITE_VIEW_TAG_API
                  }${tag?.icon}`}
                  alt=''
                  className='w-[70px] aspect-auto'
                />
              </div>
              <div className='text-left'>
                <div className='text-[16px] leading-[22px]'>{tag.title}</div>
                <div className='mt-[4px] text-gray-A flex items-center text-nowrap'>
                  <strong className='text-[14px] leading-[24px] uppercase  '>
                    BROWSE {tag.title}
                  </strong>
                  <span className='w-[24px] inline-block'>
                    <ThinArrowIcon />
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
export default Description;
