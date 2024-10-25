import { CheckBox2 } from "../../../../Component";
import PlaylistTbRow from "./PlaylistTbRow";
const Display = ({
  dataList,
  refetch,
  mockArr,
  limit,
  checkedList,
  page,
  handleChecked,
  handleCheckedAll,
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
            <th>Người tạo</th>
            <th>Title</th>
            <th className='hidden 2md:table-cell'>Tổng số thành phần</th>
            <th className='hidden 2lg:table-cell'>Ngày tạo</th>
            <th>Chức năng</th>
          </tr>
        </thead>
        <tbody className=''>
          {dataList.map((data, id) => (
            <PlaylistTbRow
              key={id}
              limit={limit}
              data={data}
              od={id}
              length={dataList?.length}
              page={page}
              refetch={refetch}
              checkedList={checkedList}
              handleChecked={handleChecked}
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
