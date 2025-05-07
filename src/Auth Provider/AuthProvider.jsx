import { AuthContext } from "./authContext";
import { useState, useRef, useLayoutEffect, useEffect, Suspense } from "react";
import { getCookie } from "../util/tokenHelpers";
import request from "../util/axios-base-url";
import connectSocket from "../util/connectSocket";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);

  const [notReadNotiCount, setNotReadNotiCount] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  const [fetchingState, setFetchingState] = useState("none");

  const [refetch, setRefetch] = useState(true);

  const [isShowing, setIsShowing] = useState(undefined);

  const [showHover, setShowHover] = useState(undefined);

  const [currentToaster, setCurrentToaster] = useState(null);

  const [displayModal, setDisplayModal] = useState(undefined);

  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const [openedMenu, setOpenedMenu] = useState(false);

  const toasterQueue = useRef([]);

  const currentToasterRef = useRef();

  const toasterContainer = useRef();

  const authTokenRef = useRef(getCookie(import.meta.env.VITE_AUTH_TOKEN));

  const hoverContainerRef = useRef();

  const modalContainerRef = useRef();

  const socketRef = useRef();

  const showCurrentToaster = () => {
    if (toasterQueue.current.length > 0) {
      const toaster = toasterQueue.current.shift();
      setCurrentToaster(toaster);
      currentToasterRef.current = toaster;
      setTimeout(() => {
        setCurrentToaster();
        showCurrentToaster(null);
        currentToasterRef.current = null;
      }, 5000);
    }
  };

  const addToaster = (message) => {
    toasterQueue.current.push(message);
    if (!currentToasterRef.current) {
      showCurrentToaster();
    }
  };

  const getUserInfo = async (token) => {
    await request
      .get("/user/me")
      .then((rsp) => {
        console.log(rsp.data);
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

  const handleCursorPositon = async (e) => {
    const child = await new Promise((resolve) => {
      requestAnimationFrame(() => {
        return resolve(hoverContainerRef.current.children[0]);
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
    if (authTokenRef.current) {
      socketRef.current = connectSocket();

      const handleSocketNotification = (message) => {
        console.log("Received notification:", message);
        setNotReadNotiCount((prev) => prev + 1);
      };
      socketRef.current.on("notification", handleSocketNotification);

      return () => {
        // If not connected, remove listeners
        if (!socketRef.current.connected) {
          socketRef.current.off();
        }

        // If connected, disconnect
        if (socketRef.current.connected) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [authTokenRef.current]);

  useEffect(() => {
    let count = 0;
    if (user) {
      count = user.notReadedNotiCount;
    }
    setNotReadNotiCount(count);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        hoverContainerRef.current &&
        !hoverContainerRef.current.contains(e.target)
      ) {
        setShowHover((prev) => {
          if (prev) {
            return undefined;
          }
        });
      } else if (
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

  // useEffect(() => {
  //   const handleClickOutside = (e) => {
  //     if (
  //       modalContainerRef.current &&
  //       !modalContainerRef.current.contains(e.target)
  //     ) {
  //       setIsShowing(undefined);
  //     }
  //   };

  //   window.addEventListener("mousedown", handleClickOutside);

  //   if (toasterContainer.current) {
  //     toasterContainer.current.appenChild;
  //   }

  //   return () => {
  //     window.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        notReadNotiCount,
        setNotReadNotiCount,
        authTokenRef,
        socket: socketRef.current,
        isShowing,
        setIsShowing,
        openedMenu,
        setOpenedMenu,
        showHover,
        setShowHover,
        handleCursorPositon,
        modalContainerRef,
        fetchingState,
        setFetchingState,
        addToaster: addToaster,
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
          <Suspense
            fallback={
              <div className='w-screen h-screen size bg-black flex items-center justify-center'>
                <span className='text-white font-bold text-[20px] leading-[22px]'>
                  Loading......
                </span>
              </div>
            }
          >
            {children}
          </Suspense>
        )}
        {showHover && (
          <div
            className={`absolute z-[9998] translate-y-[-100%] ${
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
        <div ref={toasterContainer} className='z-[9999] relative'>
          {currentToaster && (
            <div
              key={currentToaster}
              className='fixed bottom-0 left-0  toaster-animation'
            >
              <div className=' m-[12px] p-[12px] bg-white max-w-[288px] overflow-hidden rounded-[8px]'>
                <span className='text-[14px] leading-[20px] text-[#0f0f0f] line-clamp-1 text-ellipsis whitespace-pre-wrap'>
                  {currentToaster}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthContext.Provider>
  );
};
export default AuthProvider;
