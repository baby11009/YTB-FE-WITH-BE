import { Button, BtnList } from "./Component";
import { Link } from "react-router-dom";

const Menu = ({ openedMenu, setOpenedMenu, currPath, userData }) => {
  return (
    <div>
      <div className='fixed left-0 bottom-0 bg-black z-[10]'>
        <div
          className={` ${
            openedMenu ? "w-[255px]" : "w-[72px]"
          }  h-screen-h-minus-56 flex flex-col transition-[width] ease-cubic-bezier-[0,0,0.2,1]
               duration-[417ms]`}
        >
          <div
            className={`flex flex-col items-center justify-center mx-[12px] py-[14px] `}
          >
            <Link to='/'>
              <img
                src={`${import.meta.env.VITE_BASE_API_URI}${
                  import.meta.env.VITE_VIEW_AVA_API
                }${userData?.avatar}`}
                alt='avatar'
                className={`${
                  openedMenu ? "size-[112px]" : "size-[32px]"
                } rounded-[50%] object-cover object-center 
                    transition-[width_height] ease-cubic-bezier-[0,0,0.2,1] duration-[417ms] `}
              />
            </Link>

            <div
              className={`${
                openedMenu ? "h-fit opacity-[1]" : "h-0 opacity-0"
              }  transition-all ease-cubic-bezier-[0,0,0.2,1] duration-[217ms]`}
            >
              <h3 className='pt-[14px] text-[15px] leading-[24px] font-[500] text-center '>
                Admin
              </h3>
              <span className='text-[12px] leading-[16px] text-gray-A text-center'>
                {userData?.email}
              </span>
            </div>
          </div>
          <div className='w-full flex-1 overflow-auto z-[2]'>
            {BtnList.map((btn, id) => (
              <Button
                data={btn}
                currPath={currPath}
                key={id}
                openedMenu={openedMenu}
              />
            ))}
          </div>
        </div>
      </div>
      <div
        className={`fixed inset-0  ${
          openedMenu
            ? "visible bg-[rgba(0,0,0,0.5)] "
            : "invisible bg-[transparent] transition-all delay-[300ms]"
        } 2lg:invisible`}
        onClick={() => setOpenedMenu(false)}
      ></div>
    </div>
  );
};
export default Menu;
