import { CheckBox2 } from "../../../../Component";
import UserTbRow from "./UserTbRow";

const Display = ({
  dataList = [],
  checkedList = [],
  handleChecked,
  handleCheckedAll,
  handleDelete,
}) => {
  return (
    <div className='min-w-full w-fit'>
      <div
        className='sticky  top-[92px] z-[10] bg-black text-[12px] font-[500] leading-[48px]
           text-gray-A items-center border-y-[1px] border-gray-A flex'
      >
        <div className='h-[48px] px-[20px] bg-black flex items-center justify-center gap-[12px] z-[10]'>
          <CheckBox2
            checked={
              checkedList.length === dataList.length && dataList.length > 0
            }
            setChecked={handleCheckedAll}
          />
        </div>
        <div
          className='pl-[12px] flex-[2_0_300px] min-w-[300px]  bg-black
              border-r-[1px] border-gray-A z-[10]'
        >
          User
        </div>
        <div className='flex-[1_0_150px] min-w-[100px] mx-[12px]'>
          <span>Date</span>
        </div>
        <div className='flex-[1_0_100px] min-w-[100px] mx-[12px]'>
          <span>Role</span>
        </div>
        <div className='flex-[1_0_100px] min-w-[100px] mx-[12px]'>
          <span>Confirmed</span>
        </div>
      </div>
      <div className='flex flex-col z-[2] relative'>
        {dataList.map((data, id) => (
          <UserTbRow
            key={id}
            data={data}
            handleDelete={handleDelete}
            handleChecked={handleChecked}
            checked={checkedList.includes(data?._id)}
          />
        ))}
      </div>
    </div>
  );
};
export default Display;
