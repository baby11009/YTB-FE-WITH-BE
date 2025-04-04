import LeftMenu from "./Menu/LeftMenu";

const Body = ({
  openedMenu,
  setOpenedMenu,
  RenderContent,
  containerStyle,
  noLDMenu,
  noIconMenu,
}) => {
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
           
          ${!noLDMenu && "800:ml-[74px]"}
          ${openedMenu && !noLDMenu && " xl:ml-[240px]"} 
          `}
      >
        {RenderContent}
      </div>
    </main>
  );
};
export default Body;
