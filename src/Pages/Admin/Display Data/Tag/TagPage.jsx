import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  DeleteAllIcon,
  CreateIcon,
  SortIcon2,
  CloseIcon,
  TrashBinIcon,
  LongArrowIcon,
} from "../../../../Assets/Icons";
import { getData } from "../../../../Api/getData";
import { dltManyData } from "../../../../Api/controller";
import {
  Pagination,
  CustomeFuncBox,
  SearchTextInput,
  Slider,
} from "../../../../Component";
import { useAuthContext } from "../../../../Auth Provider/authContext";
import { Link } from "react-router-dom";
import Search from "./Search";
import Filter from "./Filter";
import Display from "./Display";

const limit = 8;
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

  const [totalPage, setTotalPage] = useState(1);

  const [queriese, setQueriese] = useState(initQueriese);

  const [openedSearchBox, setOpenedSearchBox] = useState(false);

  const [searchList, setSearchList] = useState([]);

  const { data: tagData, refetch } = getData(
    "tag",
    queriese,
    queriese ? true : false,
    false,
  );

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
    setQueriese((prev) => ({
      ...prev,
      search: { ...prev.search, [searchName]: searchValue },
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
        setCheckedList([]);
        refetch();
      },
      undefined,
      addToaster,
    );
  };

  useEffect(() => {
    return () => {
      queryClient.clear();
    };
  }, []);

  if (!tagData) return;

  return (
    <div className='overflow-auto h-full relative scrollbar-3'>
      <div className={`sticky left-0 top-[8px] md:mt-[8px]`}>
        <h2 className='text-[28px] leading-[44px] font-[500]'>Tags</h2>
      </div>

      <div className='sticky  left-0 top-[52px] z-[2000] w-full'>
        <div className='flex gap-[24px] bg-black'>
          <div className='relative'>
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

          <div className='flex-1 flex items-center flex-wrap'>
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
                }
              })}
          </div>

          <div className=' self-end flex items-center justify-center gap-[8px]'>
            <button>
              <div className='p-[8px] hover:text-green-500'>
                <CreateIcon />
              </div>
            </button>
            <button>
              <div className='p-[8px] hover:text-red-600'>
                <TrashBinIcon />
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className='h-[100vh]'></div>
      {/* 
      <Display
        dataList={tagData.data}
        page={queriese.page}
        handleChecked={handleChecked}
        handleCheckedAll={handleCheckedAll}
        mockArr={mockArr}
        limit={limit}
        checkedList={checkedList}
        refetch={refetch}
      /> */}

      <Pagination
        setQueriese={setQueriese}
        currPage={queriese.page}
        totalPage={totalPage}
      />
    </div>
  );
};
export default TagPage;
{
  /* <div className='flex flex-col sm:flex-row sm:items-center gap-[12px]'>
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

    <Filter params={params} setQueriese={setQueriese} />
  </div>
</div> */
}
