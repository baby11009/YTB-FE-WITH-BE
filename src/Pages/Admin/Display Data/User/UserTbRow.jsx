import { useRef, useState, useEffect } from "react";
import { dltData, updateData } from "../../../../Api/controller";
import { CheckBox2 } from "../../../../Component";
import { EditIcon, DeleteIcon, ThinArrowIcon } from "../../../../Assets/Icons";
import { Link } from "react-router-dom";
import { timeFormat3 } from "../../../../util/timeforMat";

const UserTbRow = ({
  data,
  od,
  limit,
  length,
  page,
  refetch,
  handleChecked,
  checkedList = [],
}) => {
  const containerRef = useRef();
  const [opened, setOpened] = useState(false);

  const roleList = ["admin", "user"];

  const handleChangeRole = async (id, role, currRole) => {
    setOpened(false);
    if (role === currRole) {
      alert(`${role} là role hiện tại của user với id ${id}`);
      return null;
    }
    const body = {
      role,
    };

    await updateData("user", id, body);
    refetch();
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
        <span className='font-[400] '>{data?.name}</span>
      </th>
      <th>
        <span className='font-[400] w-[80px] xsm:w-full inline-block overflow-hidden text-ellipsis'>
          {data?.email}
        </span>
      </th>
      <th className=' hidden sm:table-cell'>
        <div className='flex items-center h-full'>
          <div className='w-[100px] cursor-pointer relative' ref={containerRef}>
            <button
              className='w-full flex items-center justify-between px-[8px] py-[4px] border-b-[1px] rounded-[4px] '
              onClick={(e) => setOpened((prev) => !prev)}
            >
              <span className='font-[400]'>{data?.role}</span>
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
                {roleList.map((role, id) => (
                  <div
                    key={id}
                    onClick={() => {
                      handleChangeRole(data?._id, role, data?.role);
                    }}
                    className={`${
                      data?.role === role && "bg-black-0.1 "
                    } text-left px-[8px] my-[4px] hover:bg-black-0.2 leading-[32px] font-[400]`}
                  >
                    {role}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </th>
      <th className='hidden md:table-cell'>
        <div
          className={` ${
            data?.confirmed ? "text-green-500" : " text-red-500"
          } leading-[32px] font-[400]`}
        >
          {data?.confirmed.toString()}
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
                await dltData("user", data?._id);
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
export default UserTbRow;
