import {
  SortIcon2,
  CloseIcon,
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
import VideoCmtTbRow from "./VideoCmtTbRow";
import { useAuthContext } from "../../../../../../Auth Provider/authContext";
import { getDataWithAuth } from "../../../../../../Api/getData";
import { dltManyData } from "../../../../../../Api/controller";
import { useQueryClient } from "@tanstack/react-query";
import { scrollToTop } from "../../../../../../util/scrollCustom";

const initParams = {
  text: "",
  limit: 8,
  page: 1,
  sort: { createdAt: -1 },
  clearCache: "video-comment",
};

const VideoComment = () => {
  const queryClient = useQueryClient();

  const [sort, setSort] = useState(undefined);

  const [opened, setOpened] = useState(false);

  const [params, setParams] = useState(initParams);

  const [checkedList, setCheckedList] = useState([]);

  const { data, refetch, isLoading } = getDataWithAuth(
    "/client/comment/video-comments",
    params,
  );

  const [dataList, setDataList] = useState([]);

  const { setIsShowing, openedMenu, addToaster } = useAuthContext();

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

    if (data?.slug !== "text") {
      setParams((prev) => {
        const paramObj = { ...prev };

        paramObj.sort = {
          ...paramObj.sort,
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
      setParams((prev) => ({ ...prev, text: e.target.value, page: 1 }));
    }, 600);
  };

  const handleSortUnique = (key, value) => {
    const sortTimeKeys = ["createdAt"];
    const sortObj = { ...params.sort };

    const sortObjKeys = Object.keys(sortObj);
    if (sortObjKeys.includes(key)) {
      sortObj[key] = value;
    } else if (sortTimeKeys.includes(key)) {
      sortObj[key] = value;
    }
    setParams((prev) => ({ ...prev, sort: sortObj, page: 1 }));
  };

  const funcList = useRef([
    {
      id: 1,
      text: "Text",
      slug: "text",
      value: 1,
      handleOnClick: handleOnClick,
    },
  ]);

  const handleDeleteMany = async () => {
    console.log(checkedList.join(", "));
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
  };

  const showDltConfirm = () => {
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
    <div className='min-h-[500px] relative'>
      <div
        className={`fixed z-[2000] w-full left-0 pl-[16px] px-[16px] md:px-[16px] ${
          openedMenu ? "md:pl-[267px]" : "md:pl-[90px]"
        }`}
      >
        <div className='flex gap-[24px] bg-black '>
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
          <div className='w-full flex items-center'>
            {sort?.text && (
              <button className='flex items-center rounded-[5px] bg-black-0.2 h-[32px]'>
                <span className='ml-[12px] font-[500] leading-[20px] text-[14px]'>
                  {sort.text}
                </span>
                <div
                  className='px-[6px]'
                  onClick={() => {
                    setSort(undefined);
                    setParams((prev) => ({ ...prev, text: "", page: 1 }));
                  }}
                >
                  <CloseIcon size={18} />
                </div>
              </button>
            )}
            {sort?.text === "Text" && (
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
            <button onClick={showDltConfirm}>
              <div className='p-[8px] hover:text-red-600'>
                <TrashBinIcon />
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className='overflow-auto pt-[40px]'>
        {/* table */}
        <div className='flex-1 min-w-full w-fit'>
          {/* Head */}
          <div className='text-[12px] font-[500] leading-[48px] text-gray-A flex items-center gap-[12px] border-y-[2px] '>
            <div className='w-[70px] flex items-center gap-[12px] absolute left-0 bg-black border-r-[2px]'>
              <CheckBox2
                checked={
                  checkedList.length === data?.data?.length &&
                  data?.data?.length > 0
                }
                setChecked={handleCheckedAll}
              />
              <span>STT</span>
            </div>
            <div className='w-[150px] ml-[80px]'>Owner</div>
            <div className='w-[300px] '>Content</div>
            <div className='w-[300px]'>Video thumbnail</div>
            <div className='w-[200px]'>Video title</div>
            <div className='w-[150px] mr-[100px]'>
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
                <span>Created date </span>
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
            <div className='w-[100px] absolute right-0 border-l-[2px] px-[12px] bg-black'>
              Function
            </div>
          </div>
          {/* Body */}
          <div className='flex flex-col'>
            {isLoading ? (
              <div>Loading....</div>
            ) : (
              dataList.map((item, id) => (
                <VideoCmtTbRow
                  key={id}
                  handleChecked={handleChecked}
                  checked={checkedList.includes(item?._id)}
                  data={item}
                  od={id + params?.limit * (params?.page - 1) + 1}
                  refetch={refetch}
                />
              ))
            )}
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
export default VideoComment;
