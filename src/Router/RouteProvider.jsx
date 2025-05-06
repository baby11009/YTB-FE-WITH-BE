import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import { AdminHomePage } from "../Pages";

import { ProtectedRoute, GuestOnly } from "./ProtectedRoute";

import {
  HomePage,
  MainPage,
  ShortPage,
  SearchPage,
  FeedPage,
  NewsPage,
  GamingPage,
  PostPage,
  ChannelPage,
  SubscribeContentPage,
  SubscribeChannel,
  PlaylistsPage,
  PlaylistPage,
  WatchedPage,
  YtbChannelPage,
  MyChannelPage,
} from "./Route/Home";

import {
  AuthPage,
  Login,
  Register,
  Confirmation,
  SendCode,
  ChangePwd,
} from "./Route/Auth";

import {
  SettingPage,
  Account,
  Notifications,
  Playback,
  Download,
  Privacy,
  Sharing,
  Billing,
  Advanced,
} from "./Route/Setting";

import {
  ManagePage,
  Dashboard,
  Content,
  Comment,
  ChannelSetting,
  Video,
  Short,
  Playlist,
} from "./Route/Manage";

import { lazy } from "react";

const VideoPage = lazy(() => import("../Pages/Video/VideoPage"));
const ErrorPage = lazy(() => import("../Pages/Notification/Error/ErrorPage"));
const SuccessPage = lazy(() =>
  import("../Pages/Notification/Success/SuccessPage"),
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: "short",
        element: <ShortPage />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "feed",
        element: <FeedPage />,
      },
      {
        path: "news",
        element: <NewsPage />,
      },
      {
        path: "gaming",
        element: <GamingPage />,
      },
      {
        path: "ytb-channel/:id",
        element: <YtbChannelPage />,
      },
      {
        path: "post",
        element: <PostPage />,
      },
      {
        path: "channel",
        element: (
          <ProtectedRoute>
            <ChannelPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "sub-content",
        element: (
          <ProtectedRoute>
            <SubscribeContentPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "sub-channels",
        element: (
          <ProtectedRoute>
            <SubscribeChannel />
          </ProtectedRoute>
        ),
      },
      {
        path: "playlists",
        element: (
          <ProtectedRoute>
            <PlaylistsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "watched",
        element: (
          <ProtectedRoute>
            <WatchedPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "playlist/:id",
        element: (
          <ProtectedRoute>
            <PlaylistPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "my-channel",
        element: (
          <ProtectedRoute>
            <MyChannelPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/auth",
    element: (
      <GuestOnly
        mustHaveAccessRoutes={[
          "/auth/confirm",
          "/auth/change-pwd-2",
          "/auth/forgot-pwd-2",
        ]}
      >
        <AuthPage />
      </GuestOnly>
    ),
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "confirm",
        element: <Confirmation />,
      },
      {
        path: "change-pwd-1",
        element: <SendCode type={"change"} />,
      },
      {
        path: "change-pwd-2",
        element: <ChangePwd type={"change"} />,
      },
      {
        path: "forgot-pwd-1",
        element: <SendCode type={"forgot"} />,
      },
      {
        path: "forgot-pwd-2",
        element: <ChangePwd type={"forgot"} />,
      },
    ],
  },
  {
    path: "/video",
    element: <VideoPage />,
  },
  {
    path: "error",
    element: <ErrorPage />,
  },
  {
    path: "/success",
    element: <SuccessPage />,
  },
  {
    path: "/setting",
    element: (
      <ProtectedRoute>
        <SettingPage />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "account",
        element: <Account />,
      },
      {
        path: "notifications",
        element: <Notifications />,
      },
      {
        path: "playback",
        element: <Playback />,
      },
      {
        path: "downloads",
        element: <Download />,
      },
      {
        path: "privacy",
        element: <Privacy />,
      },
      {
        path: "sharing",
        element: <Sharing />,
      },
      {
        path: "billing",
        element: <Billing />,
      },
      {
        path: "advanced",
        element: <Advanced />,
      },
      {
        path: "*",
        element: <Navigate to={"/setting/account"} replace />,
      },
    ],
  },
  {
    path: "/manage",
    element: (
      <ProtectedRoute>
        <ManagePage />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "content",
        element: <Content />,
        children: [
          {
            path: "video",
            element: <Video />,
          },
          {
            path: "shorts",
            element: <Short />,
          },
          {
            path: "playlists",
            element: <Playlist />,
          },
          {
            path: "comunity",
            element: <div>comunity</div>,
          },
        ],
      },
      {
        path: "comment",
        element: <Comment />,
      },
      {
        path: "setting",
        element: <ChannelSetting />,
      },
    ],
  },
  // {
  //   path: "/admin/:data/:page?/:id?/:func?",
  //   element: (
  //     <ProtectedRoute requiredRole={"admin"}>
  //       <AdminHomePage />
  //     </ProtectedRoute>
  //   ),
  // },
  // {

  // {
  //   path: "*",
  //   element: (
  //     <Navigate to={"/error?status=404&message=Route not found"} replace />
  //   ),
  // },
]);

const RouteProvider = () => {
  return <RouterProvider router={router} />;
};
export default RouteProvider;
