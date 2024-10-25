import { YoutubeIcon, MenuIcon } from "../../../Assets/Icons";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button, SmallButton, BtnList, FuncBtnList } from "./Component";

const SdMenu = ({ openedMenu, setOpenedMenu, currPath }) => {
  return (
    <>
      <AnimatePresence>
        {openedMenu && (
          <div
            className='fixed z-[3000] inset-0 bg-[rgba(0,0,0,0.5)]'
            onClick={() => setOpenedMenu((prev) => !prev)}
          >
            <motion.div
              className='w-[240px] px-[12px] bg-[#0f0f0f] h-screen flex flex-col justify-between'
              initial={{
                x: "-240px",
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: "-240px",
              }}
              transition={{
                duration: 0.175,
                type: "tween",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className='w-full'>
                <div className='flex items-center h-[56px] pl-[4px]'>
                  <div
                    className='size-[40px] rounded-[50%] active:bg-black-0.2 
                    p-[8px] mr-[4px] sm:mr-0 flex items-end justify-center'
                  >
                    <button onClick={() => setOpenedMenu((prev) => !prev)}>
                      <MenuIcon />
                    </button>
                  </div>
                  <div className='h-full pl-[16px] pr-[14px] py-[18px]'>
                    <Link to='/'>
                      <div className='w-[90px] relative'>
                        <YoutubeIcon />
                        <span className=' text-gray-A text-[10px] absolute right-[-17.5px] top-[-7px]'>
                          VN
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
                {BtnList.map((btn, id) => (
                  <Button data={btn} currPath={currPath} key={id} />
                ))}
              </div>
              {FuncBtnList.map((btn, id) => (
                <Button data={btn} key={id} />
              ))}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <div className='w-[74px] h-screen-h-minus-56  hidden md:block fixed left-0 bottom-0'>
        <ul className='mt-[4px] px-[4px] h-full flex flex-col justify-between'>
          <div className='w-full flex flex-col gap-[6px]'>
            {BtnList.map((btn, id) => (
              <SmallButton data={btn} currPath={currPath} key={id} />
            ))}
          </div>
          {FuncBtnList.map((btn, id) => (
            <SmallButton data={btn} key={id} />
          ))}
        </ul>
      </div>
    </>
  );
};
export default SdMenu;
