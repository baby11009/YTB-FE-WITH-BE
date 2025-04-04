import { useEffect } from "react";
import { scrollToTop } from "../util/scrollCustom";
import { useAuthContext } from "../Auth Provider/authContext";

const MainLayOut = ({ children }) => {
  useEffect(() => {
    scrollToTop();
  }, []);

  const { isShowing, modalContainerRef } = useAuthContext();

  return (
    <div className='min-h-screen text-white-F1 relative'>
      {children}
      {isShowing && (
        <div className=' fixed z-[9999] inset-0 bg-[rgba(0,0,0,0.3)] flex items-center justify-center'>
          <div ref={modalContainerRef}>{isShowing}</div>
        </div>
      )}
    </div>
  );
};
export default MainLayOut;
