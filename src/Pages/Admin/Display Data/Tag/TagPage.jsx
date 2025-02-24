import { useState, useEffect, useLayoutEffect } from "react";
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
import { Pagination, CustomeFuncBox } from "../../../../Component";
import { useAuthContext } from "../../../../Auth Provider/authContext";
import { Link } from "react-router-dom";
import Search from "./Search";
import Filter from "./Filter";
import Display from "./Display";

const limit = 8;
const initPrs = {
  limit,
  page: 1,
  sort: {
    createdAt: -1,
  },
  title: "",
  clearCache: "tag",
};

const TagPage = ({ openedMenu }) => {
  const { addToaster } = useAuthContext();

  const queryClient = useQueryClient();

  const [totalPage, setTotalPage] = useState(1);

  const [params, setParams] = useState(initPrs);

  const [opened, setOpened] = useState(false);

  const [searching, setSearching] = useState(undefined);

  const [searchValue, setSearchValue] = useState("");

  const { data: tagData, refetch } = getData(
    "tag",
    params,
    params ? true : false,
    false,
  );

  const [mockArr, setMockArr] = useState([]);

  const [checkedList, setCheckedList] = useState([]);

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

  useLayoutEffect(() => {
    if (tagData) {
      setTotalPage(tagData?.totalPages);
      if (limit - tagData.qtt > 0) {
        setMockArr(Array.from({ length: limit - tagData.qtt }, (_, i) => i));
      } else {
        setMockArr([]);
      }
    }

    return () => {
      setCheckedList([]);
    };
  }, [tagData]);

  useEffect(() => {
    let timeOut = setTimeout(() => {
      setParams((prev) => {
        return {
          ...prev,
          title: searchValue,
          page: 1,
        };
      });
    }, 600);

    return () => {
      clearTimeout(timeOut);
    };
  }, [searchValue]);

  useEffect(() => {
    return () => {
      queryClient.clear();
    };
  }, []);

  if (!tagData) return;

  return (
    <div className='overflow-auto h-full relative scrollbar-3'>
      <div className={`sticky top-[8px] md:mt-[8px]`}>
        <h2 className='text-[28px] leading-[44px] font-[500]'>Tags</h2>
      </div>

      <div className='sticky left-0 top-[52px] z-[2000] w-full'>
        <div className='flex gap-[24px] bg-black'>
          <div className='relative'>
            <button
              className='p-[8px]'
              onClick={() => {
                setOpened((prev) => !prev);
              }}
            >
              <SortIcon2 />
            </button>
            {opened && (
              <CustomeFuncBox
                style={"left-[100%] top-[100%] w-[150px]"}
                setOpened={setOpened}
                currentId={searching?.id}
                funcList1={sortBtnList.current}
              />
            )}
          </div>
          <div className='flex-1 flex items-center'>
            {searching?.text && (
              <button className='flex items-center rounded-[5px] bg-black-0.2 h-[32px]'>
                <span className='ml-[12px] font-[500] leading-[20px] text-[14px]'>
                  {searching.text}
                </span>
                <div
                  className='px-[6px] w-[24px]'
                  onClick={() => {
                    setSearching(undefined);
                    setQueriese((prev) => ({
                      ...prev,
                      [searching.id]: "",
                      page: 1,
                    }));
                  }}
                >
                  <CloseIcon />
                </div>
              </button>
            )}
            {searching?.type === "input:text" && (
              <input
                autoFocus
                type='text'
                placeholder='Searching...'
                className='bg-transparent py-[4px] border-b-[2px] outline-none ml-[16px]'
              />
            )}
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

      <Display
        dataList={tagData.data}
        page={params.page}
        handleChecked={handleChecked}
        handleCheckedAll={handleCheckedAll}
        mockArr={mockArr}
        limit={limit}
        checkedList={checkedList}
        refetch={refetch}
      />

      <Pagination
        setParams={setParams}
        currPage={params.page}
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

    <Filter params={params} setParams={setParams} />
  </div>
</div> */
}
