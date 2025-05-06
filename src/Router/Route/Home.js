import { lazy } from "react";
// Home
const HomePage = lazy(() => import("../../Pages/Home/HomePage"));

const MainPage = lazy(() => import("../../Pages/Home/Main/MainPage"));
const ShortPage = lazy(() => import("../../Pages/Home/Short/ShortPage"));
const ChannelPage = lazy(() => import("../../Pages/Home/Channel/ChannelPage"));
const PostPage = lazy(() => import("../../Pages/Home/Comunity Post/PostPage"));
const SubscribeContentPage = lazy(() =>
  import("../../Pages/Home/Subscribe Content/SubscribeContentPage"),
);
const SubscribeChannel = lazy(() =>
  import("../../Pages/Home/Subscribe Content/SubscribeChannel"),
);
const WatchedPage = lazy(() => import("../../Pages/Home/Watched/WatchedPage"));
const PlaylistsPage = lazy(() =>
  import("../../Pages/Home/Playlists/PlaylistsPage"),
);
const PlaylistPage = lazy(() =>
  import("../../Pages/Home/Playlist/PlaylistPage"),
);
const YtbChannelPage = lazy(() =>
  import("../../Pages/Home/Ytb Channel/YtbChannelPage"),
);
const FeedPage = lazy(() => import("../../Pages/Home/Feed/FeedPage"));
const NewsPage = lazy(() => import("../../Pages/Home/News/NewsPage"));
const GamingPage = lazy(() => import("../../Pages/Home/Gaming/GamingPage"));
const MyChannelPage = lazy(() =>
  import("../../Pages/Home/MyChannel/MyChannelPage"),
);
const SearchPage = lazy(() => import("../../Pages/Home/Search/SearchPage"));

export {
  HomePage,
  // Home
  MainPage,
  ShortPage,
  ChannelPage,
  PostPage,
  SubscribeContentPage,
  SubscribeChannel,
  MyChannelPage,
  SearchPage,
  WatchedPage,
  PlaylistPage,
  PlaylistsPage,
  YtbChannelPage,
  FeedPage,
  NewsPage,
  GamingPage,
};
