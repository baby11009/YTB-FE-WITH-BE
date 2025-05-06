import { lazy } from "react";
const ManagePage = lazy(() => import("../../Pages/Manage/ManagePage"));

const Dashboard = lazy(() =>
  import("../../Pages/Manage/Display/Dashboard/Dashboard"),
);

//
const Content = lazy(() =>
  import("../../Pages/Manage/Display/Content/Content"),
);
const Video = lazy(() =>
  import("../../Pages/Manage/Display/Content/Display/Video/Video"),
);
const Short = lazy(() =>
  import("../../Pages/Manage/Display/Content/Display/Short/Short"),
);
const Playlist = lazy(() =>
  import("../../Pages/Manage/Display/Content/Display/Playlist/Playlist"),
);

//
const Comment = lazy(() =>
  import("../../Pages/Manage/Display/Comment/Comment"),
);
const ChannelSetting = lazy(() =>
  import("../../Pages/Manage/Display/Setting/ChannelSetting"),
);

export {
  ManagePage,
  Dashboard,
  Content,
  Comment,
  ChannelSetting,
  Video,
  Short,
  Playlist,
};
