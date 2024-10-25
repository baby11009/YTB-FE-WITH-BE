import { AuthContext } from "./authContext";
import { useState, useRef, useLayoutEffect } from "react";
import { getCookie } from "../util/tokenHelpers";
import request from "../util/axios-base-url";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);

  const [isLoading, setIsLoading] = useState(true);

  const [isShowing, setIsShowing] = useState(undefined);

  const [openedMenu, setOpenedMenu] = useState(true);

  useLayoutEffect(() => {
    const authToken = getCookie(import.meta.env.VITE_AUTH_TOKEN);

    const getUserInfo = async (token) => {
      await request
        .get("/client/user/me", {
          headers: {
            Authorization: `${import.meta.env.VITE_AUTH_BEARER} ${token}`,
          },
        })
        .then((rsp) => {
          setUser(rsp.data.data);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    if (authToken) {
      getUserInfo(authToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isShowing,
        setIsShowing,
        openedMenu,
        setOpenedMenu,
      }}
    >
      {isLoading ? (
        <div className='w-screen h-screen size bg-black flex items-center justify-center'>
          <span className='text-white font-bold text-[20px] leading-[22px]'>
            Loading......
          </span>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
