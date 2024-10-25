import { useRef, useState, useEffect } from "react";
import { dltData, updateData } from "../../../../Api/controller";
import { CheckBox2 } from "../../../../Component";
import { EditIcon, DeleteIcon, ThinArrowIcon } from "../../../../Assets/Icons";
import { Link } from "react-router-dom";
import { timeFormat3 } from "../../../../util/timeforMat";

const VideoTbRow = ({
  data,
  od,
  limit,
  length,
  page,
  refetch,
  checkedList = [],
  handleChecked,
}) => {

  const containerRef = useRef();
  const [opened, setOpened] = useState(false);

  const typeList = ["video", "short"];

  const handleChangeType = async (id, type, currType) => {
    setOpened(false);
    if (type === currType) {
      alert(`${type} là thể loại hiện tại của video với id ${id}`);
      return null;
    }

    const rspData = await updateData("video", id, { type });

    if (rspData) {
      await refetch();
    }
  };

  useEffect(() => {
    const handleClickOutScope = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpened(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutScope);

    return () => {
      window.removeEventListener("mousedown", handleClickOutScope);
    };
  }, []);

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
      <th className='hidden 2md:table-cell'>
        <span className='font-[400] '>{data?.title}</span>
      </th>
      <th>
        <div
          className='size-[40px] rounded-[50%] bg-cover bg-center bg-no-repeat'
          style={{
            backgroundImage: `url("${import.meta.env.VITE_BASE_API_URI}${
              import.meta.env.VITE_VIEW_THUMB_API
            }${data?.thumb}")`,
          }}
        ></div>
      </th>
      <th className='hidden xsm:table-cell'>
        <div className='leading-[32px] font-[400] overflow-hidden max-w-[90px] text-ellipsis'>
          {data?.user_info.email}
        </div>
      </th>
      <th className='hidden 1-5sm:table-cell'>
        <div className='flex items-center h-full'>
          <div className='w-[100px] cursor-pointer relative' ref={containerRef}>
            <button
              className='w-full flex items-center justify-between px-[8px] py-[4px] border-b-[1px] rounded-[4px] '
              onClick={(e) => setOpened((prev) => !prev)}
            >
              <span className='font-[400]'>{data?.type}</span>
              <div className='rotate-90'>
                <ThinArrowIcon />
              </div>
            </button>
            {opened && (
              <div
                className={`absolute w-full left-0 ${
                  data + 1 === length ? "bottom-[110%]" : "top-[110%]"
                } rounded-[5px] bg-[#212121] z-[20] shadow-lg`}
              >
                {typeList.map((type, id) => (
                  <div
                    key={id}
                    onClick={() => {
                      handleChangeType(data?._id, type, data?.type);
                    }}
                    className={`${
                      data?.type === type && "bg-black-0.1 "
                    } text-left px-[8px] my-[4px] hover:bg-black-0.2 leading-[32px] font-[400]`}
                  >
                    {type}
                  </div>
                ))}
              </div>
            )}
          </div>
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
                await dltData("video", data?._id);
                refetch();
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
export default VideoTbRow;
