import { formatNumber } from "../../util/numberFormat";
import { EmptyLikeIcon, LikeIcon } from "../../Assets/Icons";
import request from "../../util/axios-base-url";
import { useAuthContext } from "../../Auth Provider/authContext";
import { getCookie } from "../../util/tokenHelpers";

const LikeAndDislike = ({ totalLike, videoId, reactState, refetch }) => {
  
  const { user } = useAuthContext();

  const handleToggleReact = async (type) => {
    if (!user) {
      alert("Please sign in to continue");
      return;
    }

    await request
      .post(
        "/client/react",
        { type, videoId },
        {
          headers: {
            Authorization: `${import.meta.env.VITE_AUTH_BEARER} ${getCookie(
              import.meta.env.VITE_AUTH_TOKEN
            )}`,
          },
        }
      )
      .then((rsp) => {
        refetch();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className='flex items-center'>
      <button
        className='rounded-l-[18px] h-[36px] flex items-center gap-[6px] relative
    bg-hover-black hover:bg-[rgba(255,255,255,0.2)] pl-[8px] pr-[18px] cursor-pointer
        after:content-[""] after:w-[1px] after:h-[24px] after:bg-[rgba(255,255,255,0.2)]
        after:absolute after:right-0
        '
        onClick={() => {
          handleToggleReact("like");
        }}
      >
        {reactState === "like" ? <LikeIcon /> : <EmptyLikeIcon />}

        {/* <span className='text-[14px] leading-[36px]'>
        {formatNumber(30000)}
        </span> */}
        <span className='text-[14px] leading-[36px]'>
          {formatNumber(totalLike || 0)}
        </span>
      </button>

      <button
        className='rounded-r-[18px] h-[36px] flex items-center 
        bg-hover-black hover:bg-[rgba(255,255,255,0.2)] pl-[8px] pr-[18px] cursor-pointer'
        onClick={() => {
          handleToggleReact("dislike");
        }}
      >
        <div className='rotate-180'>
          {reactState === "dislike" ? <LikeIcon /> : <EmptyLikeIcon />}
        </div>
      </button>
    </div>
  );
};
export default LikeAndDislike;
