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
  createdAt: "mới nhất",
  title: "",
  clearCache: "tag",
};

const TagPage = ({ openedMenu }) => {
  const { addToaster } = useAuthContext();
  const queryClient = useQueryClient();

  const [totalPage, setTotalPage] = useState(1);

  const [params, setParams] = useState(initPrs);

  const [searchValue, setSearchValue] = useState("");

  const { data: tagData, refetch } = getDataWithAuth("tag", params);

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
    if (checkedList.length === tagData?.data?.length) {
      setCheckedList([]);
    } else {
      const idList = tagData?.data?.map((item) => item?._id);
      setCheckedList(idList);
    }
  };

  const handleDeleteMany = async () => {
    await dltManyData(
      "tag/delete-many",
      checkedList,
      "tag",
      () => {
        setCheckedList([]);
        refetch();
      },
      undefined,
      addToaster,
    );
  };

  useLayoutEffect(() => {
    if (tagData) {
      setTotalPage(tagData?.totalPages);
      if (limit - tagData.qtt > 0) {
        setMockArr(Array.from({ length: limit - tagData.qtt }, (_, i) => i));
      } else {
        setMockArr([]);
      }
    }

    return () => {
      setCheckedList([]);
    };
  }, [tagData]);

  useEffect(() => {
    let timeOut = setTimeout(() => {
      setParams((prev) => {
        return {
          ...prev,
          title: searchValue,
          page: 1,
        };
      });
    }, 600);

    return () => {
      clearTimeout(timeOut);
    };
  }, [searchValue]);

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
            <Search searchValue={searchValue} setSearchValue={setSearchValue} />

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
        dataList={tagData.data}
        page={params.page}
        handleChecked={handleChecked}
        handleCheckedAll={handleCheckedAll}
        mockArr={mockArr}
        limit={limit}
        checkedList={checkedList}
        refetch={refetch}
      />

      <Pagination
        setParams={setParams}
        currPage={params.page}
        totalPage={totalPage}
      />
    </>
  );
};
export default TagPage;
