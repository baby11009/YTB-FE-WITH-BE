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
        RenderContent={<VideoPart openedMenu={openedMenu} />}
        noLDMenu={true}
        noIconMenu={true}
      />
    </MainLayOut>
  );
};
export default VideoPage;
