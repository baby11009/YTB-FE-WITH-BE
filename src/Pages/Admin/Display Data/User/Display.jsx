import { CheckBox2 } from "../../../../Component";
import UserTbRow from "./UserTbRow";

const Display = ({
  dataList = [],
  refetch,
  handleChecked,
  handleCheckedAll,
  mockArr = [],
  limit,
  checkedList = [],
  page,
}) => {
  return (
    <div className='mt-[8px]'>
      <table className='w-full text-left'>
        <thead>
          <tr className='border-b-[1px]'>
            <th>
              <div className='flex items-center gap-[16px]'>
                <CheckBox2
                  checked={
                    checkedList.length === dataList.length &&
                    dataList.length > 0
                  }
                  setChecked={handleCheckedAll}
                />

                <button onClick={handleCheckedAll}>STT</button>
              </div>
            </th>
            <th className='hidden 2md:table-cell'>Tên</th>
            <th>Email</th>
            <th className='hidden sm:table-cell'>Role</th>
            <th className='hidden md:table-cell'>Xác thực</th>
            <th className='hidden 2lg:table-cell'>Ngày tạo</th>
            <th>Chức năng</th>
          </tr>
        </thead>
        <tbody className=''>
          {dataList.map((data, id) => (
            <UserTbRow
              key={id}
              data={data}
              od={id}
              limit={limit}
              length={dataList?.length}
              page={page}
              refetch={refetch}
              handleChecked={handleChecked}
              checkedList={checkedList}
            />
          ))}
          {mockArr.length > 0 &&
            mockArr.map((id) => <tr key={id} className='h-[56px]'></tr>)}
        </tbody>
      </table>
    </div>
  );
};
export default Display;
