import {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import {
  UploadImageIcon,
  YoutubeBlankIcon,
  LongArrowIcon,
} from "../../../../Assets/Icons";
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
import { isEmpty } from "../../../../util/validateFunc";
import { upperCaseFirstChar } from "../../../../util/func";
import { useNavigate } from "react-router-dom";

const init = {
  userId: "",
  email: "",
  title: "",
  thumbnail: undefined,
  video: undefined,
  type: "video",
  tags: [],
  view: 0,
  like: 0,
  dislike: 0,
  description: "",
};

const initUserQueries = {
  search: {},
  limit: 10,
  page: 1,
};

const initTagQueries = {
  search: {},
  page: 1,
  limit: 10,
  priorityList: [],
};

const UpsertVideo = ({ type }) => {
  const { id } = useParams();

  const navigate = useNavigate();

  const { addToaster } = useAuthContext();

  const queryClient = useQueryClient();

  const [openedUsers, setOpenedUsers] = useState(false);

  const [openedTags, setOpenedTags] = useState(false);

  const [userQueries, setUserQueries] = useState(initUserQueries);

  const [tagQueries, setTagQueries] = useState(initTagQueries);

  const [formData, setFormData] = useState({ ...init, type: type });

  const [previewThumb, setPreviewThumb] = useState("");

  const [previewVideo, setPreviewVideo] = useState("");

  const [realTimeErrs, setRealTimeErrs] = useState({});

  const [submitErrs, setSubmitErrs] = useState({});

  const thumbInputRef = useRef();

  const videoInputRef = useRef();

  const { data: videoData, refetch } = getData(
    `/admin/video/${id}`,
    { type },
    id !== undefined,
    false,
  );

  const {
    data: userData,
    error: userError,
    isLoading,
  } = getData("/admin/user", userQueries, openedUsers, false);

  const {
    data: tagData,
    error: tagErr,
    isLoading: tagIsLoading,
  } = getData("/admin/tag", tagQueries, openedTags, false);

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
      setSubmitErrs((prev) => ({
        ...prev,
        thumbnail: "Failed to upload file",
      }));
      return;
    }

    if (!file.type.startsWith("image/")) {
      setSubmitErrs((prev) => ({
        ...prev,
        thumbnail: "Just accepted image file",
      }));
      e.value = "";
      return;
    }

    const maxSize = 2 * 1024 * 1024; //10MB

    if (file.size > maxSize) {
      setSubmitErrs((prev) => ({
        ...prev,
        thumbnail: "File size exceeds 2MB",
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
        let minWidth = 640;
        let aspect = Number((16 / 9).toFixed(2));
        if (type === "short") {
          minWidth = 404;
          aspect = Number((9 / 16).toFixed(2));
        }

        if (
          naturalWidth < minWidth ||
          Number((naturalWidth / naturalHeight).toFixed(2)) !== aspect
        ) {
          setSubmitErrs((prev) => ({
            ...prev,
            thumbnail: `Thumbnail must be at least ${minWidth} width and having ${
              type === "video" ? "16:9" : "9:16"
            } aspect ratio`,
          }));
          return;
        }

        setFormData((prev) => ({
          ...prev,
          thumbnail: file,
        }));
        setPreviewThumb(URL.createObjectURL(file));
      });
    });

    reader.readAsDataURL(file);
  };

  const handleUploadVideo = async (e) => {
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

    let videoUrl = URL.createObjectURL(file);

    if (type === "short") {
      await new Promise((resolve, reject) => {
        const video = document.createElement("video");
        video.preload = "metadata";

        video.onloadedmetadata = () => {
          if (video.duration > 60) {
            reject("Short file can't be longer than 60 seconds");
          } else if (video.duration < 15) {
            reject("Short file can't be shorter than 15 seconds");
          }
          resolve();
        };

        video.onerror = () => {
          reject("Failed to upload video");
        };

        video.src = videoUrl;
      }).catch((err) => {
        setSubmitErrs((prev) => ({
          ...prev,
          video: err,
        }));
        URL.revokeObjectURL(videoUrl);
        videoUrl = undefined;
      });
    }

    if (previewVideo) {
      URL.revokeObjectURL(previewVideo);
    }

    if (videoUrl) {
      setFormData((prev) => ({
        ...prev,
        video: file,
      }));

      setPreviewVideo(videoUrl);
    }
  };

  const handleValidate = () => {
    const {
      type,
      view,
      like,
      dislike,
      description,
      tags,
      email,
      ...neededValidateFields
    } = formData;

    const fieldEntries = Object.entries(neededValidateFields);

    const validateFormValueFuncs = {
      userId: (userId) => {
        return isEmpty("userId", userId, "User not picked yet");
      },
      title: (title) => {
        return isEmpty("title", title, "Video title cannot be empty");
      },
      thumbnail: (thumbnail) => {
        return isEmpty("thumbnail", thumbnail, "Thumbnail not uploaded");
      },
      video: (video) => {
        return isEmpty("video", video, "Video not uploaded");
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
      type,
      thumbnail,
      video,
      description,
      like,
      dislike,
      view,
      userId,
      tags,
      email,
      ...neededValidateFields
    } = formData;

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
    const isValidate = handleValidate();

    if (!isValidate) {
      return;
    }

    const data = new FormData();

    for (const key in formData) {
      data.append(key, formData[key]);
    }

    await createData(
      "/admin/video/upload",
      data,
      "video",
      () => {
        setFormData(init);
        setPreviewVideo(undefined);
        setPreviewThumb(undefined);
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

    const { userId, video, thumbnail, ...finalData } = formData;

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

    if (formData.thumbnail) {
      finalData.thumbnail = formData.thumbnail;
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
      "/admin/video",
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
        thumbnail: undefined,
        video: undefined,
        type: videoData.data.type,
        view: videoData.data.view,
        like: videoData.data.like,
        dislike: videoData.data.dislike,
        description: videoData.data.description,
      };

      if (videoData.data.tags_info) {
        dataForm.tags = videoData.data.tags;
        setTagQueries((prev) => ({
          ...prev,
          priorityList: videoData.data.tags,
        }));
      }

      setFormData(dataForm);

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
    };
  }, [videoData]);

  useEffect(() => {
    if (!openedUsers) {
      queryClient.removeQueries("/admin/user");
    }
  }, [openedUsers]);

  useEffect(() => {
    if (!openedTags) {
      queryClient.removeQueries("/admin/tag");
    }
  }, [openedTags]);

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
    return () => {
      queryClient.clear();
    };
  }, []);

  return (
    <div className='max-w-[1500px] mx-auto md:px-[16px]'>
      <div className=' sticky top-[56px]  py-[8px] bg-black z-[10] flex items-center'>
        <h1 className='text-[28px] leading-[44px] font-[500] flex-1'>
          {upperCaseFirstChar(type)}s
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
              <span>
                {submitErrs["thumbnail"] ? submitErrs["thumbnail"] : ""}
              </span>
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

          <InfiniteDropDown
            disabled={id ? true : false}
            title={"User"}
            dataType={"user"}
            value={formData.email || "Not picked yet"}
            setIsOpened={setOpenedUsers}
            data={userData}
            displayData={"email"}
            isLoading={isLoading}
            fetchingError={userError?.response?.data?.msg}
            validateError={submitErrs["userId"]}
            handleSetQueries={(value, pageInc) => {
              setUserQueries((prev) => {
                const prevClone = { ...prev };
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

          {/* Tag */}
          <div className='mb-[32px]'>
            <InfiniteDropDownWithCheck
              title={"Tag"}
              valueList={formData.tags}
              setIsOpened={setOpenedTags}
              data={tagData}
              displayValue={"title"}
              isLoading={tagIsLoading}
              fetchingError={tagErr?.response?.data?.msg}
              setData={(value) => {
                setFormData((prev) => ({ ...prev, tags: value }));
              }}
              handleSetQueries={(value, pageInc) => {
                setTagQueries((prev) => {
                  const prevClone = {
                    ...prev,
                  };

                  if (value === "" || value) {
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

          <Input
            id={"view"}
            type={"number"}
            label={"View"}
            value={formData.view || 0}
            defaultValue={videoData?.data?.view}
            handleOnChange={handleOnChange}
          />

          {/* Like */}

          <Input
            id={"like"}
            type={"number"}
            label={"Like"}
            value={formData.like || 0}
            defaultValue={videoData?.data?.like}
            handleOnChange={handleOnChange}
          />

          {/* Dislike */}

          <Input
            id={"dislike"}
            type={"number"}
            label={"Dislike"}
            value={formData.dislike || 0}
            defaultValue={videoData?.data?.dislike}
            handleOnChange={handleOnChange}
          />
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
