import { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CreateIcon, SortIcon2, TrashBinIcon } from "../../../../Assets/Icons";
import { getData } from "../../../../Api/getData";
import { dltManyData, dltData } from "../../../../Api/controller";
import {
  Pagination,
  CustomeFuncBox,
  QueryTextInput,
  QuerySelection,
} from "../../../../Component";
import { getDisplayUsingValue } from "../../../../util/func";
import { useAuthContext } from "../../../../Auth Provider/authContext";
import Display from "./Display";

const limit = 12;
const initQueriese = {
  limit,
  page: 1,
  sort: {
    createdAt: -1,
  },
  search: {},
  clearCache: "tag",
};

const TagPage = () => {
  const { addToaster, openedMenu } = useAuthContext();

  const queryClient = useQueryClient();

  const [queriese, setQueriese] = useState(initQueriese);

  const [isQueryBoxOpened, setIsQueryBoxOpened] = useState(false);

  const [queryOptions, setQueryOptions] = useState([]);

  const { data: tagData, refetch } = getData(
    "/admin/tag",
    queriese,
    queriese ? true : false,
    false,
  );

  const [tagList, setTagList] = useState([]);

  const [checkedList, setCheckedList] = useState(new Set());

  const [currMode, setCurrMode] = useState(undefined);

  const containerRef = useRef();

  const totalPage = useRef();

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

    setQueriese((prev) => {
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
    if (queriese.search[searchKey] === searchValue) return;
    setQueriese((prev) => ({
      ...prev,
      search: { ...prev.search, [searchKey]: searchValue },
      page: 1,
    }));
  };

  const handleSort = (sortKey, sortValue) => {
    if (queriese.sort[sortKey] === sortValue) return;

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
      } else if (queriese.sort[sortOptionId]) {
        value = queriese.sort[sortOptionId];
      }
      sortObj[sortOptionId] = value;
    });

    setQueriese((prev) => ({
      ...prev,
      sort: sortObj,
      page: 1,
    }));
  };

  const queryOptionBtns = useRef([
    {
      id: "title",
      text: "Name",
      type: "input:text",
      buttonType: "search",
      renderCondition: true,
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
    if (checkedList.size === tagData?.data?.length) {
      list = new Set();
    } else {
      list = new Set(tagData?.data?.map((item) => item?._id));
    }
    setCheckedList(list);
  };

  const handleDeleteMany = async () => {
    await dltManyData(
      "/admin/tag/delete-many",
      [...checkedList],
      "tag",
      () => {
        refetch();
        setCheckedList(new Set());
      },
      undefined,
      addToaster,
    );
  };

  const handleDelete = async (id) => {
    await dltData(
      "/admin/tag/",
      id,
      "Tag",
      undefined,
      () => {
        refetch();
      },
      addToaster,
    );
  };

  const handleUpdate = (data) => {
    setTagList((prev) => {
      return prev.map((tag) => {
        if (tag._id === data._id) {
          return data;
        }
        return tag;
      });
    });
  };

  useEffect(() => {
    if (tagData) {
      setTagList([...tagData.data]);
      containerRef.current.scrollTop = 0;
      setCurrMode(undefined);
      totalPage.current = tagData.totalPages || 1;
    }

    return () => {
      setCheckedList(new Set());
    };
  }, [tagData]);

  useEffect(() => {
    return () => {
      queryClient.clear();
    };
  }, []);

  return (
    <div
      className='overflow-auto h-[calc(100%-44px)] relative scrollbar-3'
      ref={containerRef}
    >
      <div className='sticky left-0 top-0 pt-[8px]  bg-black z-[100]'>
        <h2 className='text-[28px] leading-[44px] font-[500]'>Tags</h2>
      </div>

      <div className='sticky h-[40px] left-0 top-[52px] z-[2000] w-full'>
        <div className='flex gap-[24px] bg-black'>
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

          <div className='flex-1 flex flex-wrap gap-[16px] py-[4px]'>
            {queryOptions.length > 0 &&
              queryOptions.map((query) => {
                if (query.type === "input:text") {
                  return (
                    <QueryTextInput
                      key={query.id}
                      queryData={query}
                      currValue={queriese.search[query.id]}
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
                          ? queriese.sort[query.id]
                          : queriese.search[query.id],
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
            <button
              className={`${currMode === "insert" ? "invisible" : "visible"}`}
              onClick={() => {
                setCurrMode("insert");
              }}
            >
              <div className='p-[8px] hover:text-green-500'>
                <CreateIcon />
              </div>
            </button>
            {checkedList.size > 0 && !currMode && (
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
        openedMenu={openedMenu}
        dataList={tagList}
        handleChecked={handleChecked}
        handleCheckedAll={handleCheckedAll}
        handleDelete={handleDelete}
        refetch={refetch}
        handleUpdate={handleUpdate}
        checkedList={checkedList}
        currMode={currMode}
        setCurrMode={setCurrMode}
      />

      <div className='w-full bg-black fixed bottom-[0] right-0 mr-[28px] py-[6px]'>
        <Pagination
          setQueriese={setQueriese}
          currPage={queriese.page}
          totalPage={totalPage.current}
        />
      </div>
    </div>
  );
};
export default TagPage;
