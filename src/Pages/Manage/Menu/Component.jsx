import { useNavigate } from "react-router-dom";
import {
  DashboardIcon,
  ActiveDashboardIcon,
  CommentIcon,
  UnActiveCommentIcon,
  LogOutIcon,
  ActiveMyChannel2Icon,
  MyChannel2Icon,
  CustomeIcon,
  ActiveCustomeIcon,
} from "../../../Assets/Icons";

export const BtnList = [
  {
    title: "Tổng quát",
    icon: <DashboardIcon />,
    active: <ActiveDashboardIcon />,
    path: "/manage/dashboard",
  },
  {
    title: "Nội dung",
    icon: <MyChannel2Icon />,
    active: <ActiveMyChannel2Icon />,
    path: "/manage/content",
    param: "video",
  },
  {
    title: "Comment",
    icon: <UnActiveCommentIcon />,
    active: <CommentIcon />,
    path: "/manage/comment",
    param: "video-comment",
  },
  {
    title: "Tùy chỉnh",
    icon: <CustomeIcon />,
    active: <ActiveCustomeIcon />,
    path: "/manage/setting",
  },
];

export const Button = ({ data, currPath }) => {
  const navigate = useNavigate();

  const handleOnclick = () => {
    if (data.path) {
      let path = data.param ? data.path + "/" + data.param : data.path;

      navigate(path);
    }
  };

  if (!data) {
    throw new Error("Thiếu data");
  }

  return (
    <button
      className={`w-full px-[12px] my-[6px] h-[48px] flex items-center   
        rounded-[10px] hover:bg-black-0.2  
        ${
          currPath && data.path && currPath.includes(data.path)
            ? " bg-black-0.1 hover:bg-black-0.2"
            : " hover:bg-black-0.1"
        }`}
      onClick={handleOnclick}
    >
      <div className='mr-[24px]'>
        {data.path === currPath && data.active ? data.active : data.icon}
      </div>
      <p className='text-[16px] leading-[24px] font-[500]'>{data.title}</p>
    </button>
  );
};

export const SmallButton = ({ data, currPath }) => {
  const navigate = useNavigate();

  const handleOnclick = () => {
    if (data.path) {
      let path = data.param ? data.path + "/" + data.param : data.path;

      navigate(path);
    }
    if (data.handleOnclick) {
      data.handleOnclick();
    }
  };

  if (!data) {
    throw new Error("Thiếu data");
  }
  return (
    <button
      className={`w-full flex flex-col items-center 
        justify-center rounded-[10px]  
       `}
      onClick={handleOnclick}
    >
      <div
        className={`size-[48px] rounded-[5px] flex items-center justify-center  ${
          currPath && data.path && currPath.includes(data.path)
            ? " bg-black-0.1 hover:bg-black-0.2"
            : " hover:bg-black-0.1"
        }`}
      >
        <div className='size-[24px]'>
          {currPath && data.path && currPath.includes(data.path)
            ? data.active
            : data.icon}
        </div>
      </div>
    </button>
  );
};
