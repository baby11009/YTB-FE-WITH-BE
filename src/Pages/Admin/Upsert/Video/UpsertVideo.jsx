import {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import { UploadImageIcon, YoutubeBlankIcon } from "../../../../Assets/Icons";
import {
  Input,
  InfiniteDropDown,
  InfiniteDropDownWithCheck,
  HovUserCard,
  TextArea,
} from "../../../../Component";
import { createData, updateData } from "../../../../Api/controller";
import { getData } from "../../../../Api/getData";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../../../Auth Provider/authContext";
import { isObjectEmpty } from "../../../../util/func";

const init = {
  userId: "",
  title: "",
  image: undefined,
  video: undefined,
  type: "video",
  tags: [],
  view: 0,
  like: 0,
  dislike: 0,
  description: "",
};

const initUserQueriese = {
  search: {},
  limit: 10,
  page: 1,
};

const initTagQueriese = {
  search: {},
  page: 1,
  limit: 10,
  priorityList: [],
  clearCache: "tag",
};

const currUserInit = {
  userId: "",
  email: "",
};

const UpsertVideo = ({ type }) => {
  const { id } = useParams();

  const { addToaster } = useAuthContext();

  const queryClient = useQueryClient();

  const [openedUsers, setOpenedUsers] = useState(false);

  const [openedTags, setOpenedTags] = useState(false);

  const [userQueriese, setUserQueriese] = useState(initUserQueriese);

  const [tagQueriese, setTagQueriese] = useState(initTagQueriese);

  const [formData, setFormData] = useState({ ...init, type: type });

  const [previewThumb, setPreviewThumb] = useState("");

  const [previewVideo, setPreviewVideo] = useState("");

  const [currUser, setCurrUser] = useState(currUserInit);

  const [realTimeErrs, setRealTimeErrs] = useState({});

  const [submitErrs, setSubmitErrs] = useState({});

  const thumbInputRef = useRef();

  const videoInputRef = useRef();

  const { data: videoData, refetch } = getData(
    `video/${id}`,
    { type },
    id !== undefined,
    false,
  );

  const {
    data: userData,
    error: userError,
    isLoading,
  } = getData("user", userQueriese, openedUsers, false);

  const {
    data: tagData,
    error: tagErr,
    isLoading: tagIsLoading,
  } = getData("tag", tagQueriese, openedTags, false);

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

  const handleUploadThumb = (e) => {
    setSubmitErrs({});

    const file = e.files[0];

    if (!file) {
      setSubmitErrs((prev) => ({ ...prev, image: "Failed to upload file" }));
      return;
    }

    if (!file.type.startsWith("image/")) {
      setSubmitErrs((prev) => ({ ...prev, image: "Just accepted image file" }));
      e.value = "";
      return;
    }

    const maxSize = 2 * 1024 * 1024; //10MB

    if (file.size > maxSize) {
      setSubmitErrs((prev) => ({
        ...prev,
        image: "File size exceeds 2MB",
      }));
      e.value = "";
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const imageElement = new Image();
      const imageUrl = reader.result?.toString() || "";
      imageElement.src = imageUrl;

      imageElement.addEventListener("load", (e) => {
        const { naturalWidth, naturalHeight } = e.currentTarget;
        // if (
        //   naturalWidth < 640 ||
        //   Number((naturalWidth / naturalHeight).toFixed(2)) !== 16 / 9
        // ) {
        //   setSubmitErrs((prev) => ({
        //     ...prev,
        //     image:
        //       "Image must be at least 640 width and having 16:9 aspect ratio",
        //   }));
        //   return;
        // }

        setFormData((prev) => ({
          ...prev,
          image: file,
        }));
        setPreviewThumb(URL.createObjectURL(file));
      });
    });

    reader.readAsDataURL(file);
  };

  const handleUploadVideo = (e) => {
    setSubmitErrs({});

    const file = e.files[0];

    if (!file) {
      setSubmitErrs((prev) => ({
        ...prev,
        video: "Failed to upload video",
      }));
      return;
    }
    if (!file.type.startsWith("video/")) {
      setSubmitErrs((prev) => ({
        ...prev,
        video: "Just accepted video file",
      }));
      e.value = "";
      return;
    }

    if (previewVideo) {
      URL.revokeObjectURL(previewVideo);
    }

    setFormData((prev) => ({
      ...prev,
      video: file,
    }));

    setPreviewVideo(URL.createObjectURL(file));
  };

  const handleValidate = () => {
    setSubmitErrs({});

    const { type, view, like, dislike, description, ...neededValidateFields } =
      formData;

    const errors = Object.entries(neededValidateFields).reduce(
      (acc, [key, value]) => {
        if (!value) {
          acc[key] =
            key === "image" || key === "video"
              ? "File not uploaded"
              : "Cannot be empty";
        }
        return acc;
      },
      {},
    );

    if (!isObjectEmpty(errors)) {
      setSubmitErrs(errors);
      return false;
    }

    return true;
  };

  const handleValidateUpdate = () => {
    setSubmitErrs({});

    const {
      type,
      image,
      video,
      description,
      like,
      dislike,
      view,
      ...neededValidateFields
    } = formData;

    const errors = Object.entries(neededValidateFields).reduce(
      (acc, [key, value]) => {
        if (!value) {
          acc[key] = "Cannot be empty";
        }
        return acc;
      },
      {},
    );

    if (!isObjectEmpty(errors)) {
      setSubmitErrs(errors);
      return false;
    }

    return true;
  };

  const create = async () => {
    const isValidate = handleValidate();

    if (!isValidate) {
      return;
    }

    const data = new FormData();

    for (const key in formData) {
      data.append(key, formData[key]);
    }

    await createData(
      "video/upload",
      data,
      "video",
      () => {
        setFormData(init);
        setPreviewVideo(undefined);
        setPreviewThumb(undefined);
        setCurrUser(currUserInit);
      },
      undefined,
      addToaster,
    );
  };

  const update = async () => {
    const isValidate = handleValidateUpdate();

    if (!isValidate) {
      return;
    }

    const { userId, video, image, ...finalData } = formData;

    for (const key in finalData) {
      if (videoData?.data?.hasOwnProperty(key)) {
        if (
          (typeof finalData[key] === "string" &&
            videoData.data[key] === finalData[key]) ||
          JSON.stringify(finalData[key]) === JSON.stringify(videoData.data[key])
        ) {
          delete finalData[key];
        }
      }
    }

    if (formData.image) {
      finalData.image = formData.image;
    }

    if (isObjectEmpty(finalData)) {
      alert("Nothing changed");
      return;
    }

    const data = new FormData();

    for (const key in finalData) {
      if (key === "tags") {
        // Chuyển mảng thành json để dữ nguyên giá trị trong FormData
        data.append(key, JSON.stringify(finalData[key]));
      } else {
        data.append(key, finalData[key]);
      }
    }

    await updateData(
      "video",
      id,
      data,
      "video",
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
    if (videoData) {
      const dataForm = {
        userId: videoData.data.user_info._id,
        title: videoData.data.title,
        image: undefined,
        video: undefined,
        type: videoData.data.type,
        view: videoData.data.view,
        like: videoData.data.like,
        dislike: videoData.data.dislike,
        description: videoData.data.description,
      };

      if (videoData.data.tags_info) {
        dataForm.tags = videoData.data.tags;
        setTagQueriese((prev) => ({
          ...prev,
          priorityList: videoData.data.tags,
        }));
      }

      setFormData(dataForm);

      setCurrUser({
        userId: videoData.data.user_info?._id,
        email: videoData.data.user_info?.email,
      });

      setPreviewThumb(
        `${import.meta.env.VITE_BASE_API_URI}${
          import.meta.env.VITE_VIEW_THUMB_API
        }${videoData.data.thumb}`,
      );

      setPreviewVideo(
        `${import.meta.env.VITE_BASE_API_URI}${
          import.meta.env.VITE_VIEW_VIDEO_API
        }${videoData.data.video}?type=video`,
      );
    }

    return () => {
      setPreviewVideo(undefined);
      setPreviewThumb(undefined);
      setCurrUser(currUserInit);
    };
  }, [videoData]);

  useEffect(() => {
    if (!openedUsers) {
      queryClient.removeQueries({
        queryKey: Object.values(userQueriese),
      });
    }
  }, [openedUsers, userQueriese]);

  useEffect(() => {
    if (!openedTags) {
      queryClient.removeQueries({
        queryKey: Object.values(tagQueriese),
      });
    }
  }, [openedTags, tagQueriese]);

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
    if (currUser.userId) {
      setFormData((prev) => ({
        ...prev,
        userId: currUser.userId,
      }));
    }
  }, [currUser]);

  useEffect(() => {
    return () => {
      queryClient.clear();
    };
  }, []);

  return (
    <div className='max-w-[1500px] overflow-auto scrollbar-3'>
      <header className='pt-[16px]'>
        <h2 className='text-[28px] leading-[44px] font-[500]'>Videos</h2>
      </header>

      <form
        noValidate
        onSubmit={handleSubmit}
        className='mb-[100px] min-w-[400px] '
      >
        <div className='flex items-center justify-center flex-wrap gap-x-[16px]'>
          {/* thumbnail */}
          <div className='basis-[100%] 2md:basis-[calc(50%-8px)]'>
            <label
              htmlFor='thumbnail'
              className={`block aspect-video max-h-[405px] size-full relative cursor-pointer 
                    rounded-[10px] overflow-hidden  border-[1px] transition-[border] ease-in ${
                      previewThumb ? "" : "border-[#6b6767] hover:border-white"
                    }`}
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={(e) => {
                e.preventDefault();
                thumbInputRef.current.files = e.dataTransfer.files;
                handleUploadThumb(thumbInputRef.current);
              }}
            >
              <div className='flex items-center justify-center size-full '>
                {previewThumb ? (
                  <div
                    className='size-full bg-contain bg-center bg-no-repeat rounded-[10px]'
                    style={{
                      backgroundImage: `url("${previewThumb}")`,
                    }}
                  ></div>
                ) : (
                  <div className='w-full flex flex-col items-center justify-center font-[500] text-center'>
                    <div className='w-[54px] sm:w-[64px]'>
                      <UploadImageIcon />
                    </div>
                    <h2 className='mt-[12px] text-[12px] xsm:text-[16px]'>
                      Click to upload video's thumbnai or drag and drop
                    </h2>
                    <p className='text-gray-A text-[10px] xsm:text-[12px] leading-[18px]'>
                      Just support : JPG, PNG,.. (Maximum 2MB)
                    </p>
                  </div>
                )}
              </div>
              <input
                type='file'
                name='thumbnail'
                id='thumbnail'
                accept='image/*'
                ref={thumbInputRef}
                onChange={(e) => handleUploadThumb(e.target)}
                className='hidden'
              />
            </label>

            <div
              className='text-[12px] text-red-FF font-[500] leading-[16px] h-[16px] m-[8px]
                line-clamp-1 text-ellipsis break-all'
            >
              <span>{submitErrs["image"] ? submitErrs["image"] : ""}</span>
            </div>
          </div>

          {/* Video */}
          <div className='basis-[100%] 2md:basis-[calc(50%-8px)]'>
            <label
              htmlFor='video'
              className={`block w-full aspect-video max-h-[405px]  relative cursor-pointer 
                    rounded-[10px] overflow-hidden border-[1px] transition-[border] ease-in ${
                      previewVideo ? "" : "border-[#6b6767] hover:border-white"
                    }`}
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={(e) => {
                if (id) {
                  return;
                }
                e.preventDefault();
                videoInputRef.current.files = e.dataTransfer.files;
                handleUploadVideo(videoInputRef.current);
              }}
            >
              <div className='flex items-center justify-center size-full '>
                {previewVideo ? (
                  <video
                    onDoubleClick={() => {
                      videoInputRef.current.click();
                    }}
                    className='size-full object-contain '
                    controls
                    controlsList='nofullscreen'
                    src={previewVideo}
                  ></video>
                ) : (
                  <div className='w-full flex flex-col items-center justify-center font-[500] text-center'>
                    <div className='w-[56px] sm:w-[64px]'>
                      <YoutubeBlankIcon />
                    </div>
                    <h2 className='mt-[12px] text-[12px] xsm:text-[16px]'>
                      Click to upload video or drag and drop
                    </h2>
                    <p className='text-gray-A text-[10px] xsm:text-[12px] leading-[18px]'>
                      Just support : MP4, WEBM,...
                    </p>
                  </div>
                )}
              </div>
              <input
                type='file'
                name='video'
                id='video'
                readOnly={id ? false : true}
                accept='video/*'
                ref={videoInputRef}
                disabled={id ? true : false}
                onChange={(e) => handleUploadVideo(e.target)}
                className='hidden'
              />
            </label>

            <div
              className='text-[12px] text-red-FF font-[500] leading-[16px] h-[16px] m-[8px]
            line-clamp-1 text-ellipsis break-all'
            >
              <span>{submitErrs["video"] ? submitErrs["video"] : ""}</span>
            </div>
          </div>
        </div>

        <div className='flex flex-wrap gap-x-[16px]'>
          <div className=' basis-[100%]  2md:basis-[calc(50%-8px)] overflow-hidden'>
            <TextArea
              title={"Title"}
              name={"title"}
              preventCharactersList={new Set(["Enter"])}
              value={formData.title}
              defaultValue={videoData?.data.title}
              handleOnChange={handleOnChange}
              maxLength={155}
              handleSetRealTimeErr={handleSetRealTimeErr}
              handleRemoveRealTimeErr={handleRemoveRealTimeErr}
              errMsg={submitErrs["title"] ? submitErrs["title"] : ""}
              placeholder={"Enter video title"}
            />
          </div>
          <div className='basis-[100%]  2md:basis-[calc(50%-8px)] overflow-hidden'>
            <TextArea
              title={"Description"}
              name={"description"}
              value={formData.description}
              defaultValue={videoData?.data.description}
              handleOnChange={handleOnChange}
              handleSetRealTimeErr={handleSetRealTimeErr}
              handleRemoveRealTimeErr={handleRemoveRealTimeErr}
              errMsg={
                submitErrs["description"] ? submitErrs["description"] : ""
              }
              placeholder={"Enter video description"}
            />
          </div>
        </div>

        <div className='grid gap-x-[16px] grid-cols-1 md:grid-cols-2 xl:grid-cols-3'>
          {/* User */}
          <div className='z-[100]'>
            <InfiniteDropDown
              disabled={videoData ? true : false}
              title={"User"}
              dataType={"user"}
              value={currUser.email || "Not picked yet"}
              setIsOpened={setOpenedUsers}
              list={userData?.data}
              isLoading={isLoading}
              displayData={"email"}
              fetchingError={userError?.response?.data?.msg}
              validateError={submitErrs["userId"]}
              handleSetQueriese={(value, pageInc) => {
                setUserQueriese((prev) => {
                  const prevClone = { ...prev };
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
                setCurrUser({
                  userId: data?._id,
                  email: data?.email,
                });
              }}
              HoverCard={HovUserCard}
            />
          </div>

          {/* Tag */}
          <div className='mb-[32px]'>
            <InfiniteDropDownWithCheck
              title={"Tag"}
              valueList={formData.tags}
              setIsOpened={setOpenedTags}
              list={tagData?.data}
              displayValue={"title"}
              isLoading={tagIsLoading}
              fetchingError={tagErr?.response?.data?.msg}
              setData={(value) => {
                setFormData((prev) => ({ ...prev, tags: value }));
              }}
              handleSetQueriese={(value, pageInc) => {
                setTagQueriese((prev) => {
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

          {/* View */}
          <div className=''>
            <Input
              id={"view"}
              type={"number"}
              label={"View"}
              value={formData.view || 0}
              defaultValue={videoData?.data?.view}
              handleOnChange={handleOnChange}
            />
          </div>
          {/* Like */}
          <div className=''>
            <Input
              id={"like"}
              type={"number"}
              label={"Like"}
              value={formData.like || 0}
              defaultValue={videoData?.data?.like}
              handleOnChange={handleOnChange}
            />
          </div>

          {/* Dislike */}
          <div className=''>
            <Input
              id={"dislike"}
              type={"number"}
              label={"Dislike"}
              value={formData.dislike || 0}
              defaultValue={videoData?.data?.dislike}
              handleOnChange={handleOnChange}
            />
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
export default UpsertVideo;
