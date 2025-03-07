import { CheckBox2 } from "../../../../Component";
import { EditIcon, TrashBinIcon } from "../../../../Assets/Icons";
import { Link } from "react-router-dom";
import { timeFormat3 } from "../../../../util/timeforMat";

const TagCard = ({ data, handleChecked, checkedList = [], handleDelete }) => {
  return (
    <div
      className='h-[280px] flex flex-col items-center relative group cursor-pointer'
      onClick={() => {
        handleChecked(data?._id);
      }}
    >
      <div
        className='absolute z-[2] size-[150px] rounded-[50%] bg-black bg-center bg-no-repeat bg-cover'
        style={{
          backgroundImage: `url('${import.meta.env.VITE_BASE_API_URI}${
            import.meta.env.VITE_VIEW_TAG_API
          }${data?.icon}')`,
        }}
      ></div>
      <div
        className='absolute z-[1] w-full h-[90px] cursor-default '
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <div className='m-[1px]'>
          <CheckBox2
            noAnimation={true}
            checked={checkedList.includes(data?._id)}
            setChecked={() => {
              handleChecked(data?._id);
            }}
          />
        </div>
      </div>

      <div
        className='size-full flex flex-col justify-between mt-[90px] pt-[70px] border-[2px]
       border-gray-A group-hover:border-white transition-[border] duration-[.15s] ease-in rounded-[5px] p-[8px]'
      >
        <div className='text-center'>
          <div className='w-full h-[20px] line-clamp-1 text-ellipsis'>
            <span className='text-[16px] leading-[20px] font-[500]  '>
              {data?.title}
            </span>
          </div>
          <span className='text-[12px] leading-[16px] text-gray-A'>
            {timeFormat3(data?.createdAt)}
          </span>
          <div className='w-full h-[20px] line-clamp-1 text-ellipsis'>
            <span className='text-[16px] leading-[20px]'>Video : 21312</span>
          </div>
        </div>
        <div className='w-full group-hover:visible group-hover:opacity-[1] opacity-0 invisible transition-all
         duration-[.15s] ease-in'>
          <div className='flex justify-between'>
            <Link
              className='size-[40px] rounded-[50%] p-[8px] hover:text-green-400'
              to={`./upsert/${data?._id}`}
            >
              <div className='w-[24px]'>
                <EditIcon />
              </div>
            </Link>
            <button
              className='size-[40px] rounded-[50%] p-[8px] hover:text-red-400 '
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(data?._id);
              }}
            >
              <div className='w-[24px]'>
                <TrashBinIcon />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TagCard;
