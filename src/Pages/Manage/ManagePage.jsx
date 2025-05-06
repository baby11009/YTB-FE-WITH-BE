import MainLayOut from "../../Layout/MainLayOut";
import Header from "./Header";
import Menu from "./Menu/Menu";
import { useLocation,  Outlet } from "react-router-dom";
import { scrollToTop } from "../../util/scrollCustom";
import { useEffect,  Suspense } from "react";
import { useAuthContext } from "../../Auth Provider/authContext";
const ManagePage = () => {
  const { user, openedMenu, setOpenedMenu } = useAuthContext();

  const location = useLocation();

  useEffect(() => {
    scrollToTop();
  }, [location.pathname]);
  return (
    <MainLayOut>
      <>
        <div className='relative z-[9501]'>
          <Header setOpenedMenu={setOpenedMenu} />
        </div>
        <div className=' relative z-[9500] '>
          <Menu
            openedMenu={openedMenu}
            setOpenedMenu={setOpenedMenu}
            currPath={location.pathname}
            data={user}
          />
        </div>
        <div
          className={`ml-[74px] flex justify-center ${
            openedMenu && "2lg:ml-[255px]"
          } transition-[margin]  ease-cubic-bezier-[0,0,0.2,1]
           duration-[417ms]`}
        >
          <div
            className={`w-full  h-screen overflow-hidden
            pt-[56px] relative`}
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
export default ManagePage;
