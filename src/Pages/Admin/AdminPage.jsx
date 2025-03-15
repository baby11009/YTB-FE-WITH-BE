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
} from "./Upsert";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { scrollToTop } from "../../util/scrollCustom";
import { useAuthContext } from "../../Auth Provider/authContext";

const AdminPage = () => {
  const { user, openedMenu, setOpenedMenu } = useAuthContext();

  const navigate = useNavigate();

  const [pageRender, setPageRender] = useState(undefined);

  const location = useLocation();

  const params = useParams();

  const pageList = {
    dashboard: <div>DashBoard</div>,
    user: <DisplayUser />,
    "upsert-user": <UpsertUser />,
    tag: <DisplayTag />,
    video: <DisplayVideo type='video' key='video' />,
    "upsert-video": <UpsertVideo type='video' key='video' />,
    short: <DisplayVideo type='short' key='short' />,
    "upsert-short": <UpsertVideo type='short' key='short' />,
    comment: <DisplayCmt />,
    "upsert-comment": <UpsertComment />,
    playlist: <DisplayPlaylist />,
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
  }, [params]);

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
          className={`ml-[74px] flex justify-center  ${
            openedMenu && "2lg:ml-[255px]"
          } transition-[margin]  ease-cubic-bezier-[0,0,0.2,1]
           duration-[417ms]`}
        >
          <div
            className='w-full h-[calc(100vh-56px)]
            mt-[56px] relative '
          >
            {pageRender}
          </div>
        </div>
      </>
    </MainLayOut>
  );
};
export default AdminPage;
