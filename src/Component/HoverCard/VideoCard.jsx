const VideoCard = ({ data }) => {
  return (
    <div className='px-[16px] py-[8px] rounded-[10px] bg-black-21 w-[250px] shadow-[0_0_8px_2px_rgba(255,255,255,1)]'>
      <div className='w-full rounded-[5px] bg-black'>
        <img
          src={`${import.meta.env.VITE_BASE_API_URI}${
            import.meta.env.VITE_VIEW_THUMB_API
          }${data?.thumb}`}
          alt='thumb'
          className='w-full aspect-video object-center object-contain'
        />
      </div>
      <span className='w-full line-clamp-2 text-ellipsis overflow-hidden text-[16px] font-bold mt-[4px]'>
        {data?.title}
      </span>
      <div className='flex items-center gap-[8px]'>
        <div className='size-[30px] rounded-[50%] overflow-hidden'>
          <img
            src={`${import.meta.env.VITE_BASE_API_URI}${
              import.meta.env.VITE_VIEW_AVA_API
            }${data?.user_info?.avatar}`}
            alt='avatar'
            className=' object-center object-cover'
          />
        </div>
        <span className='flex-1 line-clamp-1 text-ellipsis overflow-hidden'>
          {data?.user_info?.email}
        </span>
      </div>
    </div>
  );
};

export default VideoCard;
