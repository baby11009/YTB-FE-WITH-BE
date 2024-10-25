import { MyChannel } from "../../Assets/Images";
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
} from "../../Assets/Icons";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../Auth Provider/authContext";
import { removeCookie } from "../../util/tokenHelpers";
import { useNavigate } from "react-router-dom";

const CutomeButton = ({ icon1, state, title, handleOnClick }) => {
  return (
    <button onClick={handleOnClick} className='w-full'>
      <div className='flex items-center h-[40px] px-[16px] hover:bg-hover-black'>
        <div className='mr-[16px]'>{icon1}</div>
        <span className='flex-1 text-start'>{title}</span>
        {state === 1 && (
          <div>
            <ThinArrowIcon size={"24"} />
          </div>
        )}
      </div>
    </button>
  );
};

const AccountSetting = ({ opened, setOpened, boxRef }) => {
  const { user, setUser } = useAuthContext();

  const navigate = useNavigate();

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
                  <CutomeButton
                    icon1={<GoogleIcon />}
                    title={"Tài khoản Google"}
                    state={0}
                  />
                  <CutomeButton
                    icon1={<MyChannelIcon />}
                    title={"Chuyển đổi tài khoản"}
                    state={1}
                  />
                  {user?.role === "admin" && (
                    <CutomeButton
                      icon1={<HomeIcon />}
                      title={"Dash board"}
                      state={1}
                      handleOnClick={() => {
                        navigate("/admin/dashboard");
                      }}
                    />
                  )}
                  <CutomeButton
                    icon1={<LogOutIcon />}
                    title={"Đăng xuất"}
                    state={0}
                    handleOnClick={handleLogOut}
                  />
                </div>
                <div className='py-[8px] border-b-[1px] border-b-[rgba(255,255,255,0.2)] text-[14px] leading-[20px]'>
                  <CutomeButton
                    icon1={<YoutubeStudio2Icon />}
                    title={"YouTube Studio"}
                    state={0}
                  />
                  <CutomeButton
                    icon1={<TransactionIcon />}
                    title={"Giao dịch mua và gói thành viên"}
                    state={0}
                  />
                </div>
                <div className='py-[8px] border-b-[1px] border-b-[rgba(255,255,255,0.2)] text-[14px] leading-[20px]'>
                  <CutomeButton
                    icon1={<MyDataIcon />}
                    title={"Dữ liệu của bạn trong YouTube"}
                    state={0}
                  />
                  <CutomeButton
                    icon1={<ThemeIcon />}
                    title={"Giao diện: Giao diện thiết bị"}
                    state={1}
                  />
                  <CutomeButton
                    icon1={<LanguageIcon />}
                    title={"Ngôn ngữ: Tiếng Việt"}
                    state={1}
                  />
                  <CutomeButton
                    icon1={<RestrictedIcon />}
                    title={"Chế độ hạn chế : Đã tắt"}
                    state={1}
                  />
                  <CutomeButton
                    icon1={<LocationIcon />}
                    title={"Địa điểm: Việt Nam"}
                    state={1}
                  />
                  <CutomeButton
                    icon1={<ShortcutIcon />}
                    title={"Phím tắt"}
                    state={0}
                  />
                </div>
                <div className='py-[8px] border-b-[1px] border-b-[rgba(255,255,255,0.2)] text-[14px] leading-[20px]'>
                  <CutomeButton
                    icon1={<SettingIcon />}
                    title={"Cài đặt"}
                    state={0}
                  />
                </div>
                <div className='py-[8px] border-b-[1px] border-b-[rgba(255,255,255,0.2)] text-[14px] leading-[20px]'>
                  <CutomeButton
                    icon1={<HelpIcon />}
                    title={"Trợ giúp"}
                    state={0}
                  />
                  <CutomeButton
                    icon1={<FeedBackIcon />}
                    title={"Gửi ý kiến phản hồi"}
                    state={0}
                  />
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
