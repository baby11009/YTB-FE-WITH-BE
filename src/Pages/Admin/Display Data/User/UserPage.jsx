import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  DeleteAllIcon,
  CreateIcon,
  TrashBinIcon,
  SortIcon2,
  SearchIcon,
} from "../../../../Assets/Icons";
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
import Search from "./Search";
import Filter from "./Filter";
import Display from "./Display";

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

  const [totalPage, setTotalPage] = useState(1);

  const [queriese, setQueriese] = useState(initPrs);

  const [currTag, setCurrTag] = useState("name");

  const [searchValue, setSearchValue] = useState("");

  const [openedSearchBox, setOpenedSearchBox] = useState(false);

  const [searchList, setSearchList] = useState([]);

  const tagList = useRef(["name", "email"]);

  const { data: usersData, refetch } = getData(
    "user",
    queriese,
    queriese ? true : false,
    false,
  );

  const [mockArr, setMockArr] = useState([]);

  const [checkedList, setCheckedList] = useState([]);

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
      delete queries.search[searchData.id];

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
      setQueriese((prev) => {
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
    setQueriese((prev) => {
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

  if (!usersData) return;

  return (
    <div className='overflow-auto h-full relative scrollbar-3'>
      {/* <div
        className={`flex sm:items-center justify-between md:py-[16px] ${
          openedMenu ? "xl:py-[8px]" : ""
        }`}
      >
        <h2 className='text-[28px] leading-[44px] font-[500]'>Users</h2>
        <div className='flex flex-col sm:flex-row sm:items-center gap-[12px]'>
          <div className='flex items-center justify-end sm:justify-start gap-[12px]'>

            <Search
              currTag={currTag}
              setCurrTag={setCurrTag}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              tagList={tagList.current}
            />

     
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

            <Filter params={queriese} setQueriese={setQueriese} />
          </div>
        </div>
      </div> */}
      <div className='sticky left-0 top-0 pt-[8px]  bg-black z-[100]'>
        <h2 className='text-[28px] leading-[44px] font-[500]'>Users</h2>
      </div>
      <div className='sticky left-0 top-[52px] z-[2000] w-full'>
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
                      currValue={queriese.search[search.id]}
                      handleSearch={handleSearch}
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
            <button>
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
        totalPage={totalPage}
      />
    </div>
  );
};
export default DisplayUser;
