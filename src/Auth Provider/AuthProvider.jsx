import { AuthContext } from "./authContext";
import { useState, useRef, useLayoutEffect } from "react";
import { getCookie } from "../util/tokenHelpers";
import request from "../util/axios-base-url";

const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(undefined);

  const [isLoading, setIsLoading] = useState(true);

  const [refetch, setRefetch] = useState(true);

  const [isShowing, setIsShowing] = useState(undefined);

  const [openedMenu, setOpenedMenu] = useState(true);

  const authTokenRef = useRef(getCookie(import.meta.env.VITE_AUTH_TOKEN));

  const getUserInfo = async (token) => {
    await request
      .get("/client/user/me", {
        headers: {
          Authorization: `${import.meta.env.VITE_AUTH_BEARER} ${token}`,
        },
      })
      .then((rsp) => {
        setUser(rsp.data.data);
        setRefetch(false);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useLayoutEffect(() => {
    if (authTokenRef.current && refetch) {
      getUserInfo(authTokenRef.current);
    } else {
      setIsLoading(false);
    }
  }, [refetch]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isShowing,
        setIsShowing,
        openedMenu,
        setOpenedMenu,
        setRefetch
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
