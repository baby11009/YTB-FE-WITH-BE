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
import { useState, useEffect, useRef } from "react";
import { getCookie } from "../../util/tokenHelpers";

const SubscribeBtn = ({ sub, notify, id, channelId, refetch }) => {
  const { user, setRefetch } = useAuthContext();

  const [opened, setOpened] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribBtn = async () => {
    if (!user) {
      alert("Vui lòng đăng nhập để đăng ký");
      return;
    }
    setIsLoading(true);
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
              import.meta.env.VITE_AUTH_TOKEN,
            )}`,
          },
        },
      )
      .then((rsp) => {
        refetch(rsp.data);

        setRefetch(true);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleChangeNotify = async (notiCode, currNotiCode) => {
    if (currNotiCode === notiCode) {
      return;
    }
    setIsLoading(true);
    await request
      .patch(
        `/client/subscribe/${id}`,
        { notify: notiCode },
        {
          headers: {
            Authorization: `${import.meta.env.VITE_AUTH_BEARER} ${getCookie(
              import.meta.env.VITE_AUTH_TOKEN,
            )}`,
          },
        },
      )
      .then((rsp) => refetch(rsp.data))
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleOpenedBox = () => {
    setOpened((prev) => !prev);
  };

  const funcList2 = [
    {
      id: 1,
      text: "All",
      icon: <ThickBellIcon />,
      handleOnClick: () => {
        handleChangeNotify(1);
      },
    },
    {
      id: 2,
      text: "None",
      icon: <SlashBellIcon />,
      handleOnClick: () => {
        handleChangeNotify(2);
      },
    },
    {
      id: 3,
      text: "Unsubscribe",
      icon: <UnSubIcon />,
      handleOnClick: handleSubscribBtn,
    },
  ];

  const containerRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpened(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (user?._id === channelId) {
    return <></>;
  }

  return (
    <button
      disabled={isLoading}
      ref={containerRef}
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
      {notify === 1 ? <BellIcon /> : notify === 2 && <SlashBellIcon />}

      <span className='text-[14px] leading-[36px] font-[500] text-nowrap'>
        {sub ? "Subscribed" : "Subscribe"}
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
          currentId={notify}
        />
      )}
    </button>
  );
};
export default SubscribeBtn;
