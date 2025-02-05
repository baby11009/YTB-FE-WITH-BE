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
import { getDataWithAuth } from "../../../../../../Api/getData";
import { createData, updateData } from "../../../../../../Api/controller";
import { useQueryClient } from "@tanstack/react-query";
import Hls from "hls.js";

const init = {
  title: "",
  image: undefined,
  video: undefined,
  type: "video",
  tag: [],
  description: "",
};
const initTagParams = {
  title: "",
  page: 1,
  limit: 10,
  clearCache: "tag",
};

const VideoUpsertModal = ({ title, id }) => {
  const queryClient = useQueryClient();

  const { setIsShowing, addToaster } = useAuthContext();

  const videoRef = useRef();

  const hlsRef = useRef();

  const thumbInputRef = useRef();

  const videoInputRef = useRef();

  const defaultTagRef = useRef([]);

  const [openedTags, setOpenedTags] = useState(false);

  const [tagParams, setTagParams] = useState(initTagParams);

  const [formData, setFormData] = useState(init);

  const [submitLoading, setSubmitLoading] = useState(false);

  const [previewThumb, setPreviewThumb] = useState("");

  const [previewVideo, setPreviewVideo] = useState("");

  const [error, setError] = useState({
    inputName: [],
    message: [],
  });

  const {
    data: videoData,
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
    setError({
      inputName: [],
      message: [],
    });

    const file = e.files[0];

    if (!file) {
      setError((prev) => ({
        inputName: [...prev?.inputName, "image"],
        message: [...prev?.message, "Failed to upload file"],
      }));
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError((prev) => ({
        inputName: [...prev?.inputName, "image"],
        message: [...prev?.message, "Just accepted image file"],
      }));
      e.value = "";
      return;
    }
    const maxSize = 2 * 1024 * 1024; //2MB

    if (file.size > maxSize) {
      setError((prev) => ({
        inputName: [...prev?.inputName, "avatar"],
        message: [...prev?.message, "File size exceeds maximum"],
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
        if (error)
          setError({
            inputName: [],
            message: [],
          });
        const { naturalWidth, naturalHeight } = e.currentTarget;
        if (
          naturalWidth < 720 ||
          Number((naturalWidth / naturalHeight).toFixed(2)) !== 1.78
        ) {
          setError((prev) => ({
            inputName: [...prev?.inputName, "image"],
            message: [
              ...prev?.message,
              `Image must be at least 720 width and having 16:9 aspect ratio`,
            ],
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
    setError({
      inputName: [],
      message: [],
    });

    const file = e.files[0];

    if (!file) {
      setError((prev) => ({
        inputName: [...prev?.inputName, "video"],
        message: [...prev?.message, "Failed to upload video"],
      }));
      return;
    }
    if (!file.type.startsWith("video/")) {
      setError((prev) => ({
        inputName: [...prev?.inputName, "video"],
        message: [...prev?.message, "Just accepted video file"],
      }));
      e.value = "";
      return;
    }

    setFormData((prev) => ({
      ...prev,
      video: file,
    }));
    setPreviewVideo(URL.createObjectURL(file));
  }, []);

  const handleValidate = useCallback(
    (formData) => {
      if (error.inputName.length > 0) {
        setError({ inputName: [], message: [] });
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
          setError((prev) => ({
            inputName: [...prev?.inputName, key],
            message: [...prev?.message, errMsg],
          }));
          hasErrors = true;
        }
      });

      if (hasErrors) {
        return true;
      }
    },
    [error],
  );

  const handleValidateUpdate = useCallback(
    (formData) => {
      if (error.inputName.length > 0) {
        setError({ inputName: [], message: [] });
      }
      let hasErrors = false;

      const keys = Object.keys(formData).filter(
        (key) =>
          key !== "type" &&
          key !== "image" &&
          key !== "video" &&
          key !== "description",
      );

      for (const key of keys) {
        if (formData[key] === "" || !formData[key]) {
          let errMsg = "Cannot be empty";
          setError((prev) => ({
            inputName: [...prev?.inputName, key],
            message: [...prev?.message, errMsg],
          }));
          hasErrors = true;
        }
      }

      if (hasErrors) {
        console.log(5);

        return true;
      }
    },
    [error],
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
        "video",
        () => {
          setFormData(init);
          setPreviewVideo(undefined);
          setPreviewThumb(undefined);
          thumbInputRef.current.value = undefined;
        },
        undefined,
        addToaster,
      );
    },
    [error],
  );

  const update = useCallback(
    async (formData, videoData) => {
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
          videoData?.data?.hasOwnProperty(key) &&
          videoData?.data[key] === finalData[key]
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
        alert("Nothing changed!");
        return;
      }

      let data = new FormData();

      for (const key in finalData) {
        if (key === "tag") {
          // Chuyển mảng thành json để dữ nguyên giá trị trong FormData
          data.append(key, JSON.stringify(finalData[key]));
        } else {
          data.append(key, finalData[key]);
        }
      }

      await updateData(
        "/client/video",
        id,
        data,
        "video",
        () => {
          refetch();
        },
        undefined,
        addToaster,
      );
    },
    [error],
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      setSubmitLoading(true);

      if (id) {
        await update(formData, videoData);
      } else {
        await create(formData);
      }

      setSubmitLoading(false);
    },
    [formData, error, videoData],
  );

  useLayoutEffect(() => {
    if (videoData) {
      const dataForm = {
        title: videoData?.data?.title,
        image: undefined,
        video: undefined,
        type: videoData?.data?.type,
        description: videoData?.data?.description,
      };

      if (videoData?.data?.tag_info) {
        const tagIdList = videoData?.data?.tag_info.map((tag) => tag._id);
        dataForm.tag = tagIdList;
        defaultTagRef.current = tagIdList;
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
      queryClient.removeQueries("tag");
    }
  }, [openedTags]);

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
            <div className='flex items-center justify-center flex-wrap'>
              {/* thumbnail */}
              <div
                className='basis-[100%] 2md:basis-[50%] 
                max-w-full aspect-video max-h-[405px] p-[0_0_16px] pl 2md:p-[0px_16px_0px_0px]'
              >
                <label
                  htmlFor='thumbnail'
                  className='inline-block size-full relative cursor-pointer 
                    rounded-[10px] overflow-hidden shadow-[0_0_4px_2px_rgba(255,255,255,0.2)] sm:shadow-[0_0_8px_4px_rgba(255,255,255,0.2)]'
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

                <div className='text-[12px] text-red-FF font-[500] leading-[16px] h-[16px] mt-[12px] px-[8px]'>
                  <span>
                    {error.inputName?.includes("image")
                      ? error.message[error.inputName?.indexOf("image")]
                      : ""}
                  </span>
                </div>
              </div>

              {/* Video */}
              <div
                className='basis-[100%] 2md:basis-[50%] 
                max-w-full aspect-video max-h-[405px] p-[16px_0] pl 2md:p-[0px_0px_0px_16px] '
              >
                <label
                  htmlFor='video'
                  className='inline-block size-full relative cursor-pointer 
                    rounded-[10px] overflow-hidden shadow-[0_0_4px_2px_rgba(255,255,255,0.2)] sm:shadow-[0_0_8px_4px_rgba(255,255,255,0.2)]'
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

                <div className='text-[12px] text-red-FF font-[500] leading-[16px] h-[16px] mt-[12px] px-[8px]'>
                  <span>
                    {error.inputName?.includes("video")
                      ? error.message[error.inputName?.indexOf("video")]
                      : ""}
                  </span>
                </div>
              </div>
            </div>

            <div className='flex flex-wrap mt-[16px]'>
              <div className='basis-[100%]  2md:basis-[50%]  p-[0_0_8px] pl 2md:p-[0px_8px_0px_0px] '>
                <TextArea
                  title={"Title"}
                  name={"title"}
                  value={formData.title}
                  defaultValue={videoData?.data.title}
                  handleOnChange={handleOnChange}
                  maxLength={155}
                  errMsg={
                    error.inputName?.includes("title")
                      ? error.message[error.inputName?.indexOf("title")]
                      : ""
                  }
                  placeholder={"Enter video title"}
                />
              </div>
              <div className='basis-[100%]  2md:basis-[50%]  p-[8px_0_0] pl 2md:p-[0px_0px_0px_8px] '>
                <TextArea
                  title={"Description"}
                  name={"description"}
                  value={formData.description}
                  defaultValue={videoData?.data.description}
                  handleOnChange={handleOnChange}
                  errMsg={
                    error.inputName?.includes("description")
                      ? error.message[error.inputName?.indexOf("description")]
                      : ""
                  }
                  placeholder={"Enter video description"}
                />
              </div>
              <div className='basis-[100%] sm:basis-[48%] 2md:basis-[32%] mt-[32px] '>
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
                    {error.inputName.includes("videoIdList")
                      ? error.message[error.inputName.indexOf("videoIdList")]
                      : ""}
                  </span>
                </div>
              </div>
            </div>

            <div className='basis-[100%]  flex items-center justify-center mt-[180px]'>
              <button type='submit' className='w-full max-w-[160px] btn1'>
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
