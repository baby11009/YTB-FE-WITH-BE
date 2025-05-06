import MainLayOut from "../../Layout/MainLayOut";
import {  Suspense } from "react";
import { Outlet } from "react-router-dom";

const AuthPage = () => {
  return (
    <Suspense>
      <MainLayOut>
        <Outlet />
      </MainLayOut>
    </Suspense>
  );
};
export default AuthPage;
