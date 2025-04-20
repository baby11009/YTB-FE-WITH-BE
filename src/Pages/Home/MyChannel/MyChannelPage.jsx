import MyChannelInfor from "./Infor/MyChannelInfor";
import MyChannelDisplay from "./Contents/MyChannelDisplay";
import { useAuthContext } from "../../../Auth Provider/authContext";
import { useState } from "react";

const MyChannelPage = () => {
  const { user, openedMenu } = useAuthContext();

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
      />
      <MyChannelDisplay
        openedMenu={openedMenu}
        display={display}
        channelEmail={user?.email}
      />
    </div>
  );
};
export default MyChannelPage;
