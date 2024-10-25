import { Link, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  ActiveHomeIcon,
  UserIcon,
  ActiveUserIcon,
  VideoIcon,
  ActiveVideoIcon,
  CommentIcon,
  UnActiveCommentIcon,
  LogOutIcon,
  PlayListIcon,
  ActivePlayListIcon,
  TagIcon,
  ActiveTagIcon,
} from "../../../Assets/Icons";

export const BtnList = [
  {
    title: "Dashboard",
    icon: <HomeIcon />,
    active: <ActiveHomeIcon />,
    path: "/admin/dashboard",
  },
  {
    title: "User",
    icon: <UserIcon />,
    active: <ActiveUserIcon />,
    path: "/admin/user",
  },
  {
    title: "Tag",
    icon: <TagIcon />,
    active: <ActiveTagIcon />,
    path: "/admin/tag",
  },
  {
    title: "Video",
    icon: <VideoIcon />,
    active: <ActiveVideoIcon />,
    path: "/admin/video",
  },
  {
    title: "Comment",
    icon: <UnActiveCommentIcon />,
    active: <CommentIcon />,
    path: "/admin/comment",
  },
  {
    title: "Playlist",
    icon: <PlayListIcon />,
    active: <ActivePlayListIcon />,
    path: "/admin/playlist",
  },
];

export const FuncBtnList = [
  {
    title: "Đăng xuất",
    icon: <LogOutIcon />,
  },
];

export const Button = ({ data, currPath }) => {
  const navigate = useNavigate();

  const handleOnclick = () => {
    if (data.path) {
      navigate(data.path);
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
      navigate(data.path);
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
      className={`w-full h-[74px] flex flex-col items-center 
        justify-center rounded-[10px] hover:bg-black-0.2  
        ${
          currPath && data.path && currPath.includes(data.path)
            ? " bg-black-0.1 hover:bg-black-0.2"
            : " hover:bg-black-0.1"
        }`}
      onClick={handleOnclick}
    >
      <div className=''>
        {currPath && data.path && currPath.includes(data.path)
          ? data.active
          : data.icon}
      </div>
      <p className='text-[10px] leading-[14px] mt-[6px]'>{data.title}</p>
    </button>
  );
};
