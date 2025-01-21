import {
  SortIcon2,
  CloseIcon,
  TrashBinIcon,
  LongArrowIcon,
} from "../../../../../../Assets/Icons";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  CustomeFuncBox,
  CheckBox2,
  DeleteConfirm,
  Pagination,
} from "../../../../../../Component";
import PlaylistTbRow from "./PlaylistTbRow";
import { useAuthContext } from "../../../../../../Auth Provider/authContext";
import { getData } from "../../../../../../Api/getData";
import { dltManyData } from "../../../../../../Api/controller";
import { useQueryClient } from "@tanstack/react-query";
import { scrollToTop } from "../../../../../../util/scrollCustom";

const initParams = {
  title: "",
  limit: 8,
  page: 1,
  sort: { createdAt: -1, size: -1 },
  exCludeTypes: ["liked", "watch_later"],
  videoLimit: 4,
  clearCache: "playlist",
};

const Playlist = () => {
  const queryClient = useQueryClient();

  const { setIsShowing, openedMenu, addToaster } = useAuthContext();

  const [search, setSearch] = useState(undefined);

  const [opened, setOpened] = useState(false);

  const [params, setParams] = useState(initParams);

  const [checkedList, setCheckedList] = useState([]);

  const { data, refetch } = getData("/client/playlist", params);

  const [dataList, setDataList] = useState([]);

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

  const handleSearch = useCallback((data) => {
    setSearch((prev) => {
      if (prev && prev.slug === data.slug) {
        return undefined;
      }

      return data;
    });
  }, []);

  const timeoutRef = useRef();

  const handleOnSearch = useCallback((searchType, value) => {
    clearTimeout(timeoutRef.current);
    setTimeout(() => {
      setParams((prev) => ({
        ...prev,
        [`${searchType}`]: value,
        page: 1,
      }));
    }, 600);
  }, []);

  const handleSortUnique = useCallback(
    (key, value) => {
      const uniqueSortKeys = ["size"];
      const sortObj = { ...params.sort };

      const sortObjKeys = Object.keys(sortObj);
      if (sortObjKeys.includes(key)) {
        sortObj[key] = value;
      } else if (uniqueSortKeys.includes(key)) {
        sortObjKeys.forEach((key) => {
          if (uniqueSortKeys.includes(key)) {
            delete sortObj[key];
          }
        });
        sortObj[key] = value;
      }
      setParams((prev) => ({ ...prev, sort: sortObj, page: 1 }));
    },
    [params],
  );

  const funcList = useRef([
    {
      id: "title",
      text: "Title",
      handleOnClick: handleSearch,
    },
  ]);

  const handleDeleteMany = async () => {
    console.log(checkedList.join(", "));
    await dltManyData(
      "/client/playlist/delete-many",
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

  const showDltConfirm = useCallback(() => {
    if (checkedList.length < 1) {
      alert("Please select at least one item");
      return;
    }
    setIsShowing(
      <DeleteConfirm
        handleDelete={handleDeleteMany}
        type={"Playlist"}
        data={checkedList.join(", ")}
      />,
    );
  }, [checkedList]);

  useEffect(() => {
    return () => {
      setIsShowing(undefined);
      queryClient.clear();
    };
  }, []);

  useEffect(() => {
    if (data) {
      setDataList([...data?.data]);
      scrollToTop();
    }
  }, [data]);

  return (
    <div className='min-h-[500px] relative'>
      <div className='sticky left-0 top-[184px] z-[2000] w-full'>
        <div className='flex gap-[24px] bg-black'>
          <div className='relative'>
            <button
              className=' p-[8px]'
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
                currentId={search?.id}
                funcList1={funcList.current}
              />
            )}
          </div>
          <div className='flex-1 flex items-center'>
            {search && (
              <button className='flex items-center rounded-[5px] bg-black-0.2 h-[32px]'>
                <span className='ml-[12px] font-[500] leading-[20px] text-[14px]'>
                  {search.text}
                </span>
                <div
                  className='px-[6px]'
                  onClick={() => {
                    setSearch(undefined);
                    setParams((prev) => ({ ...prev, title: "", page: 1 }));
                  }}
                >
                  <CloseIcon size={18} />
                </div>
              </button>
            )}
            {search && (
              <input
                autoFocus
                type='text'
                placeholder='Searching...'
                className='bg-transparent py-[4px] border-b-[2px] outline-none ml-[16px]'
                onChange={(e) => {
                  handleOnSearch(search.id, e.target.value);
                }}
              />
            )}
          </div>
          <div className='self-end flex items-center justify-center gap-[8px]'>
            <button onClick={showDltConfirm}>
              <div className='p-[8px] hover:text-red-600'>
                <TrashBinIcon />
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className='overflow-auto'>
        {/* table */}
        <div className='min-w-full w-fit'>
          {/* Head */}
          <div className='text-[12px] font-[500] leading-[48px] text-gray-A items-center border-y-[2px] flex pl-[100px] '>
            <div className='w-[80px] px-[12px] flex items-center gap-[12px] absolute left-0 bg-black border-r-[2px]'>
              <CheckBox2
                checked={
                  dataList.length > 0 && checkedList?.length === dataList.length
                }
                setChecked={handleCheckedAll}
              />
              <span>OD</span>
            </div>
            <div className='flex-1 min-w-[382px]'>Playlist</div>
            <div className='w-[100px] px-[12px]'>Type</div>
            <div className='w-[180px] px-[12px]'>
              <button
                onClick={() => {
                  handleSortUnique(
                    "createdAt",
                    params.sort["createdAt"] === -1 ? 1 : -1,
                  );
                }}
                className={`flex items-center justify-center gap-[8px] ${
                  params.sort["createdAt"] ? "text-white-F1 font-bold" : ""
                }`}
              >
                <span>Date </span>
                {params.sort["createdAt"] && (
                  <div
                    className={`${
                      params.sort["createdAt"] === -1 ? "rotate-180" : ""
                    } text-[12px]`}
                  >
                    <LongArrowIcon size={14} />
                  </div>
                )}
              </button>
            </div>
            <div className='w-[120px] px-[12px]'>
              <button
                onClick={() => {
                  handleSortUnique("size", params.sort["size"] === -1 ? 1 : -1);
                }}
                className={`flex items-center justify-end gap-[8px] w-full ${
                  params.sort["size"] ? "text-white-F1 font-bold" : ""
                }`}
              >
                <span>Video count</span>
                {params.sort["size"] && (
                  <div
                    className={`${
                      params.sort["size"] === -1 ? "rotate-180" : ""
                    } text-[12px]`}
                  >
                    <LongArrowIcon size={14} />
                  </div>
                )}
              </button>
            </div>
          </div>
          {/* Body */}
          <div className=' flex flex-col'>
            {dataList.length > 0 &&
              dataList.map((item, id) => (
                <PlaylistTbRow
                  key={id}
                  handleChecked={handleChecked}
                  checked={checkedList?.includes(item?._id)}
                  data={item}
                  od={id + params?.limit * (params?.page - 1) + 1}
                  refetch={refetch}
                />
              ))}
          </div>
        </div>
      </div>
      <Pagination
        setParams={setParams}
        currPage={params?.page}
        totalPage={data?.totalPages}
      />
    </div>
  );
};
export default Playlist;
