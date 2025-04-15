import { useState, useEffect, useRef } from "react";
import {
  SettingIcon,
  Setting2Icon,
  DotIcon,
  BlockNotifyIcon,
  HideIcon,
} from "../../Assets/Icons";
import { levi, v1_levi } from "../../Assets/Images";
import { getData } from "../../Api/getData";
import { Link } from "react-router-dom";
import { timeFormat2 } from "../../util/timeforMat";

const NotiCard = ({ data }) => {
  console.log("🚀 ~ data:", data);

  const [opened, setOpened] = useState(false);

  const boxRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setOpened("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <li className='py-[16px] pr-[16px] flex hover:bg-hover-black'>
      <div className='mx-[6px] mt-[22px]'>{!data.readed && <DotIcon />}</div>
      <div className='mr-[16px]'>
        <img
          src={levi}
          alt='channel image'
          className='w-[48px] h-[48px] rounded-[50%]'
        />
      </div>
      <div className='flex-1 text-left'>
        <h3 className='leading-[20px] text-[14px] mb-[8px]'>{data.message}</h3>
        <div>
          <span className='text-gray-A text-[12px] leading-[18px]'>
            {timeFormat2(data.createdAt)}
          </span>
        </div>
      </div>
      <div className='w-[86px] aspect-video ml-[16px] mr-[8px] rounded-[5px] overflow-hidden '>
        <img
          src={`${import.meta.env.VITE_BASE_API_URI}${
            import.meta.env.VITE_VIEW_THUMB_API
          }${data.video_info.thumb}`}
          alt=''
          className=" size-full object-contain objec-center"
        />
      </div>
      <div
        className='w-[40px] h-[40px] rounded-[50%] mt-[-10px]
        flex items-center justify-center relative active:bg-[rgba(255,255,255,.5)] '
        onClick={(e) => {
          e.stopPropagation();
          setOpened((prev) => !prev);
        }}
        ref={boxRef}
      >
        <div className='w-[24px]'>
          <Setting2Icon />
        </div>
        {opened && (
          <div
            className='bg-[#282828] min-w-[265px] text-[14px] leading-[20px] py-[8px]
                   absolute z-[10] right-0 top-[100%] rounded-[12px]'
          >
            <div className='pl-[16px] pr-[12px] py-[8px] flex items-center hover:bg-hover-black'>
              <div className='mr-[16px]'>
                <HideIcon />
              </div>
              <h3>Ẩn thông báo này</h3>
            </div>
            <div className='pl-[16px] pr-[12px] py-[8px] flex items-center hover:bg-hover-black'>
              <div className='mr-[16px]'>
                <BlockNotifyIcon />
              </div>
              <h3>Tắt tất cả thông báo từ levi</h3>
            </div>
          </div>
        )}
      </div>
    </li>
  );
};

const NotificationBox = () => {
  const [queries, setQueries] = useState({ page: 1, limit: 12 });

  const [notificationList, setNotificationList] = useState([]);

  const { data, isLoading } = getData("/user/notification", queries);

  const firstTime = useRef(true);

  useEffect(() => {
    firstTime.current = false;
  }, []);

  useEffect(() => {
    if (data) {
      setNotificationList((prev) => [...prev, ...data.data]);
    }
  }, [data]);

  return (
    <div
      className='max-w-[480px] w-[90vw] h-[90vh] bg-[#282828] 
    absolute top-[110%] z-[500] right-0 rounded-[12px] flex flex-col justify-center overflow-hidden'
    >
      {isLoading && firstTime.current && (
        <div className='absolute inset-0 flex items-center justify-center z-[10] bg-[#282828] '>
          <div
            className='size-[40px] rounded-[50%] border-[2px] border-transparent
     border-t-[rgba(255,255,255,0.5)] border-r-[rgba(255,255,255,0.5)] animate-spin'
          ></div>
        </div>
      )}

      <div className='min-h-[48px] flex items-center justify-between border-b-[1px] border-b-[rgba(255,255,255,0.2)]'>
        <div className='ml-[16px] leading-[22px]'>Notification</div>
        <Link
          className='w-[40px] h-[40px] mr-[8px] flex items-center justify-center'
          title='Setting'
          onClick={(e) => e.stopPropagation()}
          to={"/account-setting/notifications"}
        >
          <div>
            <SettingIcon />
          </div>
        </Link>
      </div>
      <ul className=' overflow-y-auto menu-scrollbar flex-1'>
        {notificationList.length > 0 &&
          notificationList.map((notification, index) => (
            <NotiCard key={notification._id + index} data={notification} />
          ))}
      </ul>
    </div>
  );
};
export default NotificationBox;
