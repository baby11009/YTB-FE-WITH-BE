import {
  SortIcon2,
  CloseIcon,
  TrashBinIcon,
  LongArrowIcon,
} from "../../../../../../Assets/Icons";
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
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

  const { setIsShowing, addToaster } = useAuthContext();

  const [searching, setSearching] = useState(undefined);

  const [opened, setOpened] = useState(false);

  const [queriese, setQueriese] = useState(initParams);

  const [checkedList, setCheckedList] = useState([]);

  const [horizonScrollVisible, setHorizonScrollVisible] = useState();

  const { data, refetch } = getData("/client/playlist", queriese);

  const [dataList, setDataList] = useState([]);

  const containerRef = useRef();

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

  const handleOnClick = useCallback((data) => {
    setSearching((prev) => {
      if (prev && prev.id === data.id) {
        return undefined;
      }

      return data;
    });
  }, []);

  const timeoutRef = useRef();

  const handleOnSearch = useCallback((searchType, value) => {
    clearTimeout(timeoutRef.current);
    setTimeout(() => {
      setQueriese((prev) => ({
        ...prev,
        [`${searchType}`]: value,
        page: 1,
      }));
    }, 600);
  }, []);

  const handleSortUnique = useCallback(
    (key, value) => {
      const uniqueSortKeys = ["size"];
      const sortObj = { ...queriese.sort };

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
      setQueriese((prev) => ({ ...prev, sort: sortObj, page: 1 }));
    },
    [queriese],
  );

  const funcList = useRef([
    {
      id: "title",
      text: "Text",
      type: "input:text",
      handleOnClick: handleOnClick,
    },
  ]);

  const handleDeleteMany = useCallback(async () => {
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
  }, [checkedList]);

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

  useLayoutEffect(() => {
    const handleResize = (e) => {
      const scrollW = containerRef.current.scrollWidth;
      const clientW = containerRef.current.clientWidth;
      setHorizonScrollVisible(scrollW > clientW);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    return () => {
      setIsShowing(undefined);
      queryClient.clear();
    };
  }, []);

  useEffect(() => {
    if (data) {
      setDataList([...data?.data]);
      containerRef.current.scrollTop = 0;
    }
  }, [data]);

  return (
    <div
      className='overflow-auto h-full relative scrollbar-3'
      ref={containerRef}
    >
      <div className='sticky left-0 top-[0] z-[2000] w-full'>
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
                currentId={searching?.id}
                funcList1={funcList.current}
              />
            )}
          </div>
          <div className='flex-1 flex items-center'>
            {searching && (
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
                onChange={(e) => {
                  handleOnSearch(searching.id, e.target.value);
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

      {/* table */}
      <div className='min-w-full w-fit'>
        {/* Head */}
        <div
          className='sticky top-[40px] z-[10] bg-black text-[12px] font-[500] leading-[48px]
           text-gray-A items-center border-y-[1px] border-gray-A flex '
        >
          <div
            className='sticky left-0 h-[48px] p-[0_12px_0_24px] flex items-center justify-center 
          gap-[12px] bg-black'
          >
            <CheckBox2
              checked={
                dataList.length > 0 && checkedList?.length === dataList.length
              }
              setChecked={handleCheckedAll}
            />
          </div>
          <div
            className={`sticky left-[57px] pl-[12px] flex-[2_0_382px] min-w-[382px]  bg-black  
              border-r-[1px] z-[10] ${
                horizonScrollVisible ? "border-gray-A" : "border-[transparent]"
              }`}
          >
            Playlist
          </div>
          <div className='flex-[1_0_100px] min-w-[100px] px-[12px]'>Type</div>
          <div className='flex-[1_0_100px] min-w-[100px] px-[12px]'>
            <button
              onClick={() => {
                handleSortUnique(
                  "createdAt",
                  queriese.sort["createdAt"] === -1 ? 1 : -1,
                );
              }}
              className={`flex items-center justify-center gap-[8px] ${
                queriese.sort["createdAt"] ? "text-white-F1 font-bold" : ""
              }`}
            >
              <span>Date </span>
              {queriese.sort["createdAt"] && (
                <div
                  className={`${
                    queriese.sort["createdAt"] === -1 ? "rotate-180" : ""
                  } text-[12px]`}
                >
                  <LongArrowIcon size={14} />
                </div>
              )}
            </button>
          </div>
          <div className='flex-[1_0_130px] min-w-[130px] px-[12px]'>
            <button
              onClick={() => {
                handleSortUnique("size", queriese.sort["size"] === -1 ? 1 : -1);
              }}
              className={`flex items-center justify-end gap-[8px] w-full ${
                queriese.sort["size"] ? "text-white-F1 font-bold" : ""
              }`}
            >
              <span>Video count</span>
              {queriese.sort["size"] && (
                <div
                  className={`${
                    queriese.sort["size"] === -1 ? "rotate-180" : ""
                  } text-[12px]`}
                >
                  <LongArrowIcon size={14} />
                </div>
              )}
            </button>
          </div>
        </div>
        {/* Body */}
        <div className=' flex flex-col z-[2]'>
          {dataList.length > 0 &&
            dataList.map((item, id) => (
              <PlaylistTbRow
                key={id}
                handleChecked={handleChecked}
                checked={checkedList?.includes(item?._id)}
                data={item}
                refetch={refetch}
                horizonScrollVisible={horizonScrollVisible}
              />
            ))}
        </div>

        <div className='mb-[86px] px-[24px]'>
          <Pagination
            setQueriese={setQueriese}
            currPage={queriese?.page}
            totalPage={data?.totalPages}
          />
        </div>
      </div>
    </div>
  );
};
export default Playlist;
