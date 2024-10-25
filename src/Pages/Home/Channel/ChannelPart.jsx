import ChannelInfor from "./ChannelInfor/ChannelInfor";
import ChannelDisplay from "./ChannelContents/ChannelDisplay";
import { useState } from "react";
import { useAuthContext } from "../../../Auth Provider/authContext";
import { useParams } from "react-router-dom";
import { getData } from "../../../Api/getData";

const ChannelPart = ({ openedMenu }) => {
  
  const { id } = useParams();

  const { user } = useAuthContext();

  const { data, refetch } = getData(
    `/data/channels/${id}`,
    { userId: user?._id },
    true,
    true
  );

  const [display, setDisplay] = useState({
    title: "home",
    payload: undefined,
  });

  return (
    <div className='flex flex-col items-center justify-center'>
      <ChannelInfor
        data={data?.data[0]}
        openedMenu={openedMenu}
        display={display}
        setDisplay={setDisplay}
        refetch={refetch}
      />
      <ChannelDisplay
        openedMenu={openedMenu}
        display={display}
        channelEmail={id}
      />
    </div>
  );
};
export default ChannelPart;
