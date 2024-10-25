import { Link } from "react-router-dom";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { DeleteAllIcon, CreateIcon } from "../../../../Assets/Icons";
import { getDataWithAuth } from "../../../../Api/getData";
import { dltManyData } from "../../../../Api/controller";
import Display from "./Display";
import { Pagination } from "../../../../Component";
import Search from "./Search";
import Filter from "./Filter";

const limit = 8;
const initPrs = {
  limit,
  page: 1,
  reset: "title",
  title: "",
  email: "",
  type: "",
  createdAt: "mới nhất",
};

const VideoPage = ({ openedMenu }) => {
  const queryClient = useQueryClient();

  const [totalPage, setTotalPage] = useState(1);

  const [params, setParams] = useState(initPrs);

  const [currTag, setCurrTag] = useState("title");

  const [searchValue, setSearchValue] = useState("");

  const tagList = useRef(["title", "email"]);

  const { data: videosData, refetch } = getDataWithAuth("video", params);

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
    if (checkedList.length === videosData?.data?.length) {
      setCheckedList([]);
    } else {
      const idList = videosData?.data?.map((item) => item?._id);
      setCheckedList(idList);
    }
  };

  useLayoutEffect(() => {
    if (videosData) {
      setTotalPage(videosData?.totalPages);
      if (limit - videosData.qtt > 0) {
        setMockArr(Array.from({ length: limit - videosData.qtt }, (_, i) => i));
      } else {
        setMockArr([]);
      }
    }

    return () => {
      setCheckedList([]);
    };
  }, [videosData]);

  useEffect(() => {
    let timeOut = setTimeout(() => {
      setParams((prev) => {
        return {
          ...prev,
          [currTag]: searchValue,
          page: 1,
        };
      });
    }, 600);

    return () => {
      clearTimeout(timeOut);
    };
  }, [searchValue]);

  useEffect(() => {
    setParams((prev) => {
      let obj = { ...prev };

      let tagValue;

      tagList.current.forEach((item) => {
        if (item !== currTag && obj[item]) {
          tagValue = obj[item];
          obj[item] = "";
          obj[currTag] = tagValue;
        }
      });

      return {
        ...obj,
        page: 1,
      };
    });
  }, [currTag]);

  useEffect(() => {
    return () => {
      queryClient.clear();
    };
  }, []);

  return (
    <>
      <div
        className={`flex items-center justify-between md:py-[16px] ${
          openedMenu ? "xl:py-[8px]" : ""
        }`}
      >
        <h2 className='text-[28px] leading-[44px] font-[500]'>Videos</h2>
        <div className='flex flex-col sm:flex-row sm:items-center gap-[12px]'>
          <div className='flex items-center justify-end sm:justify-start gap-[12px]'>
            {/* Search */}
            <Search
              currTag={currTag}
              setCurrTag={setCurrTag}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              tagList={tagList.current}
            />

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
              onClick={async () => {
                await dltManyData("video/delete-many", checkedList);
                refetch();
              }}
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
        dataList={videosData.data}
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
export default VideoPage;
