import { Button, SmallButton, BtnList, FuncBtnList } from "./Component";

const Menu = ({ openedMenu, currPath }) => {
  return (
    <>
      {openedMenu && (
        <div className='fixed left-0 bottom-0'>
          <div className='w-[240px] px-[12px] h-screen-h-minus-56 flex flex-col justify-between'>
            <div className='w-full'>
              {BtnList.map((btn, id) => (
                <Button data={btn} currPath={currPath} key={id} />
              ))}
            </div>
            {FuncBtnList.map((btn, id) => (
              <Button data={btn} key={id} />
            ))}
          </div>
        </div>
      )}
      {!openedMenu && (
        <div className='w-[74px] h-screen-h-minus-56 hidden md:block fixed left-0 bottom-0'>
          <div className='mt-[4px] px-[4px] h-full flex flex-col justify-between '>
            <div className='flex-1 w-full flex flex-col gap-[6px] overflow-auto'>
              {BtnList.map((btn, id) => (
                <SmallButton data={btn} currPath={currPath} key={id} />
              ))}
            </div>
            {FuncBtnList.map((btn, id) => (
              <SmallButton data={btn} key={id} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};
export default Menu;
