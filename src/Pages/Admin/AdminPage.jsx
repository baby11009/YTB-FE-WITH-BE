import MainLayOut from "../../Layout/MainLayOut";
import { useEffect, Suspense } from "react";
import Header from "./Header";
import Menu from "./Menu/Menu";
import { useLocation, Outlet } from "react-router-dom";
import { scrollToTop } from "../../util/scrollCustom";
import { useAuthContext } from "../../Auth Provider/authContext";

const AdminPage = () => {
  const { user, openedMenu, setOpenedMenu } = useAuthContext();

  const location = useLocation();

  useEffect(() => {
    scrollToTop();
  }, [location.pathname]);

  return (
    <MainLayOut>
      <>
        <Header setOpenedMenu={setOpenedMenu} />

        <div className='relative z-[9500]'>
          <Menu
            openedMenu={openedMenu}
            setOpenedMenu={setOpenedMenu}
            currPath={location.pathname}
            userData={user}
          />
        </div>

        <div
          className={`ml-[74px] flex justify-center  ${
            openedMenu && "2lg:ml-[255px]"
          } transition-[margin]  ease-cubic-bezier-[0,0,0.2,1]
           duration-[417ms]`}
        >
          <div
            className='w-full h-[calc(100vh-56px)]
            mt-[56px]'
          >
            <Suspense>
              <Outlet />
            </Suspense>
          </div>
        </div>
      </>
    </MainLayOut>
  );
};
export default AdminPage;
