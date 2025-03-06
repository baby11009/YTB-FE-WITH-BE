import { CheckBox2 } from "../../../../Component";
import TagCard from "./TagCard";
import { EditIcon, TrashBinIcon } from "../../../../Assets/Icons";
import { timeFormat3 } from "../../../../util/timeforMat";
const Display = ({
  openedMenu,
  dataList = [],
  handleChecked,
  handleCheckedAll,
  handleDelete,
  checkedList = [],
}) => {
  return (
    <div className='min-w-full w-fit'>
      <div
        className={`mt-[16px] gap-[16px] grid  grid-cols-1 xsm:grid-cols-2 sm:grid-cols-3 2md:grid-cols-4 2lg:grid-cols-5
          ${
            openedMenu
              ? "1312:grid-cols-4 1360:grid-cols-5 1573:grid-cols-[repeat(6,minmax(0,260px))"
              : "1400:grid-cols-[repeat(6,minmax(0,260px))]"
          }`}
      >
        {dataList.map((data) => (
          <TagCard
            key={data?._id}
            data={data}
            handleChecked={handleChecked}
            checkedList={checkedList}
            handleDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};
export default Display;
