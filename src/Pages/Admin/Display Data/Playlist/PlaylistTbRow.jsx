import { dltData } from "../../../../Api/controller";
import { CheckBox2 } from "../../../../Component";
import { EditIcon, DeleteIcon } from "../../../../Assets/Icons";
import { Link } from "react-router-dom";
import { timeFormat3 } from "../../../../util/timeforMat";

const PlaylistTbRow = ({
  data,
  od,
  limit,
  length,
  page,
  refetch,
  checkedList = [],
  handleChecked,
}) => {
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
        <span className='font-[400] w-[70px] md:w-full max-w-[150px] text-nowrap overflow-hidden text-ellipsis'>
          {data?.user_info.email}
        </span>
      </th>
      <th>
        <span className='font-[400] w-[80px] md:w-full max-w-[150px] text-nowrap overflow-hidden text-ellipsis'>
          {data?.title}
        </span>
      </th>
      <th className='hidden 2md:table-cell'>
        <span className='font-[400] w-[80px] 1-5sm:w-full max-w-[150px] text-nowrap overflow-hidden text-ellipsis text-center'>
          {data?.itemList?.length}
        </span>
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
                await dltData("Playlist", data?._id, "playlist", () => {
                  refetch();
                });
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
export default PlaylistTbRow;
