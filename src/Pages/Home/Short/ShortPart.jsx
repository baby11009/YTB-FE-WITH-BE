import LargeShortVid from "./LargeShortVid";
import { LongArrowIcon } from "../../../Assets/Icons";
import { useLayoutEffect, useState, useRef, useEffect } from "react";
import { IsEnd, IsTop } from "../../../util/scrollPosition";
import { getData } from "../../../Api/getData";
import { useAuthContext } from "../../../Auth Provider/authContext";

const ShortPart = () => {
  const { user } = useAuthContext();

  const [isTop, setIsTop] = useState(true);

  const [isEnd, setIsEnd] = useState(false);

  const shortIdSet = useRef(new Set());

  const [params, setParams] = useState({
    watchedIdList: [],
    userId: user?._id,
  });

  const [shortList, setShortList] = useState([]);

  const currentIndex = useRef(1);

  const { data, refetch } = getData("/data/short", params);

  const handleScrollPrev = () => {
    window.scrollTo({
      left: window.scrollX,
      top: window.scrollY - 612,
      behavior: "smooth",
    });
    currentIndex.current = Math.max(1, currentIndex.current - 1);
  };

  const handleScrollNext = () => {
    window.scrollTo({
      left: window.scrollX,
      top: window.scrollY + 612,
      behavior: "smooth",
    });
    currentIndex.current = currentIndex.current + 1;
  };

  useLayoutEffect(() => {
    const disableScroll = (e) => {
      e.preventDefault();
    };

    window.addEventListener("wheel", disableScroll, { passive: false });
    window.addEventListener("touchmove", disableScroll, { passive: false });

    window.addEventListener("scroll", () => {
      IsEnd(setIsEnd);
      IsTop(setIsTop);
    });

    document.documentElement.style.setProperty("--scroll-bar-width", "none");

    return () => {
      window.removeEventListener("wheel", disableScroll, { passive: false });

      window.removeEventListener("scroll", () => {
        IsEnd(setIsEnd);
        IsTop(setIsTop);
      });

      window.scrollTo(0, 0);

      document.documentElement.style.setProperty("--scroll-bar-width", "auto");
    };
  }, []);

  useEffect(() => {
    if (data) {
      data?.data.forEach((item) => {
        if (!shortIdSet.current.has(item._id)) {
          setParams((prev) => ({
            ...prev,
            watchedIdList: [...prev.watchedIdList, item._id],
          }));
          setShortList((prev) => [...prev, item]);
          shortIdSet.current.add(item._id);
        }
      });
    }
  }, [data]);

  useEffect(() => {
    if (shortList.length - currentIndex.current === 1) {
      refetch();
    }
  }, [currentIndex.current]);

  return (
    <div className='relative '>
      <div className='mx-auto w-fit'>
        {shortList.map((item, index) => (
          <LargeShortVid
            key={index}
            data={item}
            total={shortList.length}
            od={index + 1}
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
