import { useNavigate } from "react-router-dom";
import {
  DashboardIcon,
  ActiveDashboardIcon,
  CommentIcon,
  UnActiveCommentIcon,
  ActiveMyChannel2Icon,
  MyChannel2Icon,
  CustomeIcon,
  ActiveCustomeIcon,
} from "../../../Assets/Icons";

export const BtnList = [
  {
    title: "Dashboard",
    icon: <DashboardIcon />,
    active: <ActiveDashboardIcon />,
    path: "/manage/dashboard",
  },
  {
    title: "Content",
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
    title: "Customization",
    icon: <CustomeIcon />,
    active: <ActiveCustomeIcon />,
    path: "/manage/setting",
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
          {data.path === currPath && data.active ? data.active : data.icon}
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
