import { useRef, useState, useEffect, useLayoutEffect, Suspense } from "react";
import { UploadImageIcon } from "../../../../Assets/Icons";
import { Input, InfiniteDropDown } from "../../../../Component";
import { createData, updateData } from "../../../../Api/controller";
import { getDataWithAuth } from "../../../../Api/getData";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const initForm = {
  userId: "",
  email: "",
  videoId: "",
  replyId: "",
  cmtText: "",
  like: 0,
  dislike: 0,
};

const UpsertComment = () => {
  const { id } = useParams();

  const queryClient = useQueryClient();

  const [userOpened, setUserOpened] = useState(false);
  const [videoOpened, setVideoOpened] = useState(false);
  const [cmtOpened, setCmtOpened] = useState(false);

  const [formData, setFormData] = useState(initForm);

  const [error, setError] = useState({
    inputName: [],
    message: [],
  });

  const textAreaRef = useRef();

  const [userPrs, setUserPrs] = useState({
    email: "",
    select: ["_id", "email"],
    limit: 10,
    page: 1,
    clearCache: "user",
  });

  const [videoPrs, setVideoPrs] = useState({
    id: "",
    limit: 10,
    page: 1,
    
    clearCache: "video",
  });

  const [replyPrs, setReplyPrs] = useState({
    id: "",
    limit: 10,
    page: 1,
    clearCache: "reply",
  });

  const {
    data: commentData,
    refetch,
    error: queryError,
    isLoading,
    isError,
  } = getDataWithAuth(`comment/${id}`, {}, id !== undefined, false);

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

  const {
    data: replyCmtsData,
    isLoading: replyCmtsIsLoading,
    isError: replyCmtsIsError,
    error: replyCmtsError,
  } = getDataWithAuth(
    `/comment/video-comment/${formData.videoId || "000000000000000000000000"}`,
    replyPrs,
    () => {
      if (cmtOpened && formData.videoId) {
        return true;
      }

      return false;
    },
    false
  );

  const handleOnChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTextArea = (e) => {
    setFormData((prev) => ({
      ...prev,
      cmtText: e.target.value,
    }));
  };

  const handleValidate = () => {
    if (error.inputName.length > 0) {
      setError({ inputName: [], message: [] });
    }

    let hasErrors = false;

    const keys = Object.keys(formData).filter(
      (key) =>
        key !== "email" &&
        key !== "like" &&
        key !== "dislike" &&
        key !== "replyId"
    );

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

    if (hasErrors) {
      return true;
    }
  };

  const handleValidateUpdate = () => {
    if (error.inputName.length > 0) {
      setError({ inputName: [], message: [] });
    }
    let hasErrors = false;
    const keys = Object.keys(formData).filter(
      (key) =>
        key !== "email" &&
        key !== "like" &&
        key !== "dislike" &&
        key !== "replyId"
    );
    keys.forEach((key) => {
      if (formData[key] === "" || !formData[key]) {
        let errMsg = "Không được để trống";
        setError((prev) => ({
          inputName: [...prev.inputName, key],
          message: [...prev.message, errMsg],
        }));
        hasErrors = true;
      }
    });
    if (hasErrors) {
      return true;
    }
  };

  const create = async () => {
    const error = handleValidate();

    if (error) {
      return;
    }

    const finalData = {};

    Object.keys(formData).map((key) => {
      if (key !== "email") {
        finalData[key] = formData[key];
      }
    });

    const responseData = await createData("comment", finalData);

    if (responseData) {
      setFormData(initForm);
    }
  };

  const update = async () => {
    const error = handleValidateUpdate();

    if (error) {
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

    const rspData = await updateData("comment", id, finalData);

    if (rspData) {
      await refetch();
    }
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
        userId: commentData?.data?.user_info?._id,
        email: commentData?.data?.user_info?.email,
        videoId: commentData?.data?.video_info._id,
        replyId: commentData?.data?.replied_cmt_id,
        cmtText: commentData?.data?.cmtText,
        like: commentData?.data?.like,
        dislike: commentData?.data?.dislike,
      });
      textAreaRef.current.value = commentData?.data?.cmtText;
    }

    return () => {
      setFormData(initForm);
    };
  }, [commentData]);

  useEffect(() => {
    if (!userOpened) {
      queryClient.removeQueries({ queryKey: Object.values(userPrs) });
    }
  }, [userOpened]);
  useEffect(() => {
    if (!videoOpened) {
      queryClient.removeQueries({ queryKey: Object.values(videoPrs) });
    }
  }, [videoOpened]);
  useEffect(() => {
    if (!cmtOpened) {
      queryClient.removeQueries({ queryKey: Object.values(replyPrs) });
    }
  }, [cmtOpened]);

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
      <header className='pt-[16px] pb-[32px]'>
        <h2 className='text-[28px] leading-[44px] font-[500]'>Comment</h2>
      </header>

      <form
        noValidate
        onSubmit={handleSubmit}
        className='flex items-center flex-wrap gap-[24px] mb-[36px]'
      >
        <div className='flex-1 flex flex-wrap gap-[16px]'>
          {/* User */}
          <div className='basis-[100%] sm:basis-[48%] 2md:basis-[32%] z-[100]'>
            <InfiniteDropDown
              disabled={commentData ? true : false}
              prsRemoveValue={userPrs.clearCache}
              title={"User"}
              value={formData.email || "Chưa chọn"}
              setIsOpened={setUserOpened}
              list={usersData?.data}
              isLoading={userIsLoading}
              isError={userIsError}
              errorMsg={userError?.response?.data?.msg}
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
              params={userPrs}
              handleSetCurr={(data) => {
                console.log("🚀 ~ data:", data);
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
            <InfiniteDropDown
              disabled={commentData ? true : false}
              prsRemoveValue={videoPrs.clearCache}
              title={"Video"}
              value={formData.videoId || "Chưa chọn"}
              setIsOpened={setVideoOpened}
              list={videosData?.data}
              isLoading={videoIsLoading}
              isError={videoIsError}
              errorMsg={videoError?.response?.data?.msg}
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
              handleSetCurr={(data) => {
                setFormData((prev) => ({
                  ...prev,
                  videoId: data._id,
                }));
              }}
            />
            <div className='text-[12px] text-red-FF font-[500] leading-[16px] h-[16px] mt-[12px] px-[8px]'>
              <span>
                {error.inputName.includes("videoId")
                  ? error.message[error.inputName.indexOf("videoId")]
                  : ""}
              </span>
            </div>
          </div>

          {/* Comment */}
          <div className='basis-[100%] sm:basis-[48%] 2md:basis-[32%] z-[80]'>
            <InfiniteDropDown
              disabled={commentData ? true : false}
              title={"Reply to"}
              prsRemoveValue={replyPrs.clearCache}
              value={formData.replyId || "Chưa chọn"}
              setIsOpened={setCmtOpened}
              list={replyCmtsData?.data}
              isLoading={replyCmtsIsLoading}
              isError={replyCmtsIsError}
              errorMsg={replyCmtsError?.response?.data?.msg}
              handleSetParams={(value, pageInc) => {
                setReplyPrs((prev) => {
                  let finalobj = {
                    ...prev,
                    page: 1,
                  };

                  if (value !== undefined) {
                    finalobj.id = value;
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
                  replyId: data._id,
                }));
              }}
            />
            <div className='text-[12px] text-red-FF font-[500] leading-[16px] h-[16px] mt-[12px] px-[8px]'>
              <span>
                {error.inputName.includes("videoId")
                  ? error.message[error.inputName.indexOf("videoId")]
                  : ""}
              </span>
            </div>
          </div>

          {/* Like */}
          <div className={`basis-[100%]  2md:basis-[32%] mt-[24px]`}>
            <Input
              maxWidth={"lg:max-w-[360px]"}
              id={"like"}
              type={"number"}
              label={"Like"}
              value={formData.like || 0}
              defaultValue={commentData?.data?.like}
              handleOnChange={handleOnChange}
              error={
                error.inputName.includes("like")
                  ? `${error.message[error.inputName.indexOf("like")]}`
                  : ""
              }
            />
          </div>

          {/* Dislike */}
          <div className={`basis-[100%]  2md:basis-[32%] mt-[24px]`}>
            <Input
              maxWidth={"lg:max-w-[360px]"}
              id={"dislike"}
              type={"number"}
              label={"Dislike"}
              value={formData.dislike || 0}
              defaultValue={commentData?.data?.dislike}
              handleOnChange={handleOnChange}
              error={
                error.inputName.includes("dislike")
                  ? `${error.message[error.inputName.indexOf("dislike")]}`
                  : ""
              }
            />
          </div>

          <div className='basis-[100%]'>
            <label htmlFor='text area'>Comment text</label>
            <textarea
              className='w-full bg-transparent outline-none border-[1px] rounded-[5px] p-[8px] resize-none'
              name=''
              id='text area'
              ref={textAreaRef}
              onChange={handleTextArea}
              rows={3}
            ></textarea>
            <div className='text-[12px] text-red-FF font-[500] leading-[16px] h-[16px] mt-[12px] px-[8px]'>
              <span>
                {error.inputName.includes("cmtText")
                  ? error.message[error.inputName.indexOf("cmtText")]
                  : ""}
              </span>
            </div>
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

export default UpsertComment;
