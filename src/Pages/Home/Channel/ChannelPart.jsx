import ChannelInfor from "./ChannelInfor/ChannelInfor";
import { useEffect, useState, useLayoutEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ChannelHome from "./ChannelContents/Home/ChannelHome";
import ChannelVideo from "./ChannelContents/Video/ChannelVideo";
import ChannelShort from "./ChannelContents/Short/ChannelShort";
import ChannelLive from "./ChannelContents/Live/ChannelLive";
import ChannelPlaylist from "./ChannelContents/Playlist/ChannelPlaylist";
import ChannelComunity from "./ChannelContents/Comunity/ChannelComunity";
import ChannelSearch from "./ChannelContents/Search/ChannelSearch";

const ChannelPart = ({ openedMenu }) => {
  const { id, feature } = useParams();

  const [renderComponent, setRenderComponent] = useState();

  const displayList = useRef();

  useLayoutEffect(() => {
    if (id) {
      displayList.current = {
        home: <ChannelHome channelEmail={id} />,
        videos: <ChannelVideo channelEmail={id} />,
        shorts: <ChannelShort channelEmail={id} />,
        live: <ChannelLive channelEmail={id} />,
        playlists: <ChannelPlaylist channelEmail={id} />,
        community: <ChannelComunity channelEmail={id} />,
        search: <ChannelSearch channelEmail={id} />,
      };
    }
  }, [id]);

  useLayoutEffect(() => {
    if (displayList.current && displayList.current[feature]) {
      setRenderComponent(displayList.current[feature]);
    } else {
      setRenderComponent(displayList.current["home"]);
    }
  }, [feature]);

  return (
    <div className='flex flex-col items-center justify-center'>
      <ChannelInfor
        channelEmail={id}
        openedMenu={openedMenu}
        feature={feature}
      />
      <div
        className={`w-[214px] xsm:w-[428px] sm:w-[642px] 2md:w-[856px]  
      ${
        openedMenu
          ? "1336:w-[1070px] xl 2xl:w-[1284px]"
          : "2lg:w-[1070px] 1-5xl:w-[1284px]"
      }`}
      >
        {renderComponent}
      </div>
    </div>
  );
};
export default ChannelPart;
