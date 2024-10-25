import MyChannelInfor from "./Infor/MyChannelInfor";
import MyChannelDisplay from "./Contents/MyChannelDisplay";
import { useAuthContext } from "../../../Auth Provider/authContext";
import { useState } from "react";

const MyChannelPart = ({ openedMenu }) => {
  const { user } = useAuthContext();

  const [display, setDisplay] = useState({
    title: "playlists",
    payload: undefined,
  });

  return (
    <div className='flex flex-col items-center justify-center'>
      <MyChannelInfor
        data={user}
        openedMenu={openedMenu}
        display={display}
        setDisplay={setDisplay}
        // refetch={refetch}
      />
      {/* <MyChannelDisplay     
        openedMenu={openedMenu}
        display={display}
        channelEmail={user?.email}
      /> */}
    </div>
  );
};
export default MyChannelPart;
