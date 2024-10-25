import ChannelPlaylist from "./Playlists/ChannelPlaylist";

const MyChannelDisplay = ({ openedMenu, display, channelEmail }) => {
  return (
    <div
      className={`w-[214px] xsm:w-[428px] sm:w-[642px] 2md:w-[856px]  
  ${
    openedMenu
      ? "1336:w-[1070px] xl 2xl:w-[1284px]"
      : "2lg:w-[1070px] 1-5xl:w-[1284px]"
  }`}
    >
      {display.title === "playlists" ? (
        <ChannelPlaylist channelEmail={channelEmail} />
      ) : (
        "21321"
      )}
    </div>
  );
};
export default MyChannelDisplay;
