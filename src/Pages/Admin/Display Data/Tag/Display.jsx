import TagCard from "./TagCard";
import InsertTagCard from "./InsertTagCard";
import EditTagCard from "./EditTagCard";
const Display = ({
  openedMenu,
  dataList = [],
  checkedList,
  handleChecked,
  handleCheckedAll,
  handleDelete,
  refetch,
  handleUpdate,
  currMode,
  setCurrMode,
}) => {
  console.log("🚀 ~ checkedList:", checkedList)
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
        {currMode === "insert" && (
          <InsertTagCard refetch={refetch} setCurrMode={setCurrMode} />
        )}
        {dataList.map((data) => {
          if (currMode === data._id) {
            return (
              <EditTagCard
                key={data._id}
                data={data}
                setCurrMode={setCurrMode}
                handleUpdate={handleUpdate}
              />
            );
          } else {
            return (
              <TagCard
                key={data._id}
                data={data}
                handleChecked={handleChecked}
                checked={checkedList.has(data._id)}
                handleDelete={handleDelete}
                startEditing={(id) => setCurrMode(id)}
              />
            );
          }
        })}
      </div>
    </div>
  );
};
export default Display;
