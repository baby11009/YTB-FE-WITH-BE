import MainLayOut from "../../Layout/MainLayOut";
import { Header, Body } from "../../Component";
import { Suspense, useEffect, useState } from "react";
import LeftMenu from "./LeftMenu/LeftMenu";
import { Outlet, useLocation } from "react-router-dom";
import { scrollToTop } from "../../util/scrollCustom";

const SettingPage = () => {
  const [openedMenu, setOpenedMenu] = useState(false);

  const location = useLocation();

  useEffect(() => {
    scrollToTop();
  }, [location.pathname]);
  
  return (
    <MainLayOut style={{}}>
      <Header setOpenedMenu={setOpenedMenu} />
      <Body
        openedMenu={openedMenu}
        setOpenedMenu={setOpenedMenu}
        noLDMenu={true}
        noIconMenu={true}
        modalMenu={true}
      >
        <div className='relative'>
          <LeftMenu currPath={location.pathname} />
          <div className='1-5sm:pl-[240px] flex justify-center'>
            <div className='w-full max-w-[1080px] px-[32px] mb-[16px] overflow-hidden'>
              <Suspense>
                <Outlet />
              </Suspense>
            </div>
          </div>
        </div>
      </Body>
    </MainLayOut>
  );
};
export default SettingPage;
