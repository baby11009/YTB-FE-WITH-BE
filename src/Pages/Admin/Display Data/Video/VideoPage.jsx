import { Link } from "react-router-dom";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CreateIcon, SortIcon2, TrashBinIcon } from "../../../../Assets/Icons";
import { getData } from "../../../../Api/getData";
import { dltManyData, dltData } from "../../../../Api/controller";
import {
  getDisplayUsingValue,
  upperCaseFirstChar,
} from "../../../../util/func";
import Display from "./Display";
import {
  Pagination,
  CustomeFuncBox,
  QueryTextInput,
  QuerySelection,
} from "../../../../Component";
import { useAuthContext } from "../../../../Auth Provider/authContext";

const limit = 10;
const initQueriese = {
  limit,
  page: 1,
  search: {},
  sort: {
    createdAt: -1,
  },
};

const VideoPage = ({ type }) => {
  const { addToaster } = useAuthContext();

  const queryClient = useQueryClient();

  const [queriese, setQueriese] = useState({
    ...initQueriese,
    search: { type: type },
  });

  const [isQueryBoxOpened, setIsQueryBoxOpened] = useState(false);

  const [queryOptions, setQueryOptions] = useState([]);

  const [checkedList, setCheckedList] = useState(new Set());

  const totalPage = useRef();

  const containerRef = useRef();

  const funcContainerRef = useRef();

  const tableHeader = useRef();

  const { data: videosData, refetch } = getData(
    "/admin/video",
    queriese,
    true,
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
      text: "Title",
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
      id: "name",
      text: "Channel name",
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
    let listSet;
    if (checkedList.size === videosData?.data?.length) {
      listSet = new Set();
    } else {
      listSet = new Set(videosData?.data?.map((item) => item?._id));
    }
    setCheckedList(listSet);
  };
  const handleDeleteMany = async () => {
    await dltManyData(
      "/admin/video/delete-many",
      [...checkedList],
      "video",
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
      "/admin/video",
      id,
      "Video",
      undefined,
      () => {
        refetch();
      },
      addToaster,
    );
  };

  useLayoutEffect(() => {
    if (videosData && containerRef.current) {
      containerRef.current.scrollTop = 0;
      totalPage.current = videosData.totalPages || 1;
    }

    return () => {
      setCheckedList(new Set());
    };
  }, [videosData]);

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
        <h2 className='text-[28px] leading-[44px] font-[500]'>
          {upperCaseFirstChar(type)}s
        </h2>
      </div>
      <div
        className='sticky left-0 top-[52px] z-[2000] min-w-[1224px] pb-[4px] bg-black'
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

          <div className='flex-1 flex flex-wrap items-center gap-[16px]'>
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
        dataList={videosData?.data}
        checkedList={checkedList}
        handleChecked={handleChecked}
        handleCheckedAll={handleCheckedAll}
        handleDelete={handleDelete}
        tableHeader={tableHeader}
      />

      <div className='w-full bg-black fixed bottom-[0] right-0 py-[6px]'>
        <Pagination
          setQueriese={setQueriese}
          currPage={queriese.page}
          totalPage={totalPage.current}
        />
      </div>
    </div>
  );
};
export default VideoPage;
