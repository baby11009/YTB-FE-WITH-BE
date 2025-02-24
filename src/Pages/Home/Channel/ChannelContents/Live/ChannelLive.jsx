import { useState, useEffect } from "react";
import { IsEnd } from "../../../../../util/scrollPosition";
import LiveList from "./LiveList";

const ChannelLive = () => {
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      IsEnd(setIsEnd);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      <LiveList isEnd={isEnd}/>
    </div>
  );
};
export default ChannelLive;
