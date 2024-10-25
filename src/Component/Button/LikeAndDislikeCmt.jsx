import { ThickLikeIcon, EmptyLikeIcon } from "../../Assets/Icons";
import { formatNumber } from "../../util/numberFormat";
import request from "../../util/axios-base-url";
import { useAuthContext } from "../../Auth Provider/authContext";
import { getCookie } from "../../util/tokenHelpers";

const LikeAndDislikeCmt = ({ cmtId, like, type, refetchList }) => {
  const { user } = useAuthContext();

  const handleToggleReact = async (type) => {
    if (!user) {
      alert("Đăng nhập để tương tác");
      return;
    }

    await request
      .post(
        "/client/cmt-react",
        { cmtId, type },
        {
          headers: {
            Authorization: `${import.meta.env.VITE_AUTH_BEARER} ${getCookie(
              import.meta.env.VITE_AUTH_TOKEN
            )}`,
          },
        }
      )
      .then((rsp) => {
        refetchList();
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data?.msg);
      });
  };

  return (
    <>
      <div className='flex items-center mr-[8px]'>
        <button
          className='w-[32px] h-[32px] rounded-[50%] flex items-center justify-center
             hover:bg-[rgba(255,255,255,0.2)]'
          onClick={() => {
            handleToggleReact("like");
          }}
        >
          {type === "like" ? <ThickLikeIcon /> : <EmptyLikeIcon />}
        </button>
        <span className='text-[12px] leading-[18px] text-gray-A translate-y-[15%] hidden xsm:inline-block'>
          {formatNumber(like)}
        </span>
      </div>

      {/* Dislike */}
      <button
        className='w-[32px] h-[32px] rounded-[50%] rotate-180 flex items-center 
          justify-center hover:bg-[rgba(255,255,255,0.2)]'
        onClick={() => {
          handleToggleReact("dislike");
        }}
      >
        <div className=' translate-y-[-15%]'>
          {type === "dislike" ? <ThickLikeIcon /> : <EmptyLikeIcon />}
        </div>
      </button>
    </>
  );
};
export default LikeAndDislikeCmt;
