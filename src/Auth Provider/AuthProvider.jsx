import { AuthContext } from "./authContext";
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { getCookie } from "../util/tokenHelpers";
import request from "../util/axios-base-url";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);

  const [isLoading, setIsLoading] = useState(true);

  const [refetch, setRefetch] = useState(true);

  const [isShowing, setIsShowing] = useState(undefined);

  const [showHover, setShowHover] = useState(undefined);

  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const [openedMenu, setOpenedMenu] = useState(true);

  const authTokenRef = useRef(getCookie(import.meta.env.VITE_AUTH_TOKEN));

  const modalRef = useRef();

  const hoverContainerRef = useRef();

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

  useEffect(() => {
    if (showHover && modalRef.current) {
      modalRef.current.style.left = `${cursorPosition.x + 20}px`;
      modalRef.current.style.top = `${cursorPosition.y - 100}px`;
    }
  }, [showHover, modalRef]);

  const handleCursorPositon = (e) => {
    const position = {
      x: e.pageX + 20,
      y: e.pageY - 20,
    };

    if (
      hoverContainerRef.current &&
      window.innerWidth - e.clientX < hoverContainerRef.current.clientWidth + 50
    ) {
      position.x -= hoverContainerRef.current.clientWidth + 40;
    }

    if (
      hoverContainerRef.current &&
      window.innerHeight - e.clientY <
        hoverContainerRef.current.clientHeight + 10
    ) {
      position.y -= hoverContainerRef.current.clientHeight - 20;
    }

    if (
      hoverContainerRef.current &&
      e.clientY - 56 < hoverContainerRef.current.clientHeight
    ) {
      position.y += hoverContainerRef.current.clientHeight;
    }

    setCursorPosition(position);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isShowing,
        setIsShowing,
        openedMenu,
        setOpenedMenu,
        setRefetch,
        showHover,
        setShowHover,
        handleCursorPositon,
      }}
    >
      <div className='relative'>
        {isLoading ? (
          <div className='w-screen h-screen size bg-black flex items-center justify-center'>
            <span className='text-white font-bold text-[20px] leading-[22px]'>
              Loading......
            </span>
          </div>
        ) : (
          children
        )}
        {showHover && (
          <div
            className='absolute z-[9999]'
            style={{
              left: cursorPosition.x,
              top: cursorPosition.y,
            }}
            ref={hoverContainerRef}
          >
            {showHover}
          </div>
        )}
      </div>
    </AuthContext.Provider>
  );
};
export default AuthProvider;
