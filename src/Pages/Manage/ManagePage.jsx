import MainLayOut from "../../Layout/MainLayOut";
import Header from "./Header";
import Menu from "./Menu/Menu";
import SdMenu from "./Menu/SdMenu";
import { useLocation, useParams } from "react-router-dom";
import { scrollToTop } from "../../util/scrollCustom";
import { useState, useEffect, useLayoutEffect, Suspense } from "react";
import { useAuthContext } from "../../Auth Provider/authContext";
import { Dashboard, Content, Comment, ChannelSetting } from "./Display";
const ManagePage = () => {
  const { user, openedMenu, setOpenedMenu } = useAuthContext();

  const [pageRender, setPageRender] = useState(undefined);

  const location = useLocation();

  const params = useParams();

  const pageList = {
    dashboard: <Dashboard />,
    content: <Content />,
    comment: <Comment />,
    setting: <ChannelSetting />,
  };

  useLayoutEffect(() => {
    const values = Object.values(params);

    const page = `${values[0]}`;

    if (pageList[page]) {
      setPageRender(pageList[page]);
    } else {
      setPageRender(undefined);
      throw new Error("Route does not exits");
    }
  }, [params, openedMenu]);

  useEffect(() => {
    scrollToTop();
  }, [pageRender]);
  return (
    <MainLayOut>
      <>
        <Header setOpenedMenu={setOpenedMenu} />
        <div className='hidden xl:block relative z-[9500]'>
          <Menu
            openedMenu={openedMenu}
            currPath={location.pathname}
            data={user}
          />
        </div>
        <div className='block xl:hidden relative z-[9500]'>
          <SdMenu
            openedMenu={openedMenu}
            setOpenedMenu={setOpenedMenu}
            currPath={location.pathname}
            data={user}
          />
        </div>
        <div
          className={` md:ml-[74px] flex justify-center px-[16px] md:px-0 ${
            openedMenu && "xl:ml-[255px]"
          }`}
        >
          <div
            className={`w-full md:px-[24px] min-h-screen
            pt-[56px] relative`}
          >
            <Suspense
              fallback={
                <div className='w-full h-screen flex items-center justify-center'>
                  <h2 className='text-[30px] leading-[32px] font-[500]'>
                    Loading.....
                  </h2>
                </div>
              }
            >
              {pageRender}
            </Suspense>
          </div>
        </div>
      </>
    </MainLayOut>
  );
};
export default ManagePage;
