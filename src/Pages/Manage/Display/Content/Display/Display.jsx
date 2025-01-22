import { useState, useEffect, useRef, useLayoutEffect } from "react";
import Video from "./Video/Video";
import Short from "./Short/Short";
import Playlist from "./Playlist/Playlist";
const Display = ({ path, pathParam }) => {
  const [pageRender, setPageRender] = useState(undefined);

  const container = useRef();

  const pageList = {
    video: <Video />,
    shorts: <Short />,
    playlists: <Playlist />,
    comunity: <div>comunity</div>,
  };

  useLayoutEffect(() => {
    const height =
      window.innerHeight - container.current.getBoundingClientRect().top;
    container.current.style.height = `${height}px`;
  }, []);

  useLayoutEffect(() => {
    if (pathParam && path === "content") {
      if (pageList[pathParam]) {
        setPageRender(pageList[pathParam]);
      } else {
        setPageRender(undefined);
        throw new Error("Route does not exits");
      }
    }
  }, [pathParam]);

  return (
    <div ref={container}>
      {pageRender}
    </div>
  );
};
export default Display;
