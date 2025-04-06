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
  QueryTextInput,
  QuerySelection,
} from "../../../../../../Component";
import VideoTbRow from "./VideoTbRow";
import { useAuthContext } from "../../../../../../Auth Provider/authContext";
import VideoUpsertModal from "./VideoUpsertModal";
import { getDataWithAuth } from "../../../../../../Api/getData";
import { dltManyData, dltData } from "../../../../../../Api/controller";
import { useQueryClient } from "@tanstack/react-query";
import { getDisplayUsingValue } from "../../../../../../util/func";

const initQueries = {
  limit: 10,
  page: 1,
  search: {
    type: "video",
  },
  sort: { createdAt: -1 },
};

const Video = () => {
  const queryClient = useQueryClient();

  const { setIsShowing, addToaster } = useAuthContext();

  const [queries, setQueries] = useState(initQueries);

  const [dataList, setDataList] = useState([]);

  const [checkedList, setCheckedList] = useState([]);

  const [isQueryBoxOpened, setIsQueryBoxOpened] = useState(false);

  const [queryOptions, setQueryOptions] = useState([]);

  const containerRef = useRef();

  const funcContainerRef = useRef();

  const tableHeader = useRef();

  const { data, refetch } = getDataWithAuth(
    "/user/video",
    queries,
    true,
    false,
  );

  const handleCheckedAll = useCallback(() => {
    setCheckedList((prev) => {
      if (prev.length === dataList.length) {
        return [];
      }

      const idList = dataList.map((item) => item?._id);

      return idList;
    });
  }, [dataList]);

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

    setQueries((prev) => {
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

  const showDeleteConfirm = (id) => {
    const handleDelete = async () => {
      await dltData(
        "/user/video",
        id,
        "video",
        () => {
          refetch();
        },
        undefined,
        addToaster,
      );
    };

    setIsShowing(
      <DeleteConfirm handleDelete={handleDelete} type={"video"} data={id} />,
    );
  };

  const showDeleteManyConfirm = () => {
    console.log(checkedList);
    const handleDeleteMany = async () => {
      await dltManyData(
        "/user/video/delete-many",
        checkedList,
        "video",
        () => {
          setCheckedList([]);
          refetch();
        },
        undefined,
        addToaster,
      );
    };

    setIsShowing(
      <DeleteConfirm
        handleDelete={handleDeleteMany}
        type={"Video"}
        data={checkedList.join(", ")}
      />,
    );
  };

  const showUpsertModal = () => {
    setIsShowing(<VideoUpsertModal title={"Uploading video"} />);
  };

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

  useEffect(() => {
    setCheckedList([]);
  }, [queries.page]);

  return (
    <div
      className='overflow-auto h-[calc(100%-44px)] relative scrollbar-3'
      ref={containerRef}
    >
      <div
        className='sticky top-0 z-[2000] min-w-[1000px]'
        ref={funcContainerRef}
      >
        <div className='flex flex-wrap gap-[24px] bg-black'>
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

          <div className=' self-end shrink-0 flex items-center justify-center gap-[8px]'>
            <button onClick={showUpsertModal}>
              <div className='p-[8px] hover:text-green-500'>
                <CreateIcon />
              </div>
            </button>
            {checkedList.length > 0 && (
              <button onClick={showDeleteManyConfirm}>
                <div className='p-[8px] hover:text-red-600'>
                  <TrashBinIcon />
                </div>
              </button>
            )}
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
          <div className='h-[48px] px-[20px] bg-black flex items-center justify-center gap-[12px] z-[10]'>
            <CheckBox2
              checked={
                checkedList.length === data?.data.length &&
                data?.data.length > 0
              }
              setChecked={handleCheckedAll}
            />
          </div>
          <div
            className='pl-[12px] flex-[2_0_400px] min-w-[400px]  bg-black  
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
            <VideoTbRow
              key={item?._id}
              data={item}
              checked={checkedList.includes(item?._id)}
              handleChecked={handleChecked}
              showDeleteConfirm={showDeleteConfirm}
            />
          ))}
        </div>
      </div>

      <div className='w-full bg-black fixed bottom-[0] right-0 mr-[12px] py-[6px]'>
        <Pagination
          setQueries={setQueries}
          currPage={queries?.page}
          totalPage={data?.totalPages}
        />
      </div>
    </div>
  );
};
export default Video;
