import ChannelInfor from "./ChannelInfor/ChannelInfor";
import { useState, useLayoutEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import ChannelHome from "./ChannelContents/Home/ChannelHome";
import ChannelVideo from "./ChannelContents/Video/ChannelVideo";
import ChannelShort from "./ChannelContents/Short/ChannelShort";
import ChannelLive from "./ChannelContents/Live/ChannelLive";
import ChannelPlaylist from "./ChannelContents/Playlist/ChannelPlaylist";
import ChannelComunity from "./ChannelContents/Comunity/ChannelComunity";
import ChannelSearch from "./ChannelContents/Search/ChannelSearch";
import { useAuthContext } from "../../../Auth Provider/authContext";

const ChannelPage = () => {
  const { openedMenu } = useAuthContext();

  const { id, feature } = useParams();

  const [renderComponent, setRenderComponent] = useState();

  const componentMap = useMemo(
    () => ({
      home: <ChannelHome channelEmail={id} />,
      videos: <ChannelVideo channelEmail={id} />,
      shorts: <ChannelShort channelEmail={id} />,
      lives: <ChannelLive channelEmail={id} />,
      playlists: <ChannelPlaylist channelEmail={id} />,
      community: <ChannelComunity channelEmail={id} />,
      search: <ChannelSearch channelEmail={id} />,
    }),
    [id],
  );

  useLayoutEffect(() => {
    if (componentMap) {
      setRenderComponent(
        !!componentMap[feature] ? componentMap[feature] : componentMap["home"],
      );
    }
  }, [feature, id]);

  return (
    <div className='flex flex-col items-center justify-center '>
      <div
        className={`w-[214px] xsm:w-[428px] sm:w-[642px] 2md:w-[856px] 2lg:w-[1070px] relative
      ${
        openedMenu
          ? "1312:w-[856px] 1360:w-[1070px] 1573:w-[1284px]"
          : "1400:w-[1284px]"
      }`}
      >
        <ChannelInfor
          channelEmail={id}
          openedMenu={openedMenu}
          feature={feature}
        />
        {renderComponent}
      </div>
    </div>
  );
};
export default ChannelPage;
