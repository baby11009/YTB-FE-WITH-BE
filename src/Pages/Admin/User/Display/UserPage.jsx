import { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CreateIcon, TrashBinIcon, SortIcon2 } from "../../../../Assets/Icons";
import { getData } from "../../../../Api/getData";
import { dltManyData, dltData } from "../../../../Api/controller";
import {
  Pagination,
  CustomeFuncBox,
  QueryTextInput,
  QuerySelection,
} from "../../../../Component";
import { useAuthContext } from "../../../../Auth Provider/authContext";
import { Link } from "react-router-dom";
import Display from "./Display";
import { getDisplayUsingValue } from "../../../../util/func";

const limit = 10;
const initPrs = {
  limit,
  page: 1,
  sort: {
    createdAt: -1,
  },
  search: {},
};

const DisplayUser = () => {
  const { addToaster } = useAuthContext();

  const queryClient = useQueryClient();

  const [queries, setQueries] = useState(initPrs);

  const [isQueryBoxOpened, setIsQueryBoxOpened] = useState(false);

  const [queryOptions, setQueryOptions] = useState([]);

  const [checkedList, setCheckedList] = useState(new Set());

  const totalPage = useRef();

  const containerRef = useRef();

  const funcContainerRef = useRef();

  const tableHeader = useRef();

  const { data: usersData, refetch } = getData(
    "/admin/user",
    queries,
    queries ? true : false,
    false,
  );

  const handleOnClick = (queryData) => {
    setQueryOptions((prev) => [...prev, queryData]);

    queryOptionBtns.current = queryOptionBtns.current.map((query) => {
      if (query.id === queryData.id) {
        query.renderCondition = false;
      }
      return query;
    });
  };

  const handleClose = (queryData) => {
    setQueryOptions((prev) =>
      prev.filter((search) => search.id !== queryData.id),
    );

    setQueries((prev) => {
      const prevClone = { ...prev };
      const { search, sort } = prevClone;

      if (queryData.buttonType === "sort") {
        const { [queryData.id]: _, ...rest } = sort;
        // Check if is there any sort query in the queirese
        // If not, set default sort is createdAt = -1
        if (Object.keys(rest).length > 0) {
          prev.sort = rest;
        } else {
          prev.sort = { createdAt: -1 };
        }
      } else {
        const { [queryData.id]: _, ...rest } = search;
        prev.search = rest;
      }

      prevClone.page = 1;

      return prevClone;
    });

    queryOptionBtns.current = queryOptionBtns.current.map((queryOption) => {
      if (queryOption.id === queryData.id) {
        queryOption.renderCondition = true;
      }
      return queryOption;
    });
  };

  const handleSearch = (searchKey, searchValue) => {
    if (queries.search[searchKey] === searchValue) return;
    setQueries((prev) => ({
      ...prev,
      search: { ...prev.search, [searchKey]: searchValue },
      page: 1,
    }));
  };

  const handleSort = (sortKey, sortValue) => {
    if (queries.sort[sortKey] === sortValue) return;

    const sortOptionIds = queryOptions.map((query) => {
      if (query.buttonType === "sort") {
        return query.id;
      }
    });

    const sortObj = {};

    sortOptionIds.forEach((sortOptionId) => {
      let value;
      if (sortOptionId === sortKey) {
        value = sortValue;
      } else if (queries.sort[sortOptionId]) {
        value = queries.sort[sortOptionId];
      }
      sortObj[sortOptionId] = value;
    });

    setQueries((prev) => ({
      ...prev,
      sort: sortObj,
      page: 1,
    }));
  };

  const queryOptionBtns = useRef([
    {
      id: "name",
      text: "Name",
      type: "input:text",
      buttonType: "search",
      renderCondition: true,
      handleOnClick: handleOnClick,
    },
    {
      id: "email",
      text: "Email",
      type: "input:text",
      buttonType: "search",
      renderCondition: true,
      handleOnClick: handleOnClick,
    },
    {
      id: "role",
      text: "Role",
      type: "select",
      buttonType: "search",
      renderCondition: true,
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
      buttonType: "search",
      renderCondition: true,
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
      buttonType: "sort",
      renderCondition: true,
      options: [
        { id: -1, display: "Newest" },
        { id: 1, display: "Oldest" },
      ],
      handleOnClick: handleOnClick,
    },
  ]);

  const handleChecked = (id) => {
    setCheckedList((prev) => {
      const prevClone = structuredClone(prev);
      if (prevClone.has(id)) {
        prevClone.delete(id);
      } else {
        prevClone.add(id);
      }

      return new Set([...prevClone]);
    });
  };

  const handleCheckedAll = () => {
    let list;
    if (checkedList.size === usersData?.data?.length) {
      list = new Set();
    } else {
      list = new Set(usersData?.data?.map((item) => item?._id));
    }
    setCheckedList(list);
  };

  const handleDeleteMany = async () => {
    await dltManyData(
      "/admin/user/delete-many",
      [...checkedList],
      "user",
      () => {
        setCheckedList(new Set());
        refetch();
      },
      undefined,
      addToaster,
    );
  };

  const handleDelete = async (id) => {
    await dltData(
      "/admin/user",
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
    if (usersData && containerRef.current) {
      containerRef.current.scrollTop = 0;
      totalPage.current = usersData.totalPages || 1;
    }

    return () => {
      setCheckedList(new Set());
    };
  }, [usersData]);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      tableHeader.current.style.top =
        funcContainerRef.current.clientHeight + 52 - 0.4 + "px";
    });

    observer.observe(funcContainerRef.current);
    return () => {
      observer.disconnect();
      queryClient.clear();
    };
  }, []);

  return (
    <div
      className='overflow-auto h-[calc(100%-44px)] relative scrollbar-3'
      ref={containerRef}
    >
      <div className='sticky left-0 top-0 pt-[8px]  bg-black z-[100]'>
        <h2 className='text-[28px] leading-[44px] font-[500]'>Users</h2>
      </div>

      <div
        className='sticky top-[52px] z-[2000] min-w-[782px] pb-[4px] bg-black'
        ref={funcContainerRef}
      >
        <div className='flex gap-[24px]'>
          <div className='relative flex-shrink-0'>
            <button
              className='size-[40px] p-[8px]'
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setIsQueryBoxOpened((prev) => !prev);
              }}
            >
              <SortIcon2 />
            </button>
            {isQueryBoxOpened && (
              <CustomeFuncBox
                style={"left-[100%] top-[100%] min-w-[200px]"}
                opened={isQueryBoxOpened}
                setOpened={setIsQueryBoxOpened}
                funcList1={queryOptionBtns.current}
              />
            )}
          </div>

          <div className='flex-1 flex flex-wrap gap-[16px]'>
            {queryOptions.length > 0 &&
              queryOptions.map((query) => {
                if (query.type === "input:text") {
                  return (
                    <QueryTextInput
                      key={query.id}
                      queryData={query}
                      currValue={queries.search[query.id]}
                      handleExecuteQuery={handleSearch}
                      handleClose={handleClose}
                    />
                  );
                } else if (query.type === "select") {
                  return (
                    <QuerySelection
                      key={query.id}
                      queryData={query}
                      currValue={getDisplayUsingValue(
                        query.options,
                        query?.buttonType === "sort"
                          ? queries.sort[query.id]
                          : queries.search[query.id],
                      )}
                      handleExecuteQuery={
                        query?.buttonType === "sort" ? handleSort : handleSearch
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
            {checkedList.size > 0 && (
              <button onClick={handleDeleteMany}>
                <div className='p-[8px] hover:text-red-600'>
                  <TrashBinIcon />
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      <Display
        dataList={usersData?.data}
        checkedList={checkedList}
        handleChecked={handleChecked}
        handleCheckedAll={handleCheckedAll}
        handleDelete={handleDelete}
        tableHeader={tableHeader}
      />

      <div className='w-full bg-black fixed bottom-[0] right-0 py-[6px]'>
        <Pagination
          setQueries={setQueries}
          currPage={queries.page}
          totalPage={totalPage.current}
        />
      </div>
    </div>
  );
};
export default DisplayUser;
