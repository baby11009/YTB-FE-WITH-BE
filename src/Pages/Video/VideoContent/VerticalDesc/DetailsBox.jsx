import { CloseIcon } from "../../../../Assets/Icons";
import { formatNumber } from "../../../../util/numberFormat";
import { timeFormat2 } from "../../../../util/timeforMat";

const DetailsBox = ({ setOpened, data }) => {

  return (
    <div className='w-full h-[70vh] rounded-[12px] flex flex-col overflow-hidden'>
      <div className='px-[16px] py-[4px] flex items-center justify-between '>
        <div className='my-[10px] flex items-center gap-[8px]'>
          <h4 className='text-[20px] leading-[28px] font-bold'>Description</h4>
        </div>
        <div className='flex gap-[8px]'>
          <button
            className='w-[40px] h-[40px] rounded-[50%] hover:bg-[rgba(255,255,255,0.2)]
                      flex items-center justify-center'
            onClick={() => setOpened(false)}
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      <div className='px-[16px] overflow-auto'>
        <div className=''>
          <span>
            {formatNumber(data?.view)} view{data?.view > 2 && "s"}
          </span>
          <span> {timeFormat2(data?.createdAt)}</span>
        </div>
        <div>{data?.description}</div>
        <div className='flex flex-wrap gap-[16px] mt-[24px]'>
          {data?.tag_info?.map((tag) => (
            <div className='max-w-[250px] min-w-[150px] flex items-center  flex-1 bg-black-0.2 rounded-[5px] overflow-hidden'>
              <img
                src={`${import.meta.env.VITE_BASE_API_URI}${
                  import.meta.env.VITE_VIEW_TAG_API
                }${tag?.icon}`}
                alt=''
                className='w-[70px] aspect-auto'
              />
              <div className=' ml-[12px] font-bold text-nowrap'>
                {tag?.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default DetailsBox;
