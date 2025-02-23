import ChannelInfor from "./ChannelInfor/ChannelInfor";
import { useState, useLayoutEffect } from "react";
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

  const [displayList, setDisplayList] = useState();

  useLayoutEffect(() => {
    if (id) {
      setDisplayList({
        home: <ChannelHome channelEmail={id} />,
        videos: <ChannelVideo channelEmail={id} />,
        shorts: <ChannelShort channelEmail={id} />,
        lives: <ChannelLive channelEmail={id} />,
        playlists: <ChannelPlaylist channelEmail={id} />,
        community: <ChannelComunity channelEmail={id} />,
        search: <ChannelSearch channelEmail={id} />,
      });
    }
  }, [id]);

  useLayoutEffect(() => {
    if (displayList) {
      setRenderComponent(
        !!displayList[feature] ? displayList[feature] : displayList["home"],
      );
    }
  }, [feature, displayList]);

  return (
    <div className='flex flex-col items-center justify-center'>
      <div
        className={`w-[214px] xsm:w-[428px] sm:w-[642px] 2md:w-[856px] 2lg:w-[1070px] 
      ${openedMenu ? "2xl:w-[1284px]" : "1336:w-[1284px]"}`}
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
export default ChannelPart;
