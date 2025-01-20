import { Link } from "react-router-dom";
import { CreateIcon, DeleteAllIcon } from "../../../../Assets/Icons";
import { getData } from "../../../../Api/getData";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useLayoutEffect, useCallback } from "react";
import { dltManyData } from "../../../../Api/controller";
import Search from "./Search";
import Display from "./Display";
import { Pagination } from "../../../../Component";
import Filter from "./Filter";
import { useAuthContext } from "../../../../Auth Provider/authContext";

const limit = 8;

const initPrs = {
  limit,
  page: 1,
  email: "",
  sort: {
    createdAt: -1,
  },
};

const PlaylistPage = ({ openedMenu }) => {
  const { addToaster } = useAuthContext();

  const queryClient = useQueryClient();

  const [totalPage, setTotalPage] = useState(1);

  const [params, setParams] = useState(initPrs);

  const [searchValue, setSearchValue] = useState("");

  const { data: playlistsData, refetch } = getData(
    "playlist",
    params,
    true,
    false,
  );
  console.log("🚀 ~ playlistsData:", playlistsData);

  const [mockArr, setMockArr] = useState([]);

  const [checkedList, setCheckedList] = useState([]);

  const handleChecked = useCallback((id) => {
    setCheckedList((prev) => {
      if (prev.includes(id)) {
        return [...prev.filter((data) => data !== id)];
      }

      return [...prev, id];
    });
  }, []);

  const handleCheckedAll = useCallback(() => {
    if (checkedList.length === playlistsData?.data?.length) {
      setCheckedList([]);
    } else {
      const idList = playlistsData?.data?.map((item) => item?._id);
      setCheckedList(idList);
    }
  }, [checkedList]);

  const handleDeleteMany = async () => {
    await dltManyData(
      "playlist/delete-many",
      checkedList,
      "playlist",
      () => {
        setCheckedList([]);
        refetch();
      },
      undefined,
      addToaster,
    );
  };

  useLayoutEffect(() => {
    if (playlistsData) {
      setTotalPage(playlistsData?.totalPages);
      if (limit - playlistsData.qtt > 0) {
        setMockArr(
          Array.from({ length: limit - playlistsData.qtt }, (_, i) => i),
        );
      } else {
        setMockArr([]);
      }
    }

    return () => {
      setCheckedList([]);
    };
  }, [playlistsData]);

  useEffect(() => {
    let timeOut = setTimeout(() => {
      setParams((prev) => {
        return {
          ...prev,
          email: searchValue,
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

  if (!playlistsData) return;

  return (
    <>
      <div
        className={`flex items-center justify-between py-[16px] ${
          openedMenu ? "xl:py-[8px]" : ""
        }`}
      >
        <h2 className='text-[28px] leading-[44px] font-[500]'>Playlists</h2>
        <div className='flex flex-col sm:flex-row sm:items-center gap-[12px]'>
          <div className='flex items-center justify-end sm:justify-start gap-[12px]'>
            {/* Search */}
            <Search searchValue={searchValue} setSearchValue={setSearchValue} />

            {/* Create */}
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
            {/* Delete many */}
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

            {/* Filter */}
            <Filter params={params} setParams={setParams} />
          </div>
        </div>
      </div>
      <Display
        dataList={playlistsData.data}
        page={params.page}
        mockArr={mockArr}
        limit={limit}
        checkedList={checkedList}
        refetch={refetch}
        handleChecked={handleChecked}
        handleCheckedAll={handleCheckedAll}
      />
      <Pagination
        setParams={setParams}
        currPage={params.page}
        totalPage={totalPage}
      />
    </>
  );
};
export default PlaylistPage;
