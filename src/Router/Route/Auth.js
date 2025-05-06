import { lazy } from "react";

const AuthPage = lazy(() => import("../../Pages/Auth/AuthPage.jsx"));

const Login = lazy(() => import("../../Pages/Auth/Login.jsx"));
const Register = lazy(() => import("../../Pages/Auth/Register"));
const Confirmation = lazy(() => import("../../Pages/Auth/Confirmation"));
const SendCode = lazy(() =>
  import("../../Pages/Auth/Modify password/SendCode"),
);
const ChangePwd = lazy(() =>
  import("../../Pages/Auth/Modify password/ChangePwd"),
);

export { AuthPage, Login, Register, Confirmation, SendCode, ChangePwd };
