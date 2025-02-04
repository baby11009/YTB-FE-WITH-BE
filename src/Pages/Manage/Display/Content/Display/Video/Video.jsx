import {
  SortIcon2,
  CloseIcon,
  CreateIcon,
  TrashBinIcon,
  LongArrowIcon,
} from "../../../../../../Assets/Icons";
import { useState, useRef, useEffect } from "react";
import {
  CustomeFuncBox,
  CheckBox2,
  DeleteConfirm,
  Pagination,
} from "../../../../../../Component";
import VideoTbRow from "./VideoTbRow";
import { useAuthContext } from "../../../../../../Auth Provider/authContext";
import VideoUpsertModal from "./VideoUpsertModal";
import { getDataWithAuth } from "../../../../../../Api/getData";
import { dltManyData } from "../../../../../../Api/controller";
import { useQueryClient } from "@tanstack/react-query";
import { scrollToTop } from "../../../../../../util/scrollCustom";

const initParams = {
  title: "",
  limit: 8,
  page: 1,
  sort: { createdAt: -1, view: -1 },
  type: "video",
  clearCache: "video",
};

const Video = () => {
  const queryClient = useQueryClient();

  const { setIsShowing, openedMenu, addToaster } = useAuthContext();

  const [sort, setSort] = useState(undefined);

  const [opened, setOpened] = useState(false);

  const [params, setParams] = useState(initParams);

  const [checkedList, setCheckedList] = useState([]);

  const { data, isLoading, refetch } = getDataWithAuth(
    "/client/video",
    params,
    true,
    false,
  );

  const [dataList, setDataList] = useState([]);

  const handleCheckedAll = () => {
    if (checkedList.length === data?.data?.length) {
      setCheckedList([]);
    } else {
      const idList = data?.data?.map((item) => item?._id);

      setCheckedList(idList);
    }
  };

  const handleChecked = (id) => {
    setCheckedList((prev) => {
      const index = prev.indexOf(id);
      if (index === -1) {
        return [...prev, id];
      } else {
        return [...prev.filter((data) => data !== id)];
      }
    });
  };

  const handleOnClick = (data) => {
    setSort((prev) => {
      if (prev && prev.slug === data.slug) {
        return undefined;
      }

      return data;
    });

    if (data.slug !== "title") {
      setParams((prev) => {
        const paramObj = { ...prev };

        paramObj.sort = {
          [`${data.slug}`]: data.value,
        };
        paramObj.page = 1;
        return paramObj;
      });
    }
  };

  const timeoutRef = useRef();

  const handleOnSearch = (e) => {
    clearTimeout(timeoutRef.current);
    setTimeout(() => {
      setParams((prev) => ({ ...prev, title: e.target.value, page: 1 }));
    }, 600);
  };

  const handleSortUnique = (key, value) => {
    const uniqueSortKeys = ["view", "like", "dislike", "totalCmt"];
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
  };

  const funcList = useRef([
    {
      id: 1,
      text: "Title",
      slug: "title",
      value: 1,
      handleOnClick: handleOnClick,
    },
  ]);

  const handleDeleteMany = async () => {
    await dltManyData(
      "/client/video/delete-many",
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

  const showDltConfirm = () => {
    if (checkedList.length < 1) {
      alert("Please select at least one item");
      return;
    }
    setIsShowing(
      <DeleteConfirm
        handleDelete={handleDeleteMany}
        type={"Video"}
        data={checkedList.join(", ")}
      />,
    );
  };

  const showUpsertModal = () => {
    setIsShowing(<VideoUpsertModal title={"Uploading video"} />);
  };

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

  useEffect(() => {
    setCheckedList([]);
  }, [params.page]);

  return (
    <div className='overflow-auto max-h-full relative scrollbar-3'>
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
                currentId={sort?.id}
                funcList1={funcList.current}
              />
            )}
          </div>
          <div className='flex-1 flex items-center'>
            {sort?.text && (
              <button className='flex items-center rounded-[5px] bg-black-0.2 h-[32px]'>
                <span className='ml-[12px] font-[500] leading-[20px] text-[14px]'>
                  {sort.text}
                </span>
                <div
                  className='px-[6px] w-[24px]'
                  onClick={() => {
                    setSort(undefined);
                    setParams((prev) => ({ ...prev, title: "", page: 1 }));
                  }}
                >
                  <CloseIcon />
                </div>
              </button>
            )}
            {sort?.text === "Title" && (
              <input
                autoFocus
                type='text'
                placeholder='Tìm kiếm...'
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
          className='sticky top-[40px] z-[7] bg-black text-[12px] font-[500] leading-[48px]
           text-gray-A items-center border-y-[1px] border-gray-A flex '
        >
          <div className='sticky left-0 h-[48px] p-[0_12px_0_24px] flex items-center justify-center gap-[12px]'>
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
              border-r-[1px] border-gray-A'
          >
            Video
          </div>
          <div className='flex-[1_0_100px] min-w-[100px] mx-[12px]'>
            <button
              onClick={() => {
                handleSortUnique(
                  "createdAt",
                  params.sort["createdAt"] === -1 ? 1 : -1,
                );
              }}
              className={`flex items-center  w-full ${
                params.sort["createdAt"] ? "text-white-F1 font-bold" : ""
              }`}
            >
              <span>Date </span>

              <div
                className={`${
                  params.sort["createdAt"] === -1 ? "rotate-180" : ""
                }
                ${
                  params.sort["createdAt"] ? "visible" : "invisible"
                } ml-[12px] w-[12px]`}
              >
                <LongArrowIcon />
              </div>
            </button>
          </div>
          <div className='flex-[1_0_100px] min-w-[100px] mx-[12px] '>
            <button
              onClick={() => {
                handleSortUnique("view", params.sort["view"] === -1 ? 1 : -1);
              }}
              className={`flex items-center justify-end w-full ${
                params.sort["view"] ? "text-white-F1 font-bold" : ""
              }`}
            >
              <span>View</span>
              <div
                className={`${params.sort["view"] === -1 ? "rotate-180" : ""}
                ${
                  params.sort["view"] ? "visible" : "invisible"
                } ml-[12px] w-[12px]`}
              >
                <LongArrowIcon />
              </div>
            </button>
          </div>
          <div className='flex-[1_0_100px] min-w-[100px] mx-[12px]'>
            <button
              onClick={() => {
                handleSortUnique(
                  "totalCmt",
                  params.sort["totalCmt"] === -1 ? 1 : -1,
                );
              }}
              className={`flex items-center justify-end  w-full ${
                params.sort["totalCmt"] ? "text-white-F1 font-bold" : ""
              }`}
            >
              <span>Comments</span>

              <div
                className={`${
                  params.sort["totalCmt"] === -1 ? "rotate-180" : ""
                }
                  ${
                    params.sort["totalCmt"] ? "visible" : "invisible"
                  } ml-[12px] w-[12px]`}
              >
                <LongArrowIcon />
              </div>
            </button>
          </div>
          <div className='flex-[1_0_60px] min-w-[60px] mx-[12px]'>
            <button
              onClick={() => {
                handleSortUnique("like", params.sort["like"] === -1 ? 1 : -1);
              }}
              className={`flex items-center justify-end w-full ${
                params.sort["like"] ? "text-white-F1 font-bold" : ""
              }`}
            >
              <span>Like</span>

              <div
                className={`${params.sort["like"] === -1 ? "rotate-180" : ""}
                    ${
                      params.sort["like"] ? "visible" : "invisible"
                    } ml-[12px] w-[12px]`}
              >
                <LongArrowIcon size={14} />
              </div>
            </button>
          </div>
          <div className='flex-[1_0_60px] min-w-[60px] mx-[12px]'>
            <button
              onClick={() => {
                handleSortUnique(
                  "dislike",
                  params.sort["dislike"] === -1 ? 1 : -1,
                );
              }}
              className={`flex items-center justify-end w-full ${
                params.sort["dislike"] ? "text-white-F1 font-bold" : ""
              }`}
            >
              <span>Dislike</span>

              <div
                className={`${params.sort["dislike"] === -1 ? "rotate-180" : ""}
                  ${
                    params.sort["dislike"] ? "visible" : "invisible"
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
            <VideoTbRow
              key={id}
              handleChecked={handleChecked}
              checked={checkedList.includes(item?._id)}
              data={item}
              od={id + params?.limit * (params?.page - 1) + 1}
              refetch={refetch}
            />
          ))}
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
export default Video;
