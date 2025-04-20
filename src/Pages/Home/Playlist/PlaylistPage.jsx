
import { useEffect, useState, useRef } from "react";
import WatchLater from "./WatchLater";
import LikedVideo from "./LikedVideo";
import { useParams } from "react-router-dom";
const PlaylistPage = () => {
  const { id, path } = useParams();

  const [Renderer, setRenderer] = useState(<WatchLater />);

  const prevPath = useRef(path);

  useEffect(() => {
    const renderComponents = {
      wl: <WatchLater />,
      lv: <LikedVideo />,
    };
    if (prevPath.current === path) {
      if (renderComponents[id]) {
        setRenderer(renderComponents[id]);
      } else {
        throw new Error();
      }
    }
  }, [id]);

  return <>{Renderer}</>;
};
export default PlaylistPage;
