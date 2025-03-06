import { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CreateIcon, TrashBinIcon, SortIcon2 } from "../../../../Assets/Icons";
import { getData } from "../../../../Api/getData";
import { dltManyData, dltData } from "../../../../Api/controller";
import {
  Pagination,
  CustomeFuncBox,
  SearchTextInput,
  SearchSelection,
} from "../../../../Component";
import { useAuthContext } from "../../../../Auth Provider/authContext";
import { Link } from "react-router-dom";
import Display from "./Display";
import { getDisplayUsingValue } from "../../../../util/func";

const limit = 10;
const initPrs = {
  limit,
  page: 1,
  reset: "name",
  sort: {
    createdAt: -1,
  },
  search: {},
};

const DisplayUser = ({ openedMenu }) => {
  const { addToaster } = useAuthContext();

  const queryClient = useQueryClient();

  const [queriese, setQueriese] = useState(initPrs);

  const [openedSearchBox, setOpenedSearchBox] = useState(false);

  const [searchList, setSearchList] = useState([]);

  const { data: usersData, refetch } = getData(
    "user",
    queriese,
    queriese ? true : false,
    false,
  );

  const [checkedList, setCheckedList] = useState([]);

  const containerRef = useRef();

  const handleOnClick = (data) => {
    setSearchList((prev) => {
      if (data.searchType === 1) {
        return [...prev, data];
      }

      return [data];
    });

    searchBtnList.current = searchBtnList.current.filter(
      (prev) => prev.id !== data.id,
    );
  };

  const handleClose = (searchData) => {
    setSearchList((prev) =>
      prev.filter((search) => search.id !== searchData.id),
    );
    setQueriese((prev) => {
      let queries = structuredClone(prev);
      if (searchData.buttonType === "sort") {
        queries.sort[searchData.id] = -1;
      } else {
        delete queries.search[searchData.id];
      }

      return queries;
    });
    searchBtnList.current.push(searchData);
  };

  const handleSearch = (searchName, searchValue) => {
    if (queriese.search[searchName] === searchValue) return;
    setQueriese((prev) => ({
      ...prev,
      search: { ...prev.search, [searchName]: searchValue },
      page: 1,
    }));
  };

  const handleSort = (sortKey, sortValue) => {
    if (queriese.sort[sortKey] === sortValue) return;
    setQueriese((prev) => ({
      ...prev,
      sort: { ...prev.sort, [sortKey]: sortValue },
      page: 1,
    }));
  };

  // searchType  = 1 it can combine with other search else it cannot go with other search
  const searchBtnList = useRef([
    {
      id: "name",
      text: "Name",
      type: "input:text",
      searchType: 1,
      handleOnClick: handleOnClick,
    },
    {
      id: "email",
      text: "Email",
      type: "input:text",
      searchType: 1,
      handleOnClick: handleOnClick,
    },
    {
      id: "role",
      text: "Role",
      type: "select",
      searchType: 1,
      options: [
        { id: "user", display: "User" },
        { id: "admin", display: "Admin" },
      ],
      handleOnClick: handleOnClick,
    },
    {
      id: "confirmed",
      text: "Confirmed",
      type: "select",
      searchType: 1,
      options: [
        { id: true, display: "True" },
        { id: false, display: "False" },
      ],
      handleOnClick: handleOnClick,
    },
    {
      id: "createdAt",
      text: "Date",
      type: "select",
      searchType: 1,
      buttonType: "sort",
      options: [
        { id: -1, display: "Newest" },
        { id: 1, display: "Oldest" },
      ],
      handleOnClick: handleOnClick,
    },
  ]);

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

  const handleDelete = async (id) => {
    await dltData(
      "user/",
      id,
      "User",
      undefined,
      () => {
        refetch();
      },
      addToaster,
    );
  };

  useEffect(() => {
    return () => {
      queryClient.clear();
    };
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [usersData]);

  if (!usersData) return;

  return (
    <div
      className='overflow-auto h-full relative scrollbar-3'
      ref={containerRef}
    >
      <div className='sticky left-0 top-0 pt-[8px]  bg-black z-[100]'>
        <h2 className='text-[28px] leading-[44px] font-[500]'>Users</h2>
      </div>

      <div className='sticky h-[40px] left-0 top-[52px] z-[2000] w-full'>
        <div className='flex gap-[24px] bg-black'>
          <div className='relative flex-shrink-0'>
            <button
              className='size-[40px] p-[8px]'
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setOpenedSearchBox((prev) => !prev);
              }}
            >
              <SortIcon2 />
            </button>
            {openedSearchBox && (
              <CustomeFuncBox
                style={"left-[100%] top-[100%] min-w-[200px]"}
                opened={openedSearchBox}
                setOpened={setOpenedSearchBox}
                funcList1={searchBtnList.current}
              />
            )}
          </div>

          <div className='flex-1 flex flex-wrap gap-[16px] py-[4px]'>
            {searchList.length > 0 &&
              searchList.map((search) => {
                if (search.type === "input:text") {
                  return (
                    <SearchTextInput
                      key={search.id}
                      searchData={search}
                      currValue={queriese.search[search.id]}
                      handleSearch={handleSearch}
                      handleClose={handleClose}
                    />
                  );
                } else if (search.type === "select") {
                  return (
                    <SearchSelection
                      key={search.id}
                      searchData={search}
                      currValue={getDisplayUsingValue(
                        search.options,
                        search?.buttonType === "sort"
                          ? queriese.sort[search.id]
                          : queriese.search[search.id],
                      )}
                      handleSearch={
                        search?.buttonType === "sort"
                          ? handleSort
                          : handleSearch
                      }
                      handleClose={handleClose}
                    />
                  );
                }
              })}
          </div>

          <div className=' self-end flex items-center justify-center gap-[8px]'>
            <Link to={"./upsert"}>
              <div className='p-[8px] hover:text-green-500'>
                <CreateIcon />
              </div>
            </Link>
            <button onClick={handleDeleteMany}>
              <div className='p-[8px] hover:text-red-600'>
                <TrashBinIcon />
              </div>
            </button>
          </div>
        </div>
      </div>
      <Display
        dataList={usersData.data}
        refetch={refetch}
        handleChecked={handleChecked}
        handleCheckedAll={handleCheckedAll}
        handleDelete={handleDelete}
        limit={limit}
        checkedList={checkedList}
        page={queriese.page}
      />

      <Pagination
        setQueriese={setQueriese}
        currPage={queriese.page}
        totalPage={usersData?.totalPages || 0}
      />
    </div>
  );
};
export default DisplayUser;
