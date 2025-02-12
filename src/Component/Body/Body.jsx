import LeftMenu from "./Menu/LeftMenu";

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
      <LeftMenu
        openedMenu={openedMenu}
        setOpenedMenu={setOpenedMenu}
        path={location.pathname}
      />
      <div
        className={`
           
          ${!noLDMenu && "md:ml-[74px]"}
          ${openedMenu && !noLDMenu && " xl:ml-[240px]"} 
          `}
      >
        {RenderContent}
      </div>
    </main>
  );
};
export default Body;
