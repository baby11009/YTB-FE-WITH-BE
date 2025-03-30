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

const SubscribeBtn = ({ sub, notify, id, channelId, refetch }) => {
  const { user, setRefetch, addToaster } = useAuthContext();

  const [opened, setOpened] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!user) {
      alert("Please sign in to start subscription");
      return;
    }

    setIsLoading(true);
    await request
      .post("/user/subscription", {
        channelId: channelId,
      })
      .then((rsp) => {
        refetch(rsp.data);

        setRefetch(true);
      })
      .catch((err) => {
        console.log(err);
        addToaster("Failed to subscribe to channel");
      })
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
      .patch(`/user/subscription/${id}`, { notify: notiCode })
      .then((rsp) => refetch(rsp.data))
      .catch((err) => {
        console.log(err);
        addToaster("Failed to modify subscription");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleUnsubscribe = async () => {
    if (!user) {
      alert("Please sign in to start subscription");
      return;
    }

    setIsLoading(true);
    await request
      .delete(`/user/subscription/${channelId}`, {
        channelId: channelId,
      })
      .then((rsp) => {
        refetch(rsp.data);
        setRefetch(true);
      })
      .catch((err) => {
        console.log(err);
        addToaster("Failed to unsubscribe channel");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleOnClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!sub) {
      handleSubscribe();
    } else {
      setOpened((prev) => !prev);
    }
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
      handleOnClick: handleUnsubscribe,
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
      className={`min-w-fit w-full px-[16px] rounded-[18px] flex items-center justify-center relative
        ${
          sub
            ? "bg-hover-black hover:bg-[rgba(255,255,255,0.2)]"
            : "bg-[#ffffff] text-black"
        }
        `}
      onClick={handleOnClick}
    >
      <div className=' shrink-0'>
        {notify === 1 ? <BellIcon /> : notify === 2 && <SlashBellIcon />}
      </div>

      <div className="flex-1 line-clamp-1">
      <span className='text-[14px] leading-[36px] font-[500] text-nowrap'>
        {sub ? "Subscribed" : "Subscribe"}
      </span>
      </div>
      {sub && (
        <div className='rotate-90 ml-[6px] mr-[-6px] shrink-0'>
          <ThinArrowIcon />
        </div>
      )}
      {opened && (
        <CustomeFuncBox
          style={"left-0 top-[101%]"}
          setOpened={setOpened}
          funcList1={funcList2}
          currentId={notify}
        />
      )}
    </button>
  );
};
export default SubscribeBtn;
