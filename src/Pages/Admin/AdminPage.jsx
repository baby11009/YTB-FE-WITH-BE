import MainLayOut from "../../Layout/MainLayOut";
import { useState, useEffect, useLayoutEffect, Suspense } from "react";
import Header from "./Header";
import Menu from "./Menu/Menu";
import SdMenu from "./Menu/SdMenu";
import {
  DisplayUser,
  DisplayVideo,
  DisplayCmt,
  DisplayPlaylist,
  DisplayTag,
} from "./Display Data";
import {
  UpsertUser,
  UpsertVideo,
  UpsertComment,
  UpsertPlaylist,
  UpsertTag,
} from "./Upsert";
import { useLocation, useParams } from "react-router-dom";
import { scrollToTop } from "../../util/scrollCustom";

const AdminPage = () => {
  const [openedMenu, setOpenedMenu] = useState(true);

  const [pageRender, setPageRender] = useState(undefined);

  const location = useLocation();

  const params = useParams();

  const pageList = {
    dashboard: <div>DashBoard</div>,
    user: <DisplayUser openedMenu={openedMenu} />,
    "upsert-user": <UpsertUser />,
    tag: <DisplayTag openedMenu={openedMenu} />,
    "upsert-tag": <UpsertTag />,
    video: <DisplayVideo openedMenu={openedMenu} />,
    "upsert-video": <UpsertVideo />,
    comment: <DisplayCmt openedMenu={openedMenu} />,
    "upsert-comment": <UpsertComment />,
    playlist: <DisplayPlaylist openedMenu={openedMenu} />,
    "upsert-playlist": <UpsertPlaylist />,
  };

  useLayoutEffect(() => {
    const values = Object.values(params);

    const page =
      values.length >= 2 ? `${values[1]}-${values[0]}` : `${values[0]}`;

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

        <div className='hidden xl:block z-[500]'>
          <Menu
            openedMenu={openedMenu}
            setOpenedMenu={setOpenedMenu}
            currPath={location.pathname}
          />
        </div>
        <div className='block xl:hidden z-[500]'>
          <SdMenu
            openedMenu={openedMenu}
            setOpenedMenu={setOpenedMenu}
            currPath={location.pathname}
          />
        </div>
        <div
          className={` md:ml-[74px] flex justify-center px-[16px] md:px-0 ${
            openedMenu && "xl:ml-[240px]"
          }`}
        >
          <div
            className={`w-full md:px-[24px]
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
export default AdminPage;
