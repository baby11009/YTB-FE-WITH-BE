import LeftMenu from "./Menu/LeftMenu";
import SDLeftMenu from "./Menu/SDLeftMenu";
import { Suspense } from "react";
import { useLayoutEffect, useCallback, useState } from "react";

const Body = ({
  openedMenu,
  setOpenedMenu,
  RenderContent,
  containerStyle,
  noLDMenu,
  noIconMenu,
}) => {
  const [useLargeMenu, setUseLargeMenu] = useState();

  const handleResize = useCallback(() => {
    if (window.innerWidth >= 1280 && !noLDMenu) {
      setUseLargeMenu(true);
    } else {
      setUseLargeMenu(false);
    }
  }, []);

  useLayoutEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <main className={`pt-[56px] ${containerStyle}`}>
      {/* Large device Left Menu */}
      {useLargeMenu ? (
        <LeftMenu
          openedMenu={openedMenu}
          setOpenedMenu={setOpenedMenu}
          path={location.pathname}
        />
      ) : (
        <SDLeftMenu
          openedMenu={openedMenu}
          setOpenedMenu={setOpenedMenu}
          noIconMenu={noIconMenu}
          path={location.pathname}
        />
      )}
      {/* {!noLDMenu && (
        <div className='hidden xl:block z-[9999]'>
          <LeftMenu
            openedMenu={openedMenu}
            setOpenedMenu={setOpenedMenu}
            path={location.pathname}
          />
        </div>
      )} */}
      {/* Small device left menu */}
      {/* <div className={`${!noLDMenu && " xl:hidden"} z-[9999]`}>
        <SDLeftMenu
          openedMenu={openedMenu}
          setOpenedMenu={setOpenedMenu}
          noIconMenu={noIconMenu}
          path={location.pathname}
        />
      </div> */}
      <div
        className={`
           
          ${!noLDMenu && "md:ml-[74px]"}
          ${openedMenu && !noLDMenu && " xl:ml-[240px]"} 
          `}
      >
        <Suspense
          fallback={
            <div className='w-full flex items-center justify-center'>
              <h2 className='text-[30px] leading-[32px] font-[500]'>
                Loading.....
              </h2>
            </div>
          }
        >
          {RenderContent}
        </Suspense>
      </div>
    </main>
  );
};
export default Body;
