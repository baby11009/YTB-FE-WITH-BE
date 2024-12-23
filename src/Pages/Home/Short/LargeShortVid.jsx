import {
  LikeIcon,
  DisLikeIcon,
  CommentIcon,
  ThickShareIcon,
  Setting2Icon,
  LoadShortImgIcon,
  PlayIcon,
  ThickAudioIcon,
  StopIcon,
  DescriptionIcon,
  SubtitlesIcon,
  AddPLIcon,
  NoSuggetIcon,
  DiaryIcon,
  FeedBackIcon,
  MuteAudiIcon,
} from "../../../Assets/Icons";

import {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import { useAnimate, AnimatePresence, motion } from "framer-motion";
import { formatNumber } from "../../../util/numberFormat";
import { useAuthContext } from "../../../Auth Provider/authContext";
import { CustomeFuncBox } from "../../../Component";
import request from "../../../util/axios-base-url";
import CommentBox from "./CommentBox";
import { useQueryClient } from "@tanstack/react-query";

// const ConfirmUnsubscribe = ({
//   handleSubscribe,
//   channelEmail,
//   handleCancel,
// }) => {
//   return (
//     <div className=' max-w-[688px] bg-black-21 rounded-[10px]'>
//       <div className='mt-[24px]'>
//         <div className='px-[24px] mt-[4px] mb-[24px] text-nowrap'>
//           Unsubscribe from {channelEmail} ?
//         </div>
//         <div className='flex justify-end items-center py-[8px]'>
//           <button
//             onClick={() => {
//               handleCancel();
//             }}
//             className='px-[16px] leading-[36px] text-[14px] font-[500] rounded-[18px] hover:bg-black-0.1'
//           >
//             Cancel
//           </button>
//           <button
//             onClick={async () => {
//               await handleSubscribe();
//               handleCancel();
//             }}
//             className='px-[16px] leading-[36px] text-[14px] font-[500] rounded-[18px] text-blue-3E hover:bg-[#263850'
//           >
//             Unsubscribe
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const CustomeButton = ({
//   Icon,
//   text,
//   title,
//   handleOnClick,
//   showedCmt,
//   buttonCss,
//   iconCss,
// }) => {
//   return (
//     <div className='flex flex-col items-center w-[48px] '>
//       <button
//         className={`w-[48px] h-[48px] rounded-[50%] flex items-center justify-center
//           ${
//             buttonCss
//               ? buttonCss
//               : showedCmt
//               ? "bg-[rgba(0,0,0,0.4)] hover:bg-[rgba(40,40,40,0.6)]"
//               : "bg-hover-black hover:bg-[rgba(255,255,255,0.2)]"
//           }
//           `}
//         title={title}
//         onClick={() => {
//           if (handleOnClick) {
//             handleOnClick();
//           }
//         }}
//       >
//         <div className={`${iconCss ? iconCss : ""}`}>
//           <Icon />
//         </div>
//       </button>
//       {text && (
//         <span className='mt-[4px] text-[14px] leading-[20px] cursor-default overflow-hidden t-1-ellipsis'>
//           {text}
//         </span>
//       )}
//     </div>
//   );
// };

// const funcList = [
//   {
//     id: 1,
//     text: "Thông tin mô tả",
//     icon: <DescriptionIcon />,
//   },
//   {
//     id: 2,
//     text: "Lưu vào danh sách phát",
//     icon: <AddPLIcon />,
//   },
//   {
//     id: 3,
//     text: "Phụ đề",
//     icon: <SubtitlesIcon />,
//   },
//   {
//     id: 4,
//     text: "Không đề xuất kênh này",
//     icon: <NoSuggetIcon />,
//   },
//   {
//     id: 5,
//     text: "Báo cáo vi phạm",
//     icon: <DiaryIcon />,
//   },
//   {
//     id: 6,
//     text: "Gửi ý kiến phản hồi",
//     icon: <FeedBackIcon />,
//   },
// ];

// const LargeShortVid = ({ shortId, socket }) => {
//   const queryClient = useQueryClient();

//   const { setIsShowing, user } = useAuthContext();

//   const [firstTimeRender, setFirstTimeRender] = useState(true);

//   const [moveBtn, setMoveBtn] = useState(false);

//   const [audioValue, setAudioValue] = useState(100);

//   const [videoProgress, setVideoProgress] = useState(0);

//   const [hoverAudio, setHoverAudio] = useState(false);

//   const [showedCmt, setShowedCmt] = useState(false);

//   const [showContent, setShowContent] = useState(false);

//   const [opened, setOpened] = useState(false);

//   const [clicked, setClicked] = useState({
//     state: false,
//     type: "pause",
//   });

//   const [scope, animate] = useAnimate();

//   const elementRef = useRef(null);

//   const containRef = useRef();

//   const videoRef = useRef();

//   const timeOutRef = useRef();

//   const [shortDetails, setShortDetails] = useState(undefined);

//   const [refetch, setRefetch] = useState(true);

//   const handleClick = () => {
//     setClicked((prev) => {
//       return {
//         state: !prev.state,
//         type: prev.type === "play" ? "stop" : "play",
//       };
//     });
//     setTimeout(() => {
//       setClicked((prev) => {
//         return {
//           ...prev,
//           state: !prev.state,
//         };
//       });
//     }, 400);
//   };

//   const handleSubscribe = async () => {
//     if (!user) {
//       alert(
//         `Please login to subscribe to ${shortDetails?.channel_info?.email}`,
//       );
//       return;
//     }
//     await request
//       .post("/client/subscribe", {
//         userId: user?._id,
//         channelId: shortDetails?.channel_info?._id,
//       })
//       .then(() => {
//         setRefetch(true);
//       })
//       .catch((err) => console.log(err));
//   };

//   const handleToggleReact = async (type) => {
//     await request
//       .post("/client/react", { videoId: shortId, type: type })
//       .then(() => {
//         setRefetch(true);
//       });
//   };

//   const handleToggleCmt = () => {
//     if (timeOutRef.current) {
//       clearTimeout(timeOutRef.current);
//     }
//     if (showedCmt) {
//       setShowContent(false);
//       setTimeout(() => {
//         setShowedCmt(false);
//       }, 20);
//       timeOutRef.current = setTimeout(() => {
//         setMoveBtn(false);
//       }, 310);
//     } else {
//       setShowedCmt(true);
//       timeOutRef.current = setTimeout(() => {
//         setMoveBtn(true);
//         setShowContent(true);
//       }, 310);
//     }
//   };

//   const fetchData = async () => {
//     await request
//       .get(`/data/video/${shortId}`)
//       .then(({ data }) => {
//         if (!shortDetails) {
//           setShortDetails(data?.data);
//         } else {
//           setShortDetails((prev) => {
//             const datakeys = Object.keys(data?.data);
//             const finalData = { ...prev };
//             datakeys.forEach((key) => {
//               if (
//                 prev[key] !== data?.data[key] ||
//                 typeof prev[key] === "object" ||
//                 Array.isArray(prev[key])
//               ) {
//                 finalData[key] = data?.data[key];
//               }
//             });

//             return finalData;
//           });
//         }
//       })
//       .catch((err) => {
//         alert(err.response.data.msg);
//         console.error(err);
//       })
//       .finally(() => {
//         setRefetch(false);
//       });
//   };

//   useLayoutEffect(() => {
//     if (refetch) {
//       fetchData();
//     }
//   }, [refetch]);

//   useEffect(() => {
//     if (scope.current) {
//       if (hoverAudio) {
//         animate(
//           scope.current,
//           {
//             width: "180px",
//             backgroundColor: "rgba(40,40,40,0.6)",
//           },
//           {
//             type: "tween",
//             duration: 0.3,
//           },
//         );
//       } else {
//         animate(
//           scope.current,
//           {
//             width: "48px",
//             backgroundColor: "rgba(0,0,0,0.4)",
//           },
//           {
//             type: "tween",
//             duration: 0.3,
//           },
//         );
//       }
//     }
//   }, [hoverAudio]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (containRef.current && !containRef.current.contains(event.target)) {
//         setOpened("");
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);

//     const handleUpdateTime = () => {
//       const percent =
//         (videoRef.current.currentTime / videoRef.current.duration) * 100;
//       setVideoProgress(percent);
//     };
//     if (videoRef.current) {
//       videoRef.current.addEventListener("timeupdate", () => {
//         handleUpdateTime();
//       });
//     }

//     const checkVisibility = () => {
//       if (elementRef.current) {
//         const rect = elementRef.current.getBoundingClientRect();
//         const windowHeight =
//           window.innerHeight || document.documentElement.clientHeight;

//         // Check if at least 70% of the element is within the viewport
//         const isInView =
//           rect.bottom >= windowHeight * 0.9 && rect.bottom < windowHeight;

//         if (!isInView) {
//           setClicked({ state: false, type: "stop" });
//         }
//       }
//     };

//     window.addEventListener("scroll", checkVisibility);
//     window.addEventListener("resize", checkVisibility);

//     // Initial visibility check
//     checkVisibility();

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//       if (videoRef.current) {
//         videoRef.current.removeEventListener("timeupdate", () => {
//           handleUpdateTime();
//         });
//       }
//       window.removeEventListener("scroll", checkVisibility);
//       window.removeEventListener("resize", checkVisibility);
//     };
//   }, []);

//   useEffect(() => {
//     if (firstTimeRender) {
//       setFirstTimeRender(false);
//     }
//   }, [firstTimeRender]);

//   useEffect(() => {
//     if (videoRef.current) {
//       if (clicked.type === "play") {
//         videoRef.current.play();
//       } else {
//         videoRef.current.pause();
//       }
//     }
//   }, [clicked]);

//   useEffect(() => {
//     if (videoRef.current) {
//       videoRef.current.volume = audioValue / 100;
//     }
//   }, [audioValue]);

//   useEffect(() => {
//     if (videoRef.current && videoRef.current.duration) {
//       videoRef.current.currentTime =
//         (videoProgress / 100) * videoRef.current.duration;
//     }
//   }, [videoProgress]);

//   return (
//     <div className='flex cursor-pointer relative mb-[16px]' ref={elementRef}>
//       <div className='relative'>
//         <div
//           className={` relative overflow-hidden bg-[rgb(0,0,0)] group ${
//             showedCmt ? "rounded-l-[12px]" : "rounded-[12px]"
//           } `}
//           onClick={handleClick}
//         >
//           <video
//             className='w-[20vw] min-w-[331px] min-h-[616px] h-screen-h-minus-128'
//             src={`${import.meta.env.VITE_BASE_API_URI}${
//               import.meta.env.VITE_VIEW_VIDEO_API
//             }${shortDetails?.video}?type=video`}
//             ref={videoRef}
//           ></video>

//           <div className='absolute top-0 left-0 pt-[16px] pb-[32px] px-[16px] w-full group-hover:flex hidden items-center gap-[16px]'>
//             <div className=' bg-[rgba(0,0,0,0.4)] hover:bg-[rgba(40,40,40,0.6)] rounded-[50%]'>
//               <button
//                 className='w-[48px] h-[48px] flex items-center justify-center'
//                 title='Play'
//               >
//                 <div className='w-[24px]'>
//                   {clicked.type === "play" ? <StopIcon /> : <PlayIcon />}
//                 </div>
//               </button>
//             </div>
//             <div
//               className='flex items-center bg-[rgba(0,0,0,0.4)] rounded-[30px] w-[48px]'
//               onMouseOver={() => setHoverAudio(true)}
//               onMouseOut={() => setHoverAudio(false)}
//               ref={scope}
//             >
//               <button
//                 className='!w-[48px] h-[48px] flex items-center justify-center'
//                 title='Audio'
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setAudioValue((prev) => {
//                     if (prev === 0) {
//                       return 100;
//                     }
//                     return 0;
//                   });
//                 }}
//               >
//                 <div className='w-[24px]'>
//                   {audioValue === 0 ? <MuteAudiIcon /> : <ThickAudioIcon />}
//                 </div>
//               </button>
//               <AnimatePresence>
//                 {hoverAudio && (
//                   <motion.div
//                     className='flex items-center relative'
//                     initial={{
//                       width: 0,
//                     }}
//                     animate={{
//                       width: "calc(100% - 48px)",
//                       opacity: 1,
//                     }}
//                     exit={{
//                       width: 0,
//                       opacity: 0,
//                     }}
//                     transition={{
//                       type: "tween",
//                       duration: 0.3,
//                     }}
//                   >
//                     <input
//                       type='range'
//                       max={100}
//                       min={0}
//                       step={1}
//                       className='cursor-pointer cs-range'
//                       value={audioValue}
//                       onChange={(e) => setAudioValue(Number(e.target.value))}
//                       onClick={(e) => e.stopPropagation()}
//                     />
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           </div>

//           <AnimatePresence>
//             {clicked.state && (
//               <motion.div
//                 className='absolute w-[60px] h-[60px] bg-[rgba(0,0,0,0.5)] rounded-[50%] top-[45%] left-[44%]
//             flex items-center justify-center'
//                 animate={{
//                   scale: 1.4,
//                   opacity: 1,
//                 }}
//                 exit={{
//                   opacity: 0,
//                 }}
//                 transition={{
//                   duration: 0.4,
//                   type: "tween",
//                 }}
//               >
//                 <div className='w-[24px]'>
//                   {clicked.type === "play" ? <StopIcon /> : <PlayIcon />}
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//         <div
//           className={`pb-[24px] pl-[16px] ${
//             moveBtn ? "pr-[60px]" : "pr-[16px]"
//           } absolute bottom-0 left-0 w-full text-white`}
//         >
//           <div className='flex items-center gap-[6px] bg- '>
//             <img
//               src={`${import.meta.env.VITE_BASE_API_URI}${
//                 import.meta.env.VITE_VIEW_AVA_API
//               }${shortDetails?.channel_info?.avatar}`}
//               alt=''
//               className='w-[36px] h-[36px] rounded-[50%] bg-[#ccc]'
//             />
//             <span className='text-[14px] leading-[20px] '>
//               {shortDetails?.channel_info?.email}
//             </span>
//             {shortDetails?.subscription_info ? (
//               <button
//                 className=' hover:bg-[rgba(255,255,255,0.2)]
//                bg-hover-black text-[12px] leading-[32px] font-[550] px-[12px] rounded-[16px]'
//                 onClick={() => {
//                   setIsShowing(
//                     <ConfirmUnsubscribe
//                       handleSubscribe={handleSubscribe}
//                       channelEmail={shortDetails?.channel_info?.email}
//                       handleCancel={() => {
//                         setIsShowing(undefined);
//                       }}
//                     />,
//                   );
//                 }}
//               >
//                 <span>Subscribed</span>
//               </button>
//             ) : (
//               <button
//                 className=' hover:bg-[#e6e6e6] text-black
//                bg-white text-[12px] leading-[32px] font-[550] px-[12px] rounded-[16px]'
//                 onClick={async () => {
//                   await handleSubscribe();
//                 }}
//               >
//                 <span>Subscribe</span>
//               </button>
//             )}
//           </div>
//           <div className='py-[4px]'>
//             <h3 className='text-[14px] leading-[20px]'>
//               {shortDetails?.title}
//             </h3>
//           </div>
//         </div>
//         <div className='px-[12px] absolute bottom-0 w-full '>
//           <input
//             type='range'
//             className='video-range'
//             max={100}
//             min={0}
//             step={1}
//             onChange={(e) => {
//               setVideoProgress(Number(e.target.value));
//             }}
//             value={videoProgress}
//           />
//         </div>
//       </div>

//       <div
//         className={`h-screen-h-minus-128 min-h-[616px] px-[12px]
//         flex flex-col items-center justify-end gap-[16px]
//         ${moveBtn && "absolute left-[42%] translate-x-[-100%] pb-[24px]"}
//         ${showedCmt && !moveBtn && "!hidden"}
//         ${!showedCmt && moveBtn && "!hidden"}
//         `}
//       >
//         <CustomeButton
//           text={formatNumber(shortDetails?.like)}
//           Icon={LikeIcon}
//           title='Tôi thích video này'
//           showedCmt={showedCmt}
//           buttonCss={
//             shortDetails?.react_info?.type === "like"
//               ? "bg-white-F1 hover:bg-white-D9"
//               : undefined
//           }
//           iconCss={
//             shortDetails?.react_info?.type === "like" ? "text-black" : undefined
//           }
//           handleOnClick={() => {
//             handleToggleReact("like");
//           }}
//         />
//         <CustomeButton
//           text={formatNumber(shortDetails?.dislike)}
//           Icon={DisLikeIcon}
//           title='Tôi không thích video này'
//           showedCmt={showedCmt}
//           buttonCss={
//             shortDetails?.react_info?.type === "dislike"
//               ? "bg-white-F1 hover:bg-white-D9"
//               : undefined
//           }
//           iconCss={
//             shortDetails?.react_info?.type === "dislike"
//               ? "text-black"
//               : undefined
//           }
//           handleOnClick={() => {
//             handleToggleReact("dislike");
//           }}
//         />
//         <CustomeButton
//           text={formatNumber(shortDetails?.totalCmt)}
//           Icon={CommentIcon}
//           title={"Bình luận"}
//           handleOnClick={handleToggleCmt}
//           showedCmt={showedCmt}
//         />
//         <CustomeButton
//           text='Chia sẻ'
//           Icon={ThickShareIcon}
//           title={"Chia sẻ"}
//           showedCmt={showedCmt}
//         />
//         <div className='relative' ref={containRef}>
//           <CustomeButton
//             Icon={Setting2Icon}
//             showedCmt={showedCmt}
//             handleOnClick={() => {
//               setOpened((prev) => !prev);
//             }}
//           />
//           {opened && (
//             <CustomeFuncBox
//               style={"w-[241px] left-0 bottom-[100%]"}
//               setOpened={setOpened}
//               funcList1={funcList}
//             />
//           )}
//         </div>
//         <div className='w-[40px] h-[40px] border-[1px] border-white rounded-[6px] flex items-center justify-center'>
//           <LoadShortImgIcon />
//         </div>
//       </div>
//       <AnimatePresence>
//         {showedCmt && (
//           <CommentBox
//             handleCloseCmt={() => {
//               handleToggleCmt();
//             }}
//             showedContent={showContent}
//             shortId={shortId}
//             handleRefetch={() => {
//               setRefetch(true);
//             }}
//             totalCmt={formatNumber(shortDetails?.totalCmt)}
//             socket={socket}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

const LargeShortVid = ({ shortId, socket }) => {
  const videoRef = useRef();

  const [shortDetails, setShortDetails] = useState(undefined);

  const [refetch, setRefetch] = useState(true);

  const fetchData = async () => {
    await request
      .get(`/data/video/${shortId}`)
      .then(({ data }) => {
        if (!shortDetails) {
          setShortDetails(data?.data);
        } else {
          setShortDetails((prev) => {
            const datakeys = Object.keys(data?.data);
            const finalData = { ...prev };
            datakeys.forEach((key) => {
              if (
                prev[key] !== data?.data[key] ||
                typeof prev[key] === "object" ||
                Array.isArray(prev[key])
              ) {
                finalData[key] = data?.data[key];
              }
            });

            return finalData;
          });
        }
      })
      .catch((err) => {
        alert(err.response.data.msg);
        console.error(err);
      })
      .finally(() => {
        setRefetch(false);
      });
  };

  useLayoutEffect(() => {
    if (refetch) {
      fetchData();
    }
  }, [refetch]);

  return (
    <div className='flex'>
      <video
        controls={true}
        className='w-[20vw] min-w-[331px] min-h-[616px] h-screen-h-minus-128'
        src={`${import.meta.env.VITE_BASE_API_URI}${
          import.meta.env.VITE_VIEW_VIDEO_API
        }${shortDetails?.video}?type=video`}
        ref={videoRef}
      ></video>
      //{" "}
      <CommentBox
        handleCloseCmt={() => {
          213;
        }}
        showedContent={true}
        shortId={shortId}
        handleRefetch={() => {
          12312
        }}
        totalCmt={formatNumber(shortDetails?.totalCmt)}
        socket={socket}
      />
    </div>
  );
};
export default LargeShortVid;
