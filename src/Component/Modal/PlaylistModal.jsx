import InsertPlaylist from "./InsertPlaylist";
import CreatePlaylist from "./CreatePlaylist";
import { useState } from "react";
import { useAuthContext } from "../../Auth Provider/authContext";
const PlaylistModal = ({ videoId }) => {
  const { modalContainerRef } = useAuthContext();

  const [display, setDisplay] = useState("insert");
  return (
    <div ref={modalContainerRef} className='bg-black-21 rounded-[10px] '>
      {display === "insert" ? (
        <InsertPlaylist videoId={videoId} setDisplay={setDisplay} />
      ) : (
        <CreatePlaylist setDisplay={setDisplay} videoId={videoId} />
      )}
    </div>
  );
};
export default PlaylistModal;
