import {dltData } from "../../../../Api/controller";
import { CheckBox2 } from "../../../../Component";
import { EditIcon, DeleteIcon } from "../../../../Assets/Icons";
import { Link } from "react-router-dom";
import { timeFormat3 } from "../../../../util/timeforMat";
import { useAuthContext } from "../../../../Auth Provider/authContext";

const CommentTbRow = ({
  data,
  od,
  limit,
  length,
  page,
  refetch,
  checkedList = [],
  handleChecked,
}) => {
  const { setNotifyMessage } = useAuthContext();

  return (
    <tr className={`${od + 1 !== length && "border-b-[1px]"} `}>
      <th>
        <div className='flex items-center gap-[16px]'>
          <CheckBox2
            checked={checkedList.includes(data?._id)}
            setChecked={() => {
              handleChecked(data?._id);
            }}
          />
          <button
            onClick={() => handleChecked(data?._id)}
            className='font-[400]  '
          >
            {od + limit * (page - 1) + 1}
          </button>
        </div>
      </th>
      <th>
        <div className='font-[400] w-[70px] md:w-full max-w-[150px] text-nowrap overflow-hidden text-ellipsis'>
          {data?.user_info.email}
        </div>
      </th>
      <th className='hidden 2md:table-cell'>
        <div className='font-[400] w-[80px] 1-5sm:w-full max-w-[150px] text-nowrap overflow-hidden text-ellipsis'>
          {data?.video_info?.title}
        </div>
      </th>
      <th>
        <div className='font-[400] w-[80px] md:w-full max-w-[150px] text-nowrap overflow-hidden text-ellipsis'>
          {data?.cmtText}
        </div>
      </th>
      <th className=' hidden lg:table-cell'>
        <div className='flex flex-col py-[4px] gap-[4px] font-[400]'>
          <span>Like : {data?.like}</span>
          <span>Dislike : {data?.dislike}</span>
        </div>
      </th>

      <th className='hidden 2lg:table-cell'>
        <span className='font-[400]'>{timeFormat3(data?.createdAt)}</span>
      </th>
      <th>
        <div className='flex items-center gap-[16px]'>
          <Link
            className='size-[32px] rounded-[5px] flex items-center justify-center 
           group border-[2px] border-[rgba(255,255,255,0.4)] hover:border-blue-500 transition-all duration-[0.2s] ease-in
          '
            to={`upsert/${data._id}`}
          >
            <div className='text-[rgba(255,255,255,0.4)] group-hover:text-blue-500  transition-all duration-[0.2s]'>
              <EditIcon />
            </div>
          </Link>
          <button
            className='size-[32px] rounded-[5px] flex items-center justify-center 
           group border-[2px] border-[rgba(255,255,255,0.4)] hover:border-red-500 transition-all duration-[0.2s] ease-in
          '
          >
            <div
              className='text-[rgba(255,255,255,0.4)] group-hover:text-red-500  transition-all duration-[0.2s]'
              onClick={async () => {
                await dltData(
                  "comment",
                  data?._id,
                  "comment",
                  () => {
                    refetch();
                  },
                  undefined,
                  setNotifyMessage,
                );
              }}
            >
              <DeleteIcon />
            </div>
          </button>
        </div>
      </th>
    </tr>
  );
};
export default CommentTbRow;
