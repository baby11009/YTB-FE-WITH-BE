const DisableTextArea = ({ title, value }) => {
  return (
    <div
      className="overflow-hidden border-[1px] rounded-[8px]  hover:border-white-F1 border-[#6b6767]
      transition-all ease-in px-[12px] mb-[32px]" 
    >
      <div className='mt-[8px] mb-[4px]'>
        <span className='text-[12px] leading-[16px] font-[500] text-gray-A'>{title}</span>
      </div>
      <div className='text-[15px]leading-[24px] min-h-[120px] overflow-hidden outline-none'>
        {value}
      </div>
    </div>
  );
};
export default DisableTextArea;
