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
  
  const { user, addToaster } = useAuthContext();

  const [opened, setOpened] = useState(false);

  const [triggerAnimation, setTriggerAnimation] = useState(false);

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
      })
      .catch((err) => {
        console.error(err);
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
      .delete(`/user/subscription/${channelId}`)
      .then((rsp) => {
        refetch(rsp.data);
        setTriggerAnimation(true);
        setTimeout(() => {
          setTriggerAnimation(false);
        }, 1500);
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
      className={`min-w-fit w-full h-[40px] relative`}
      onClick={handleOnClick}
    >
      {sub ? (
        <div
          className={`${
            triggerAnimation ? "animate-subBtnChangeBgColor" : ""
          } bg-black-0.1  
         hover:bg-black-0.2 px-[16px] rounded-[18px]  flex items-center justify-center`}
        >
          <div
            className={`shrink-0 ml-[-6px] mr-[6px]  origin-[top_center]
            ${triggerAnimation ? "animate-subBellRing" : ""}`}
          >
            {notify === 1 ? <BellIcon /> : notify === 2 && <SlashBellIcon />}
          </div>
          <div
            className={`line-clamp-1 h-[36px]     ${
              triggerAnimation ? "856:animate-subTextSlideIn" : ""
            }`}
          >
            <span className='text-[14px] leading-[36px] font-[500] text-nowrap text-white-F1'>
              Subscribed
            </span>
          </div>
          <div className='rotate-90 ml-[6px] mr-[-6px] shrink-0'>
            <ThinArrowIcon />
          </div>
        </div>
      ) : (
        <div className='bg-[#ffffff] text-black px-[16px] rounded-[18px] '>
          <div className=' line-clamp-1 h-[36px]'>
            <span className='text-[14px] leading-[36px] font-[500] text-nowrap '>
              Subscribe
            </span>
          </div>
        </div>
      )}
      <div className='text-white-F1'>
        {opened && (
          <CustomeFuncBox
            style={"left-0 top-[101%]"}
            setOpened={setOpened}
            funcList1={funcList2}
            currentId={notify}
          />
        )}
      </div>
    </button>
  );
};
export default SubscribeBtn;
