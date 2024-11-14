const UserCard = ({ data }) => {
  return (
    <div className=' bg-black-28 px-[16px] py-[8px] rounded-[5px] flex items-center gap-[8px] shadow-[0_0_8px_2px_rgba(255,255,255,1)]'>
      <div className='size-[60px] rounded-[50%] overflow-hidden'>
        <img
          src={`${import.meta.env.VITE_BASE_API_URI}${
            import.meta.env.VITE_VIEW_AVA_API
          }${data?.avatar}`}
          alt='avatar'
          className=' object-center object-cover'
        />
      </div>
      <div className='font-[500]'>
        <h3 className='text-[16px]'>{data?.email}</h3>
        <span className='text-[14px] text-gray-A'>{data?.name}</span>
      </div>
    </div>
  );
};

export default UserCard;
