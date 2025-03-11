import {
  SortIcon2,
  CreateIcon,
  TrashBinIcon,
} from "../../../../../../Assets/Icons";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  CustomeFuncBox,
  CheckBox2,
  DeleteConfirm,
  Pagination,
  QuerySelection,
  QueryTextInput,
} from "../../../../../../Component";
import ShortTbRow from "./ShortTbRow";
import { useAuthContext } from "../../../../../../Auth Provider/authContext";
import ShortUpsertModal from "./ShortUpsertModal";
import { getDataWithAuth } from "../../../../../../Api/getData";
import { dltManyData } from "../../../../../../Api/controller";
import { useQueryClient } from "@tanstack/react-query";

const initQueriese = {
  limit: 10,
  page: 1,
  search: {
    type: "short",
  },
  sort: { createdAt: -1 },
};

const Short = () => {
  const queryClient = useQueryClient();

  const { setIsShowing, addToaster } = useAuthContext();

  const [searching, setSearching] = useState(undefined);

  const [opened, setOpened] = useState(false);

  const [queriese, setQueriese] = useState(initQueriese);

  const [dataList, setDataList] = useState([]);

  const [checkedList, setCheckedList] = useState([]);

  const [isQueryBoxOpened, setIsQueryBoxOpened] = useState(false);

  const [queryOptions, setQueryOptions] = useState([]);

  const containerRef = useRef();

  const funcContainerRef = useRef();

  const tableHeader = useRef();

  const { data, refetch } = getDataWithAuth(
    "/client/video",
    queriese,
    true,
    false,
  );

  const handleCheckedAll = useCallback(() => {
    if (checkedList.length === dataList.length) {
      setCheckedList([]);
    } else {
      const idList = dataList.map((item) => item?._id);

      setCheckedList(idList);
    }
  }, [checkedList, dataList]);

  const handleChecked = useCallback((id) => {
    setCheckedList((prev) => {
      const index = prev.indexOf(id);
      if (index === -1) {
        return [...prev, id];
      } else {
        return [...prev.filter((data) => data !== id)];
      }
    });
  }, []);

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
      const { search, sort } = prev;

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

      return prev;
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
      text: "Title",
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
    {
      id: "view",
      text: "View",
      type: "select",
      buttonType: "sort",
      renderCondition: true,
      options: [
        { id: -1, display: "Most popular" },
        { id: 1, display: "Least popular" },
      ],
      handleOnClick: handleOnClick,
    },
    {
      id: "like",
      text: "Like",
      type: "select",
      buttonType: "sort",
      renderCondition: true,
      options: [
        { id: -1, display: "Most liked" },
        { id: 1, display: "Least liked" },
      ],
      handleOnClick: handleOnClick,
    },
    {
      id: "dislike",
      text: "Dislike",
      type: "select",
      buttonType: "sort",
      renderCondition: true,
      options: [
        { id: -1, display: "Most disliked" },
        { id: 1, display: "Least disliked" },
      ],
      handleOnClick: handleOnClick,
    },
    {
      id: "totalCmt",
      text: "Comment",
      type: "select",
      buttonType: "sort",
      renderCondition: true,
      options: [
        { id: -1, display: "Most commented" },
        { id: 1, display: "Least commented" },
      ],
      handleOnClick: handleOnClick,
    },
  ]);

  const handleDeleteMany = async () => {
    await dltManyData(
      "/client/video/delete-many",
      checkedList,
      "short",
      () => {
        setCheckedList([]);
        refetch();
      },
      undefined,
      addToaster,
    );
  };

  const showDltConfirm = () => {
    if (checkedList.length < 1) {
      alert("Please select at least one item");
      return;
    }
    setIsShowing(
      <DeleteConfirm
        handleDelete={handleDeleteMany}
        type={"Short"}
        data={checkedList.join(", ")}
      />,
    );
  };

  const showUpsertModal = () => {
    setIsShowing(<ShortUpsertModal title={"Uploading short"} />);
  };

  useEffect(() => {
    setCheckedList([]);
  }, [queriese.page]);

  useEffect(() => {
    if (data) {
      setDataList([...data?.data]);
      containerRef.current.scrollTop = 0;
    }
  }, [data]);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      tableHeader.current.style.top =
        funcContainerRef.current.clientHeight - 0.4 + "px";
    });
    observer.observe(funcContainerRef.current);

    return () => {
      observer.disconnect();
      setIsShowing(undefined);
      queryClient.clear();
    };
  }, []);

  return (
    <div
      className='overflow-auto max-h-full min-h-[500px] relative scrollbar-3'
      ref={containerRef}
    >
      <div
        className='sticky left-0 top-0 z-[2000] w-full'
        ref={funcContainerRef}
      >
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

          <div className='flex-1 flex flex-wrap gap-[16px] items-center'>
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
            <button onClick={showUpsertModal}>
              <div className='p-[8px] hover:text-green-500'>
                <CreateIcon />
              </div>
            </button>
            <button onClick={showDltConfirm}>
              <div className='p-[8px] hover:text-red-600'>
                <TrashBinIcon />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* table */}
      <div className='min-w-full w-fit'>
        {/* Head */}
        <div
          className='sticky z-[10] top-[40px] bg-black text-[12px] font-[500] leading-[48px]
           text-gray-A items-center border-y-[1px] border-gray-A flex'
          ref={tableHeader}
        >
          <div className='sticky left-0 h-[48px] px-[20px] bg-black flex items-center justify-center gap-[12px] z-[10]'>
            <CheckBox2
              checked={
                checkedList.length === data?.data.length &&
                data?.data.length > 0
              }
              setChecked={handleCheckedAll}
            />
          </div>
          <div
            className='sticky left-[60px] pl-[12px] flex-[2_0_400px] min-w-[400px]  bg-black  
              border-r-[1px] border-gray-A z-[10]'
          >
            Video
          </div>
          <div className='flex-[1_0_100px] min-w-[100px] mx-[12px]'>Date</div>
          <div className='flex-[1_0_100px] min-w-[100px] mx-[12px] text-end '>
            View
          </div>
          <div className='flex-[1_0_100px] min-w-[100px] mx-[12px] text-end'>
            Comments
          </div>
          <div className='flex-[1_0_60px] min-w-[60px] mx-[12px] text-end'>
            Like
          </div>
          <div className='flex-[1_0_60px] min-w-[60px] mx-[12px] text-end'>
            Dislike
          </div>
        </div>
        {/* Body */}
        <div className='flex flex-col z-[2]'>
          {dataList.map((item) => (
            <ShortTbRow
              key={item?._id}
              handleChecked={handleChecked}
              checked={checkedList.includes(item?._id)}
              data={item}
              refetch={refetch}
            />
          ))}
        </div>
      </div>
      <Pagination
        setQueriese={setQueriese}
        currPage={queriese?.page}
        totalPage={data?.totalPages}
      />
    </div>
  );
};
export default Short;
