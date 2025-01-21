import { Button, SmallButton, BtnList } from "./Component";
import { Link } from "react-router-dom";

const Menu = ({ openedMenu, currPath, data }) => {
  return (
    <>
      <div className='fixed left-0 bottom-0'>
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
                }${data?.avatar}`}
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
                Kênh của bạn
              </h3>
              <span className='text-[12px] leading-[16px] text-gray-A text-center'>
                {data?.email}
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

      {/* {!openedMenu && (
        <div className='w-[74px] h-screen-h-minus-56 hidden md:block fixed left-0 bottom-0'>
          <div className='mt-[4px] px-[4px] h-full flex flex-col justify-between '>
            <div className='h-[60px] flex items-center justify-center'>
              <Link to='/'>
                <img
                  src={`${import.meta.env.VITE_BASE_API_URI}${
                    import.meta.env.VITE_VIEW_AVA_API
                  }${data?.avatar}`}
                  alt='avatar'
                  className='size-[32px] rounded-[50%] object-cover object-center'
                />
              </Link>
            </div>
            <div className='flex-1 overflow-auto w-full flex flex-col gap-[6px]'>
              {BtnList.map((btn, id) => (
                <SmallButton data={btn} currPath={currPath} key={id} />
              ))}
            </div>
          </div>
        </div>
      )} */}
    </>
  );
};
export default Menu;
