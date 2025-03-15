import { Link, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  ActiveHomeIcon,
  UserIcon,
  ActiveUserIcon,
  VideoIcon,
  ShortIcon,
  ActiveShortIcon,
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
    title: "Short",
    icon: <ShortIcon />,
    active: <ActiveShortIcon />,
    path: "/admin/short",
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
    title: "SignOut",
    icon: <LogOutIcon />,
  },
];

export const Button = ({ data, currPath, openedMenu }) => {
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
    <button className='w-full' onClick={handleOnclick}>
      <div
        className={`mx-[12px] pl-[4px] pr-[12px] h-[48px] flex items-center   
        rounded-[10px] hover:bg-black-0.2 overflow-hidden 
        ${
          currPath && data.path && currPath.includes(data.path)
            ? " bg-black-0.1 hover:bg-black-0.2"
            : " hover:bg-black-0.1"
        }`}
      >
        <div className='min-w-[24px] size-[24px] ml-[8px] mr-[24px]'>
          {currPath && data.path && currPath.includes(data.path)
            ? data.active
            : data.icon}
        </div>

        <p
          className={` text-[16px] leading-[24px] font-[500] ${
            openedMenu ? "opacity-[1]" : "opacity-[0]"
          } transition-[opacity] ease-cubic-bezier-[0,0,0.2,1] duration-[217ms] `}
        >
          {data.title}
        </p>
      </div>
    </button>
  );
};
