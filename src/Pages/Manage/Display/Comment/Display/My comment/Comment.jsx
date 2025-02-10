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
import CmtTbRow from "./CmtTbRow";
import { useAuthContext } from "../../../../../../Auth Provider/authContext";
import { getDataWithAuth } from "../../../../../../Api/getData";
import { dltManyData } from "../../../../../../Api/controller";
import { useQueryClient } from "@tanstack/react-query";

const initParams = {
  text: "",
  limit: 2,
  page: 1,
  sort: { createdAt: -1 },
  clearCache: "comment",
};

const Comment = () => {
  const queryClient = useQueryClient();

  const [searching, setSearching] = useState(undefined);

  const [opened, setOpened] = useState(false);

  const [queriese, setQueriese] = useState(initParams);

  const [checkedList, setCheckedList] = useState([]);

  const { data, refetch, isError, error } = getDataWithAuth(
    "/client/comment",
    queriese,
    true,
    false,
  );

  const [dataList, setDataList] = useState([]);

  const { setIsShowing, addToaster } = useAuthContext();

  const handleCheckedAll = useCallback(() => {
    if (checkedList.length === dataList?.length) {
      setCheckedList([]);
    } else {
      const idList = data?.data?.map((item) => item?._id);

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
      setQueriese((prev) => ({ ...prev, text: e.target.value, page: 1 }));
    }, 600);
  }, []);

  const handleSort = useCallback(
    (key, value) => {
      const addOnSortKeys = new Set(["createdAt"]);

      const sortObj = structuredClone(queriese.sort);

      const sortObjKeys = new Set(Object.keys(sortObj));
      if (sortObjKeys.has(key)) {
        sortObj[key] = value;
      } else if (addOnSortKeys.has(key)) {
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
      "/client/comment/delete-many",
      checkedList,
      "comment",
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
        type={"Comment"}
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
    }
  }, [data]);

  useEffect(() => {
    setCheckedList([]);
  }, [queriese.page]);

  if (isError) {
    console.log(error);
    return;
  }

  return (
    <div className='overflow-auto h-full relative scrollbar-3'>
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
                onChange={handleOnSearch}
              />
            )}
          </div>
          <div>
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
          className='sticky top-[46px] z-[10] bg-black text-[12px] font-[500] leading-[48px]
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
            Comment
          </div>
          <div className='flex-[2_0_400px] min-w-[400px] mx-[12px]'>Video</div>
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
          <div className='flex-[1_0_60px] min-w-[60px] mx-[12px] text-right'>
            Like
          </div>
          <div className='flex-[1_0_60px] min-w-[60px] mx-[12px] text-right'>
            Dislike
          </div>
        </div>
        {/* Body */}
        <div className='flex flex-col z-[2]'>
          {dataList.length > 0 &&
            dataList.map((item, id) => (
              <CmtTbRow
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
        setParams={setQueriese}
        currPage={queriese?.page}
        totalPage={data?.totalPages}
      />
    </div>
  );
};
export default Comment;
