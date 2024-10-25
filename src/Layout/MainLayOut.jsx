import { useEffect, useLayoutEffect } from "react";
import { scrollToTop } from "../util/scrollCustom";
import { useAuthContext } from "../Auth Provider/authContext";

//  Swiper css
import "swiper/css";

const MainLayOut = ({ children, style }) => {
  useEffect(() => {
    scrollToTop();
  }, []);

  const { isShowing } = useAuthContext();

  useLayoutEffect(() => {
    if (isShowing) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isShowing]);

  return (
    <div className='min-h-screen text-white-F1 relative'>
      {children}
      {isShowing && (
        <div className=' fixed z-[9999] inset-0 bg-[rgba(0,0,0,0.5)]'>
          <div className='w-screen h-screen flex items-center justify-center'>
            {isShowing}
          </div>
        </div>
      )}
    </div>
  );
};
export default MainLayOut;
