import { useParams } from "react-router-dom";
import { getDataWithAuth } from "../../../../Api/getData";
import { useQueryClient } from "@tanstack/react-query";
import {
  Input,
  InfiniteDropDown,
  InfiniteDropDownWithCheck,
} from "../../../../Component";
import { useState, useEffect, useLayoutEffect } from "react";
import { CloseIcon } from "../../../../Assets/Icons";
import { createData, updateData } from "../../../../Api/controller";
import { useAuthContext } from "../../../../Auth Provider/authContext";

const initForm = {
  userId: "",
  videoIdList: [],
  title: "",
  email: "",
};

const userPrsInit = {
  email: "",
  limit: 10,
  page: 1,
  clearCache: "user",
};

const videoPrsInit = {
  id: "",
  limit: 10,
  page: 1,
  clearCache: "video",
};

const UpsertPlaylist = () => {
  const { id } = useParams();

  const { addToaster } = useAuthContext();

  const queryClient = useQueryClient();

  const [formData, setFormData] = useState(initForm);

  const [userPrs, setUserPrs] = useState(userPrsInit);

  const [videoPrs, setVideoPrs] = useState(videoPrsInit);

  const [userOpened, setUserOpened] = useState(false);

  const [videoOpened, setVideoOpened] = useState(false);

  const [error, setError] = useState({
    inputName: [],
    message: [],
  });

  const {
    data: playlistData,
    refetch,
    error: queryError,
    isLoading,
    isError,
  } = getDataWithAuth(`playlist/${id}`, {}, id !== undefined, false);

  const {
    data: usersData,
    isLoading: userIsLoading,
    isError: userIsError,
    error: userError,
  } = getDataWithAuth("user", userPrs, userOpened, false);

  const {
    data: videosData,
    isLoading: videoIsLoading,
    isError: videoIsError,
    error: videoError,
  } = getDataWithAuth("video", videoPrs, videoOpened, false);

  const handleOnChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRemove = (value) => {
    if (formData.videoIdList.includes(value)) {
      const newList = formData.videoIdList;
      const finalList = newList.filter((item) => item !== value);
      setFormData((prev) => ({
        ...prev,
        videoIdList: finalList,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        videoIdList: [...prev.videoIdList, value],
      }));
    }
  };

  const handleValidate = () => {
    if (error.inputName.length > 0) {
      setError({ inputName: [], message: [] });
    }

    let hasErrors = false;

    const keys = Object.keys(formData).filter((key) => key !== "videoIdList");

    keys.forEach((key) => {
      if (!formData[key]) {
        let errMsg = "Không được để trống";
        setError((prev) => ({
          inputName: [...prev.inputName, key],
          message: [...prev.message, errMsg],
        }));
        hasErrors = true;
      }
    });

    return hasErrors;
  };

  const handleUpdateValidate = () => {
    if (handleValidate()) {
      return true;
    }

    if (formData.videoIdList.length === playlistData?.data?.itemList?.length) {
      const sameArray = formData.videoIdList.every((item) => {
        console.log(playlistData?.data?.itemList?.includes(item));
        return playlistData?.data?.itemList?.includes(item);
      });

      if (sameArray && formData.title === playlistData?.data?.title) {
        alert("Nothing changed");
        return true;
      }
    }
  };

  const create = async () => {
    const isError = handleValidate();
    if (isError) {
      return;
    }

    const finalFormData = {
      title: formData.title,
      videoIdList: formData.videoIdList,
      userId: formData.userId,
    };

    await createData(
      "playlist",
      finalFormData,
      "playlist",
      () => {
        setFormData(initForm);
      },
      undefined,
      addToaster,
    );
  };

  const update = async () => {
    const isError = handleUpdateValidate();

    if (isError) {
      return;
    }

    const finalFormData = {};

    if (formData.title !== playlistData?.data?.title) {
      finalFormData.title = formData.title;
    }

    // Lấy ra các phần tử chỉ có ở 1 trong 2 mảng để xóa và thêm
    // Xóa đối với các phần tử chỉ có trong mảng của data fetch về
    // Thêm đối với các phẩn tử chỉ có trong mảng đang điều chỉnh dữ liệu
    // Có trong cả 2 tức là k thay đổi các phần tử

    const setFormData = new Set(formData.videoIdList);

    const setData = new Set(playlistData?.data?.itemList);

    const uniqueIdList = [];

    playlistData?.data?.itemList?.forEach((item) => {
      if (!formData.videoIdList.includes(item)) {
        uniqueIdList.push(item);
      }
    });

    formData.videoIdList.filter((item) => {
      if (!playlistData?.data?.itemList.includes(item)) {
        uniqueIdList.push(item);
      }
    });

    console.log("🚀 ~ uniqueIdList:", uniqueIdList);
    if (uniqueIdList.length > 0) {
      finalFormData.videoIdList = uniqueIdList;
    }

    await updateData(
      "playlist",
      id,
      finalFormData,
      "playlist",
      () => {
        refetch();
      },
      undefined,
      addToaster,
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (id) {
      await update();
    } else {
      await create();
    }
  };

  useLayoutEffect(() => {
    if (playlistData) {
      setFormData({
        userId: playlistData?.data?.user_info?._id,
        email: playlistData?.data?.user_info?.email,
        videoIdList: playlistData?.data?.itemList,
        title: playlistData?.data?.title,
      });
    }

    return () => {
      setFormData(initForm);
    };
  }, [playlistData]);

  useEffect(() => {
    if (!userOpened) {
      queryClient.removeQueries("user");
    }
  }, [userOpened]);

  useEffect(() => {
    if (!videoOpened) {
      queryClient.removeQueries("video");
    }
  }, [videoOpened]);

  useEffect(() => {
    let timeOut;
    if (error.inputName.length > 0) {
      timeOut = setTimeout(() => {
        setError({
          inputName: [],
          message: [],
        });
      }, 2500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [error]);

  useEffect(() => {
    return () => {
      queryClient.clear();
    };
  }, []);

  if (isError) {
    return queryError.message;
  }

  return (
    <div>
      <header className='pt-[16px] pb-[40px]'>
        <h2 className='text-[28px] leading-[44px] font-[500]'>Playlist</h2>
      </header>

      <form
        noValidate
        onSubmit={handleSubmit}
        className='flex items-center flex-wrap gap-[24px] mb-[36px]'
      >
        <div className='flex-1 flex flex-wrap gap-[16px]'>
          {/* Title */}
          <div className='basis-[100%] sm:basis-[48%] 2md:basis-[32%] z-[100]'>
            <Input
              id={"title"}
              type={"text"}
              label={"Playlist title"}
              value={formData.title}
              defaultValue={""}
              handleOnChange={handleOnChange}
              error={
                error.inputName.includes("title")
                  ? `${error.message[error.inputName.indexOf("title")]}`
                  : ""
              }
            />
          </div>

          {/* User */}
          <div className='basis-[100%] sm:basis-[48%] 2md:basis-[32%] z-[100]'>
            <InfiniteDropDown
              disabled={id ? true : false}
              prsRemoveValue={userPrsInit.clearCache}
              title={"User"}
              value={formData.email || "Chưa chọn"}
              setIsOpened={setUserOpened}
              list={usersData?.data}
              isLoading={userIsLoading}
              isError={userIsError}
              errorMsg={userError?.response?.data?.msg}
              displayData={"email"}
              handleSetParams={(value, pageInc) => {
                setUserPrs((prev) => {
                  let finalobj = {
                    ...prev,
                  };

                  if (value !== undefined) {
                    finalobj.email = value;
                    finalobj.page = 1;
                  }

                  if (pageInc !== undefined) {
                    finalobj.page = finalobj.page + pageInc;
                  }

                  return finalobj;
                });
              }}
              handleSetCurr={(data) => {
                setFormData((prev) => ({
                  ...prev,
                  userId: data?._id,
                  email: data?.email,
                }));
              }}
            />
            <div className='text-[12px] text-red-FF font-[500] leading-[16px] h-[16px] mt-[12px] px-[8px]'>
              <span>
                {error.inputName.includes("userId")
                  ? error.message[error.inputName.indexOf("userId")]
                  : ""}
              </span>
            </div>
          </div>

          {/* Video */}

          <div className='basis-[100%] sm:basis-[48%] 2md:basis-[32%] z-[90]'>
            <InfiniteDropDownWithCheck
              title={"Video"}
              prsRemoveValue={videoPrsInit.clearCache}
              valueList={formData.videoIdList}
              setIsOpened={setVideoOpened}
              list={videosData?.data}
              isLoading={videoIsLoading}
              isError={videoIsError}
              errorMsg={videoError?.response?.data?.msg}
              setData={(value) => {
                setFormData((prev) => ({ ...prev, videoIdList: value }));
              }}
              handleSetParams={(value, pageInc) => {
                setVideoPrs((prev) => {
                  let finalobj = {
                    ...prev,
                  };

                  if (value !== undefined) {
                    finalobj.id = value;
                    finalobj.page = 1;
                  }

                  if (pageInc !== undefined) {
                    finalobj.page = finalobj.page + pageInc;
                  }

                  return finalobj;
                });
              }}
            />
            <div className='text-[12px] text-red-FF font-[500] leading-[16px] h-[16px] mt-[12px] px-[8px]'>
              <span>
                {error.inputName.includes("videoIdList")
                  ? error.message[error.inputName.indexOf("videoIdList")]
                  : ""}
              </span>
            </div>
          </div>
        </div>

        <div
          className='w-full mt-[24px] border-[2px] rounded-[5px] h-[35vh] min-h-[200px] max-h-[300px]
         overflow-y-auto'
        >
          <div className='flex flex-wrap gap-[12px] px-[20px] py-[10px]'>
            {formData.videoIdList.map((item, id) => (
              <div
                key={id}
                className='flex items-center justify-center py-[4px] pl-[11px] pr-[4px] h-fit bg-black-0.2 rounded-[5px]'
              >
                <span className='text-[18px] leading-[20px]'>{item}</span>
                <button
                  className='size-[30px] flex items-center justify-center '
                  onClick={() => handleRemove(item)}
                  type='button'
                >
                  <CloseIcon size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className='basis-[100%] order-7 flex items-center justify-center mt-[50px]'>
          <button type='submit' className='w-full max-w-[160px] btn1 relative'>
            <span className='z-[50] relative'>Submit</span>
          </button>
        </div>
      </form>
    </div>
  );
};
export default UpsertPlaylist;
