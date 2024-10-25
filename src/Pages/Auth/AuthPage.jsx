import MainLayOut from "../../Layout/MainLayOut";
import { useState, useLayoutEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { scrollToTop } from "../../util/scrollCustom";
import Login from "./Login";
import Register from "./Register";
import Confirmation from "./Confirmation";
import SendCode from "./Modify password/SendCode";
import ChangePwd from "./Modify password/ChangePwd";

const AuthPage = () => {
  const params = useParams();

  const [renderComponent, setRenderComponent] = useState(undefined);

  const componentMap = useRef();

  componentMap.current = {
    login: <Login />,
    register: <Register />,
    confirm: <Confirmation />,
    "change-pwd-1": <SendCode type={"change"} />,
    "change-pwd-2": <ChangePwd type={"change"} />,
    "forgot-pwd-1": <SendCode type={"forgot"} />,
    "forgot-pwd-2": <ChangePwd type={"forgot"} />,
  };

  useLayoutEffect(() => {
    if (params.path) {
      const pageRender = componentMap.current[params.path];

      if (pageRender) {
        setRenderComponent(pageRender);
        scrollToTop();
      } else {
        setRenderComponent(undefined);

        throw new Error(`Route ${params.path} does not exist`);
      }
    }
  }, [params]);

  return <MainLayOut>{renderComponent}</MainLayOut>;
};
export default AuthPage;
