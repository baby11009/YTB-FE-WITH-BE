import { Link } from "react-router-dom";
import { formatNumber } from "../../util/numberFormat";
import { Setting2Icon, FeedBackIcon } from "../../Assets/Icons";
import CustomeFuncBox from "../Box/CustomeFuncBox";
import { useAuthContext } from "../../Auth Provider/authContext";
const funcList1 = [
  {
    id: 1,
    text: "Send feedback",
    icon: <FeedBackIcon />,
  },
];

const ShortCard = ({ data, containerStyle, imgStyle, noDesc }) => {
  const { setShowHover, handleCursorPositon } = useAuthContext();

  return (
    <Link
      to={`/short/${data._id}`}
      className={`cursor-pointer inline-block ${
        containerStyle ? containerStyle : "flex-1 mx-[8px] mb-[20px]"
      }`}
    >
      <div
        className={`rounded-[12px] overflow-hidden w-full relative ${
          imgStyle ? imgStyle : "h-[468px]"
        }`}
      >
        <div
          className='absolute inset-0 z-[1] blur-sm'
          style={{
            backgroundImage: `url('${import.meta.env.VITE_BASE_API_URI}${
              import.meta.env.VITE_VIEW_THUMB_API
            }${data?.thumb}?width=405&heigth=720&fit=cover')`,
          }}
        ></div>
        <img
          src={`${import.meta.env.VITE_BASE_API_URI}${
            import.meta.env.VITE_VIEW_THUMB_API
          }${data?.thumb}?width=405&heigth=720`}
          alt='short'
          className='size-full object-contain relative z-[2]'
        />
      </div>
      {!noDesc && (
        <div className='pt-[12px] flex justify-between'>
          <div>
            <div
              className=' text-[16px] leading-[22px] max-h-[44px] 
            line-clamp-2 text-ellipsis whitespace-normal'
              dangerouslySetInnerHTML={{ __html: data?.title }}
            ></div>
            <div className='text-[14px] leading-[20px] text-gray-A'>
              {formatNumber(data.view)} views
            </div>
          </div>
          <button
            className='size-[40px] active:bg-black-0.2 rounded-[50%] p-[8px]'
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              setShowHover((prev) => {
                if (prev) return undefined;
                handleCursorPositon(e);
                return (
                  <CustomeFuncBox
                    style={`w-[210px] top-[100%] right-[20%] ${
                      false ? "" : "sm:left-[-20%]"
                    } `}
                    setOpened={() => {
                      setShowHover(undefined);
                    }}
                    funcList1={funcList1}
                  />
                );
              });
            }}
          >
            <div className='w-[24px] h-[24px]  '>
              <Setting2Icon />
            </div>
          </button>
        </div>
      )}
    </Link>
  );
};
export default ShortCard;
