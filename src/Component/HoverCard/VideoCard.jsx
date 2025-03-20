const VideoCard = ({ data }) => {
  return (
    <div className='flex gap-[16px] min-w-[300px]'>
      <div className='shrink-0 w-[120px] aspect-video rounded-[5px] overflow-hidden bg-black'>
        <img
          src={`${import.meta.env.VITE_BASE_API_URI}${
            import.meta.env.VITE_VIEW_THUMB_API
          }${data?.thumb}`}
          alt='thumb'
          className='size-full object-center object-contain'
        />
      </div>
      <div className='flex flex-col justify-between'>
        <span
          className='w-full line-clamp-2 text-ellipsis break-words overflow-hidden text-[14px] font-bold mt-[4px]'
          style={{ overflowWrap: "anywhere" }}
        >
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
          <span className='flex-1 text-[13px] line-clamp-1 text-ellipsis overflow-hidden text-gray-A'>
            {data?.user_info?.email}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
