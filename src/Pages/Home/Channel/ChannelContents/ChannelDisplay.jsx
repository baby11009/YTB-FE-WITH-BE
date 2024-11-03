import ChannelHome from "./Home/ChannelHome";
import ChannelVideo from "./Video/ChannelVideo";
import ChannelShort from "./Short/ChannelShort";
import ChannelLive from "./Live/ChannelLive";
import ChannelPlaylist from "./Playlist/ChannelPlaylist";
import ChannelComunity from "./Comunity/ChannelComunity";
import ChannelSearch from "./Search/ChannelSearch";

const ChannelDisplay = ({ openedMenu, display, channelEmail }) => {

  return (
    <div
      className={`w-[214px] xsm:w-[428px] sm:w-[642px] 2md:w-[856px]  
      ${
        openedMenu
          ? "1336:w-[1070px] xl 2xl:w-[1284px]"
          : "2lg:w-[1070px] 1-5xl:w-[1284px]"
      }`}
    >
      {display.title === "home" ? (
        <ChannelHome channelEmail={channelEmail} />
      ) : display.title === "video" ? (
        <ChannelVideo channelEmail={channelEmail} />
      ) : display.title === "short" ? (
        <ChannelShort channelEmail={channelEmail} />
      ) : display.title === "live" ? (
        <ChannelLive channelEmail={channelEmail} />
      ) : display.title === "playlist" ? (
        <ChannelPlaylist channelEmail={channelEmail} />
      ) : display.title === "comunity" ? (
        <ChannelComunity channelEmail={channelEmail} />
      ) : (
        <ChannelSearch
          searchValue={display.payload}
          channelEmail={channelEmail}
        />
      )}
    </div>
  );
};
export default ChannelDisplay;
