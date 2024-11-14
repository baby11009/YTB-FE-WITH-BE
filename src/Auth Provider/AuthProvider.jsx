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

  const handleCursorPositon = (e) => {
    const position = {
      x: e.pageX + 10,
      y: e.pageY - 10,
    };

    if (
      hoverContainerRef.current &&
      window.innerWidth - e.clientX < hoverContainerRef.current.clientWidth + 20
    ) {
      position.x = e.pageX - hoverContainerRef.current.clientWidth;
    }

    if (
      hoverContainerRef.current &&
      window.innerHeight - e.clientY <
        hoverContainerRef.current.clientHeight + 20
    ) {
      position.y = e.pageY - hoverContainerRef.current.clientHeight;
    }

    if (
      hoverContainerRef.current &&
      e.clientY - 56 < hoverContainerRef.current.clientHeight + 25
    ) {
      position.y = e.pageY + hoverContainerRef.current.clientHeight + 20;
    }

    setCursorPosition(position);
  };
  useLayoutEffect(() => {
    if (authTokenRef.current && refetch) {
      getUserInfo(authTokenRef.current);
    } else {
      setIsLoading(false);
    }
  }, [refetch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        hoverContainerRef.current &&
        !hoverContainerRef.current.contains(event.target)
      ) {
        setShowHover((prev) => {
          if (prev) {
            return undefined;
          }
        });
      }
    };

    document.addEventListener("mousedown", (e) => {
      handleClickOutside(e);
    });

    return () => {
      document.removeEventListener("mousedown", (e) => {
        handleClickOutside(e);
      });
    };
  }, [hoverContainerRef.current]);

  useEffect(() => {
    const disabledScroll = (e) => {
      e.preventDefault();
    };
    if (showHover) {
      document.addEventListener("scroll", disabledScroll, { passive: false });
      document.addEventListener("wheel", disabledScroll, { passive: false });
    }

    return () => {
      if (showHover) {
        document.removeEventListener("scroll", disabledScroll, {
          passive: false,
        });
        document.removeEventListener("wheel", disabledScroll, {
          passive: false,
        });
      }
    };
  }, [showHover]);

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
            className='absolute z-[9999] translate-y-[-100%]'
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
