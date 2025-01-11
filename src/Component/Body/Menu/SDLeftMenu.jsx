import {
  MenuIcon,
  YoutubeIcon,
  ThinArrowIcon,
  AllIcon,
} from "../../../Assets/Icons";

import { Link, useNavigate } from "react-router-dom";

import { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { useAuthContext } from "../../../Auth Provider/authContext";

import { useLayoutEffect, useCallback } from "react";

import {
  Button,
  SmButton,
  LinkComponent,
  ChannelButton,
  footerList1,
  footerList2,
  funcList1,
  funcList2,
  funcList3,
  funcList4,
  funcList5,
} from "./Component";

const SDLeftMenu = ({ openedMenu, setOpenedMenu, noIconMenu, path }) => {
  const { user } = useAuthContext();

  const [showMored, setShowMored] = useState(false);

  const navigate = useCallback(useNavigate(), []);

  const handleNav = useCallback((link) => {
    navigate(link);
  }, []);

  const handlePreventDefault = useCallback((e) => {
    e.preventDefault();
  }, []);

  useLayoutEffect(() => {
    if (openedMenu) {
      window.addEventListener("wheel", handlePreventDefault, {
        passive: false,
      });
    }

    return () => {
      if (openedMenu) {
        window.removeEventListener("wheel", handlePreventDefault, {
          passive: false,
        });
      }
    };
  }, [openedMenu]);

  return (
    <>
      <AnimatePresence>
        {openedMenu && (
          <div
            className='fixed z-[9999] inset-0 bg-[rgba(0,0,0,0.5)]'
            onClick={() => setOpenedMenu((prev) => !prev)}
          >
            <motion.div
              className='w-[240px] bg-[#0f0f0f] h-screen'
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
              ref={(e) => {
                if (e) {
                  e.addEventListener("wheel", (e) => {
                    e.stopPropagation();
                  });
                }
              }}
            >
              <div className='flex items-center  h-[56px] pl-[16px]'>
                <div
                  className='size-[40px] rounded-[50%] active:bg-black-0.2 
                p-[8px] mr-[4px] sm:mr-0 flex items-end justify-center'
                >
                  <button onClick={() => setOpenedMenu((prev) => !prev)}>
                    <MenuIcon />
                  </button>
                </div>
                <div className=' h-full  pl-[16px] pr-[14px] py-[18px]'>
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
              <div className='text-[14px] font-[500] leading-[20px] h-full-minus-56 overflow-y-scroll overscroll-contain menu-scrollbar'>
                <nav className='p-[12px]'>
                  <ul>
                    {funcList1.slice(0, 3).map((item) => {
                      if (item.renderCondition && !item.renderCondition(user)) {
                        return;
                      }
                      return (
                        <Button
                          key={item.id}
                          data={item}
                          path={path}
                          handleOnClick={handleNav}
                        />
                      );
                    })}
                  </ul>
                  {user && (
                    <>
                      <ul className='border-t-[1px] border-[rgba(255,255,255,0.2)] mt-[12px] pt-[12px]'>
                        <Button
                          data={{
                            title: "You",
                            path: "/manage/dashboard",
                            icon: <ThinArrowIcon />,
                          }}
                          path={path}
                          handleOnClick={handleNav}
                          style='flex-row-reverse justify-end !gap-[8px]'
                          textStyle='text-[16px]'
                        />
                        {funcList2.map((item) => (
                          <Button
                            key={item.id}
                            data={item}
                            path={path}
                            handleOnClick={handleNav}
                          />
                        ))}
                      </ul>
                      <ul className='border-t-[1px] border-[rgba(255,255,255,0.2)] mt-[12px] pt-[12px]'>
                        <li className='px-[12px] text-[16px] pt-[6px] pb-[4px] leading-[22px]'>
                          Subscriptions
                        </li>
                        {user?.subscribed_list
                          ?.slice(
                            0,
                            showMored ? user?.subscribed_list?.length : 7,
                          )
                          .map((channel, id) => (
                            <ChannelButton
                              key={id}
                              data={channel?.channel_info}
                            />
                          ))}

                        {showMored && (
                          <Button
                            data={{
                              title: "All subscriptions",
                              path: "/sub-channels",
                              icon: <AllIcon />,
                            }}
                            path={path}
                            handleOnClick={handleNav}
                          />
                        )}

                        <li
                          className={`px-[12px] hover:bg-hover-black rounded-[10px] cursor-pointer`}
                          onClick={() => setShowMored((prev) => !prev)}
                        >
                          <div className={`flex items-center h-[40px] `}>
                            <div
                              className={`mr-[24px] ${
                                showMored ? "rotate-[-90deg]" : "rotate-90"
                              } rotate-90`}
                            >
                              <ThinArrowIcon size='24' />
                            </div>
                            <span className={`flex-1`}>
                              {showMored ? "Show less" : "Show more"}
                            </span>
                          </div>
                        </li>
                      </ul>
                    </>
                  )}
                  <ul className='border-t-[1px] border-[rgba(255,255,255,0.2)] mt-[12px] pt-[12px]'>
                    <li className='px-[12px] text-[16px] pt-[6px] pb-[4px] leading-[22px]'>
                      Explore
                    </li>
                    {funcList3.map((item) => (
                      <Button
                        key={item.id}
                        data={item}
                        path={path}
                        handleOnClick={handleNav}
                      />
                    ))}
                  </ul>
                  <ul className='border-t-[1px] border-[rgba(255,255,255,0.2)] mt-[12px] pt-[12px]'>
                    <li className='px-[12px] text-[16px] pt-[6px] pb-[4px] leading-[22px]'>
                      More from YouTube
                    </li>
                    {funcList4.map((item) => (
                      <Button
                        key={item.id}
                        data={item}
                        path={path}
                        handleOnClick={handleNav}
                      />
                    ))}
                  </ul>
                  <ul className='border-t-[1px] border-[rgba(255,255,255,0.2)] mt-[12px] pt-[12px]'>
                    {funcList5.map((item) => (
                      <Button
                        key={item.id}
                        data={item}
                        path={path}
                        handleOnClick={handleNav}
                      />
                    ))}
                  </ul>
                  <div
                    className='border-t-[1px] border-[rgba(255,255,255,0.2)] mt-[12px] pt-[12px] text-[#AAAAAA] 
                    text-[13px] leading-[18px] font-bold  px-[12px]'
                  >
                    <ul className='flex flex-wrap mb-[12px]'>
                      {footerList1.map((item, i) => (
                        <LinkComponent key={i} title={item} />
                      ))}
                    </ul>
                    <ul className='flex flex-wrap'>
                      {footerList2.map((item, i) => (
                        <LinkComponent key={i} title={item} />
                      ))}
                    </ul>
                    <div className=' text-gray-71 text-[12px] font-[400] mt-[16px]'>
                      © 2024 Google LLC
                    </div>
                  </div>
                </nav>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {!noIconMenu && (
        <div className='w-[74px] h-scrren hidden md:block fixed left-0'>
          <nav className='mt-[4px] px-[4px]'>
            {funcList1.map((item) => {
              if (item.renderCondition && !item.renderCondition(user)) {
                return;
              }
              return (
                <SmButton
                  key={item.id}
                  data={item}
                  path={path}
                  handleOnClick={handleNav}
                />
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
};
export default SDLeftMenu;
