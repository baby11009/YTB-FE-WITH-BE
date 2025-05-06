import MainLayOut from "../../Layout/MainLayOut";
import { Header, Body } from "../../Component";
import VideoPart from "./NewLayout/VideoPart";
import { useAuthContext } from "../../Auth Provider/authContext";
import { useParams } from "react-router-dom";
import { useLayoutEffect } from "react";
import { scrollToTop } from "../../util/scrollCustom";

const VideoPage = () => {
  const { openedMenu, setOpenedMenu } = useAuthContext();

  const params = useParams();
  useLayoutEffect(() => {
    scrollToTop();
  }, [params]);
  return (
    <MainLayOut>
      <Header setOpenedMenu={setOpenedMenu} />
      <Body
        openedMenu={openedMenu}
        setOpenedMenu={setOpenedMenu}
        noLDMenu={true}
        noIconMenu={true}
        modalMenu={true}
      >
        <VideoPart />
      </Body>
    </MainLayOut>
  );
};
export default VideoPage;
