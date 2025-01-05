import ChannelInfor from "./ChannelInfor/ChannelInfor";
import ChannelDisplay from "./ChannelContents/ChannelDisplay";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const ChannelPart = ({ openedMenu }) => {
  const queryClient = useQueryClient();

  const { id } = useParams();

  const [display, setDisplay] = useState({
    title: "home",
    payload: undefined,
  });

  useEffect(() => {
    setDisplay({
      title: "home",
      payload: undefined,
    });
  }, [id]);

  useEffect(() => {
    return () => {
      queryClient.clear();
    };
  }, []);

  return (
    <div className='flex flex-col items-center justify-center'>
      <ChannelInfor
        channelEmail={id}
        openedMenu={openedMenu}
        display={display}
        setDisplay={setDisplay}
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
