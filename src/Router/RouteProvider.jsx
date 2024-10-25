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
    path: "/:path",
    element: <HomePage />,
  },
  {
    path: "/:path/:id",
    element: <HomePage />,
  },
  {
    path: "/auth/success/:msg",
    element: <SuccessPage />,
  },
  {
    path: "/auth/:path",
    element: (
      <ProtectedRoute
        notAuthRoutes={["/auth/login"]}
        accessRoutes={["/auth/confirm"]}
      >
        <AuthPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/video/:id",
    element: <VideoPage />,
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
      <ProtectedRoute notAuthRoutes={["/auth/login"]}>
        <ManagePage />
      </ProtectedRoute>
    ),
  },
  ,
  {
    path: "/manage/:func/:data",
    element: (
      <ProtectedRoute notAuthRoutes={["/auth/login"]}>
        <ManagePage />
      </ProtectedRoute>
    ),
  },
]);

const RouteProvider = () => {
  return <RouterProvider router={router} />;
};
export default RouteProvider;
