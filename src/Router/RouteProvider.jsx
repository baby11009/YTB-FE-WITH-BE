import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  VideoPage,
  HomePage,
  SettingPage,
  AdminHomePage,
  AuthPage,
  SuccessPage,
  ErrorPage,
  ManagePage,
} from "../Pages";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "error/:code/:msg",
    element: <ErrorPage />,
  },
  {
    path: "/video",
    element: <VideoPage />,
  },
  {
    path: "/auth/success/:msg",
    element: <SuccessPage />,
  },
  {
    path: "/auth/:path",
    element: (
      <ProtectedRoute
        disableRouteAfterSigin={["/auth/login"]}
        accessRoutes={["/auth/confirm"]}
      >
        <AuthPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/account-setting/:id",
    element: <SettingPage />,
  },
  {
    path: "/admin/:data",
    element: (
      <ProtectedRoute requiredRole={"admin"}>
        <AdminHomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/:data/:func",
    element: (
      <ProtectedRoute requiredRole={"admin"}>
        <AdminHomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/:data/:func/:id",
    element: (
      <ProtectedRoute requiredRole={"admin"}>
        <AdminHomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/manage/:func",
    element: (
      <ProtectedRoute authAll={true} disableRouteAfterSigin={["/auth/login"]}>
        <ManagePage />
      </ProtectedRoute>
    ),
  },
  ,
  {
    path: "/manage/:func/:data",
    element: (
      <ProtectedRoute authAll={true} disableRouteAfterSigin={["/auth/login"]}>
        <ManagePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/:path",
    element: (
      <ProtectedRoute
        onlyAuthTheseRoutes={[
          "/sub-content",
          "/sub-channels",
          "/my-channel",
          "/watched/me",
          "/playlists",
          "/playlist/wl",
          "/playlist/lv",
        ]}
        disableRouteAfterSigin={["/auth/login"]}
      >
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/:path/:id",
    element: <HomePage />,
  },
]);

const RouteProvider = () => {
  return <RouterProvider router={router} />;
};
export default RouteProvider;
