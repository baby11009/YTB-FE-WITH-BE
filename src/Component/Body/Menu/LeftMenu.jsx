import { ThinArrowIcon, AllIcon } from "../../../Assets/Icons";

import { useNavigate } from "react-router-dom";

import {
  Button,
  ChannelButton,
  SmButton,
  LinkComponent,
  footerList1,
  footerList2,
  funcList1,
  funcList2,
  funcList3,
  funcList4,
  funcList5,
} from "./Component";

import { useState } from "react";
import { useAuthContext } from "../../../Auth Provider/authContext";

const LeftMenu = ({ openedMenu, setOpenedMenu, path }) => {
  const { user } = useAuthContext();

  const [showMored, setShowMored] = useState(false);

  const navigate = useNavigate();

  const handleNav = (path) => {
    navigate(path);
  };

  return (
    <nav
      className={`fixed top-[56px] left-0   h-screen z-[1000]`}
      ref={(e) => {
        if (e) {
          e.addEventListener("wheel", (e) => {
            e.stopPropagation();
          });
        }
      }}
    >
      {/* Big menu */}

      <div
        className={`absolute w-[240px] bg-black h-full-minus-56 overflow-y-scroll overscroll-contain menu-scrollbar
         text-[14px] font-[500] leading-[20px] z-[2000]    ${
           openedMenu ? "translate-x-[0]" : "translate-x-[-100%]"
         } 
         ${
           path !== "/video"
             ? "transition-[transform] 1336:transition-none"
             : "transition-[transform]"
         }`}
      >
        <div className='p-[12px]'>
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
                  handleOnClick={handleNav}
                  path={path}
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
                  ?.slice(0, showMored ? user?.subscribed_list?.length : 7)
                  .map((channel, id) => (
                    <ChannelButton key={id} data={channel?.channel_info} />
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
        </div>
      </div>

      {/* Small menu */}

      <nav
        className={`w-[74px] mt-[4px] px-[4px] hidden   ${
          path !== "/video" ? "800:block" : ""
        } `}
      >
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

      <div
        className={`fixed inset-0  ${
          openedMenu
            ? "visible bg-[rgba(0,0,0,0.5)] "
            : "invisible bg-[transparent] transition-all delay-[250ms]"
        }    ${path !== "/video" ? "1336:invisible" : ""}`}
        onClick={() => {
          setOpenedMenu(false);
        }}
      ></div>
    </nav>
  );
};
export default LeftMenu;
