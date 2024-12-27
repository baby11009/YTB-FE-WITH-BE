import LargeShortVid from "./LargeShortVid";
import { LongArrowIcon } from "../../../Assets/Icons";
import {
  useLayoutEffect,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { IsEnd, IsTop } from "../../../util/scrollPosition";
import { useAuthContext } from "../../../Auth Provider/authContext";
import connectSocket from "../../../util/connectSocket";
import { useParams } from "react-router-dom";
import request from "../../../util/axios-base-url";
import CommentBox from "./CommentBox";
import { formatNumber } from "../../../util/numberFormat";

const ShortPart = () => {
  const { id } = useParams();

  const { setFetchingState, fetchingState, user } = useAuthContext();

  const [isLoading, setIsLoading] = useState(true);

  const [fetching, setFetching] = useState(true);

  const [isTop, setIsTop] = useState(true);

  const [isEnd, setIsEnd] = useState(false);

  const isScrolling = useRef(false);

  // Prevent React strict mode to fetch data 2 times in a row when first rendering
  const firtTimeRender = useRef(true);

  const remainData = useRef(1);

  const [shortList, setShortList] = useState([]);

  const [openedSideMenu, setOpenedSideMenu] = useState(false);

  const [currentShort, setCurrentShort] = useState(0);

  const [deviceType, setDeviceType] = useState();

  const containerRef = useRef();

  const listContainerRef = useRef();

  const socketRef = useRef(null);

  const outSideAreaRef = useRef();

  const fetchRandomShort = useCallback(async () => {
    if (user) {
      // set session-id is user _id if user already signed in
      sessionStorage.setItem("session-id", user._id);
    }
    let sessionId = sessionStorage.getItem("session-id") || "";
    setFetchingState("loading");
    await request
      .get(id ? `/data/short/${id}` : "/data/short/", {
        headers: { "session-id": sessionId },
      })
      .then((rsp) => {
        if (!sessionId) {
          sessionStorage.setItem("session-id", rsp.headers["session-id"]);
          console.log(rsp.headers["session-id"]);
        }
        remainData.current = rsp.data.remain;
        setShortList((prev) => [...prev, ...rsp.data.data]);
        setFetchingState("success");
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to get short data");
        setFetchingState("false");
      })
      .finally(() => {
        setFetching(false);
      });
  }, [id]);

  const removeRedisKey = useCallback(async () => {
    let sessionId = sessionStorage.getItem("session-id");
    if (!sessionId) return;
    await request
      .delete("/redis/remove", {
        headers: { "session-id": sessionId },
      })
      .then((rsp) => {
        console.log(rsp.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleScrollPrev = useCallback(() => {
    if (isScrolling.current) {
      return;
    }

    isScrolling.current = true;

    window.scrollTo({
      left: window.scrollX,
      top:
        window.scrollY -
        Math.ceil(listContainerRef.current?.clientHeight / shortList.length) -
        2,
      behavior: "smooth",
    });

    setTimeout(() => {
      isScrolling.current = false;
    }, 500);
  }, [shortList]);

  const handleScrollNext = useCallback(() => {
    if (remainData.current > 0) {
      setFetching(true);
    } else {
      if (isScrolling.current) {
        return;
      }

      isScrolling.current = true;

      window.scrollTo({
        left: window.scrollX,
        top:
          window.scrollY +
          Math.ceil(listContainerRef.current?.clientHeight / shortList.length) +
          2,
        behavior: "smooth",
      });

      setTimeout(() => {
        isScrolling.current = false;
      }, 500);
    }
  }, [shortList]);

  const handleScrollEvent = useCallback(() => {
    IsTop(setIsTop);
    IsEnd(setIsEnd);
  }, []);

  const handleToggleFullScreen = useCallback(() => {
    if (document.fullscreenElement == null) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        // Safari
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.msRequestFullscreen) {
        // IE/Edge
        containerRef.current.msRequestFullscreen();
      }
    } else {
      document.exitFullscreen();
    }
  }, []);

  const handleResize = useCallback(() => {
    let width = 361;
    if (window.innerWidth > 1156) {
      width = window.innerWidth / 3.05;
      setDeviceType("large");
    } else {
      setDeviceType("small");
    }

    document.body.style.setProperty("--short-sideMenu-width", `${width}px`);
  }, []);

  const handleClickOutsideArea = useCallback((e) => {
    setOpenedSideMenu("");
  }, []);

  useLayoutEffect(() => {
    window.addEventListener("beforeunload", removeRedisKey);

    document.addEventListener("scroll", handleScrollEvent);

    handleResize();

    window.addEventListener("resize", handleResize);

    document.documentElement.style.setProperty("--scroll-bar-width", "none");

    outSideAreaRef.current.addEventListener("click", handleClickOutsideArea);

    socketRef.current = connectSocket();

    return () => {
      window.removeEventListener("beforeunload", removeRedisKey);

      // document.removeEventListener("wheel", disableScroll, { passive: false });
      // document.addEventListener("touchmove", disableScroll, { passive: false });

      // Remove session-id key in redis to make watched data reset - should use this if doesn't have much data

      if (!firtTimeRender.current) {
        removeRedisKey();
      }

      // off and disconect socket when not using
      if (socketRef.current && !socketRef.current.connected) {
        socketRef.current.off();
      }
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.disconnect();
      }

      document.removeEventListener("scroll", handleScrollEvent);

      window.removeEventListener("resize", handleResize);

      window.scrollTo(0, 0);

      outSideAreaRef.current.removeEventListener(
        "click",
        handleClickOutsideArea,
      );

      document.documentElement.style.setProperty("--scroll-bar-width", "auto");
    };
  }, []);

  useLayoutEffect(() => {
    if (fetching && !firtTimeRender.current) {
      fetchRandomShort();
    } else if (!firtTimeRender.current && !fetching) {
      isScrolling.current = true;

      window.scrollTo({
        left: window.scrollX,
        top:
          window.scrollY +
          Math.ceil(listContainerRef.current?.clientHeight / shortList.length) +
          2,
        behavior: "smooth",
      });

      setTimeout(() => {
        isScrolling.current = false;
      }, 500);
    }

    return () => {
      firtTimeRender.current = false;
    };
  }, [fetching]);

  useEffect(() => {
    if (deviceType === "small" && openedSideMenu) {
      console.log(1);
      document.body.style.overflow = "hidden";
    } else {
      console.log(2);

      document.body.style.overflow = "auto";
    }
  }, [deviceType, openedSideMenu]);

  useEffect(() => {
    const handleScroll = (e) => {
      e.preventDefault();
      if (e.deltaY >= 100) {
        handleScrollNext();
      } else {
        handleScrollPrev();
      }
    };

    if (deviceType !== "small" || !openedSideMenu) {
      window.addEventListener("wheel", handleScroll, { passive: false });
    }

    return () => {
      if (deviceType !== "small" || !openedSideMenu) {
        window.removeEventListener("wheel", handleScroll, { passive: false });
      }
    };
  }, [shortList, deviceType, openedSideMenu]);

  return (
    <div className='relative mt-[8px] flex ' ref={containerRef}>
      <div className='mx-auto w-fit relative z-[1000]' ref={listContainerRef}>
        {shortList.map((item, index) => (
          <LargeShortVid
            key={index}
            shortData={item}
            socket={socketRef.current}
            handleRefetchShortData={(newShortData) => {
              setShortList((prev) => {
                let list = [...prev];
                list[index] = newShortData;

                return list;
              });
            }}
            handleSetCurrentShort={() => {
              setCurrentShort(index);
            }}
            handleToggleSideMenu={(menuName) => {
              setOpenedSideMenu((prev) => (prev ? "" : menuName));
            }}
            handleToggleFullScreen={handleToggleFullScreen}
          />
        ))}
      </div>
      {deviceType === "large" && (
        <div
          className={`max-w-[480px] transition-all duration-[0.3s] ease-linear `}
          style={{
            width: openedSideMenu
              ? "calc(var(--short-sideMenu-width) + 96px)"
              : "0",
          }}
        ></div>
      )}
      <div className={`absolute inset-0 ${openedSideMenu && ""}`}>
        <div
          className={`fixed ${
            openedSideMenu ? "inset-0 1156:hidden" : ""
          } bg-[rgba(0,0,0,0.6)] z-[3000] `}
          ref={outSideAreaRef}
        ></div>
        <div
          className={`fixed right-[50%] translate-x-[50%] 1156:translate-x-0 1156:right-[96px] max-w-[480px] min-w-[250px] 
          h-[calc((100vh-96px)*0.8)] 1156:h-[calc(100vh-96px)]  
          overflow-hidden  box-content ${openedSideMenu && "z-[3000]"}`}
          style={{
            width: "var(--short-sideMenu-width)",
          }}
        >
          <div
            className={`${
              openedSideMenu
                ? " visible 1156:right-[0]"
                : " invisible 1156:right-[-100%]"
            } fixed size-full transition-[right] 
          duration-[0.3s] ease-linear `}
          >
            {shortList.length > 0 && (
              <CommentBox
                handleCloseCmt={() => {
                  setOpenedSideMenu("");
                }}
                showedContent={true}
                shortId={shortList[currentShort]._id}
                handleRefetch={() => {
                  12312;
                }}
                totalCmt={formatNumber(shortList[currentShort]?.totalCmt)}
                socket={socketRef.current}
              />
            )}
          </div>
        </div>
      </div>

      <div className='hidden md:flex md:flex-col fixed top-[50%] translate-y-[-50%] right-0'>
        {!isTop && (
          <div className='pl-[16px] pr-[24px] py-[8px]'>
            <button
              className='w-[56px] h-[56px] rounded-[50%] bg-hover-black
           hover:bg-[rgba(255,255,255,0.2)] rotate-180 flex items-center justify-center'
              title='Video trước'
              onClick={handleScrollPrev}
            >
              <div>
                <LongArrowIcon />
              </div>
            </button>
          </div>
        )}
        {/* Show scrollNext btn if remainData > 0 or remainData = 0 and not isEnd */}
        {(remainData.current > 0 || (remainData.current === 0 && !isEnd)) && (
          <div className='pl-[16px] pr-[24px] py-[8px]'>
            <button
              className='w-[56px] h-[56px] rounded-[50%] bg-hover-black
             hover:bg-[rgba(255,255,255,0.2)] flex items-center justify-center'
              title='Video tiếp theo'
              onClick={handleScrollNext}
            >
              <div>
                <LongArrowIcon />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default ShortPart;
