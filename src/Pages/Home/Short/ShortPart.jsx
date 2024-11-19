import LargeShortVid from "./LargeShortVid";
import { LongArrowIcon } from "../../../Assets/Icons";
import { useLayoutEffect, useState, useRef, useEffect } from "react";
import { IsEnd, IsTop } from "../../../util/scrollPosition";
import { getData } from "../../../Api/getData";
import { useAuthContext } from "../../../Auth Provider/authContext";
import connectSocket from "../../../util/connectSocket";
import { useParams } from "react-router-dom";
const ShortPart = () => {
  const { id } = useParams();

  const { user } = useAuthContext();

  const [isTop, setIsTop] = useState(true);

  const [isEnd, setIsEnd] = useState(false);

  const [isScrolling, setIsScrolling] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(1);

  const shortIdSet = useRef(new Set());

  const [params, setParams] = useState({
    watchedIdList: [],
    shortId: id,
    reset: user?._id,
  });

  const [shortList, setShortList] = useState([]);

  const containerRef = useRef();
  const socketRef = useRef(null);
  const { data } = getData("/data/short", params);

  const handleScrollPrev = () => {
    if (isScrolling) {
      return;
    }
    setIsScrolling(true);
    window.scrollTo({
      left: window.scrollX,
      top:
        window.scrollY -
        Math.ceil(containerRef.current?.clientHeight / shortList.length) -
        2,
      behavior: "smooth",
    });
    setCurrentIndex((prev) => Math.max(1, prev - 1));
    setTimeout(() => {
      setIsScrolling(false);
    }, 500);
  };

  const handleScrollNext = () => {
    if (isScrolling) {
      return;
    }
    setIsScrolling(true);
    window.scrollTo({
      left: window.scrollX,
      top:
        window.scrollY +
        Math.ceil(containerRef.current?.clientHeight / shortList.length) +
        2,
      behavior: "smooth",
    });
    setCurrentIndex((prev) => Math.min(shortList.length, prev + 1));
    setTimeout(() => {
      setIsScrolling(false);
    }, 500);
  };

  useEffect(() => {
    document.addEventListener("scroll", () => {
      IsEnd(setIsEnd);
      IsTop(setIsTop);
    });

    document.documentElement.style.setProperty("--scroll-bar-width", "none");
    if (!socketRef.current) {
      socketRef.current = connectSocket();
    }
    return () => {
      // document.removeEventListener("wheel", disableScroll, { passive: false });
      // document.addEventListener("touchmove", disableScroll, { passive: false });

      if (socketRef.current && !socketRef.current.connected) {
        socketRef.current.off();
      }
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.disconnect();
      }

      document.removeEventListener("scroll", () => {
        IsEnd(setIsEnd);
        IsTop(setIsTop);
      });

      window.scrollTo(0, 0);

      document.documentElement.style.setProperty("--scroll-bar-width", "auto");
    };
  }, []);

  useLayoutEffect(() => {
    if (data) {
      data?.data.forEach((item) => {
        if (!shortIdSet.current.has(item)) {
          setShortList((prev) => [...prev, item]);
          shortIdSet.current.add(item);
        }
      });
    }
  }, [data]);

  useEffect(() => {
    if (shortList.length - currentIndex === 1) {
      setParams((prev) => ({
        ...prev,
        watchedIdList: [...shortIdSet.current],
      }));
    }
  }, [currentIndex, shortList.length]);

  useEffect(() => {
    const handleScroll = (e) => {
      e.preventDefault();
      if (e.deltaY >= 100) {
        handleScrollNext();
      } else {
        handleScrollPrev();
      }
    };

    window.addEventListener("wheel", handleScroll, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleScroll, { passive: false });
    };
  }, [shortList.length, isScrolling]);

  return (
    <div className='relative'>
      <div className='mx-auto w-fit' ref={containerRef}>
        {shortList.map((item, index) => (
          <LargeShortVid
            key={index}
            shortId={item}
            socket={socketRef.current}
          />
        ))}
      </div>
      <div className='hidden md:flex md:flex-col fixed top-[50%] translate-y-[-50%] right-0'>
        {!isTop && (
          <div className='px-[24px] py-[8px]'>
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
        {!isEnd && (
          <div className='px-[24px] py-[8px]'>
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
