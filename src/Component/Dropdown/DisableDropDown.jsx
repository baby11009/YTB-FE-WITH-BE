const DisableDropDown = ({ title, value }) => {
  return (
    <div
      className='z-[150] border-[1px] rounded-[8px] 
        border-[#6b6767] transition-all ease-in hover:border-[white] mb-[32px] h-fit'
    >
      <div className='pl-[12px]'>
        <div className='flex items-center justify-between w-full  h-[56px] z-[100]'>
          <div className='flex-1 text-left'>
            <div className='text-[12px] leading-[20px] text-gray-A'>
              {title}
            </div>
            <div className='text-[14px] leading-[24px] h-[24px] line-clamp-1'>
              {value}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DisableDropDown;
