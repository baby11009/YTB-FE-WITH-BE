import { Button, SmallButton, BtnList, FuncBtnList } from "./Component";
import { Link } from "react-router-dom";

const Menu = ({ openedMenu, currPath, data }) => {
  return (
    <>
      {openedMenu && (
        <div className='fixed left-0 bottom-0'>
          <div className='w-[255px] px-[12px] h-screen-h-minus-56 flex flex-col'>
            <div className='flex flex-col items-center justify-center h-[207px]'>
              <Link to='/'>
                <img
                  src={`${import.meta.env.VITE_BASE_API_URI}${
                    import.meta.env.VITE_VIEW_AVA_API
                  }${data?.avatar}`}
                  alt='avatar'
                  className='size-[112px] rounded-[50%] object-cover object-center'
                />
              </Link>
              <h3 className='pt-[14px] text-[15px] leading-[24px] font-[500]'>
                Kênh của bạn
              </h3>
              <span className='text-[12px] leading-[16px] text-gray-A'>
                {data?.email}
              </span>
            </div>
            <div className='w-full flex-1 overflow-auto'>
              {BtnList.map((btn, id) => (
                <Button data={btn} currPath={currPath} key={id} />
              ))}
            </div>
            <div className='flex flex-col  mt-auto '>
              {FuncBtnList.map((btn, id) => (
                <Button data={btn} key={id} />
              ))}
            </div>
          </div>
        </div>
      )}
      {!openedMenu && (
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
            <div className='flex flex-col  mt-auto pb-[8px]'>
              {FuncBtnList.map((btn, id) => (
                <SmallButton data={btn} key={id} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Menu;
