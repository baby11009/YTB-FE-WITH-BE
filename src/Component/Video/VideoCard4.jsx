import {
  Setting2Icon,
  Verification,
  AddWLIcon,
  WatchedIcon,
  SaveIcon,
  DownloadIcon,
  ShareIcon,
  DiaryIcon,
} from "../../Assets/Icons";
import { formatNumber } from "../../util/numberFormat";
import { timeFormat2 } from "../../util/timeforMat";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../Auth Provider/authContext";
import CustomeFuncBox from "../Box/CustomeFuncBox";
import PlaylistModal from "../Modal/PlaylistModal";
import request from "../../util/axios-base-url";
import { useNavigate } from "react-router-dom";
const VideoCard4 = ({ data }) => {
  const { setShowHover, handleCursorPositon, addToaster, user, setIsShowing } =
    useAuthContext();

  const navigate = useNavigate();

  const funcList1 = [
    {
      id: 1,
      text: "Add to queue",
      icon: <AddWLIcon />,
    },
    {
      id: 2,
      text: "Save to watch later",
      icon: <WatchedIcon />,
      renderCondition: !!user,
      handleOnClick: async () => {
        await request
          .patch("/client/playlist/wl", {
            videoIdList: [data?._id],
          })
          .then((rsp) => {
            addToaster(rsp.data.msg);
          })
          .catch((err) => {
            console.error(err);
          });
      },
    },
    {
      id: 3,
      text: "Save to Playlist",
      icon: <SaveIcon />,
      handleOnClick: () => {
        setIsShowing(<PlaylistModal videoId={data?._id} />);
      },
      renderCondition: !!user,
    },
    {
      id: 4,
      text: "Download",
      icon: <DownloadIcon />,
    },
    {
      id: 5,
      text: "Share",
      icon: <ShareIcon />,
    },
  ];

  const funcList2 = [
    {
      id: 3,
      text: "Report",
      icon: <DiaryIcon />,
    },
  ];

  return (
    <div className={` flex `}>
      <Link
        to={
          data.type === "video" ? `/video?id=${data._id}` : `/short/${data._id}`
        }
        className='relative max-w-[500px] min-w-[240px] flex-1 mr-[16px]'
      >
        <div className='w-full aspect-video relative rounded-[12px] overflow-hidden'>
          <img
            src={`${import.meta.env.VITE_BASE_API_URI}${
              import.meta.env.VITE_VIEW_THUMB_API
            }${data?.thumb}?width=720&height=404&format=webp`}
            alt='thumbnail'
            className='size-full object-contain z-[2] relative'
          />
          <div
            className='absolute size-full top-0 left-0 z-[1] bg-no-repeat bg-cover bg-center  blur-[3px] '
            style={{
              backgroundImage: `url('${import.meta.env.VITE_BASE_API_URI}${
                import.meta.env.VITE_VIEW_THUMB_API
              }${data?.thumb}?width=720&height=404&fit=cover')`,
            }}
          ></div>
        </div>
      </Link>

      <Link
        to={
          data.type === "video" ? `/video?id=${data._id}` : `/short/${data._id}`
        }
        className='flex-1 text-[12px] leading-[18px] text-gray-A'
      >
        <div className='flex '>
          <div className='flex-1'>
            <div
              className='w-full text-[18px] leading-[26px] max-h-[52px] line-clamp-2 text-white-F1 '
              style={{ overflowWrap: "anywhere" }}
            >
              {data.title}
            </div>
          </div>
          <button
            className='shrink-0 size-[40px] p-[8px]  rounded-[50%] overflow-hidden
             active:bg-black-0.1 mt-[-8px] relative'
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              setShowHover((prev) => {
                if (prev) return undefined;
                handleCursorPositon(e);
                return (
                  <CustomeFuncBox
                    style={`w-[270px]`}
                    setOpened={() => {
                      setShowHover(undefined);
                    }}
                    funcList1={funcList1}
                    funcList2={funcList2}
                  />
                );
              });
            }}
          >
            <div className='w-[24px]'>
              <Setting2Icon />
            </div>
          </button>
        </div>
        <div>
          <span>{formatNumber(data.view)} views</span>
          <span className='mx-[4px]'>•</span>
          <span>{timeFormat2(data.createdAt)}</span>
        </div>

        <div
          className='flex items-center my-3 w-fit'
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            navigate(`/channel/${data.channel_info.email}`);
          }}
        >
          <img
            src={`${import.meta.env.VITE_BASE_API_URI}${
              import.meta.env.VITE_VIEW_AVA_API
            }${data?.channel_info?.avatar}?width=68&height=68`}
            alt={`avatar-${data.channel_info?.email}`}
            className='size-[24px] object-cover object-center rounded-[50%] overflow-hidden mr-[6px]'
          />
          <div className='hover:text-white-F1 text-gray-A'>
            {data.channel_info.name}
          </div>
          {data.channel_info.subsriber > 100000 && (
            <div className='w-[14px] ml-[4px]'>
              <Verification />
            </div>
          )}
        </div>

        <div
          title='From the video description'
          className={`t-ellipsis text-[12px] leading-[18px]
                 text-gray-A pt-[8px] mb-[8px]`}
          dangerouslySetInnerHTML={{
            __html:
              data.description +
              `at JSXParserMixin.parseExprAtom (D:\Lập trình web F8\ytb pj\Ytb-clone\node_modules\@babel\parser\lib\index.js:10849:23)
      at JSXParserMixin.parseExprAtom (D:\Lập trình web F8\ytb pj\Ytb-clone\node_modules\@babel\parser\lib\index.js:6811:20)
      at JSXParserMixin.parseExprSubscripts (D:\Lập trình web F8\ytb pj\Ytb-clone\node_modules\@babel\parser\lib\index.js:10591:23)
      at JSXParserMixin.parseUpdate (D:\Lập trình web F8\ytb pj\Ytb-clone\node_modules\@babel\parser\lib\index.js:10576:21)
      at JSXParserMixin.parseMaybeUnary (D:\Lập trình web F8\ytb pj\Ytb-clone\node_modules\@babel\parser\lib\index.js:10556:23)
      at JSXParserMixin.parseMaybeUnaryOrPrivate (D:\Lập trình web F8\ytb pj\Ytb-clone\node_modules\@babel\parser\lib\index.js:10410:61)
      at JSXParserMixin.parseExprOps (D:\Lập trình web F8\ytb pj\Ytb-clone\node_modules\@babel\parser\lib\index.js:10415:23)
      at JSXParserMixin.parseMaybeConditional (D:\Lập trình web F8\ytb pj\Ytb-clone\node_modules\@babel\parser\lib\index.js:10392:23)
      at JSXParserMixin.parseMaybeAssign (D:\Lập trình web F8\ytb pj\Ytb-clone\node_modules\@babel\parser\lib\index.js:10355:21)
      at JSXParserMixin.parseExpressionBase (D:\Lập trình web F8\ytb pj\Ytb-clone\node_modules\@babel\parser\lib\index.js:10309:23)
      at D:\Lập trình web F8\ytb pj\Ytb-clone\node_modules\@babel\parser\lib\index.js:10305:39`,
          }}
        ></div>
      </Link>
    </div>
  );
};
export default VideoCard4;
