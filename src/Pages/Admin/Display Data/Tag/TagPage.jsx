import { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CreateIcon, SortIcon2, TrashBinIcon } from "../../../../Assets/Icons";
import { getData } from "../../../../Api/getData";
import { dltManyData, dltData } from "../../../../Api/controller";
import {
  Pagination,
  CustomeFuncBox,
  SearchTextInput,
  SearchSelection,
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

const TagPage = ({ openedMenu }) => {
  const { addToaster } = useAuthContext();

  const queryClient = useQueryClient();

  const [queriese, setQueriese] = useState(initQueriese);

  const [openedSearchBox, setOpenedSearchBox] = useState(false);

  const [searchList, setSearchList] = useState([]);

  const { data: tagData, refetch } = getData(
    "tag",
    queriese,
    queriese ? true : false,
    false,
  );

  const [tagList, setTagList] = useState([]);

  const tagSet = useRef(new Set());

  const [checkedList, setCheckedList] = useState([]);

  const [currMode, setCurrMode] = useState(undefined);

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
    setQueriese((prev) => ({
      ...prev,
      search: { ...prev.search, [searchName]: searchValue },
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
      id: "title",
      text: "Name",
      type: "input:text",
      searchType: 1,
      value: 1,
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
        const checkedSet = new Set(checkedList);
        const dataList = structuredClone(tagList).filter((data) => {
          if (!checkedSet.has(data?._id)) {
            tagSet.current.delete(data?._id);
            return data;
          }
        });
        setTagList(dataList);
        setCheckedList([]);
      },
      undefined,
      addToaster,
    );
  };

  const handleDelete = async (id) => {
    await dltData(
      "tag/",
      id,
      "Tag",
      undefined,
      () => {
        const dataList = structuredClone(tagList).filter((data) => {
          if (!(data._id === id)) {
            tagSet.current.delete(data?._id);
            return data;
          }
        });
        setTagList(dataList);
      },
      addToaster,
    );
  };

  const handleAddNewData = (newData) => {
    const setArr = [newData._id, ...tagSet.current];

    tagSet.current = new Set(setArr);

    setTagList((prev) => [newData, ...prev]);
  };

  useEffect(() => {
    if (tagData) {
      const dataList = [];
      tagData.data.forEach((tag) => {
        if (!tagSet.current.has(tag._id)) {
          tagSet.current.add(tag._id);
          dataList.push(tag);
        }
      });

      if (dataList.length > 0) {
        setTagList((prev) => [...prev, ...dataList]);
      }
    }
  }, [tagData]);

  useEffect(() => {
    return () => {
      queryClient.clear();
    };
  }, []);

  if (!tagData) return;

  return (
    <div className='overflow-auto h-[calc(100%-44px)] relative scrollbar-3 pb-[44px]'>
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
            <button onClick={handleDeleteMany}>
              <div className='p-[8px] hover:text-red-600'>
                <TrashBinIcon />
              </div>
            </button>
          </div>
        </div>
      </div>

      <Display
        openedMenu={openedMenu}
        dataList={tagList}
        handleAddNewData={handleAddNewData}
        handleChecked={handleChecked}
        handleCheckedAll={handleCheckedAll}
        handleDelete={handleDelete}
        checkedList={checkedList}
        currMode={currMode}
        setCurrMode={setCurrMode}
      />

      <div className='w-full bg-black fixed bottom-[0] right-0 mr-[28px] pb-[12px]'>
        <Pagination
          setQueriese={setQueriese}
          currPage={queriese.page}
          totalPage={tagData?.totalPages}
        />
      </div>
    </div>
  );
};
export default TagPage;
