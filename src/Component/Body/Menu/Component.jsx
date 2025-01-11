import { Link } from "react-router-dom";
import {
  HomeIcon,
  ActiveHomeIcon,
  ShortIcon,
  ActiveShortIcon,
  SubChannelIcon,
  ActiveSubChannelIcon,
  MyChannelIcon,
  WatchedIcon,
  ActiveWatchedIcon,
  PlayListIcon,
  ActivePlayListIcon,
  MyVideoIcon,
  LaterIcon,
  ActiveLaterIcon,
  LikedIcon,
  CutIcon,
  ActiveCutIcon,
  PopularIcon,
  ActivePopularIcon,
  MusicIcon,
  ActiveMusicIcon,
  GameIcon,
  ActiveGameIcon,
  NewsIcons,
  ActiveNewsIcon,
  SportIcon,
  ActiveSportIcon,
  YoutubePremiumIcon,
  YoutubeMusicIcon,
  YoutubeStudioIcon,
  YoutubeKidIcon,
  SettingIcon,
  ActiveSettingIcon,
  DiaryIcon,
  ActiveDiaryIcon,
  HelpIcon,
  FeedBackIcon,
  MyChannel2Icon,
  ActiveMyChannel2Icon,
  ActiveLikedIcon,
} from "../../../Assets/Icons";

import {
  iloda,
  levi,
  sangtraan,
  llstylish,
  theanh,
  tgb,
  zeros,
  bauffs,
  vuive,
  asoken,
} from "../../../Assets/Images";

import { useNavigate } from "react-router-dom";

export const channelList = [
  {
    id: 1,
    name: "iLoda",
    img: iloda,
    state: 2,
  },
  {
    id: 2,
    name: "Levi",
    img: levi,
    state: 2,
  },
  {
    id: 3,
    name: "sangtraan",
    img: sangtraan,
    state: 0,
  },
  {
    id: 4,
    name: "LL Stylish",
    img: llstylish,
    state: 1,
  },
  {
    id: 5,
    name: "TheAnh96",
    img: theanh,
    state: 1,
  },
  {
    id: 6,
    name: "Thầy Giáo Ba",
    img: tgb,
    state: 1,
  },
  {
    id: 7,
    name: "Zeros",
    img: zeros,
    state: 0,
  },
  {
    id: 8,
    name: "Thebausffs",
    img: bauffs,
    state: 1,
  },
  {
    id: 9,
    name: "Vui vẻ",
    img: vuive,
    state: 1,
  },
  {
    id: 10,
    name: "Asoken",
    img: asoken,
    state: 0,
  },
];

export const footerList1 = [
  "About",
  "Press",
  "Copyright",
  "Contact us",
  "Creators",
  "Advertise",
  "Developers",
];

export const footerList2 = [
  "Terms",
  "Privacy",
  "Policy & Safety",
  "How YouTube works",
  "Test new features",
];

export const funcList1 = [
  {
    id: 1,
    title: "Home",
    path: "/",
    icon: <HomeIcon />,
    activeIcon: <ActiveHomeIcon />,
  },
  {
    id: 2,
    title: "Shorts",
    path: "/short",
    icon: <ShortIcon />,
    activeIcon: <ActiveShortIcon />,
  },
  {
    id: 3,
    title: "Subscriptions",
    path: "/sub-content?layout=grid",
    icon: <SubChannelIcon />,
    activeIcon: <ActiveSubChannelIcon />,
    renderCondition: (user) => {
      return !!user;
    },
  },
  {
    id: 4,
    title: "You",
    path: "/my-channel",
    activeIcon: <ActiveMyChannel2Icon />,
    icon: <MyChannel2Icon />,
    renderCondition: (user) => {
      return !!user;
    },
  },
];

export const funcList2 = [
  {
    id: 1,
    title: "You",
    path: "/my-channel",
    icon: <MyChannelIcon />,
    renderCondition: (user) => {
      return !!user;
    },
  },
  {
    id: 2,
    title: "History",
    path: "/watched",
    icon: <WatchedIcon />,
    activeIcon: <ActiveWatchedIcon />,
    renderCondition: (user) => {
      return !!user;
    },
  },
  {
    id: 3,
    title: "Playlists",
    path: "/playlists",
    icon: <PlayListIcon />,
    activeIcon: <ActivePlayListIcon />,
    renderCondition: (user) => {
      return !!user;
    },
  },
  {
    id: 4,
    title: "Your videos",
    path: "/manage/content/video",
    icon: <MyVideoIcon />,
    renderCondition: (user) => {
      return !!user;
    },
  },
  {
    id: 5,
    title: "Watch later",
    path: "/playlist/wl",
    icon: <LaterIcon />,
    activeIcon: <ActiveLaterIcon />,
    renderCondition: (user) => {
      return !!user;
    },
  },
  {
    id: 6,
    title: "Liked videos",
    path: "/playlist/lv",
    icon: <LikedIcon />,
    activeIcon: <ActiveLikedIcon />,
    renderCondition: (user) => {
      return !!user;
    },
  },
  {
    id: 7,
    title: "Your clips",
    path: "/my-cut",
    icon: <CutIcon />,
    activeIcon: <ActiveCutIcon />,
    renderCondition: (user) => {
      return !!user;
    },
  },
];

