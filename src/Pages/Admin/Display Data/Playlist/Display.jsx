import { CheckBox2 } from "../../../../Component";
import PlaylistTbRow from "./PlaylistTbRow";
import { useRef, useEffect } from "react";
const Display = ({
  dataList = [],
  checkedList,
  handleChecked,
  handleCheckedAll,
  handleDelete,
  tableHeader,
}) => {
  const playlistList = useRef([]);

  useEffect(() => {
    if (dataList) {
      playlistList.current = dataList.filter(
        (item) => item.type === "Playlist",
      );
    }
  }, [dataList]);
  return (
    <div className='min-w-full w-fit'>
      <div
        className='sticky left-0 top-[96px] z-[10] bg-black text-[12px] font-[500] leading-[48px]
       text-gray-A items-center border-y-[1px] border-gray-A flex'
        ref={tableHeader}
      >
        <div className='h-[48px] px-[20px] flex items-center justify-center gap-[12px] z-[10]'>
          <CheckBox2
            checked={
              checkedList.size === playlistList.current.length &&
              playlistList.current.length > 0
            }
            setChecked={handleCheckedAll}
          />
        </div>
        <div className='pl-[12px] flex-[2_0_300px] min-w-[300px] '>
          Playlist
        </div>
        <div className='pl-[12px] flex-[1_0_224px] min-w-[224px] border-x-[1px] border-gray-A'>
          Channel
        </div>
        <div className='flex-[1_0_100px] min-w-[100px] mx-[12px]'>Type</div>
        <div className='flex-[1_0_100px] min-w-[100px] mx-[12px]'>Privacy</div>
        <div className='flex-[1_0_100px] min-w-[100px] mx-[12px]'>Date</div>
        <div className='flex-[1_0_100px] min-w-[100px] mx-[12px]'>
          Modified date
        </div>
        <div className='flex-[1_0_100px] min-w-[100px] mx-[12px] text-end'>
          Size
        </div>
      </div>
      <div className='flex flex-col z-[2] relative'>
        {dataList &&
          dataList.length > 0 &&
          dataList.map((data, id) => (
            <PlaylistTbRow
              key={id}
              data={data}
              handleDelete={handleDelete}
              handleChecked={handleChecked}
              checked={checkedList.has(data._id)}
            />
          ))}
      </div>
    </div>
  );
};
export default Display;
