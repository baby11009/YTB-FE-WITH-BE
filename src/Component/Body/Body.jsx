import LeftMenu from "./Menu/LeftMenu";
import SDLeftMenu from "./Menu/SDLeftMenu";
import { useLocation } from "react-router-dom";
import { Suspense } from "react";

const Body = ({
  openedMenu,
  setOpenedMenu,
  RenderContent,
  containerStyle,
  noLDMenu,
  noIconMenu,
}) => {
  const location = useLocation();

  return (
    <div className={`pt-[56px] ${containerStyle}`}>
      {/* Large device Left Menu */}
      {!noLDMenu && (
        <div className='hidden xl:block'>
          <LeftMenu
            openedMenu={openedMenu}
            setOpenedMenu={setOpenedMenu}
            path={location.pathname}
          />
        </div>
      )}
      {/* Small device left menu */}
      <div className={`${!noLDMenu && " xl:hidden"} z-[2]`}>
        <SDLeftMenu
          openedMenu={openedMenu}
          setOpenedMenu={setOpenedMenu}
          noIconMenu={noIconMenu}
          path={location.pathname}
        />
      </div>
      <div
        className={`
           
          ${!noLDMenu && "md:ml-[74px]"}
          ${openedMenu && !noLDMenu && " xl:ml-[240px]"} 
          `}
      >
        <Suspense
          fallback={
            <div className='w-full h-screen flex items-center justify-center'>
              <h2 className='text-[30px] leading-[32px] font-[500]'>
                Loading.....
              </h2>
            </div>
          }
        >
          {RenderContent}
        </Suspense>
      </div>
    </div>
  );
};
export default Body;
