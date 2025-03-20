const UserCard = ({ data }) => {
  return (
    <div className='rounded-[5px] flex items-center gap-[8px]'>
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
