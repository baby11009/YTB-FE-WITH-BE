import { useState, useRef, useEffect, useCallback } from "react";
import {
  ThinArrowIcon,
  PublicIcon,
  PrivateIcon,
  CheckIcon,
} from "../../Assets/Icons";
import { useAuthContext } from "../../Auth Provider/authContext";
import request from "../../util/axios-base-url";

const CreatePlaylist = ({ videoId }) => {
  const { setIsShowing } = useAuthContext();

  const [data, setData] = useState({ title: "", type: "public" });

  const [opened, setOpened] = useState(false);

  const [clicked, setClicked] = useState(false);

  const [isFocused, setIsFocused] = useState(false);

  const textAreaRef = useRef();

  const funcList = useRef([
    {
      id: "public",
      text: "Public",
      icon: <PublicIcon />,
      desc: "Anyone can search for and view",
    },
    {
      id: "private",
      text: "Private",
      icon: <PrivateIcon />,
      desc: "Only you can view",
    },
  ]);

  const handleChooseType = (type) => {
    setData((prev) => ({ ...prev, type }));
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      await request
        .post("/client/playlist", { ...data, videoIdList: [videoId] })
        .then((rsp) => {
          setIsShowing(undefined);
        })
        .catch((err) => {
          console.error(err);
          alert("Failed to create playlist");
        });
    },
    [data]
  );

  useEffect(() => {
    if (isFocused) {
      textAreaRef.current.focus();
    }
  }, [isFocused]);

  useEffect(() => {
    textAreaRef.current.addEventListener("input", function () {
      this.style.height = "22px";
      this.style.height = this.scrollHeight + "px";
    });
  }, []);

  return (
    <div className='w-[320px] px-[24px] '>
      <form onSubmit={handleSubmit}>
        <h3 className='text-[20px] leading-[28px] font-[500] pt-[24px] pb-[8px]'>
          New playlist
        </h3>
        <div
          className='mt-[12px]'
          onClick={() => {
            !isFocused && setIsFocused(true);
            !clicked && setClicked(true);
          }}
        >
          <div
            className={`mb-[12px] rounded-[8px] relative border-[2px] pt-[24px] px-[12px] pb-[8px]
            ${
              isFocused
                ? data.title.length < 150
                  ? " border-white-F1 "
                  : "border-[#ff5577]"
                : " border-black-0.2 "
            }
            `}
          >
            <div
              className={`absolute text-gray-71 top-[16px] left-[12px] right-[12px] leading-[22px] ${
                clicked ? "hidden" : ""
              }`}
            >
              Choose a title
            </div>

            <label
              htmlFor='playlist-title'
              className={`absolute top-[8px] left-[12px] text-gray-A text-[12px] leading-[18px] ${
                !isFocused && data.title.length === 0 ? "hidden" : ""
              }`}
            >
              Title
            </label>
            <textarea
              name=''
              ref={textAreaRef}
              id='playlist-title'
              autoFocus={true}
              onBlur={() => {
                setIsFocused(false);
                if (data.title.length === 0) {
                  setClicked(false);
                }
              }}
              style={{ height: "22px" }}
              onFocus={() => {
                setIsFocused(true);
              }}
              value={data.title}
              onChange={(e) =>
                setData((prev) => ({ ...prev, title: e.target.value }))
              }
              maxLength={150}
              className={`bg-transparent resize-none w-full border-none outline-none leading-[22px] overflow-hidden ${
                !isFocused && data.title.length === 0 ? "invisible" : "visible"
              }`}
            ></textarea>
            {clicked && (
              <div
                className={`flex justify-end text-[12px] leading-[16px] ${
                  data.title.length < 150 ? " text-gray-A " : "text-[#ff5577]"
                }`}
              >
                <span> {data.title.length}/150</span>
              </div>
            )}
          </div>
        </div>

        <div
          className='mb-[12px] px-[12px] py-[8px] border-[2px] border-black-0.2 rounded-[8px] 
      flex items-center cursor-pointer relative'
          onClick={() => {
            setOpened((prev) => !prev);
          }}
        >
          <div className='flex-1'>
            <div>
              <span className='text-[12px] leading-[18px] text-gray-A'>
                Visibility
              </span>
            </div>
            <div className='leading-[22px]'>
              {data.type.replace(/\b\w/g, (char) => char.toUpperCase())}
            </div>
          </div>
          <div className='w-[24px] rotate-90 '>
            <ThinArrowIcon />
          </div>
          {opened && (
            <div className='left-0 top-[110%] absolute bg-black-28 w-full rounded-[12px] overflow-hidden'>
              <div className='py-[10px] px-[12px] border-b-[1px] border-black-0.2'>
                <span className='text-[20px] leading-[28px] font-bold'>
                  Visibility
                </span>
              </div>
              <div>
                {funcList.current.map((item) => (
                  <div
                    key={item.id}
                    className='px-[16px] py-[6px] flex items-center hover:bg-black-0.1'
                    onClick={() => {
                      handleChooseType(item.id);
                    }}
                  >
                    <div className='mr-[12px] w-[24px] text-white-F1'>
                      {item.icon}
                    </div>
                    <div className='flex-1'>
                      <div className='text-[14px] leading-[20px]'>
                        <span>{item.text}</span>
                      </div>
                      <div className='mt-[4px] text-[11px] leading-[18px] text-gray-A'>
                        <span>{item.desc}</span>
                      </div>
                    </div>
                    {data.type === item.id && (
                      <div className='ml-[12px] w-[24px] text-white-F1'>
                        <CheckIcon />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className='flex items-center justify-between pt-[16px] pb-[24px]'>
          <button
            className='border-[1px] border-black-0.2 px-[15px] rounded-[18px] hover:bg-black-0.2
         hover:border-transparent'
            onClick={() => {
              setIsShowing(undefined);
            }}
            type='button'
          >
            <div className='text-[14px] leading-[36px] font-[500] w-[100px]'>
              Cancel
            </div>
          </button>
          <button
            disabled={data.title.length === 0}
            className={`border-[1px] px-[15px] rounded-[18px]
          ${
            data.title.length > 0
              ? "text-black bg-white-F1 hover:bg-white-D9 "
              : " border-transparent bg-black-0.1 text-gray-71 cursor-default"
          } `}
          >
            <div className='text-[14px] leading-[36px] font-[500] w-[100px] '>
              Create
            </div>
          </button>
        </div>
      </form>
    </div>
  );
};
export default CreatePlaylist;
