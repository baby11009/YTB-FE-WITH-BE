import { Link } from "react-router-dom";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CreateIcon, SortIcon2, TrashBinIcon } from "../../../../Assets/Icons";
import { getDataWithAuth } from "../../../../Api/getData";
import { dltManyData } from "../../../../Api/controller";
import { getDisplayUsingValue } from "../../../../util/func";
import Display from "./Display";
import {
  Pagination,
  CustomeFuncBox,
  QueryTextInput,
  QuerySelection,
} from "../../../../Component";
import Search from "./Search";
import Filter from "./Filter";
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

const VideoPage = () => {
  const { addToaster } = useAuthContext();

  const queryClient = useQueryClient();

  const [queriese, setQueriese] = useState(initQueriese);
  console.log("🚀 ~ queriese:", queriese);

  const [openedSearchBox, setOpenedSearchBox] = useState(false);

  const [queryOptions, setQueryOptions] = useState([]);

  const [checkedList, setCheckedList] = useState([]);

  const containerRef = useRef();

  const { data: videosData, refetch } = getDataWithAuth(
    "video",
    queriese,
    false,
    false,
  );

  const handleOnClick = (queryData) => {
    setQueryOptions((prev) => {
      if (queryData?.unique) {
        const newOptions = prev.filter(
          (prevQuery) => prevQuery.buttonType !== "sort",
        );
        newOptions.push(queryData);

        return newOptions;
      }

      return [...prev, queryData];
    });

    if (queryData?.unique) {
      queryOptionBtns.current = queryOptionBtns.current.map((queryOption) => {
        if (queryOption.id === queryData.id) {
          queryOption.renderCondition = false;
        } else if (
          queryOption.buttonType === "sort" &&
          !queryOption.renderCondition
        ) {
          queryOption.renderCondition = true;
        }

        return queryOption;
      });
    } else {
      queryOptionBtns.current = queryOptionBtns.current.map((queryOption) => {
        if (queryOption.id === queryData.id) {
          queryOption.renderCondition = false;
        }
        return queryOption;
      });
    }
  };

  const handleClose = (queryData) => {
    setQueryOptions((prev) =>
      prev.filter((search) => search.id !== queryData.id),
    );

    setQueriese((prev) => {
      const { search, sort } = prev;

      if (queryData.buttonType === "sort") {
        if (queryData.unique) {
          const { [queryData.id]: _, ...rest } = sort;
          prev.sort = rest;
        } else {
          sort[queryData.id] = -1;
          prev.sort = sort;
        }
      } else {
        const { [queryData.id]: _, ...rest } = search;
        prev.search = rest;
      }

      return prev;
    });

    if (queryData.unique) {
    } else {
      queryOptionBtns.current = queryOptionBtns.current.map((queryOption) => {
        if (queryOption.id === queryData.id) {
          queryOption.renderCondition = true;
        }
        return queryOption;
      });
    }
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
      id: "type",
      text: "Type",
      type: "select",
      buttonType: "search",
      options: [
        { id: "video", display: "Video" },
        { id: "short", display: "Short" },
      ],
      renderCondition: true,
      handleOnClick: handleOnClick,
    },
    {
      id: "createdAt",
      text: "Date",
      type: "select",
      buttonType: "sort",
      options: [
        { id: -1, display: "Newest" },
        { id: 1, display: "Oldest" },
      ],
      renderCondition: true,
      handleOnClick: handleOnClick,
    },
    {
      id: "view",
      text: "View",
      type: "select",
      buttonType: "sort",
      unique: true,
      options: [
        { id: -1, display: "Most popular" },
        { id: 1, display: "Least popular" },
      ],
      renderCondition: true,
      handleOnClick: handleOnClick,
    },
    {
      id: "like",
      text: "Like",
      type: "select",
      buttonType: "sort",
      unique: true,
      options: [
        { id: -1, display: "Most liked" },
        { id: 1, display: "Least liked" },
      ],
      renderCondition: true,
      handleOnClick: handleOnClick,
    },
    {
      id: "dislike",
      text: "Dislike",
      type: "select",
      buttonType: "sort",
      unique: true,
      options: [
        { id: -1, display: "Most disliked" },
        { id: 1, display: "Least disliked" },
      ],
      renderCondition: true,
      handleOnClick: handleOnClick,
    },
    {
      id: "totalCmt",
      text: "Comment",
      type: "select",
      buttonType: "sort",
      unique: true,
      options: [
        { id: -1, display: "Most commented" },
        { id: 1, display: "Least commented" },
      ],
      renderCondition: true,
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
    if (checkedList.length === videosData?.data?.length) {
      setCheckedList([]);
    } else {
      const idList = videosData?.data?.map((item) => item?._id);
      setCheckedList(idList);
    }
  };

  const handleDeleteMany = async () => {
    await dltManyData(
      "video/delete-many",
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

  useLayoutEffect(() => {
    if (videosData) {
    }

    return () => {
      setCheckedList([]);
    };
  }, [videosData]);

  useEffect(() => {
    return () => {
      queryClient.clear();
    };
  }, []);

  // if (!videosData) return;

  return (
    <div
      className='overflow-auto h-[calc(100%-44px)] pb-[44px] relative scrollbar-3'
      ref={containerRef}
    >
      <div className='sticky left-0 top-0 pt-[8px]  bg-black z-[100]'>
        <h2 className='text-[28px] leading-[44px] font-[500]'>Videos</h2>
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
      <div className='w-full bg-black fixed bottom-[0] right-0 mr-[28px] py-[6px]'>
        <Pagination
          setQueriese={setQueriese}
          currPage={queriese.page}
          totalPage={videosData?.totalPages || 1}
        />
      </div>
    </div>
  );
};
export default VideoPage;

// <div
//         className={`flex items-center justify-between md:py-[16px] ${
//           openedMenu ? "xl:py-[8px]" : ""
//         }`}
//       >
//         <h2 className='text-[28px] leading-[44px] font-[500]'>Videos</h2>
//         <div className='flex flex-col sm:flex-row sm:items-center gap-[12px]'>
//           <div className='flex items-center justify-end sm:justify-start gap-[12px]'>
//             {/* Search */}
//             <Search
//               currTag={currTag}
//               setCurrTag={setCurrTag}
//               searchValue={searchValue}
//               setSearchValue={setSearchValue}
//               tagList={tagList.current}
//             />

//             {/* Create */}
//             <Link
//               className='size-[32px] rounded-[5px] flex items-center justify-center
//             group border-[2px] border-[rgba(255,255,255,0.4)] hover:border-green-400 transition-all duration-[0.2s] ease-in
//             '
//               to={"upsert"}
//             >
//               <div className='text-[rgba(255,255,255,0.4)] group-hover:text-green-400  transition-all duration-[0.2s]'>
//                 <CreateIcon />
//               </div>
//             </Link>
//           </div>
//           <div className='flex items-center gap-[12px]'>
//             {/* Delete many */}
//             <button
//               className='size-[32px] rounded-[5px] flex items-center justify-center
//              group border-[2px] border-[rgba(255,255,255,0.4)] hover:border-red-600 transition-all duration-[0.2s] ease-in
//             '
//               onClick={handleDeleteMany}
//             >
//               <div className='text-[rgba(255,255,255,0.4)] group-hover:text-red-600  transition-all duration-[0.2s]'>
//                 <DeleteAllIcon />
//               </div>
//             </button>

//             {/* Filter */}
//             <Filter params={queriese} setParams={setQueriese} />
//           </div>
//         </div>
//       </div>
//       <Display
//         dataList={videosData.data}
//         page={queriese.page}
//         mockArr={mockArr}
//         limit={limit}
//         checkedList={checkedList}
//         refetch={refetch}
//         handleChecked={handleChecked}
//         handleCheckedAll={handleCheckedAll}
//       />
