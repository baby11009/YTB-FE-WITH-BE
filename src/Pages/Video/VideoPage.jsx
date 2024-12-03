import MainLayOut from "../../Layout/MainLayOut";
import { Header, Body } from "../../Component";
import { useState } from "react";
// import VideoPart from "./VideoContent/VideoPart";
import VideoPart from "./NewLayout/VideoPart";
import { useAuthContext } from "../../Auth Provider/authContext";

const VideoPage = () => {
  const { openedMenu, setOpenedMenu } = useAuthContext();

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
