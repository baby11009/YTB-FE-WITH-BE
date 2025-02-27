import { CheckBox2 } from "../../../../Component";
import UserTbRow from "./UserTbRow";

const Display = ({
  dataList = [],
  refetch,
  handleChecked,
  handleCheckedAll,
  handleDelete,
  limit,
  checkedList = [],
  page,
}) => {
  return (
    <div className='min-w-full w-fit'>
      <div
        className='sticky left-0 top-[92px] z-[10] bg-black text-[12px] font-[500] leading-[48px]
           text-gray-A items-center border-y-[1px] border-gray-A flex'
      >
        <div className='sticky left-0 h-[48px] p-[0_12px_0_25px] bg-black flex items-center justify-center gap-[12px] z-[10]'>
          <CheckBox2
            checked={
              checkedList.length === dataList.length && dataList.length > 0
            }
            setChecked={handleCheckedAll}
          />
        </div>
        <div
          className='sticky left-[57px] pl-[12px] flex-[2_0_300px] min-w-[300px]  bg-black
              border-r-[1px] border-gray-A z-[10]'
        >
          User
        </div>
        <div className='flex-[1_0_150px] min-w-[100px] mx-[12px]'>
          <button
            onClick={() => {}}
            // className={`flex items-center  w-full ${
            //   queriese.sort["createdAt"] ? "text-white-F1 font-bold" : ""
            // }`}
          >
            <span>Date</span>
            {/* 
            <div
              className={`${
                queriese.sort["createdAt"] === -1 ? "rotate-180" : ""
              }
                ${
                  queriese.sort["createdAt"] ? "visible" : "invisible"
                } ml-[12px] w-[12px]`}
            >
              <LongArrowIcon />
            </div> */}
          </button>
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
            checkedList={checkedList}
          />
        ))}
      </div>
    </div>
  );
};
export default Display;