export const funcList3 = [
  {
    id: 1,
    title: "Tranding",
    path: "/feed/popular",
    tag: "?tag=latest",
    icon: <PopularIcon />,
    activeIconn: <ActivePopularIcon />,
  },
  {
    id: 2,
    title: "Music",
    path: "/ytb-channel/music",
    icon: <MusicIcon />,
    activeIcon: <ActiveMusicIcon />,
  },
  {
    id: 3,
    title: "Gaming",
    path: "/gaming",
    icon: <GameIcon />,
    activeIcon: <ActiveGameIcon />,
  },
  {
    id: 4,
    title: "News",
    path: "/news",
    tag: "?tag=top",
    icon: <NewsIcons />,
    activeIcon: <ActiveNewsIcon />,
  },
  {
    id: 5,
    title: "Sports",
    path: "/ytb-channel/sport",
    icon: <SportIcon />,
    activeIcon: <ActiveSportIcon />,
  },
];

export const funcList4 = [
  {
    id: 1,
    title: "YouTube Premium",
    path: "/ytb-premium",
    icon: <YoutubePremiumIcon />,
  },
  {
    id: 2,
    title: "YouTube Studio",
    path: "/ytb-studio",
    icon: <YoutubeStudioIcon />,
  },
  {
    id: 3,
    title: "YouTube Music",
    path: "/ytb-music",
    icon: <YoutubeMusicIcon />,
  },
  {
    id: 4,
    title: "YouTube Kids",
    path: "/ytb-kids",
    icon: <YoutubeKidIcon />,
  },
];

export const funcList5 = [
  {
    id: 1,
    title: "Settings",
    path: "/account-setting/account",
    icon: <SettingIcon />,
    activeIcon: <ActiveSettingIcon />,
  },
  {
    id: 2,
    title: "Report history",
    path: "/report-history",
    icon: <DiaryIcon />,
    activeIcon: <ActiveDiaryIcon />,
  },
  {
    id: 3,
    title: "Help",
    path: "/support",
    icon: <HelpIcon />,
  },
  {
    id: 4,
    title: "Send feedback",
    path: "/feedback",
    icon: <FeedBackIcon />,
  },
];

export const Button = ({ data, path, style, textStyle, handleOnClick }) => {
  return (
    <li
      className={`px-[12px] rounded-[10px] cursor-pointer
        ${
          path && data.path && data?.path.split("?")[0] === path
            ? "bg-hover-black hover:bg-black-0.2"
            : "hover:bg-hover-black"
        }
        `}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (handleOnClick) {
          handleOnClick(data.path + (data?.tag ? data?.tag : ""));
        }
      }}
    >
      <div className={`flex ${style} items-center h-[40px] `}>
        <div className='mr-[24px]'>
          {path === data?.path ? data.activeIcon || data?.icon : data?.icon}
        </div>
        <span className={`${textStyle || "flex-1"}`}>{data?.title}</span>
        {data?.icon2}
      </div>
    </li>
  );
};

export const ChannelButton = ({ data }) => {
  const navigate = useNavigate();

  return (
    <li
      className='px-[12px] rounded-[10px] cursor-pointer hover:bg-hover-black'
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/channel/${data?.email}`);
      }}
    >
      <div className='flex  items-center h-[40px]'>
        <div className='mr-[24px]'>
          <img
            src={`${import.meta.env.VITE_BASE_API_URI}${
              import.meta.env.VITE_VIEW_AVA_API
            }${data?.avatar}`}
            alt={`channel-${data?.email}`}
            className='w-[24px] h-[24px] rounded-full'
          />
        </div>
        <span className='flex-1'>{data?.name}</span>
      </div>
    </li>
  );
};

export const SmButton = ({ data, path, handleOnClick }) => {
  return (
    <div
      className={`flex flex-col justify-center items-center pt-[16px] py-[14px]
          rounded-[10px] cursor-pointer
              ${
                path && data.path && data?.path.split("?")[0] === path
                  ? "bg-hover-black hover:bg-black-0.2"
                  : "hover:bg-hover-black"
              }
        `}
      onClick={() => {
        if (handleOnClick) {
          handleOnClick(data.path);
        }
      }}
    >
      {path === data?.path ? data.activeIcon || data?.icon : data?.icon}
      <span className='text-[10px] leading-[14px] mt-[6px]'>{data.title}</span>
    </div>
  );
};

export const LinkComponent = ({ title }) => {
  return (
    <li className='mr-[6px]'>
      <Link>{title}</Link>
    </li>
  );
};
