import { NoResultIcon } from "../../Assets/Icons";

const NoResult = () => {
  return (
    <div className='pt-[140px] flex flex-col items-center justify-center'>
      <div className='w-[424px]'>
        <NoResultIcon />
      </div>
      <div className='my-[24px]'>
        <div className='mb-[16px] text-[24px] leading-[32px] text-center'>
          No result founds
        </div>
        <div className='text-[14px] leading-[20px] text-wrap'>
          Try different keywords or remove search filters
        </div>
      </div>
    </div>
  );
};
export default NoResult;
