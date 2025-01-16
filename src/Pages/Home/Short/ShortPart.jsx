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
import DetailsBox from "./DetailsBox";
import { formatNumber } from "../../../util/numberFormat";

const fetchingShortQtt = 2;

const ShortPart = () => {
  const { id } = useParams();

  const { setFetchingState, fetchingState, user, openedMenu } =
    useAuthContext();

  const [refetchSingleShort, setRefetchSingleShort] = useState(false);

  const [isTop, setIsTop] = useState(true);

  const [isEnd, setIsEnd] = useState(false);

  const isScrolling = useRef(false);

  // Prevent React strict mode to fetch data 2 times in a row when first rendering
  const firtTimeRender = useRef(true);

  const remainData = useRef(1);

  const [shortList, setShortList] = useState([]);

  const [sideMenu, setSideMenu] = useState("comment");

  const [openedSideMenu, setOpenedSideMenu] = useState(false);

  const [fullScreen, setFullScreen] = useState(false);

  const [currentShort, setCurrentShort] = useState(0);

  const [deviceType, setDeviceType] = useState();

  const [volume, setVolume] = useState(1);

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
      .get(
        id
          ? `/data/shorts/${id}?size=${fetchingShortQtt}`
          : `/data/shorts?size=${fetchingShortQtt}`,
        {
          headers: { "session-id": sessionId },
        },
      )
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
        Math.ceil(listContainerRef.current?.clientHeight / shortList.length),
      behavior: "smooth",
    });

    setTimeout(() => {
      isScrolling.current = false;
    }, 500);
  }, [shortList]);

  const handleScrollNext = useCallback(async () => {
    if (remainData.current > 0) {
      await fetchRandomShort();
    }
    if (isScrolling.current) {
      return;
    }

    isScrolling.current = true;

    window.scrollTo({
      left: window.scrollX,
      top: Math.min(
        listContainerRef.current?.clientHeight,
        window.scrollY +
          Math.ceil(listContainerRef.current?.clientHeight / shortList.length),
      ),
      behavior: "smooth",
    });

    setTimeout(() => {
      isScrolling.current = false;
    }, 500);
  }, [shortList]);

  const handleScrollEvent = useCallback(() => {
    IsTop(setIsTop);
    IsEnd(setIsEnd, 24);
  }, []);

  const handleWheelScroll = useCallback(
    (e) => {
      e.preventDefault();
      if (e.deltaY >= 100) {
        handleScrollNext();
      } else {
        handleScrollPrev();
      }
    },
    [shortList],
  );

  const handleToggleFullScreen = useCallback(() => {
    setFullScreen((prev) => !prev);
    if (document.fullscreenElement === null) {
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
    let width;

    if (window.innerWidth > 1156) {
      width = window.innerWidth / 3.05;
      setDeviceType("large");
    } else {
      setDeviceType("small");
    }

    document.body.style.setProperty("--short-sideMenu-width", `${width}px`);
  }, [sideMenu]);

  const handleClickOutsideArea = useCallback((e) => {
    setOpenedSideMenu("");
  }, []);

  useLayoutEffect(() => {
    window.addEventListener("beforeunload", removeRedisKey);

    document.addEventListener("scroll", handleScrollEvent);

    handleResize();

    document.documentElement.style.setProperty("--scroll-bar-width", "none");

    outSideAreaRef.current.addEventListener("click", handleClickOutsideArea);

    socketRef.current = connectSocket();

    return () => {
      window.removeEventListener("beforeunload", removeRedisKey);

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

      window.scrollTo(0, 0);

      outSideAreaRef.current.removeEventListener(
        "click",
        handleClickOutsideArea,
      );

      document.documentElement.style.setProperty("--scroll-bar-width", "auto");
    };
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [sideMenu]);

  useLayoutEffect(() => {
    if (!firtTimeRender.current) {
      fetchRandomShort();
    }

    return () => {
      firtTimeRender.current = false;
    };
  }, []);

  useEffect(() => {
    if (deviceType !== "small" || !openedSideMenu) {
      containerRef.current.addEventListener("wheel", handleWheelScroll, {
        passive: false,
      });
    }

    return () => {
      if ((deviceType !== "small" || !openedSideMenu) && containerRef.current) {
        containerRef.current.removeEventListener("wheel", handleWheelScroll, {
          passive: false,
        });
      }
    };
  }, [shortList, deviceType, openedSideMenu]);

  return (
    <div className='relative mt-[8px] flex' ref={containerRef}>
      <div
        className='mx-auto w-fit relative z-[1000] mb-[24px]'
        ref={listContainerRef}
      >
        {shortList.map((item, index) => (
          <LargeShortVid
            key={index}
            shortData={item}
            refetch={refetchSingleShort}
            setRefetch={setRefetchSingleShort}
            volume={volume}
            setVolume={setVolume}
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
              if (menuName === sideMenu && openedSideMenu) {
                setOpenedSideMenu(false);
              } else {
                setSideMenu(menuName);
                setOpenedSideMenu(true);
              }
            }}
            fullScreen={fullScreen}
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
      <div
        className={`fixed top-[56px]  ${
          openedMenu ? "left-[74px] xl:left-[230px]" : "left-[74px]"
        } bottom-0 right-0 inset-0 ${openedSideMenu && "z-[2001] 1156:z-[1]"}`}
      >
        <div
          className={`fixed ${
            openedSideMenu ? "inset-0 1156:hidden" : ""
          } bg-[rgba(0,0,0,0.6)] z-[3000]`}
          ref={outSideAreaRef}
        ></div>

        <div
          className={`${
            openedSideMenu
              ? "visible right-[50%] translate-x-[50%] top-[13%] 1156:top-0 1156:translate-x-0  1156:right-[96px]"
              : "invisible 1156:visible 1156:right-[-100%]"
          } 
         
          absolute transition-[right] max-w-[480px] h-[calc((100vh-96px)*0.8)] 1156:h-[calc(100vh-96px)]
          duration-[0.3s] ease-linear z-[3001]`}
          style={{
            width:
              deviceType === "large"
                ? "var(--short-sideMenu-width)"
                : sideMenu === "comment"
                ? "450px"
                : "480px",
          }}
        >
          {shortList.length > 0 && sideMenu === "comment" ? (
            <CommentBox
              openedSideMenu={openedSideMenu}
              handleClose={() => {
                setOpenedSideMenu("");
              }}
              shortId={shortList[currentShort]._id}
              handleRefetch={() => {
                setRefetchSingleShort(true);
              }}
              totalCmt={formatNumber(shortList[currentShort]?.totalCmt)}
              socket={socketRef.current}
            />
          ) : (
            shortList.length > 0 &&
            sideMenu === "details" && (
              <DetailsBox
                shortData={shortList[currentShort]}
                handleClose={() => {
                  setOpenedSideMenu("");
                }}
              />
            )
          )}
        </div>
      </div>

      <div
        className='hidden md:block fixed 
      right-0 h-[calc(100%-56px)] bg-black 1156:z-[2001] w-[96px]'
      >
        <div className='pl-[16px] pr-[24px] py-[8px]'>
          <button
            className={`w-[56px] h-[56px] rounded-[50%] bg-hover-black
           hover:bg-[rgba(255,255,255,0.2)] rotate-180 flex items-center justify-center 
            absolute top-[50%]  ${
              !isTop
                ? "translate-y-[calc(-100%_-_5px)] visible opacity-[1]"
                : "translate-y-[-50%] invisible opacity-0"
            }  transition-[opacity_transform] ] ease-linear duration-[0.3s]`}
            title='Previous video'
            onClick={handleScrollPrev}
          >
            <div>
              <LongArrowIcon />
            </div>
          </button>
        </div>

        {/* Show scrollNext btn if remainData > 0 or remainData = 0 and not isEnd */}

        <div className='pl-[16px] pr-[24px] py-[8px]'>
          <button
            className={`w-[56px] h-[56px] rounded-[50%] bg-hover-black
             hover:bg-[rgba(255,255,255,0.2)] flex items-center justify-center
             absolute top-[50%]  ${
               remainData.current > 0 || (remainData.current === 0 && !isEnd)
                 ? "translate-y-[10px] visible opacity-[1]"
                 : "translate-y-[-50%] invisible opacity-[0]"
             } transition-[opacity_transform] ease-linear duration-[0.3s]`}
            title='Next video'
            onClick={handleScrollNext}
          >
            <div>
              <LongArrowIcon />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
export default ShortPart;
