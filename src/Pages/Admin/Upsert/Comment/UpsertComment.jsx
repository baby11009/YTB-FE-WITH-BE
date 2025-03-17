import {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import {
  Input,
  InfiniteDropDown,
  HovVideorCard,
  HovCommentCard,
  HovUserCard,
  TextArea,
} from "../../../../Component";
import { createData, updateData } from "../../../../Api/controller";
import { getDataWithAuth } from "../../../../Api/getData";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../../../Auth Provider/authContext";
import { isObjectEmpty } from "../../../../util/func";
import { isEmpty } from "../../../../util/validateFunc";
import { useNavigate } from "react-router-dom";
import { LongArrowIcon } from "../../../../Assets/Icons";

const initForm = {
  userId: undefined,
  email: "",
  videoId: undefined,
  videoTitle: "",
  replyId: "",
  replyContent: "",
  cmtText: "",
  like: 0,
  dislike: 0,
};

const initUserQueriese = {
  search: {},
  select: ["_id", "email"],
  limit: 10,
  page: 1,
  clearCache: "user",
};

const intiVideoQueriese = {
  search: {},
  limit: 10,
  page: 1,
  clearCache: "video",
};

const initReplyCmtQueriese = {
  search: {},
  limit: 10,
  page: 1,
  videoId: undefined,
  clearCache: "reply",
};

const UpsertComment = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const { addToaster } = useAuthContext();

  const queryClient = useQueryClient();

  const [userOpened, setUserOpened] = useState(false);

  const [videoOpened, setVideoOpened] = useState(false);

  const [cmtOpened, setCmtOpened] = useState(false);

  const [formData, setFormData] = useState(initForm);

  const [realTimeErrs, setRealTimeErrs] = useState({});

  const [submitErrs, setSubmitErrs] = useState({});

  const [userQueriese, setUserQueriese] = useState(initUserQueriese);

  const [videoQuerese, setVideoQueriese] = useState(intiVideoQueriese);

  const [replyCmtQueriese, setReplyCmtQueriese] =
    useState(initReplyCmtQueriese);

  const {
    data: commentData,
    refetch,
    error: queryError,
  } = getDataWithAuth(`comment/${id}`, {}, id !== undefined, false);

  const {
    data: usersData,
    isLoading: userIsLoading,
    error: userError,
  } = getDataWithAuth("user", userQueriese, userOpened, false);

  const {
    data: videosData,
    isLoading: videoIsLoading,
    error: videoError,
  } = getDataWithAuth("video", videoQuerese, videoOpened, false);

  const {
    data: replyCmtsData,
    isLoading: replyCmtsIsLoading,
    error: replyCmtsError,
  } = getDataWithAuth(
    `/comment`,
    replyCmtQueriese,
    cmtOpened && formData.videoId ? true : false,
    false,
  );

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

  const handleValidate = () => {
    const {
      email,
      like,
      dislike,
      replyId,
      replyContent,
      videoTitle,
      ...neededValidateFields
    } = formData;

    const fieldEntries = Object.entries(neededValidateFields);

    const validateFormValueFuncs = {
      userId: (userId) => {
        return isEmpty("userId", userId, "User not picked yet");
      },
      videoId: (videoId) => {
        return isEmpty("videoId", videoId, "Video not picked yet");
      },
      cmtText: (cmtText) => {
        return isEmpty("cmtText", cmtText, "Comment content cannot be empty");
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
    const {
      email,
      like,
      dislike,
      replyId,
      userId,
      videoId,
      replyContent,
      videoTitle,
      ...neededValidateFields
    } = formData;

    const fieldEntries = Object.entries(neededValidateFields);

    const validateFormValueFuncs = {
      cmtText: (cmtText) => {
        return isEmpty("cmtText", cmtText, "Comment content cannot be empty");
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

    const finalData = {};

    Object.keys(formData).map((key) => {
      if (key !== "email") {
        finalData[key] = formData[key];
      }
    });

    await createData(
      "comment",
      finalData,
      "comment",
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

    let finalData = {
      cmtText: formData.cmtText,
      like: formData.like,
      dislike: formData.dislike,
    };

    for (const key in finalData) {
      if (commentData?.data?.hasOwnProperty(key)) {
        if (commentData?.data[key] === finalData[key]) {
          delete finalData[key];
        }
      }
    }

    if (Object.keys(finalData).length === 0) {
      alert("Không có gì thay đổi");
      return;
    }

    await updateData(
      "comment",
      id,
      finalData,
      "comment",
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
    if (commentData) {
      setFormData({
        userId: commentData.data.user_info._id,
        email: commentData.data.user_info.email,
        videoId: commentData.data.video_info._id,
        videoTitle: commentData.data.video_info.title,
        replyId: commentData.data.replied_cmt_id,
        replyContent: commentData.data.replied_cmt_info?.cmtText || "",
        cmtText: commentData.data.cmtText,
        like: commentData.data.like,
        dislike: commentData.data.dislike,
      });
    }

    return () => {
      setFormData(initForm);
    };
  }, [commentData]);

  useEffect(() => {
    if (!userOpened) {
      queryClient.removeQueries({ queryKey: Object.values(userQueriese) });
    }
  }, [userOpened, userQueriese]);

  useEffect(() => {
    if (!videoOpened) {
      queryClient.removeQueries({ queryKey: Object.values(videoQuerese) });
    }
  }, [videoOpened, videoQuerese]);

  useEffect(() => {
    if (!cmtOpened) {
      queryClient.removeQueries({ queryKey: Object.values(replyCmtQueriese) });
    }
  }, [cmtOpened, replyCmtQueriese]);

  useEffect(() => {
    let timeOut;

    if (!isObjectEmpty(submitErrs)) {
      timeOut = setTimeout(() => {
        setSubmitErrs({});
      }, 2500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [submitErrs]);

  useEffect(() => {
    if (formData.videoId) {
      setReplyCmtQueriese((prev) => ({
        ...prev,
        search: { videoId: formData.videoId },
      }));
    }
  }, [formData.videoId]);

  useEffect(() => {
    return () => {
      queryClient.clear();
    };
  }, []);

  return (
    <div className='max-w-[1500px] mx-auto md:px-[16px]'>
      <div className=' sticky top-[56px]  py-[8px] bg-black z-[10] flex items-center'>
        <h1 className='text-[28px] leading-[44px] font-[500] flex-1'>
          Comments
        </h1>
        <button
          className='flex-shrink-0 size-[40px] rounded-[50%] hover:bg-black-0.1 p-[8px]'
          onClick={() => {
            navigate(-1);
          }}
        >
          <div className='w-[24px]'>
            <LongArrowIcon />
          </div>
        </button>
      </div>

      <form noValidate onSubmit={handleSubmit} className='mb-[36px]'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[16px]'>
          {/* User */}
          <div className='z-[100]'>
            <InfiniteDropDown
              disabled={id ? true : false}
              title={"User"}
              value={formData.email || "Not picked yet"}
              setIsOpened={setUserOpened}
              list={usersData?.data}
              displayData={"email"}
              isLoading={userIsLoading}
              fetchingError={userError?.response?.data?.msg}
              validateError={submitErrs["userId"]}
              handleSetQueriese={(value, pageInc) => {
                setUserQueriese((prev) => {
                  const prevClone = {
                    ...prev,
                  };

                  if (value === "" || value) {
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
          <div className='z-[90]'>
            <InfiniteDropDown
              disabled={id ? true : false}
              title={"Video"}
              dataType={"video"}
              value={formData.videoTitle || "Not picked yet"}
              setIsOpened={setVideoOpened}
              list={videosData?.data}
              isLoading={videoIsLoading}
              displayData={"title"}
              fetchingError={videoError?.response?.data?.msg}
              validateError={submitErrs["videoId"]}
              handleSetQueriese={(value, pageInc) => {
                console.log(value);
                setVideoQueriese((prev) => {
                  const prevClone = {
                    ...prev,
                  };

                  if (value === "" || value) {
                    prevClone.search["title"] = value;
                    prevClone.page = 1;
                  }

                  if (pageInc) {
                    prevClone.page = prevClone.page + pageInc;
                  }

                  return prevClone;
                });
              }}
              handleSetCurr={(data) => {
                setFormData((prev) => ({
                  ...prev,
                  videoId: data._id,
                  videoTitle: data.title,
                }));
              }}
              HoverCard={HovVideorCard}
            />
          </div>

          {/* Comment */}
          <div className='z-[80]'>
            <InfiniteDropDown
              disabled={id || !formData.videoId ? true : false}
              title={"Reply to"}
              dataType={"comment"}
              prsRemoveValue={replyCmtQueriese.clearCache}
              value={formData.replyContent || "Not picked yet"}
              setIsOpened={setCmtOpened}
              list={replyCmtsData?.data}
              isLoading={replyCmtsIsLoading}
              displayData={"cmtText"}
              fetchingError={replyCmtsError?.response?.data?.msg}
              handleSetQueriese={(value, pageInc) => {
                console.log(value);
                setReplyCmtQueriese((prev) => {
                  const prevClone = {
                    ...prev,
                  };

                  if (value === "" || value) {
                    prevClone.search["content"] = value;
                    prevClone.page = 1;
                  }

                  if (pageInc) {
                    prevClone.page = prevClone.page + pageInc;
                  }

                  return prevClone;
                });
              }}
              handleSetCurr={(data) => {
                setFormData((prev) => ({
                  ...prev,
                  replyId: data._id,
                  replyContent: data.cmtText,
                }));
              }}
              HoverCard={HovCommentCard}
            />
          </div>

          {/* Like */}
          <Input
            maxWidth={"lg:max-w-[360px]"}
            id={"like"}
            type={"number"}
            label={"Like"}
            value={formData.like || 0}
            defaultValue={commentData?.data?.like}
            handleOnChange={handleOnChange}
          />

          {/* Dislike */}

          <Input
            maxWidth={"lg:max-w-[360px]"}
            id={"dislike"}
            type={"number"}
            label={"Dislike"}
            value={formData.dislike || 0}
            defaultValue={commentData?.data?.dislike}
            handleOnChange={handleOnChange}
          />
        </div>

        <div>
          <TextArea
            title={"Comment content"}
            name={"cmtText"}
            preventCharactersList={new Set(["Enter"])}
            value={formData.cmtText}
            defaultValue={commentData?.data.cmtText}
            handleOnChange={handleOnChange}
            handleSetRealTimeErr={handleSetRealTimeErr}
            handleRemoveRealTimeErr={handleRemoveRealTimeErr}
            errMsg={submitErrs["cmtText"] ? submitErrs["cmtText"] : ""}
            placeholder={"Enter comment content"}
          />
        </div>

        <div className='flex items-center justify-center mt-[50px]'>
          <button type='submit' className='w-full max-w-[160px] btn1 relative'>
            <span className='z-[50] relative'>Submit</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpsertComment;
