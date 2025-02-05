import {
  ThinArrowIcon,
  YoutubeIcon,
  MenuIcon,
  YourChannelIcon,
  YoutubeBlankIcon,
  MyChannelIcon,
  LogOutIcon,
  ThemeIcon,
  FeedBackIcon,
} from "../../Assets/Icons";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../Auth Provider/authContext";
import { removeCookie } from "../../util/tokenHelpers";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

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
        <div className='w-[24px] text-[#909090] mr-[16px]'>{data.icon}</div>
        <span className='flex-1 text-start text-[14px] leading-[20px] font-[500]'>
          {data.title}
        </span>
        {data.type === 1 && (
          <div className='text-[#909090]'>
            <ThinArrowIcon />
          </div>
        )}
      </div>
    </button>
  );
};

const Header = ({ setOpenedMenu }) => {
  const { user, setUser } = useAuthContext();

  const navigate = useNavigate();

  const [openedUserMenu, setOpenedUserMenu] = useState(false);

  const userMenuContainer = useRef();

  const funcList1 = useRef([
    {
      id: 1,
      title: "Your channel",
      icon: <YourChannelIcon />,
      handleOnClick: () => {
        navigate("/my-channel");
      },
    },
    {
      id: 2,
      title: "Youtube",
      icon: <YoutubeBlankIcon />,
      handleOnClick: () => {
        navigate("/");
      },
    },
    {
      id: 3,
      title: "Switch account",
      icon: <MyChannelIcon />,
      type: 1,
      handleOnClick: () => {
        setOpenedUserMenu(false);
      },
    },
    {
      id: 4,
      title: "Sign out",
      icon: <LogOutIcon />,
      handleOnClick: () => {
        removeCookie(import.meta.env.VITE_AUTH_TOKEN);
        setUser(undefined);
        if (window.location.href !== "/") {
          navigate("/", { replace: true });
        }
      },
    },
  ]);

  const funcList2 = useRef([
    {
      id: 5,
      title: "Appearance: Device theme",
      icon: <ThemeIcon />,
      type: 1,
      handleOnClick: () => {
        setOpenedUserMenu(false);
      },
    },
    {
      id: 6,
      title: "Send feedback",
      icon: <FeedBackIcon />,
      handleOnClick: () => {
        setOpenedUserMenu(false);
      },
    },
  ]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        userMenuContainer.current &&
        !userMenuContainer.current.contains(e.target) &&
        e.target !== userMenuContainer.current
      ) {
        setOpenedUserMenu(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className=' fixed top-0 w-full bg-black  py-[10px] px-[8px] md:px-[16px] z-[3000]'>
      <div className='flex items-center justify-between size-full'>
        <div className='flex  gap-[16px]'>
          <button
            className='size-[44px] rounded-[50%] hover:bg-black-0.2 flex items-center justify-center'
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

        <div className='cursor-pointer relative' ref={userMenuContainer}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setOpenedUserMenu((prev) => !prev);
            }}
          >
            <img
              src={`${
                import.meta.env.VITE_BASE_API_URI +
                import.meta.env.VITE_VIEW_AVA_API +
                user.avatar
              }`}
              alt='avatar'
              className='size-[32px] rounded-[50%]'
            />
          </button>

          <div
            className={`absolute right-0 w-[300px] max-h-[350px] overflow-hidden flex flex-col
            rounded-[12px] bg-[#282828] origin-top-right transition-transform duration-[0.1s] ${
              openedUserMenu ? "scale-[1]" : "scale-0"
            } `}
          >
            <div className='border-b-[1px] border-black-0.1 px-[16px] py-[16px] flex'>
              <div className='mr-[16px]'>
                <img
                  src={`${
                    import.meta.env.VITE_BASE_API_URI +
                    import.meta.env.VITE_VIEW_AVA_API +
                    user.avatar
                  }`}
                  alt='avatar'
                  className='size-[40px] rounded-[50%]'
                />
              </div>
              <div className='flex-1 overflow-hidden'>
                <span className='text-[16px] leading-[22px] text-white line-clamp-1 text-ellipsis break-words'>
                  {user?.name}
                </span>

                <span className='text-[16px] leading-[22px] text-white line-clamp-1 text-ellipsis  break-words '>
                  @{user?.email}
                </span>
              </div>
            </div>
            <div className='flex-1 overflow-y-auto menu-scrollbar border-b-[1px] border-black-0.1'>
              {funcList1.current.map((func, id) => (
                <CustomButton data={func} key={id} />
              ))}
            </div>
            <div className='border-b-[1px] border-black-0.1'>
              {funcList2.current.map((func, id) => (
                <CustomButton data={func} key={id} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
