import { AuthContext } from "./authContext";
import {
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  useCallback,
} from "react";
import { getCookie, removeCookie } from "../util/tokenHelpers";
import request from "../util/axios-base-url";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);

  const [isLoading, setIsLoading] = useState(true);

  const [fetchingState, setFetchingState] = useState("none");

  const [refetch, setRefetch] = useState(true);

  const [isShowing, setIsShowing] = useState(undefined);

  const [showHover, setShowHover] = useState(undefined);

  const [displayModal, setDisplayModal] = useState(undefined);

  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const [openedMenu, setOpenedMenu] = useState(false);

  const authTokenRef = useRef(getCookie(import.meta.env.VITE_AUTH_TOKEN));

  const hoverContainerRef = useRef();

  const modalContainerRef = useRef();

  const getUserInfo = useCallback(async (token) => {
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
  }, []);

  const handleCursorPositon = async (e) => {
    let child;
    await new Promise((resolve) => {
      requestAnimationFrame(() => {
        child = hoverContainerRef.current.children[0];
        return resolve();
      });
    });

    const position = {
      x: e.pageX + 10,
      y: e.pageY - 10,
    };

    if (window.innerWidth - e.clientX < child.clientWidth + 20) {
      position.x = e.pageX - child.clientWidth;
    }

    if (window.innerHeight - e.clientY < child.clientHeight) {
      position.y = e.pageY - child.clientHeight;
    }

    if (e.clientY - 56 < child.clientHeight.clientHeight + 25) {
      position.y = e.pageY + child.clientHeight;
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
  }, []);

  useEffect(() => {
    const disabledScroll = (e) => {
      e.preventDefault();
    };
    if (showHover) {
      document.addEventListener("scroll", disabledScroll, { passive: false });
      document.addEventListener("wheel", disabledScroll, { passive: false });
    } else {
      setDisplayModal(false);
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

  useEffect(() => {
    if (isShowing) {
      setShowHover(undefined);
    }

    return () => {};
  }, [isShowing]);

  useEffect(() => {
    if (fetchingState === "success" || fetchingState === "error") {
      const resetTimeout = setTimeout(() => {
        setFetchingState("none"); // Reset về trạng thái ban đầu
      }, 500); // Thời gian cho thanh trượt chạy ra khỏi màn hình
      return () => clearTimeout(resetTimeout);
    }
  }, [fetchingState]);

  useEffect(() => {
    setDisplayModal(showHover);
  }, [cursorPosition]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        modalContainerRef.current &&
        !modalContainerRef.current.contains(e.target)
      ) {
        setIsShowing(undefined);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
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
        setRefetch,
        showHover,
        setShowHover,
        handleCursorPositon,
        modalContainerRef,
        fetchingState,
        setFetchingState,
      }}
    >
      <div className='relative'>
        <div
          className={`absolute w-full h-[2px] bg-red-600 z-[9999] 
        left-0 
          ${
            fetchingState === "loading"
              ? "translate-x-[-70%] transition-all ease-in"
              : fetchingState === "success" || fetchingState === "error"
              ? "translate-x-[100%] transition-all ease-out "
              : "translate-x-[-100%]"
          }
        `}
        ></div>
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
            className={`absolute z-[9999] translate-y-[-100%] ${
              displayModal ? "opacity-[1]" : "opacity-0"
            }`}
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
