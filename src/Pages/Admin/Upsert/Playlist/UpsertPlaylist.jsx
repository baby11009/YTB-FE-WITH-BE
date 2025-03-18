import { useParams } from "react-router-dom";
import { getData } from "../../../../Api/getData";
import { useQueryClient } from "@tanstack/react-query";
import {
  DropDown,
  DisableTextArea,
  InfiniteDropDown,
  InfiniteDropDownWithCheck,
  TextArea,
} from "../../../../Component";
import {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
} from "react";
import { CloseIcon } from "../../../../Assets/Icons";
import { createData, updateData } from "../../../../Api/controller";
import { useAuthContext } from "../../../../Auth Provider/authContext";
import { isEmpty } from "../../../../util/validateFunc";
import { isObjectEmpty } from "../../../../util/func";
import { HovUserCard, HovVideorCard } from "../../../../Component";
import { isTwoArrayEqual } from "../../../../util/func";

const initForm = {
  userId: "",
  email: "",
  videoIdList: [],
  title: "",
  privacy: "public",
};

const intiQueriese = {
  videoPage: 1,
  videoLimit: 10,
  search: {},
  sort: {},
};

const userQuerieseInit = {
  search: {},
  limit: 10,
  page: 1,
  clearCache: "user",
};

const videoQuerieseInit = {
  search: {},
  limit: 10,
  page: 1,
  clearCache: "video",
};

