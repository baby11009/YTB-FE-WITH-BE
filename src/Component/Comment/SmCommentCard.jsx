const SmCommentCard = ({ data }) => {
  return (
    <div className='flex items-center gap-[8px] text-[14px] leading-[20px]'>
      <img
        src={`${import.meta.env.VITE_BASE_API_URI}${
          import.meta.env.VITE_VIEW_AVA_API
        }${data?.user_info?.avatar}`}
        alt=''
        className='w-[24px] h-[24px] rounded-[50%]'
      />
      <span>{data?.cmtText}</span>
    </div>
  );
};
export default SmCommentCard;
