import {
  CloseIcon,
  MailIcon,
  InternetIcon,
  InformationIcon,
  SubscribersIcon,
  MyVideoIcon,
  GrowthIcon,
  ShareIcon,
  DiaryIcon,
  FacebookIcon,
  XIcon,
  EmailIcon,
  WhatsAppIcon,
  KakaoTalkIcon,
  RedditIcon,
  LinkedInIcon,
  PinterestIcon,
  TumblrIcon,
  OKIcon,
  VKIcon,
  MixIcon,
} from "../../../../Assets/Icons";
import { timeFormat4 } from "../../../../util/timeforMat";
import { formatNumber, formatNumber2 } from "../../../../util/numberFormat";
import { useState, useRef } from "react";
import { useAuthContext } from "../../../../Auth Provider/authContext";
import { Slider } from "../../../../Component";

const ShareBox = ({ data, handleCloseShareBox }) => {
  const { addToaster } = useAuthContext();

  const shareList = useRef([
    {
      title: "Facebook",
      icon: <FacebookIcon />,
      handleOnClick: () => {
        const url = encodeURIComponent(
          `http://localhost:5173/channel/${data.email}`,
        );

        window.open(
          `https://www.facebook.com/share_channel/?type=reshare&link=${url}&app_id=87741124305&source_surface=external_reshare&display=popup&hashtag=${encodeURIComponent(
            "#" + data.email,
          )}`,
          "_blank",
        );
      },
    },
    {
      title: "X",
      icon: <XIcon />,
      handleOnClick: () => {
        const url = encodeURIComponent(
          `http://localhost:5173/channel/${data.email}`,
        );

        window.open(
          `https://x.com/intent/post?url=${url}&text=${encodeURIComponent(
            data.name,
          )}&via=YouTube`,
          "_blank",
        );
      },
    },
    {
      title: "Email",
      icon: <EmailIcon />,
      handleOnClick: () => {
        const subject = encodeURIComponent(`Sharing ${data.name} channel`);
        const body = encodeURIComponent(
          `http://localhost:5173/channel/${data.email}`,
        );
        window.open(
          `https://mail.google.com/mail/?view=cm&fs=1&tf=1&su=${subject}&body=${body}`,
          "_blank",
        );
      },
    },
    {
      title: "WhatsApp",
      icon: <WhatsAppIcon />,
      handleOnClick: () => {
        const url = encodeURIComponent(
          `http://localhost:5173/channel/${data.email}`,
        );

        window.open(
          `https://api.whatsapp.com/send/?text=${url}&type=custom_url&app_absent=0`,
          "_blank",
        );
      },
    },
    {
      title: "KakaoTalk",
      icon: <KakaoTalkIcon />,
      handleOnClick: () => {},
    },
    {
      title: "Reddit",
      icon: <RedditIcon />,
      handleOnClick: () => {
        const url = encodeURIComponent(
          `http://localhost:5173/channel/${data.email}`,
        );

        const title = encodeURIComponent(`Sharing ${data.name} channel`);

        window.open(
          `https://www.reddit.com/submit?url=${url}&title=${title}`,
          "_blank",
        );
      },
    },
    {
      title: "LinkedIn",
      icon: <LinkedInIcon />,
      handleOnClick: () => {
        const url = encodeURIComponent(
          `http://localhost:5173/channel/${data.email}`,
        );

        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
          "_blank",
        );
      },
    },
    { title: "Pinterest", icon: <PinterestIcon />, handleOnClick: () => {} },
    { title: "Tumblr", icon: <TumblrIcon />, handleOnClick: () => {} },
    {
      title: "OK",
      icon: <OKIcon />,
      handleOnClick: () => {},
    },
    { title: "VK", icon: <VKIcon />, handleOnClick: () => {} },
    { title: "Mix", icon: <MixIcon />, handleOnClick: () => {} },
  ]);
  return (
    <div
      className='fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center'
      onClick={handleCloseShareBox}
    >
      <div
        className=' w-[80vw] md:w-[60vw] lg:w-[46vw]  xl:w-[37vw] rounded-[12px] bg-black-21 '
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className='my-[24px] px-[24px]'>
          <div className='mb-[8px] flex items-center justify-between'>
            <h3 className='text-[16px] leading-[22px]'>Share</h3>
            <button onClick={handleCloseShareBox}>
              <div className='w-[24px]'>
                <CloseIcon />
              </div>
            </button>
          </div>

          {/* Share Button */}
          <Slider dragScroll={true} buttonPosition={37}>
            <div className='flex'>
              {shareList.current.map((share, index) => (
                <button
                  key={share.title}
                  className={`${
                    index === shareList.current.length - 1 ? "" : "mr-[8px]"
                  }`}
                  onClick={share.handleOnClick}
                >
                  <div className='my-[1px] p-[5px_1px_2px]'>
                    <div
                      className='w-[60px] mx-[4px] mb-[8px]'
                      title={share.title}
                    >
                      {share.icon}
                    </div>
                  </div>
                  <div className='text-[12px] leading-[18px] text-white-F1 text-center'>
                    {share.title}
                  </div>
                </button>
              ))}
            </div>
          </Slider>

          {/* Copy link */}
          <div className='mt-[24px]'>
            <div
              className='h-[36px] py-[8px] box-content border-[1px] border-black-0.2 bg-black rounded-[12px]
             flex items-center justify-between  overflow-hidden'
            >
              <input
                type='text'
                readOnly
                value={`http://localhost:5173/channel/${data.email}`}
                className='bg-transparent ml-[16px] p-[2px_1px] min-w-0 grow-[1] '
              />
              <div className='px-[8px]'>
                <button
                  className='px-[16px] bg-blue-3E hover:bg-[#65b8ff] rounded-[18px] 
                leading-[36px] text-black font-[500]'
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `http://localhost:5173/channel/${data.email}`,
                    );
                    addToaster("Link copied to clipboard");
                  }}
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InformationBox = ({ data, handleCloseBox }) => {
  const [openedShareBox, setOpenedShareBox] = useState(false);

  const sendEmail = () => {
    const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      data.email,
    )}`;
    window.open(gmailURL, "_blank");
  };

  return (
    <div
      className='bg-black-21 mx-[40px] my-[24px] 
      w-[80vw] md:w-[60vw] lg:w-[46vw] h-[80vh] xl:w-[37vw] rounded-[12px] overflow-auto scrollbar-3'
    >
      <div className='min-w-[450px] relative'>
        <div className='sticky top-[8px] p-[8px_8px_0px]  '>
          <div className='w-full pl-[16px] py-[4px] pr-[2px] flex items-center justify-between'>
            <h2 className='text-[20px] leading-[28px] font-bold m-[10px_8px_10px_0px]'>
              About
            </h2>
            <button
              className='size-[40px] p-[8px] rounded-[50%] hover:bg-black-0.2'
              onClick={handleCloseBox}
            >
              <div className='size-[24px]'>
                <CloseIcon />
              </div>
            </button>
          </div>
        </div>
        <div className='p-[0px_24px_24px] text-[14px] leading-[20px]'>
          <span>{data.description}</span>
          <div>
            <div className='mt-[16px] mb-[8px] text-[20px] leading-[28px] font-bold'>
              Links
            </div>
            <div></div>
          </div>
          <div>
            <div className='mt-[16px] mb-[8px] text-[20px] leading-[28px] font-bold'>
              Channel details
            </div>
            <ul>
              <li
                className='h-[40px] flex items-center cursor-pointer'
                onClick={sendEmail}
              >
                <div className='w-[36px]'>
                  <div className='size-[24px]'>
                    <MailIcon />
                  </div>
                </div>
                <span>{data.email}</span>
              </li>
              <li className='h-[40px] flex items-center'>
                <div className='w-[36px]'>
                  <div className='size-[24px]'>
                    <InternetIcon />
                  </div>
                </div>
                <a
                  href={`http://localhost:5173/channel/${data.email}`}
                >{`http://localhost:5173/channel/${data.email}`}</a>
              </li>
              <li className='h-[40px] flex items-center'>
                <div className='w-[36px]'>
                  <div className='size-[24px]'>
                    <InformationIcon />
                  </div>
                </div>
                <span>Joined {timeFormat4(data.createdAt)}</span>
              </li>
              <li className='h-[40px] flex items-center'>
                <div className='w-[36px]'>
                  <div className='size-[24px]'>
                    <SubscribersIcon />
                  </div>
                </div>
                <span>{formatNumber(data.subscriber)} subscribers</span>
              </li>
              <li className='h-[40px] flex items-center'>
                <div className='w-[36px]'>
                  <div className='size-[24px]'>
                    <MyVideoIcon />
                  </div>
                </div>
                <span>{data.totalVids} videos</span>
              </li>
              <li className='h-[40px] flex items-center'>
                <div className='w-[36px]'>
                  <div className='size-[24px]'>
                    <GrowthIcon />
                  </div>
                </div>
                <span>{data.views || formatNumber2(1000000000)} views</span>
              </li>
            </ul>
          </div>
          <div className='mt-[12px]'>
            <button
              className='h-[36px] rounded-[18px] px-[16px] bg-black-0.1 hover:bg-black-0.2 mr-[12px]'
              onClick={() => {
                setOpenedShareBox(true);
              }}
            >
              <span className='w-[24px] ml-[-6px] mr-[6px]'>
                <ShareIcon />
              </span>
              <span className='text-[14px] leading-[36px] font-[500]'>
                Share channel
              </span>
            </button>
            <button className='h-[36px] rounded-[18px] px-[16px] bg-black-0.1 hover:bg-black-0.2'>
              <span className='w-[24px] ml-[-6px] mr-[6px]'>
                <DiaryIcon />
              </span>
              <span className='text-[14px] leading-[36px] font-[500]'>
                Report user
              </span>
            </button>
          </div>
          {openedShareBox && (
            <ShareBox
              data={data}
              handleCloseShareBox={() => {
                setOpenedShareBox(false);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default InformationBox;
