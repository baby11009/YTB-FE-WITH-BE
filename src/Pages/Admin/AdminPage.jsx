import MainLayOut from "../../Layout/MainLayOut";
import { useState, useEffect, useLayoutEffect, Suspense } from "react";
import Header from "./Header";
import Menu from "./Menu/Menu";
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
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { scrollToTop } from "../../util/scrollCustom";
import { useAuthContext } from "../../Auth Provider/authContext";

const AdminPage = () => {
  const { user } = useAuthContext();

  const navigate = useNavigate();

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
      navigate("/");
    }
  }, [params, openedMenu]);

  useEffect(() => {
    scrollToTop();
  }, [pageRender]);

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
          className={` md:ml-[74px] flex justify-center  ${
            openedMenu && "2lg:ml-[255px]"
          } transition-[margin]  ease-cubic-bezier-[0,0,0.2,1]
           duration-[417ms]`}
        >
          <div
            className='w-full h-[calc(100vh-56px)] md:px-[16px]
            mt-[56px] relative '
          >
            <Suspense
              fallback={
                <div className=' h-screen flex items-center justify-center'>
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
