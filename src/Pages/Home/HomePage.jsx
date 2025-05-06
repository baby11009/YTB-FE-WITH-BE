import { useLayoutEffect, Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import MainLayOut from "../../Layout/MainLayOut";
import { Body, Header } from "../../Component";
import { scrollToTop } from "../../util/scrollCustom";
import { useAuthContext } from "../../Auth Provider/authContext";

const HomePage = () => {
  const { pathname } = useLocation();

  const { openedMenu, setOpenedMenu } = useAuthContext();

  useLayoutEffect(() => {
    scrollToTop();
  }, [pathname]);

  return (
    <MainLayOut>
      <Header setOpenedMenu={setOpenedMenu} />
      <Body openedMenu={openedMenu} setOpenedMenu={setOpenedMenu}>
        <Suspense fallback={"...Loading"}>
          <Outlet />
        </Suspense>
      </Body>
    </MainLayOut>
  );
};
export default HomePage;
