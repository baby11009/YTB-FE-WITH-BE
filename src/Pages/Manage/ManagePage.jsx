import MainLayOut from "../../Layout/MainLayOut";
import Header from "./Header";
import Menu from "./Menu/Menu";
import { useLocation, useParams } from "react-router-dom";
import { scrollToTop } from "../../util/scrollCustom";
import { useState, useEffect, useLayoutEffect } from "react";
import { useAuthContext } from "../../Auth Provider/authContext";
import { Dashboard, Content, Comment, ChannelSetting } from "./Display";
const ManagePage = () => {
  const { user, openedMenu, setOpenedMenu } = useAuthContext();

  const [pageRender, setPageRender] = useState(undefined);

  const location = useLocation();

  const params = useParams();

  const pageList = {
    dashboard: <Dashboard openedMenu={openedMenu} />,
    content: <Content openedMenu={openedMenu} />,
    comment: <Comment openedMenu={openedMenu} />,
    setting: <ChannelSetting openedMenu={openedMenu} />,
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
            {pageRender}
          </div>
        </div>
      </>
    </MainLayOut>
  );
};
export default ManagePage;
