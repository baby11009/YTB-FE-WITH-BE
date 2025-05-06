import { lazy } from "react";
const SettingPage = lazy(() => import("../../Pages/Setting/SettingPage.jsx"));
const Account = lazy(() => import("../../Pages/Setting/Display/Account.jsx"));
const Notifications = lazy(() =>
  import("../../Pages/Setting/Display/Notifications"),
);
const Playback = lazy(() => import("../../Pages/Setting/Display/Playback"));
const Download = lazy(() => import("../../Pages/Setting/Display/Download"));
const Privacy = lazy(() => import("../../Pages/Setting/Display/Privacy"));
const Sharing = lazy(() => import("../../Pages/Setting/Display/Sharing"));
const Billing = lazy(() => import("../../Pages/Setting/Display/Billing"));
const Advanced = lazy(() => import("../../Pages/Setting/Display/Advanced"));

export {
  SettingPage,
  Account,
  Notifications,
  Playback,
  Download,
  Privacy,
  Sharing,
  Billing,
  Advanced,
};
