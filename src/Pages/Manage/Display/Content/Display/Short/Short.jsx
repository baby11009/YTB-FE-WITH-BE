import {
  SortIcon2,
  CloseIcon,
  CreateIcon,
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
import ShortTbRow from "./ShortTbRow";
import { useAuthContext } from "../../../../../../Auth Provider/authContext";
import ShortUpsertModal from "./ShortUpsertModal";
import { getDataWithAuth } from "../../../../../../Api/getData";
import { dltManyData } from "../../../../../../Api/controller";
import { useQueryClient } from "@tanstack/react-query";

const initParams = {
  title: "",
  limit: 8,
  page: 1,
  sort: { createdAt: -1, view: -1 },
  type: "short",
  clearCache: "short",
};

const Short = () => {
  const queryClient = useQueryClient();

  const { setIsShowing, addToaster } = useAuthContext();

  const [searching, setSearching] = useState(undefined);

  const [opened, setOpened] = useState(false);

  const [queriese, setQueriese] = useState(initParams);

  const [checkedList, setCheckedList] = useState([]);

  const { data, refetch } = getDataWithAuth(
    "/client/video",
    queriese,
    true,
    false,
  );

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

  const handleOnClick = useCallback((data) => {
    setSearching((prev) => {
      if (prev && prev.id === data.id) {
        return undefined;
      }

      return data;
    });
  }, []);
  const timeoutRef = useRef();

  const handleOnSearch = useCallback((e) => {
    clearTimeout(timeoutRef.current);
    setTimeout(() => {
      setQueriese((prev) => ({ ...prev, title: e.target.value, page: 1 }));
    }, 600);
  }, []);

  const handleSort = useCallback(
    (key, value) => {
      // Can only have 1 add on sort key at the same time
      const addOnSortKeys = new Set(["view", "like", "dislike", "totalCmt"]);
      const sortObj = structuredClone(queriese.sort);

      const sortObjKeys = Object.keys(sortObj);
      if (sortObjKeys.includes(key)) {
        sortObj[key] = value;
      } else if (addOnSortKeys.has(key)) {
        // remove previous addon sort key
        sortObjKeys.forEach((key) => {
          if (addOnSortKeys.has(key)) {
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
      value: 1,
      handleOnClick: handleOnClick,
    },
  ]);

  const handleDeleteMany = useCallback(async () => {
    await dltManyData(
      "/client/video/delete-many",
      checkedList,
      "short",
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
        type={"Short"}
        data={checkedList.join(", ")}
      />,
    );
  }, [checkedList]);

  const showUpsertModal = useCallback(() => {
    setIsShowing(<ShortUpsertModal title={"Uploading short"} />);
  }, []);

  useEffect(() => {
    return () => {
      setIsShowing(undefined);
      queryClient.clear();
    };
  }, []);

  useEffect(() => {
    setCheckedList([]);
  }, [queriese.page]);

  useEffect(() => {
    if (data) {
      setDataList([...data?.data]);
    }
  }, [data]);

  return (
    <div className='overflow-auto max-h-full min-h-[500px] relative scrollbar-3'>
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
                onChange={handleOnSearch}
              />
            )}
          </div>
          <div className=' self-end flex items-center justify-center gap-[8px]'>
            <button onClick={showUpsertModal}>
              <div className='p-[8px] hover:text-green-500'>
                <CreateIcon />
              </div>
            </button>
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
           text-gray-A items-center border-y-[1px] border-gray-A flex'
        >
          <div className='sticky left-0 h-[48px] p-[0_12px_0_25px] bg-black flex items-center justify-center gap-[12px] z-[10]'>
            <CheckBox2
              checked={
                checkedList.length === data?.data.length &&
                data?.data.length > 0
              }
              setChecked={handleCheckedAll}
            />
          </div>
          <div
            className='sticky left-[57px] pl-[12px] flex-[2_0_400px] min-w-[400px]  bg-black  
              border-r-[1px] border-gray-A z-[10]'
          >
            Video
          </div>
          <div className='flex-[1_0_100px] min-w-[100px] mx-[12px]'>
            <button
              onClick={() => {
                handleSort(
                  "createdAt",
                  queriese.sort["createdAt"] === -1 ? 1 : -1,
                );
              }}
              className={`flex items-center  w-full ${
                queriese.sort["createdAt"] ? "text-white-F1 font-bold" : ""
              }`}
            >
              <span>Date </span>

              <div
                className={`${
                  queriese.sort["createdAt"] === -1 ? "rotate-180" : ""
                }
                ${
                  queriese.sort["createdAt"] ? "visible" : "invisible"
                } ml-[12px] w-[12px]`}
              >
                <LongArrowIcon />
              </div>
            </button>
          </div>
          <div className='flex-[1_0_100px] min-w-[100px] mx-[12px] '>
            <button
              onClick={() => {
                handleSort("view", queriese.sort["view"] === -1 ? 1 : -1);
              }}
              className={`flex items-center justify-end w-full ${
                queriese.sort["view"] ? "text-white-F1 font-bold" : ""
              }`}
            >
              <span>View</span>
              <div
                className={`${queriese.sort["view"] === -1 ? "rotate-180" : ""}
                ${
                  queriese.sort["view"] ? "visible" : "invisible"
                } ml-[12px] w-[12px]`}
              >
                <LongArrowIcon />
              </div>
            </button>
          </div>
          <div className='flex-[1_0_100px] min-w-[100px] mx-[12px]'>
            <button
              onClick={() => {
                handleSort(
                  "totalCmt",
                  queriese.sort["totalCmt"] === -1 ? 1 : -1,
                );
              }}
              className={`flex items-center justify-end  w-full ${
                queriese.sort["totalCmt"] ? "text-white-F1 font-bold" : ""
              }`}
            >
              <span>Comments</span>

              <div
                className={`${
                  queriese.sort["totalCmt"] === -1 ? "rotate-180" : ""
                }
                  ${
                    queriese.sort["totalCmt"] ? "visible" : "invisible"
                  } ml-[12px] w-[12px]`}
              >
                <LongArrowIcon />
              </div>
            </button>
          </div>
          <div className='flex-[1_0_60px] min-w-[60px] mx-[12px]'>
            <button
              onClick={() => {
                handleSort("like", queriese.sort["like"] === -1 ? 1 : -1);
              }}
              className={`flex items-center justify-end w-full ${
                queriese.sort["like"] ? "text-white-F1 font-bold" : ""
              }`}
            >
              <span>Like</span>

              <div
                className={`${queriese.sort["like"] === -1 ? "rotate-180" : ""}
                    ${
                      queriese.sort["like"] ? "visible" : "invisible"
                    } ml-[12px] w-[12px]`}
              >
                <LongArrowIcon size={14} />
              </div>
            </button>
          </div>
          <div className='flex-[1_0_60px] min-w-[60px] mx-[12px]'>
            <button
              onClick={() => {
                handleSort("dislike", queriese.sort["dislike"] === -1 ? 1 : -1);
              }}
              className={`flex items-center justify-end w-full ${
                queriese.sort["dislike"] ? "text-white-F1 font-bold" : ""
              }`}
            >
              <span>Dislike</span>

              <div
                className={`${
                  queriese.sort["dislike"] === -1 ? "rotate-180" : ""
                }
                  ${
                    queriese.sort["dislike"] ? "visible" : "invisible"
                  } ml-[12px] w-[12px]`}
              >
                <LongArrowIcon size={14} />
              </div>
            </button>
          </div>
        </div>
        {/* Body */}
        <div className='flex flex-col z-[2]'>
          {dataList.map((item, id) => (
            <ShortTbRow
              key={id}
              handleChecked={handleChecked}
              checked={checkedList.includes(item?._id)}
              data={item}
              od={id + queriese?.limit * (queriese?.page - 1) + 1}
              refetch={refetch}
            />
          ))}
        </div>
      </div>
      <Pagination
        setQueriese={setQueriese}
        currPage={queriese?.page}
        totalPage={data?.totalPages}
      />
    </div>
  );
};
export default Short;
