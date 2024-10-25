import { useState, useLayoutEffect } from "react";
import Comment from "./My comment/Comment";
import VideoComment from "./Video comment/VideoComment";

const Display = ({ path, pathParam }) => {
  const [pageRender, setPageRender] = useState(undefined);

  const pageList = {
    "video-comment": <VideoComment/>,
    "my-comment": <Comment />,
  };

  useLayoutEffect(() => {
    if (pathParam && path === "comment") {
      if (pageList[pathParam]) {
        setPageRender(pageList[pathParam]);
      } else {
        setPageRender(undefined);
        throw new Error("Route does not exits");
      }
    }
  }, [pathParam]);

  return <div className='mt-[128px]'>{pageRender}</div>;
};
export default Display;
