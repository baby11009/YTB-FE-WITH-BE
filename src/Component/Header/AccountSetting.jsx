import {
  GoogleIcon,
  MyChannelIcon,
  LogOutIcon,
  YoutubeStudio2Icon,
  TransactionIcon,
  MyDataIcon,
  ThemeIcon,
  LanguageIcon,
  RestrictedIcon,
  LocationIcon,
  ShortcutIcon,
  ThinArrowIcon,
  SettingIcon,
  HelpIcon,
  FeedBackIcon,
  UserIcon,
  HomeIcon,
  DashboardIcon,
} from "../../Assets/Icons";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../Auth Provider/authContext";
import { removeCookie } from "../../util/tokenHelpers";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

const CustomButton = ({ data }) => {
  return (
    <button
      onClick={() => {
        if (data.handleOnClick) {
          data.handleOnClick();
        }
      }}
      className='w-full'
    >
      <div className='flex items-center h-[40px] px-[16px] hover:bg-hover-black'>
        <div className='mr-[16px]'>{data.icon}</div>
        <span className='flex-1 text-start'>{data.title}</span>
        {data.type === 1 && (
          <div>
            <ThinArrowIcon />
          </div>
        )}
      </div>
    </button>
  );
};

const AccountSetting = ({ opened, setOpened, boxRef }) => {
  const { user, setUser, authTokenRef } = useAuthContext();

  const navigate = useNavigate();

  const funclist1 = useRef([
    { id: 1, title: "Google account", icon: <GoogleIcon /> },
    { id: 2, title: "Switch account", icon: <MyChannelIcon />, type: 1 },
    {
      id: 3,
      title: "Dashboard",
      icon: <HomeIcon />,
      handleOnClick: () => {
        navigate("/admin/dashboard");
      },
      notRender: !user || user.role !== "admin",
    },
    {
      id: 4,
      title: "Sign out",
      icon: <LogOutIcon />,
      handleOnClick: () => {
        removeCookie(import.meta.env.VITE_AUTH_TOKEN);
        setUser(null);
        authTokenRef.current = null;
        if (window.location.href !== "/") {
          navigate("/", { replace: true });
        }
      },
    },
  ]);
  const funclist2 = useRef([
    { id: 5, title: "Youtube Studio", icon: <YoutubeStudio2Icon /> },
    { id: 6, title: "Purchases and memberships", icon: <TransactionIcon /> },
  ]);
  const funclist3 = useRef([
    { id: 7, title: "Your data in Youtube", icon: <MyDataIcon /> },
    { id: 8, title: "Appearance: Device theme", icon: <ThemeIcon />, type: 1 },
    { id: 9, title: "Language: English", icon: <LanguageIcon />, type: 1 },
    {
      id: 10,
      title: "Restricted Mode: Off",
      icon: <RestrictedIcon />,
      type: 1,
    },
    { id: 11, title: "Location: VietNam", icon: <LocationIcon />, type: 1 },
    { id: 12, title: "Keyboard shortcuts", icon: <ShortcutIcon /> },
  ]);
  const funclist4 = useRef([
    { id: 13, title: "Settings", icon: <SettingIcon /> },
  ]);
  const funclist5 = useRef([
    { id: 14, title: "Help", icon: <HelpIcon /> },
    { id: 15, title: "Send feedback", icon: <FeedBackIcon /> },
  ]);

  const handleLogOut = () => {
    removeCookie(import.meta.env.VITE_AUTH_TOKEN);
    setUser(undefined);
    if (window.location.href !== "/") {
      navigate("/", { replace: true });
    }
  };

  return (
    <>
      {!user ? (
        <div className='flex items-center justify-center'>
          <div
            className='size-[32px] rounded-[50%] border-[2px] flex items-center justify-center cursor-pointer'
            onClick={() => {
              navigate("/auth/login");
            }}
          >
            <UserIcon />
          </div>
        </div>
      ) : (
        <div
          className='flex items-center cursor-pointer justify-center px-[6px] py-[1px] w-[60px] relative'
          onClick={(e) => {
            setOpened((prev) => (prev === "setting" ? "" : "setting"));
          }}
          ref={opened === "setting" ? boxRef : null}
        >
          <img
            draggable='false'
            alt='Hình ảnh đại diện'
            height='32px'
            width='32px'
            src={`${import.meta.env.VITE_BASE_API_URI}${
              import.meta.env.VITE_VIEW_AVA_API
            }${user?.avatar}`}
            className='rounded-full w-[32px] h-[32px]'
          />
          {opened === "setting" && (
            <div
              className='absolute w-[300px] h-screen-h-minus-11 bg-[#282828] top-[3px] 
              left-[-301px] z-[500] rounded-[12px] text-[16px] leading-[22px] text-white-F1 cursor-default
              flex flex-col'
            >
              <div className='p-[16px] flex border-b-[1px] border-b-[rgba(255,255,255,0.2)]'>
                <div className='w-[40px] h-[40px] rounded-full overflow-hidden mr-[16px]'>
                  <img
                    src={`${import.meta.env.VITE_BASE_API_URI}${
                      import.meta.env.VITE_VIEW_AVA_API
                    }${user?.avatar}`}
                    alt='user'
                  />
                </div>
                <div className='flex flex-col items-start'>
                  <span>{user?.name}</span>
                  <span>{`@${user?.email}`}</span>
                  <Link className='mt-[8px] text-blue-3E'>
                    Xem kênh của bạn
                  </Link>
                </div>
              </div>
              <div className=' overflow-y-auto  menu-scrollbar'>
                <div className='py-[8px] border-b-[1px] border-b-[rgba(255,255,255,0.2)] text-[14px] leading-[20px]'>
                  {funclist1.current.map((func) => {
                    if (func.notRender) return;
                    return <CustomButton key={func.id} data={func} />;
                  })}
                </div>
                <div className='py-[8px] border-b-[1px] border-b-[rgba(255,255,255,0.2)] text-[14px] leading-[20px]'>
                  {funclist2.current.map((func) => {
                    if (func.notRender) return;
                    return <CustomButton key={func.id} data={func} />;
                  })}
                </div>
                <div className='py-[8px] border-b-[1px] border-b-[rgba(255,255,255,0.2)] text-[14px] leading-[20px]'>
                  {funclist3.current.map((func) => {
                    if (func.notRender) return;
                    return <CustomButton key={func.id} data={func} />;
                  })}
                </div>
                <div className='py-[8px] border-b-[1px] border-b-[rgba(255,255,255,0.2)] text-[14px] leading-[20px]'>
                  {funclist4.current.map((func) => {
                    if (func.notRender) return;
                    return <CustomButton key={func.id} data={func} />;
                  })}
                </div>
                <div className='py-[8px] border-b-[1px] border-b-[rgba(255,255,255,0.2)] text-[14px] leading-[20px]'>
                  {funclist5.current.map((func) => {
                    if (func.notRender) return;
                    return <CustomButton key={func.id} data={func} />;
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
export default AccountSetting;