const UpsertPlaylist = () => {
  const { id } = useParams();

  const { addToaster } = useAuthContext();

  const queryClient = useQueryClient();

  const [queriese, setQueriese] = useState(intiQueriese);

  const [userQueriese, setUserQueriese] = useState(userQuerieseInit);

  const [videoQueriese, setVideoQueriese] = useState(videoQuerieseInit);

  const [userOpened, setUserOpened] = useState(false);

  const [videoOpened, setVideoOpened] = useState(false);

  const [formData, setFormData] = useState(initForm);

  const [realTimeErrs, setRealTimeErrs] = useState({});

  const [submitErrs, setSubmitErrs] = useState({});

  const privacy = useRef([
    { id: "public", label: "Public" },
    { id: "private", label: "Private" },
  ]);

  const [error, setError] = useState({
    inputName: [],
    message: [],
  });

  const { data: playlistData, refetch } = getData(
    `playlist/${id}`,
    queriese,
    id !== undefined,
    false,
  );

  const {
    data: usersData,
    isLoading: userIsLoading,
    error: userError,
  } = getData("user", userQueriese, userOpened, false);

  const {
    data: videosData,
    isLoading: videoIsLoading,
    isError: videoIsError,
    error: videoError,
  } = getData("video", videoQueriese, videoOpened, false);

  const handleOnChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSetRealTimeErr = useCallback((errName, errMessage) => {
    setRealTimeErrs((prev) => ({ ...prev, [errName]: errMessage }));
  }, []);

  const handleRemoveRealTimeErr = useCallback(
    (errName) => {
      if (!Object.keys(realTimeErrs).includes(errName)) return;

      setRealTimeErrs((prev) => {
        const errs = structuredClone(prev);
        delete errs[errName];
        return errs;
      });
    },
    [realTimeErrs],
  );

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
    const { email, videoIdList, privacy, ...neededValidateFields } = formData;

    const fieldEntries = Object.entries(neededValidateFields);

    const validateFormValueFuncs = {
      userId: (userId) => {
        return isEmpty("userId", userId, "User not picked yet");
      },
      title: (title) => {
        return isEmpty("title", title, "Video title cannot be empty");
      },
    };

    const errors = fieldEntries.reduce((acc, [key, value]) => {
      const err = validateFormValueFuncs[key](value) || undefined;

      if (err) {
        acc = { ...acc, ...err };
      }

      return acc;
    }, {});

    const isValid = isObjectEmpty(errors);

    if (!isValid) {
      setSubmitErrs(errors);
    }

    return isValid;
  };

  const handleValidateUpdate = () => {
    const { userId, email, privacy, videoIdList, ...neededValidateFields } =
      formData;

    const fieldEntries = Object.entries(neededValidateFields);

    const validateFormValueFuncs = {
      title: (title) => {
        return isEmpty("title", title, "Video title cannot be empty");
      },
    };

    const errors = fieldEntries.reduce((acc, [key, value]) => {
      const err = validateFormValueFuncs[key](value) || undefined;
      if (err) {
        acc = { ...acc, ...err };
      }

      return acc;
    }, {});

    const isValid = isObjectEmpty(errors);

    if (!isValid) {
      setSubmitErrs(errors);
    }

    return isValid;
  };

  const create = async () => {
    const isValid = handleValidate();

    if (!isValid) {
      return;
    }

    const { email, ...finalFormData } = formData;

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
    const isValid = handleValidateUpdate();

    if (!isValid) {
      return;
    }

    const { email, userId, videoIdList, ...finalFormData } = formData;

    // Lấy ra các phần tử chỉ có ở 1 trong 2 mảng để xóa và thêm
    // Xóa đối với các phần tử chỉ có trong mảng của data fetch về
    // Thêm đối với các phẩn tử chỉ có trong mảng đang điều chỉnh dữ liệu
    // Có trong cả 2 tức là k thay đổi các phần tử

    for (const key in finalFormData) {
      if (finalFormData[key] === playlistData.data[key]) {
        delete finalFormData[key];
      }
    }

    if(isTwoArrayEqual(videoIdList,playlistData.data)){
      
    }

    // const setFormData = new Set(videoIdList);

    // const setData = new Set(playlistData?.data?.itemList);

    // const uniqueIdList = [];

    // playlistData?.data?.itemList?.forEach((item) => {
    //   if (!formData.videoIdList.includes(item)) {
    //     uniqueIdList.push(item);
    //   }
    // });

    // formData.videoIdList.filter((item) => {
    //   if (!playlistData?.data?.itemList.includes(item)) {
    //     uniqueIdList.push(item);
    //   }
    // });

    // if (uniqueIdList.length > 0) {
    //   finalFormData.videoIdList = uniqueIdList;
    // }

    // await updateData(
    //   "playlist",
    //   id,
    //   finalFormData,
    //   "playlist",
    //   () => {
    //     refetch();
    //   },
    //   undefined,
    //   addToaster,
    // );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (id) {
      await update();
    } else {
      await create();
    }
  };

  useEffect(() => {
    let timeOut;
    if (submitErrs) {
      timeOut = setTimeout(() => {
        setSubmitErrs({});
      }, 2500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [submitErrs]);

  useLayoutEffect(() => {
    if (playlistData) {
      const data = {
        userId: playlistData?.data?.user_info?._id,
        email: playlistData?.data?.user_info?.email,
        videoIdList: playlistData?.data?.itemList,
        title: playlistData?.data?.title,
      };

      if (playlistData.data.type === "playlist") {
        data.privacy = playlistData.data.privacy;
      }
      setFormData(data);
    }

    return () => {
      setFormData(initForm);
    };
  }, [playlistData]);

  useEffect(() => {
    if (!userOpened) {
      queryClient.removeQueries({ queryKey: Object.values(userQueriese) });
    }
  }, [userOpened, userQueriese]);

  useEffect(() => {
    if (!videoOpened) {
      queryClient.removeQueries({ queryKey: Object.values(videoQueriese) });
    }
  }, [videoOpened, videoQueriese]);

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

  if (id && !playlistData) return;

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
        <div className='flex-1 flex flex-wrap gap-x-[16px]'>
          {/* Title */}
          <div className='basis-[100%] sm:basis-[48%] 2md:basis-[32%] z-[100]'>
            {!id || playlistData?.data.type === "playlist" ? (
              <TextArea
                title={"Title"}
                name={"title"}
                preventCharactersList={new Set(["Enter"])}
                value={formData.title}
                defaultValue={playlistData?.data.title}
                handleOnChange={handleOnChange}
                maxLength={155}
                handleSetRealTimeErr={handleSetRealTimeErr}
                handleRemoveRealTimeErr={handleRemoveRealTimeErr}
                errMsg={submitErrs["title"] ? submitErrs["title"] : ""}
                placeholder={"Enter playlist title"}
              />
            ) : (
              <DisableTextArea title={"Title"} value={formData.title} />
            )}
          </div>

          {/* User */}
          <div className='basis-[100%] sm:basis-[48%] 2md:basis-[32%] z-[100]'>
            <InfiniteDropDown
              disabled={id ? true : false}
              prsRemoveValue={userQuerieseInit.clearCache}
              title={"User"}
              value={formData.email || "Not picked"}
              setIsOpened={setUserOpened}
              list={usersData?.data}
              isLoading={userIsLoading}
              fetchingError={userError?.response?.data?.msg}
              validateError={submitErrs["userId"] ? submitErrs["userId"] : ""}
              displayData={"email"}
              handleSetQueriese={(value, pageInc) => {
                setUserQueriese((prev) => {
                  const prevClone = {
                    ...prev,
                  };

                  if (value !== undefined) {
                    prevClone.search["email"] = value;
                    prevClone.page = 1;
                  }

                  if (pageInc !== undefined) {
                    prevClone.page = prevClone.page + pageInc;
                  }

                  return prevClone;
                });
              }}
              handleSetCurr={(data) => {
                setFormData((prev) => ({
                  ...prev,
                  userId: data?._id,
                  email: data?.email,
                }));
              }}
              HoverCard={HovUserCard}
            />
          </div>

          {/* Video */}

          <div className='basis-[100%] sm:basis-[48%] 2md:basis-[32%] z-[90]'>
            <InfiniteDropDownWithCheck
              title={"Video"}
              prsRemoveValue={videoQuerieseInit.clearCache}
              valueList={formData.videoIdList}
              setIsOpened={setVideoOpened}
              list={videosData?.data}
              isLoading={videoIsLoading}
              isError={videoIsError}
              fetchingError={videoError?.response?.data?.msg}
              setData={(value) => {
                setFormData((prev) => ({ ...prev, videoIdList: value }));
              }}
              handleSetQueriese={(value, pageInc) => {
                setVideoQueriese((prev) => {
                  const prevClone = {
                    ...prev,
                  };

                  if (value !== undefined) {
                    prevClone.search["title"] = value;
                    prevClone.page = 1;
                  }

                  if (pageInc !== undefined) {
                    prevClone.page = prevClone.page + pageInc;
                  }

                  return prevClone;
                });
              }}
            />
          </div>
          {(!id || playlistData?.data.type === "playlist") && (
            <div className='basis-[100%] sm:basis-[48%] 2md:basis-[32%] z-[90]'>
              <DropDown
                list={privacy.current}
                title={"Privacy"}
                value={formData.privacy || ""}
                handleOnClick={(privacy) => {
                  setFormData((prev) => ({ ...prev, privacy }));
                }}
              />
            </div>
          )}
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
