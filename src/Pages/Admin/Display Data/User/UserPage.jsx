import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { DeleteAllIcon, CreateIcon } from "../../../../Assets/Icons";
import { getDataWithAuth } from "../../../../Api/getData";
import { dltManyData } from "../../../../Api/controller";
import { Pagination } from "../../../../Component";
import { useAuthContext } from "../../../../Auth Provider/authContext";
import { Link } from "react-router-dom";
import Search from "./Search";
import Filter from "./Filter";
import Display from "./Display";

const limit = 8;
const initPrs = {
  limit,
  page: 1,
  reset: "name",
  name: "",
  email: "",
  createdAt: "mới nhất",
};

const DisplayUser = ({ openedMenu }) => {
  const { addToaster } = useAuthContext();

  const queryClient = useQueryClient();

  const [totalPage, setTotalPage] = useState(1);

  const [params, setParams] = useState(initPrs);

  const [currTag, setCurrTag] = useState("name");

  const [searchValue, setSearchValue] = useState("");

  const tagList = useRef(["name", "email"]);

  const { data: usersData, refetch } = getDataWithAuth("user", params);

  const [mockArr, setMockArr] = useState([]);

  const [checkedList, setCheckedList] = useState([]);

  const handleChecked = (id) => {
    setCheckedList((prev) => {
      if (prev.includes(id)) {
        return [...prev.filter((data) => data !== id)];
      }

      return [...prev, id];
    });
  };

  const handleCheckedAll = () => {
    if (checkedList.length === usersData?.data?.length) {
      setCheckedList([]);
    } else {
      const idList = usersData?.data?.map((item) => item?._id);
      setCheckedList(idList);
    }
  };

  const handleDeleteMany = async () => {
    await dltManyData(
      "user/delete-many",
      checkedList,
      "user",
      () => {
        setCheckedList([]);
        refetch();
      },
      undefined,
      addToaster,
    );
  };

  useLayoutEffect(() => {
    if (usersData) {
      setTotalPage(usersData?.totalPages);
      if (limit - usersData.qtt > 0) {
        setMockArr(Array.from({ length: limit - usersData.qtt }, (_, i) => i));
      } else {
        setMockArr([]);
      }
    }

    return () => {
      setCheckedList([]);
    };
  }, [usersData]);

  useEffect(() => {
    let timeOut = setTimeout(() => {
      setParams((prev) => {
        return {
          ...prev,
          [currTag]: searchValue,
          page: 1,
        };
      });
    }, 600);

    return () => {
      clearTimeout(timeOut);
    };
  }, [searchValue]);

  useEffect(() => {
    setParams((prev) => {
      let obj = { ...prev };

      let tagValue;

      tagList.current.forEach((item) => {
        if (item !== currTag && obj[item]) {
          tagValue = obj[item];
          obj[item] = "";
          obj[currTag] = tagValue;
        }
      });

      return {
        ...obj,
        page: 1,
      };
    });
  }, [currTag]);

  useEffect(() => {
    return () => {
      queryClient.clear();
    };
  }, []);

  return (
    <>
      <div
        className={`flex sm:items-center justify-between md:py-[16px] ${
          openedMenu ? "xl:py-[8px]" : ""
        }`}
      >
        <h2 className='text-[28px] leading-[44px] font-[500]'>Users</h2>
        <div className='flex flex-col sm:flex-row sm:items-center gap-[12px]'>
          <div className='flex items-center justify-end sm:justify-start gap-[12px]'>
            {/* Search */}
            <Search
              currTag={currTag}
              setCurrTag={setCurrTag}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              tagList={tagList.current}
            />

            {/* Create */}
            <Link
              className='size-[32px] rounded-[5px] flex items-center justify-center 
           group border-[2px] border-[rgba(255,255,255,0.4)] hover:border-green-400 transition-all duration-[0.2s] ease-in
          '
              to={"upsert"}
            >
              <div className='text-[rgba(255,255,255,0.4)] group-hover:text-green-400  transition-all duration-[0.2s]'>
                <CreateIcon />
              </div>
            </Link>
          </div>
          <div className='flex items-center gap-[12px]'>
            {/* Delete many */}
            <button
              className='size-[32px] rounded-[5px] flex items-center justify-center 
             group border-[2px] border-[rgba(255,255,255,0.4)] hover:border-red-600 transition-all duration-[0.2s] ease-in
            '
              onClick={handleDeleteMany}
            >
              <div className='text-[rgba(255,255,255,0.4)] group-hover:text-red-600  transition-all duration-[0.2s]'>
                <DeleteAllIcon />
              </div>
            </button>

            {/* Filter */}
            <Filter params={params} setParams={setParams} />
          </div>
        </div>
      </div>

      <Display
        dataList={usersData.data}
        refetch={refetch}
        handleChecked={handleChecked}
        handleCheckedAll={handleCheckedAll}
        mockArr={mockArr}
        limit={limit}
        checkedList={checkedList}
        page={params.page}
      />

      <Pagination
        setParams={setParams}
        currPage={params.page}
        totalPage={totalPage}
      />
    </>
  );
};
export default DisplayUser;
