import { Link } from "react-router-dom";
import { getRandomHexColor } from "../../util/func";
import { useRef } from "react";
import { Verification } from "../../Assets/Icons";
import { durationCalc } from "../../util/durationCalc";

const PlaylistCard3 = ({ data, thumbStyle }) => {
  const bgColor = useRef(getRandomHexColor());
  return (
    <div className='flex'>
      <Link
        className={`${
          thumbStyle ? thumbStyle : "w-[246px] h-[138px] "
        } aspect-video relative mr-[16px]`}
        to={`/video?id=${data?.video_list[0]?._id}&list=${data?._id}`}
      >
        <div className='relative rounded-[8px] overflow-hidden'>
          <img
            src={`${import.meta.env.VITE_BASE_API_URI}${
              import.meta.env.VITE_VIEW_THUMB_API
            }${data?.video_list[0]?.thumb}?width=480&height=270`}
            alt={"thumb" + data._id}
            className='relative w-full  z-[2]'
          />
          <div
            className='absolute inset-0 z-[1] bg-no-repeat bg-cover bg-center rounded-[8px]'
            style={{
              backgroundImage: `url('${import.meta.env.VITE_BASE_API_URI}${
                import.meta.env.VITE_VIEW_THUMB_API
              }${
                data?.video_list[0]?.thumb
              }?width=480&height=270&fit=cover&quality=1')`,
              filter: "blur(4px)",
            }}
          ></div>
        </div>
        <div
          className='absolute top-[-4px] rounded-[8px] w-[calc(100%-16px)] h-full mx-[8px]'
          style={{ backgroundColor: bgColor.current }}
        ></div>
      </Link>
      <div className="flex-1">
        <div className=' line-clamp-2 max-h-[52px]  text-[18px] leading-[26px]'>
          {data.title}
        </div>
        <div className='flex items-center text-[12px] leading-[18px] text-gray-A'>
          <Link
            to={`/channel/${data.channel_info.email}`}
            title={data.channel_info.name}
            className='hover:text-white-F1'
          >
            {data.channel_info.name}
          </Link>
          <span className='mx-[4px]'>·</span>
          <span>Playlist</span>
          <div className='w-[14px] ml-[4px] mb-[-1px]'>
            <Verification />
          </div>
        </div>
        <ul className='mt-[16px] mb-[8px] text-[12px] leading-[18px] text-white-F1'>
          {data.video_list.map((video) => (
            <li key={video._id}>
              <Link
                className='flex items-center'
                to={`/video?id=${video._id}&list=${data._id}`}
                title={video.title}
              >
                <div className='line-clamp-1 h-[18px] '>{video.title}</div>
                <div className='mx-[4px] shrink-0'>·</div>
                <div className=' shrink-0'>{durationCalc(video.duration)}</div>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          to={`/video?id=${data?.video_list[0]?._id}&list=${data?._id}`}
          className='text-[12px] leading-[18px] text-gray-A font-[500] hover:text-white-F1'
        >
          VIEW FULL PLAYLIST
        </Link>
      </div>
    </div>
  );
};
export default PlaylistCard3;
