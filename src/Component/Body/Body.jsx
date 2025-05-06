import LeftMenu from "./Menu/LeftMenu";

const Body = ({
  openedMenu,
  setOpenedMenu,
  containerStyle,
  noLDMenu,
  noIconMenu,
  modalMenu,
  children,
}) => {
  return (
    <main className={`pt-[56px] ${containerStyle}`}>
      {/* Large device Left Menu */}
      <LeftMenu
        openedMenu={openedMenu}
        setOpenedMenu={setOpenedMenu}
        path={location.pathname}
        noIconMenu={noIconMenu}
        modalMenu={modalMenu}
      />
      <div
        className={`
           
          ${!noLDMenu && "800:ml-[74px]"}
          ${openedMenu && !noLDMenu && " xl:ml-[240px]"} 
          `}
      >
        {children}
      </div>
    </main>
  );
};
export default Body;
