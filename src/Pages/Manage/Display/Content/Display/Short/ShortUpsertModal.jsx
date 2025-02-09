import { useAuthContext } from "../../../../../../Auth Provider/authContext";
import {
  CloseIcon,
  UploadImageIcon,
  YoutubeBlankIcon,
} from "../../../../../../Assets/Icons";
import {
  InfiniteDropDownWithCheck,
  TextArea,
} from "../../../../../../Component";
import {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import { getDataWithAuth } from "../../../../../../Api/getData";
import { createData, updateData } from "../../../../../../Api/controller";
import { useQueryClient } from "@tanstack/react-query";
import Hls from "hls.js";
const init = {
  title: "",
  image: undefined,
  video: undefined,
  type: "short",
  tag: [],
  description: "",
};
const initTagParams = {
  title: "",
  page: 1,
  limit: 10,
  clearCache: "tag",
};

const ShortUpsertModal = ({ title, id }) => {
  const queryClient = useQueryClient();

  const { setIsShowing, addToaster } = useAuthContext();

  const thumbInputRef = useRef();

  const videoInputRef = useRef();

  const videoRef = useRef();

  const hlsRef = useRef();

  const defaultTagRef = useRef([]);

  const [tagParams, setTagParams] = useState(initTagParams);

  const [formData, setFormData] = useState(init);

  const [submitLoading, setSubmitLoading] = useState(false);

  const [previewThumb, setPreviewThumb] = useState("");

  const [previewVideo, setPreviewVideo] = useState("");

  const [openedTags, setOpenedTags] = useState(false);

  const [realTimeErrs, setRealTimeErrs] = useState({});

  const [submitErrs, setSubmitErrs] = useState({
    inputName: [],
    message: [],
  });

  const {
    data: shortData,
    refetch,
    error: queryError,
    isLoading: videoLoading,
    isError: videoisError,
  } = getDataWithAuth(`/client/video/${id}`, {}, id !== undefined, false);

  const {
    data: tagList,
    error: tagErr,
    isLoading: tagIsLoading,
    isError: tagIsErr,
  } = getDataWithAuth("tag", tagParams, openedTags, false);

  const handleOnChange = useCallback((name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleUploadThumb = useCallback((e) => {
    setSubmitErrs({});

    const file = e.files[0];

    if (!file) {
      setSubmitErrs((prev) => ({ ...prev, image: "Không thể tải file" }));
      return;
    }
    if (!file.type.startsWith("image/")) {
      setSubmitErrs((prev) => ({
        ...prev,
        image: "Only image files can be uploaded",
      }));
      e.value = "";
      return;
    }
    const maxMb = 10;
    const maxSize = maxMb * 1024 * 1024; //10MB

    if (file.size > maxSize) {
      setSubmitErrs((prev) => ({
        ...prev,
        image: `Files size must less than ${maxMb}MB`,
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

        if (
          naturalWidth < 404 ||
          Number((naturalWidth / naturalHeight).toFixed(4)) !== 9 / 16
        ) {
          setSubmitErrs((prev) => ({
            ...prev,
            image: `Image must be at least 404 width and having 9:16 aspect ratio`,
          }));
          return;
        }

        setFormData((prev) => ({
          ...prev,
          image: file,
        }));
        setPreviewThumb(URL.createObjectURL(file));
      });
    });
    reader.readAsDataURL(file);
  }, []);

  const handleUploadVideo = useCallback((e) => {
    setSubmitErrs({});

    const file = e.files[0];

    if (!file) {
      setSubmitErrs((prev) => ({ ...prev, video: "Failed to upload video" }));
      return;
    }
    if (!file.type.startsWith("video/")) {
      setSubmitErrs((prev) => ({ ...prev, video: "Just accepted video file" }));
      e.value = "";
      return;
    }

    setFormData((prev) => ({
      ...prev,
      video: file,
    }));
    setPreviewVideo(URL.createObjectURL(file));
  }, []);

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

  const handleValidate = useCallback(
    (formData) => {
      if (Object.keys(submitErrs).length > 0) {
        setSubmitErrs({});
      }
      let hasErrors = false;

      const keys = Object.keys(formData).filter(
        (key) => key !== "type" && key !== "description",
      );

      keys.forEach((key) => {
        if (formData[key] === "" || !formData[key]) {
          let errMsg = "Cannot be empty";
          if (key === "image" || key === "video") {
            errMsg = "File not uploaded";
          }
          setSubmitErrs((prev) => ({ ...prev, [key]: errMsg }));
          hasErrors = true;
        }
      });

      if (hasErrors) {
        return true;
      }
    },
    [submitErrs],
  );

  const handleValidateUpdate = useCallback(
    (formData) => {
      if (Object.keys(submitErrs).length > 0) {
        setSubmitErrs({});
      }
      let hasErrors = false;
      const keys = Object.keys(formData).filter(
        (key) =>
          key !== "type" &&
          key !== "image" &&
          key !== "video" &&
          key !== "description",
      );
      keys.forEach((key) => {
        if (formData[key] === "" || !formData[key]) {
          let errMsg = "Cannot be empty";
          setSubmitErrs((prev) => ({ ...prev, [key]: errMsg }));
          hasErrors = true;
        }
      });
      if (hasErrors) {
        return true;
      }
    },
    [submitErrs],
  );

  const create = useCallback(
    async (formData) => {
      const error = handleValidate(formData);

      if (error) {
        return;
      }

      let data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }

      await createData(
        "/client/video/upload",
        data,
        "short",
        () => {
          setFormData(init);
          setPreviewVideo(undefined);
          setPreviewThumb(undefined);
          thumbInputRef.current.files = undefined;
        },
        undefined,
        addToaster,
      );
    },
    [submitErrs],
  );

  const update = useCallback(
    async (formData, shortData) => {
      const error = handleValidateUpdate(formData);

      if (error) {
        return;
      }

      let finalData = {
        title: formData.title,
        type: formData.type,
        description: formData.description,
      };

      for (const key in finalData) {
        if (
          shortData?.data?.hasOwnProperty(key) &&
          shortData?.data[key] === finalData[key]
        ) {
          delete finalData[key];
        }
      }

      if (formData.tag.length === defaultTagRef.current.length) {
        let test = formData.tag.filter((id) =>
          defaultTagRef.current.includes(id),
        );
        if (test.length !== defaultTagRef.current.length) {
          finalData.tag = formData.tag;
        }
      } else {
        finalData.tag = formData.tag;
      }
      if (formData.image) {
        finalData.image = formData.image;
      }

      if (Object.keys(finalData).length === 0) {
        alert("Nothing changed");
        return;
      }

      let data = new FormData();
      for (const key in finalData) {
        if (key === "tag") {
          // Convert to JSON to keep data type not changed to tring
          data.append(key, JSON.stringify(finalData[key]));
        } else {
          data.append(key, finalData[key]);
        }
      }

      await updateData(
        "/client/video",
        id,
        data,
        "short",
        () => {
          refetch();
        },
        undefined,
        addToaster,
      );
    },
    [submitErrs],
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setSubmitLoading(true);

      if (id) {
        await update(formData, shortData);
      } else {
        await create(formData);
      }

      setSubmitLoading(false);
    },
    [error, formData, shortData],
  );

  useLayoutEffect(() => {
    if (shortData) {
      const dataForm = {
        title: shortData?.data?.title,
        image: undefined,
        video: undefined,
        type: shortData?.data?.type,
        description: shortData?.data?.description,
      };
      if (shortData?.data?.tag_info) {
        const tagIdList = shortData?.data?.tag_info.map((tag) => tag._id);
        dataForm.tag = tagIdList;
        defaultTagRef.current = tagIdList;
      }
      setFormData(dataForm);
      setPreviewThumb(
        `${import.meta.env.VITE_BASE_API_URI}${
          import.meta.env.VITE_VIEW_THUMB_API
        }${shortData?.data?.thumb}`,
      );
      setPreviewVideo(() => {
        if (Hls.isMSESupported() && shortData?.data?.stream) {
          return `stream:${
            import.meta.env.VITE_BASE_API_URI
          }/file/videomaster/${shortData?.data?.stream}`;
        }

        return `${import.meta.env.VITE_BASE_API_URI}${
          import.meta.env.VITE_VIEW_VIDEO_API
        }${shortData?.data?.video}?type=video`;
      });
    }

    return () => {
      setFormData(init);
    };
  }, [shortData]);

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
      queryClient.removeQueries("tag");
    }
  }, [openedTags]);

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
            <div className='flex lg:gap-[16px] flex-wrap'>
              <div className='flex items-center flex-wrap'>
                {/* thumbnail */}
                <div className='h-[85vh] sm:h-[80vh] xl:h-[85vh] max-h-[720px] aspect-[9/16] mb-[32px] sm:mr-[16px]  '>
                  <label
                    htmlFor='thumbnail'
                    className={`inline-block size-full relative cursor-pointer
                       rounded-[10px] overflow-hidden border-[1px] transition-[border] ease-in ${
                         previewThumb
                           ? ""
                           : "border-[#6b6767] hover:border-white"
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
                    <div className='flex items-center justify-center size-full'>
                      {previewThumb ? (
                        <div
                          className='size-full bg-contain bg-center bg-no-repeat'
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
                            Drag and drop or click to upload short thumbnail
                          </h2>
                          <p className='text-gray-A text-[10px] xsm:text-[12px] leading-[18px]'>
                            Suported : JPG, PNG,.. (Max 10MB)
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
                    className='text-[12px] text-red-FF font-[500] leading-[16px] h-[16px] 
                  px-[8px] line-clamp-1 text-ellipsis break-all'
                  >
                    <span>
                      {submitErrs["image"] ? submitErrs["image"] : ""}
                    </span>
                  </div>
                </div>

                {/* Video */}

                <div className='h-[85vh] sm:h-[80vh] xl:h-[85vh] max-h-[720px] aspect-[9/16] mb-[32px]'>
                  <label
                    htmlFor='video'
                    className={`inline-block size-full  relative 
                    rounded-[10px] overflow-hidden
                    border-[1px] transition-[border] ease-in ${
                      previewVideo ? "" : "border-[#6b6767] hover:border-white"
                    }
                      ${!id ? "cursor-pointer " : " cursor-default"}
                `}
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
                    <div className='flex items-center justify-center size-full'>
                      {previewVideo ? (
                        <video
                          ref={videoRef}
                          className='h-full object-contain'
                          controls
                        ></video>
                      ) : (
                        <div className='w-full flex flex-col items-center justify-center font-[500] text-center'>
                          <div className='w-[54px] sm:w-[64px]'>
                            <YoutubeBlankIcon />
                          </div>
                          <h2 className='mt-[12px] text-[12px] xsm:text-[16px]'>
                            Drag and drop to upload short
                          </h2>
                          <p className='text-gray-A text-[10px] xsm:text-[12px] leading-[18px]'>
                            Suported : MP4, WEBM,...
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
                    <span>
                      {submitErrs["video"] ? submitErrs["video"] : ""}
                    </span>
                  </div>
                </div>
              </div>

              <div className='flex-1 min-w-[300px] flex flex-wrap h-fit gap-[16px]'>
                <div className='basis-[100%] md:basis-[48.5%] lg:basis-[100%] 2xl:basis-[48.5%] overflow-hidden'>
                  <TextArea
                    title={"Title"}
                    name={"title"}
                    value={formData.title}
                    defaultValue={shortData?.data.title}
                    handleOnChange={handleOnChange}
                    handleSetRealTimeErr={handleSetRealTimeErr}
                    handleRemoveRealTimeErr={handleRemoveRealTimeErr}
                    errMsg={submitErrs["title"] ? submitErrs["title"] : ""}
                    placeholder={"Enter short title"}
                  />
                </div>

                <div className='basis-[100%] md:basis-[48.5%] lg:basis-[100%] 2xl:basis-[48.5%] overflow-hidden'>
                  <TextArea
                    title={"Description"}
                    name={"description"}
                    cannotEmpty={false}
                    value={formData.description}
                    defaultValue={shortData?.data.description}
                    handleOnChange={handleOnChange}
                    handleSetRealTimeErr={handleSetRealTimeErr}
                    handleRemoveRealTimeErr={handleRemoveRealTimeErr}
                    errMsg={
                      submitErrs["description"] ? submitErrs["description"] : ""
                    }
                    placeholder={"Enter short description"}
                  />
                </div>

                <div className='basis-[100%] xsm:basis-[70%] sm:basis-[60%] md:basis-[100%] lg:max-w-[320px]  '>
                  <InfiniteDropDownWithCheck
                    title={"Tag"}
                    valueList={formData.tag}
                    setIsOpened={setOpenedTags}
                    list={tagList?.data}
                    displayValue={"title"}
                    isLoading={tagIsLoading}
                    isError={tagIsErr}
                    errorMsg={tagErr?.response?.data?.msg}
                    setData={(value) => {
                      setFormData((prev) => ({ ...prev, tag: value }));
                    }}
                    handleSetParams={(value, pageInc) => {
                      setTagParams((prev) => {
                        let finalobj = {
                          ...prev,
                        };

                        if (value !== undefined) {
                          finalobj.title = value;
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
                      {submitErrs["videoIdList"]
                        ? submitErrs["videoIdList"]
                        : ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className='basis-[100%] order-7 flex justify-center mt-[50px]'>
              <button
                type='submit'
                className={`w-full max-w-[160px] btn1 relative `}
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
export default ShortUpsertModal;
