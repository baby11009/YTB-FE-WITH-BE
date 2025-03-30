import { useEffect, useState } from "react";
import AllContent from "./Type/AllContent";
import ShortContent from "./Type/ShortContent";
import { useParams } from "react-router-dom";
const SubscribeContentPart = ({ openedMenu }) => {
  const { id } = useParams();

  const [Renderer, setRenderer] = useState(undefined);

  useEffect(() => {
    if (id) {
      const renderComponents = {
        short: <ShortContent openedMenu={openedMenu} />,
      };
      if (renderComponents[id]) {
        setRenderer(renderComponents[id]);
      }
    } else {
      setRenderer(<AllContent openedMenu={openedMenu} />);
    }
  }, [id, openedMenu]);

  return <div>{Renderer}</div>;
};
export default SubscribeContentPart;
