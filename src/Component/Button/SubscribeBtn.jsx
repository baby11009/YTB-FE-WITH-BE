import {
  BellIcon,
  ThinArrowIcon,
  ThickBellIcon,
  SlashBellIcon,
  UnSubIcon,
} from "../../Assets/Icons";
import request from "../../util/axios-base-url";
import { useAuthContext } from "../../Auth Provider/authContext";
import { CustomeFuncBox } from "../../Component";
import { useState } from "react";
import { getCookie } from "../../util/tokenHelpers";

const SubscribeBtn = ({ sub, notify, id, channelId, refetch }) => {
  const { user, setRefetch } = useAuthContext();

  const [opened, setOpened] = useState(false);

  const handleSubscribBtn = async () => {
    if (!user) {
      alert("Vui lòng đăng nhập để đăng ký");
      return;
    }
    await request
      .post(
        "/client/subscribe",
        {
          userId: user?._id,
          channelId: channelId,
        },
        {
          headers: {
            Authorization: `${import.meta.env.VITE_AUTH_BEARER} ${getCookie(
              import.meta.env.VITE_AUTH_TOKEN
            )}`,
          },
        }
      )
      .then(() => {
        refetch();
        setRefetch(true);
      })
      .catch((err) => console.log(err));
  };

  const handleChangeNotify = async (notiCode, currNotiCode) => {
    if (currNotiCode === notiCode) {
      return;
    }
    await request
      .patch(
        `/client/subscribe/${id}`,
        { notify: notiCode },
        {
          headers: {
            Authorization: `${import.meta.env.VITE_AUTH_BEARER} ${getCookie(
              import.meta.env.VITE_AUTH_TOKEN
            )}`,
          },
        }
      )
      .then(() => refetch())
      .catch((err) => console.log(err));
  };

  const handleOpenedBox = () => {
    setOpened((prev) => !prev);
  };

  const funcList2 = [
    {
      id: 1,
      text: "Tất cả",
      icon: <ThickBellIcon />,
      handleOnClick: () => {
        handleChangeNotify(2);
      },
    },
    {
      id: 2,
      text: "Dành riêng cho bạn",
      icon: <BellIcon />,
      handleOnClick: 1,
    },
    {
      id: 3,
      text: "Không nhận thông báo",
      icon: <SlashBellIcon />,
      handleOnClick: () => {
        handleChangeNotify(1);
      },
    },
    {
      id: 4,
      text: "Hủy đăng ký",
      icon: <UnSubIcon />,
      handleOnClick: handleSubscribBtn,
    },
  ];

  return (
    <button
      className={`px-[16px] rounded-[18px] flex items-center relative
        ${
          sub
            ? "bg-hover-black hover:bg-[rgba(255,255,255,0.2)]"
            : "bg-[#ffffff] text-black"
        }
        `}
      onClick={() => {
        if (!sub) {
          handleSubscribBtn();
        } else {
          handleOpenedBox();
        }
      }}
    >
      {sub && (
        <div className='ml-[-6px] mr-[6px]'>
          <BellIcon />
        </div>
      )}
      <span className='text-[14px] leading-[36px] font-[500] text-nowrap'>
        {sub ? "Đã Đăng ký" : "Đăng ký"}
      </span>
      {sub && (
        <div className='rotate-90 ml-[6px] mr-[-6px]'>
          <ThinArrowIcon />
        </div>
      )}
      {opened && (
        <CustomeFuncBox
          style={"right-0 top-[101%]"}
          setOpened={setOpened}
          funcList1={funcList2}
          currentId={notify === 1 ? 3 : 1}
        />
      )}
    </button>
  );
};
export default SubscribeBtn;

{
  /* <button
className={`px-[16px] rounded-[18px] flex items-center
${
sub
  ? "bg-hover-black hover:bg-[rgba(255,255,255,0.2)]"
  : "bg-[#ffffff] text-black"
}
`}
onClick={handleSubscribBtn}
>
{sub && (
  <div className='ml-[-6px] mr-[6px]'>
    <BellIcon />
  </div>
)}
<span className='text-[14px] leading-[36px] font-[500]'>
  {sub ? "Đã Đăng ký" : "Đăng ký"}
</span>
{sub && (
  <div className='rotate-90 ml-[6px] mr-[-6px]'>
    <ThinArrowIcon />
  </div>
)}
</button> */
}
