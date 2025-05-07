import { useAuthContext } from "../../../../../../Auth Provider/authContext";
import {
  CloseIcon,
  UploadImageIcon,
  YoutubeBlankIcon,
} from "../../../../../../Assets/Icons";
import {
  TextArea,
  InfiniteDropDownWithCheck,
} from "../../../../../../Component";
import {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import { getData } from "../../../../../../Api/getData";
import { createData, updateData } from "../../../../../../Api/controller";
import { useQueryClient } from "@tanstack/react-query";
import Hls from "hls.js";
import { isEmpty } from "../../../../../../util/validateFunc";
import { isObjectEmpty } from "../../../../../../util/func";

const init = {
  title: "",
  thumbnail: undefined,
  video: undefined,
  type: "video",
  tags: new Set(),
  description: "",
};

const initTagQueries = {
  search: {},
  priorityList: [],
  page: 1,
  limit: 10,
  clearCache: "tag",
};

const VideoUpsertModal = ({ title, id }) => {
  console.log("🚀 ~  id:", id);
  const queryClient = useQueryClient();

  const { setIsShowing, addToaster } = useAuthContext();

  const videoRef = useRef();

  const hlsRef = useRef();

  const thumbInputRef = useRef();

  const videoInputRef = useRef();

  const defaultTagRef = useRef([]);

  const [openedTags, setOpenedTags] = useState(false);

  const [tagQueries, setTagQueries] = useState(initTagQueries);

  const [formData, setFormData] = useState(init);

  const [submitLoading, setSubmitLoading] = useState(false);

  const [previewThumb, setPreviewThumb] = useState("");

  const [previewVideo, setPreviewVideo] = useState("");

  const [realTimeErrs, setRealTimeErrs] = useState({});

  const [submitErrs, setSubmitErrs] = useState({});

  const { data: videoData, refetch } = getData(
    `/user/video/${id}`,
    {},
    id !== undefined,
    false,
  );

  const {
    data: tagData,
    error: tagErr,
    isLoading: tagIsLoading,
  } = getData("/data/tags", tagQueries, openedTags, false);

  const handleOnChange = useCallback((name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

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

    const maxSize = 2 * 1024 * 1024; //2MB

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
        if (Object.keys(submitErrs).lenght > 1) setSubmitErrs({});
        const { naturalWidth, naturalHeight } = e.currentTarget;
        if (
          naturalWidth < 720 ||
          Number((naturalWidth / naturalHeight).toFixed(2)) !== 1.78
        ) {
          setSubmitErrs((prev) => ({
            ...prev,
            thumbnail:
              "Image must be at least 720 width and having 16:9 aspect ratio",
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

    setFormData((prev) => ({
      ...prev,
      video: file,
    }));
    setPreviewVideo(URL.createObjectURL(file));
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
    const { type, description, tags, ...neededValidateFields } = formData;

    const fieldEntries = Object.entries(neededValidateFields);

    const validateFormValueFuncs = {
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
      tags,
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
    const isValidate = handleValidate(formData);

    if (!isValidate) return;

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    await createData(
      "/user/video/upload",
      data,
      "video",
      () => {
        setFormData(init);
        setPreviewVideo(undefined);
        setPreviewThumb(undefined);
        thumbInputRef.current.value = "";
      },
      undefined,
      addToaster,
    );
  };

  const update = async () => {
    const isValidate = handleValidateUpdate(formData);

    if (!isValidate) return;

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
      "/user/video",
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

    setSubmitLoading(true);

    if (id) {
      await update();
    } else {
      await create();
    }

    setSubmitLoading(false);
  };

  useLayoutEffect(() => {
    if (videoData) {
      const dataForm = {
        title: videoData?.data?.title,
        thumbnail: undefined,
        video: undefined,
        type: videoData?.data?.type,
        description: videoData?.data?.description,
      };

      if (videoData?.data?.tags_info) {
        const tagIdList = videoData?.data?.tags_info.map((tag) => tag._id);
        dataForm.tags = tagIdList;
        defaultTagRef.current = tagIdList;

        if (videoData.data.tags_info) {
          dataForm.tags = videoData.data.tags;
          setTagQueries((prev) => ({
            ...prev,
            priorityList: videoData.data.tags,
          }));
        }
      }

      setFormData(dataForm);

      setPreviewThumb(
        `${import.meta.env.VITE_BASE_API_URI}${
          import.meta.env.VITE_VIEW_THUMB_API
        }${videoData?.data?.thumb}`,
      );

      setPreviewVideo(() => {
        if (Hls.isMSESupported() && videoData?.data?.stream) {
          return `stream:${
            import.meta.env.VITE_BASE_API_URI
          }/file/videomaster/${videoData?.data?.stream}`;
        }

        return `${import.meta.env.VITE_BASE_API_URI}${
          import.meta.env.VITE_VIEW_VIDEO_API
        }${videoData?.data?.video}?type=video`;
      });
    }

    return () => {
      setFormData(init);
    };
  }, [videoData]);

  useLayoutEffect(() => {
    if (previewVideo) {
      if (id && previewVideo.startsWith("stream:")) {
        const streamUrl = previewVideo.split("stream:")[1];

        const hls = new Hls();
        hlsRef.current = hls;
        hls.loadSource(streamUrl);

        hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
          console.log("video resolution levels", data.levels.length);
        });

        hls.attachMedia(videoRef.current);
      } else {
        videoRef.current.src = previewVideo;
      }
    }
  }, [previewVideo]);

  useEffect(() => {
    if (!openedTags) {
      queryClient.removeQueries({
        queryKey: Object.values(tagQueries),
      });
    }
  }, [openedTags, tagQueries]);

  useEffect(() => {
    let timeOut;
    if (Object.keys(submitErrs).length > 0) {
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
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className='w-[min(1700px,100vw)] sm:p-[12px] lg:p-[24px] h-screen'>
      <div className='rounded-[12px] bg-black size-full shadow-[0_0_8px_#f1f1f1] pr-[4px] overflow-hidden'>
        <div className=' size-full overflow-auto scrollbar-3 relative'>
          <div className='sticky top-0 px-[16px] h-[68px] xl:h-[72px] flex items-center justify-between bg-black z-[2]'>
            <h2 className='text-nowrap text-[25px] leading-[32px] font-[600]'>
              {title}
            </h2>
            <button
              className='size-[32px] rounded-[50%] flex items-center justify-center hover:bg-black-0.1 active:bg-black-0.2'
              onClick={() => {
                setIsShowing(undefined);
              }}
            >
              <div className='w-[16px]'>
                <CloseIcon />
              </div>
            </button>
          </div>
          <form
            noValidate
            onSubmit={handleSubmit}
            className='my-[20px] p-[0_8px_8px] sm:p-[0_16px_16px]'
          >
            <div className='flex items-center justify-center flex-wrap gap-x-[16px]'>
              {/* thumbnail */}
              <div className='basis-[100%] 2md:basis-[calc(50%-8px)]'>
                <label
                  htmlFor='thumbnail'
                  className={`inline-block  aspect-video max-h-[405px]  size-full relative cursor-pointer 
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
                  className='text-[12px] text-red-FF font-[500] leading-[16px] h-[16px] px-[8px] 
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
                  className={`inline-block w-full aspect-video max-h-[405px]  relative cursor-pointer 
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
                        ref={videoRef}
                        className='size-full object-contain '
                        controls
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

                <div className='text-[12px] text-red-FF font-[500] leading-[16px] h-[16px] px-[8px] line-clamp-1 text-ellipsis break-all'>
                  <span>{submitErrs["video"] ? submitErrs["video"] : ""}</span>
                </div>
              </div>
            </div>

            <div className='flex flex-wrap mt-[8px] gap-x-[16px]'>
              <div className=' basis-[100%]  2md:basis-[calc(50%-8px)]  overflow-hidden'>
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
              <div className='basis-[100%]  2md:basis-[calc(50%-8px)]  overflow-hidden'>
                <TextArea
                  title={"Description"}
                  name={"description"}
                  value={formData.description}
                  defaultValue={videoData?.data.description}
                  handleOnChange={handleOnChange}
                  handleSetRealTimeErr={handleSetRealTimeErr}
                  handleRemoveRealTimeErr={handleRemoveRealTimeErr}
                  errMsg={submitErrs["description"] ? description : ""}
                  placeholder={"Enter video description"}
                />
              </div>
              <div className='basis-[100%] sm:basis-[48%] 2md:basis-[32%]'>
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
                  handleSetQueries={(value, pageInc) => {
                    setTagQueries((prev) => {
                      const prevClone = {
                        ...prev,
                      };

                      if (value) {
                        prevClone.search["title"] = value;
                        prevClone.page = 1;
                      } else if (!value && !pageInc) {
                        prevClone.search = {};
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
            </div>

            <div className='basis-[100%]  flex items-center justify-center mt-[180px]'>
              <button
                type='submit'
                className='w-full max-w-[160px] btn1'
                disabled={Object.keys(realTimeErrs).length > 0 ? true : false}
              >
                {submitLoading ? (
                  <div
                    className='size-[30px] rounded-[50%] border-[3px] border-l-transparent 
              border-b-transparent animate-spin mx-auto'
                  ></div>
                ) : (
                  <span className='z-[50] relative'>Submit</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default VideoUpsertModal;
