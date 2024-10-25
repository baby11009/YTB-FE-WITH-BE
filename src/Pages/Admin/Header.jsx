import {
  BellIcon,
  ThinArrowIcon,
  YoutubeIcon,
  MenuIcon,
} from "../../Assets/Icons";
import { Link } from "react-router-dom";

const Header = ({ setOpenedMenu }) => {
  return (
    <header className=' fixed top-0 w-full bg-black h-[56px] px-[8px] 2xsm:px-[16px] z-[1000]'>
      <div className='flex items-center justify-between w-full h-full'>
        <div className='flex  gap-[16px]'>
          <button
            className='size-[40px] rounded-[50%] hover:bg-black-0.2 flex items-center justify-center'
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setOpenedMenu((prev) => !prev);
            }}
          >
            <MenuIcon />
          </button>
          <Link className='w-[90px]' to={"/"}>
            <YoutubeIcon />
          </Link>
        </div>
        <div className='flex justify-end gap-[8px] '>
          <button
            className='size-[40px] rounded-[50%]
          hover:bg-black-0.2 flex items-center justify-center'
          >
            <BellIcon />
          </button>
          <div className='flex items-center  gap-[16px]'>
            <img
              src=''
              alt='avatar'
              className='size-[32px] rounded-[50%] bg-white'
            />
            <button className='flex items-center gap-[16px]'>
              <div>Admin</div>
              <div className=' rotate-[90deg]'>
                <ThinArrowIcon />
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
