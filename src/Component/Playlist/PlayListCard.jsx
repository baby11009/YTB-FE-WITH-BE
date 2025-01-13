import { useState, useEffect, useRef } from "react";
import {
  PlayIcon,
  PlayListIcon,
  Setting2Icon,
  BlockIcon,
  Verification,
} from "../../Assets/Icons";
import { formatNumber } from "../../util/numberFormat";
import { timeFormat2 } from "../../util/timeforMat";
import CustomeFuncBox from "../Box/CustomeFuncBox";
import { useParams } from "react-router-dom";
import { getRandomHexColor } from "../../util/func";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../Auth Provider/authContext";

const PlayListCard = ({
  data,
  l2Color,
  l3Color,
  showL3,
  containerStyle,
  imgStyle,
}) => {
  const { path } = useParams();

  const { setShowHover, handleCursorPositon } = useAuthContext();

  const bgColorRef = useRef(getRandomHexColor());

  return (
    <Link
      to={`/video?id=${data?.video_list[0]?._id}&list=${data?._id}`}
      state={{
        stream: data?.video_list[0]?.stream,
        video: data?.video_list[0]?.video,
        thumb: data?.video_list[0]?.thumb,
      }}
      className='cursor-pointer inline-block'
    >
      <div className={`flex-1 mx-[8px] mb-[40px] ${containerStyle} group`}>
        <div className={`relative ${imgStyle || "w-full"} aspect-video`}>
          <div
            className='w-full h-full bg-black-0.1 relative rounded-[12px] z-[3]'
            style={{
              backgroundColor: bgColorRef.current,
            }}
          >
            {data?.size > 0 && (
              <img
                src={`${import.meta.env.VITE_BASE_API_URI}${
                  import.meta.env.VITE_VIEW_THUMB_API
                }${data?.video_list[0]?.thumb}`}
                alt='thumb'
                className='object-contain w-full h-full rounded-[12px] '
              />
            )}
          </div>
          {showL3 && (
            <div
              className='absolute top-[-8px]  left-[50%] 
          translate-x-[-50%] w-full-minus-24 h-full z-[1] rounded-[12px]'
              style={{
                backgroundColor: l3Color || "rgb(80,71,65)",
              }}
            ></div>
          )}
          <div
            className='absolute top-[-4px] left-[50%] 
          translate-x-[-50%] w-full-minus-16 h-full z-[2] rounded-[12px] border-t-[1px] border-black'
            style={{
              backgroundColor: l2Color || "rgb(147,129,118)",
            }}
          ></div>

          <div
            className='absolute bottom-0 right-0 mr-[8px] mb-[8px] 
        rounded-[4px] w-fit bg-[rgba(51,37,34,0.8)] z-[4] flex items-center justify-center'
          >
            <div className='mx-[4px]'>
              <PlayListIcon />
            </div>
            <span className=' text-[12px] leading-[18px] text-white mr-[4px] py-[3px]'>
              {formatNumber(data?.size)} video
            </span>
          </div>

          <div
            className='absolute inset-0 bg-[rgba(0,0,0,0.8)] group-hover:opacity-[1] opacity-0
            z-[5] rounded-[12px] border-t-[1px] border-black flex items-center justify-center'
          >
            <div className='w-[24px]'>
              <PlayIcon />
            </div>
            <span className='ml-[2px] text-[13px] font-[550]'>Play all</span>
          </div>
        </div>
        <div className='flex mt-[12px]'>
          <div className='group-hover:pr-[24px] group-hover:mr-[16px] flex-1'>
            <div
              className='max-h-[44px]
                       line-clamp-2 text-ellipsis text-[16px] leading-[22px] font-[500] mb-[4px]'
            >
              <span className='whitespace-pre-wrap'>{data?.title}</span>
            </div>

            <div className='text-[12px] leading-[18px] text-gray-A'>
              <div className='flex flex-wrap items-center'>
                {data.user_info && (
                  <div className='flex items-center'>
                    <span>{data.user_info.name}</span>
                    {data.user_info.subscriber >= 100000 && (
                      <div className='ml-[4px]'>
                        <Verification size={14} />
                      </div>
                    )}
                  </div>
                )}
                {path === "playlists" && (
                  <div className="before:content-['•'] before:mx-[4px] t-1-ellipsis">
                    Playlist
                  </div>
                )}
              </div>

              <div>Updated {timeFormat2(data.updatedAt)}</div>

              <div className='hover:text-white'>Watch all playlist</div>
            </div>
          </div>

          <button
            className='w-[40px] h-[40px] rounded-[50%] 
            flex items-center justify-center relative mt-[-9px] active:bg-black-0.2
             group-hover:opacity-[1] opacity-0'
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              setShowHover((prev) => {
                if (prev) return undefined;
                handleCursorPositon(e);
                return (
                  <CustomeFuncBox
                    funcList1={[
                      {
                        id: 1,
                        text: "Không quan tâm",
                        icon: <BlockIcon />,
                      },
                    ]}
                    setOpened={() => setShowHover(undefined)}
                  />
                );
              });
            }}
          >
            <Setting2Icon />
          </button>
        </div>
      </div>
    </Link>
  );
};
export default PlayListCard;
