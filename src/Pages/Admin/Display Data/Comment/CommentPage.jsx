import { Link } from "react-router-dom";
import { TrashBinIcon, SortIcon2, CreateIcon } from "../../../../Assets/Icons";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { getData } from "../../../../Api/getData";
import { dltManyData, dltData } from "../../../../Api/controller";
import Display from "./Display";
import {
  Pagination,
  CustomeFuncBox,
  QueryTextInput,
  QuerySelection,
} from "../../../../Component";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../../../Auth Provider/authContext";
import { getDisplayUsingValue } from "../../../../util/func";

const limit = 10;

const initQueriese = {
  limit,
  page: 1,
  search: {},
  sort: {
    createdAt: -1,
  },
};

const CommentPage = ({ openedMenu }) => {
  const { addToaster } = useAuthContext();

  const queryClient = useQueryClient();

  const [queriese, setQueriese] = useState(initQueriese);

  const [isQueryBoxOpened, setIsQueryBoxOpened] = useState(false);

  const [queryOptions, setQueryOptions] = useState([]);

  const [checkedList, setCheckedList] = useState([]);

  const containerRef = useRef();

  const funcContainerRef = useRef();

  const tableHeader = useRef();

  const { data: cmtsData, refetch } = getData("comment", queriese, true, false);

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
      id: "content",
      text: "Content",
      type: "input:text",
      buttonType: "search",
      renderCondition: true,
      handleOnClick: handleOnClick,
    },
    {
      id: "title",
      text: "Video title",
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
      id: "type",
      text: "Comment type",
      type: "select",
      buttonType: "search",
      renderCondition: true,
      options: [
        { id: "root", display: "Root" },
        { id: "reply", display: "Reply" },
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
    {
      id: "reply",
      text: "Reply count",
      type: "select",
      buttonType: "sort",
      renderCondition: true,
      options: [
        { id: -1, display: "Most reply" },
        { id: 1, display: "Least reply" },
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
    if (checkedList.length === cmtsData?.data?.length) {
      setCheckedList([]);
    } else {
      const idList = cmtsData?.data?.map((item) => item?._id);
      setCheckedList(idList);
    }
  };

  const handleDeleteMany = async () => {
    await dltManyData(
      "comment/delete-many",
      checkedList,
      "Comment",
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
      "comment/",
      id,
      "Comment",
      undefined,
      () => {
        refetch();
      },
      addToaster,
    );
  };

  useLayoutEffect(() => {
    if (cmtsData && containerRef.current) {
      containerRef.current.scrollTop = 0;
    }

    return () => {
      setCheckedList([]);
    };
  }, [cmtsData]);

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
        <h2 className='text-[28px] leading-[44px] font-[500]'>Comments</h2>
      </div>
      <div
        className='sticky left-0 top-[52px] z-[2000] min-w-[1280px] pb-[4px] bg-black'
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
            {checkedList.length > 0 && (
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
        dataList={cmtsData?.data}
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
          totalPage={cmtsData?.totalPages || 1}
        />
      </div>
    </div>
  );
};
export default CommentPage;

{
  /* <div
className={`flex items-center justify-between py-[16px] ${
  openedMenu ? "xl:py-[8px]" : ""
}`}
>
<h2 className='text-[28px] leading-[44px] font-[500]'>Comments</h2>
<div className='flex flex-col sm:flex-row sm:items-center gap-[12px]'>
  <div className='flex items-center justify-end sm:justify-start gap-[12px]'>

    <Search searchValue={searchValue} setSearchValue={setSearchValue} />

 
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

  
    <Filter queriese={queriese} setQueriese={setQueriese} />
  </div>
</div>
</div>
<Display
dataList={cmtsData?.data || []}
page={queriese.page}
mockArr={mockArr}
limit={limit}
checkedList={checkedList}
refetch={refetch}
handleChecked={handleChecked}
handleCheckedAll={handleCheckedAll}
/>
<Pagination
setQueriese={setQueriese}
currPage={queriese.page}
totalPage={totalPage}
/> */
}
