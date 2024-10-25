import { useAuthContext } from "../../../../../../Auth Provider/authContext";
import { CloseIcon, UploadImageIcon } from "../../../../../../Assets/Icons";
import {
  InfiniteDropDownWithCheck,
  TextArea,
} from "../../../../../../Component";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { getDataWithAuth } from "../../../../../../Api/getData";
import { createData, updateData } from "../../../../../../Api/controller";
import { useQueryClient } from "@tanstack/react-query";

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

  const { setIsShowing } = useAuthContext();

  const [openedTags, setOpenedTags] = useState(false);

  const [tagParams, setTagParams] = useState(initTagParams);

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

  const [formData, setFormData] = useState(init);

  const [previewThumb, setPreviewThumb] = useState("");

  const [previewVideo, setPreviewVideo] = useState("");

  const [error, setError] = useState({
    inputName: [],
    message: [],
  });

  const thumbRef = useRef();

  const videoRef = useRef();

  const defaultTagRef = useRef([]);

  const handleOnChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadThumb = (e) => {
    const file = e.files[0];

    if (!file) {
      setError((prev) => ({
        inputName: [...prev?.inputName, "image"],
        message: [...prev?.message, "Không thể tải file"],
      }));
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError((prev) => ({
        inputName: [...prev?.inputName, "image"],
        message: [...prev?.message, "Chỉ nhận file hình ảnh"],
      }));
      e.value = "";
      return;
    }
    const maxSize = 2 * 1024 * 1024; //2MB

    if (file.size > maxSize) {
      setError((prev) => ({
        inputName: [...prev?.inputName, "avatar"],
        message: [...prev?.message, "Kích thước file lớn hơn 2MB"],
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
        console.log(
          "🚀 ~ naturalWidth, naturalHeight:",
          naturalWidth,

          naturalHeight
        );
        if (
          naturalWidth < 404 ||
          Number((naturalWidth / naturalHeight).toFixed(4)) !== 9 / 16
        ) {
          setError((prev) => ({
            inputName: [...prev?.inputName, "image"],
            message: [
              ...prev?.message,
              `Image must be at least 404 width and having 9:16 aspect ratio`,
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
  };

  const handleUploadVideo = (e) => {
    const file = e.files[0];

    if (!file) {
      setError((prev) => ({
        inputName: [...prev?.inputName, "video"],
        message: [...prev?.message, "Không thể tải file"],
      }));
      return;
    }
    if (!file.type.startsWith("video/")) {
      setError((prev) => ({
        inputName: [...prev?.inputName, "video"],
        message: [...prev?.message, "Chỉ nhận file video"],
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

  const handleValidate = () => {
    if (error.inputName.length > 0) {
      setError({ inputName: [], message: [] });
    }
    let hasErrors = false;

    const keys = Object.keys(formData).filter(
      (key) => key !== "type" && key !== "description"
    );

    keys.forEach((key) => {
      if (formData[key] === "" || !formData[key]) {
        let errMsg = "Không được để trống";
        if (key === "image" || key === "video") {
          errMsg = "Chưa upload file";
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
  };

  const handleValidateUpdate = () => {
    if (error.inputName.length > 0) {
      setError({ inputName: [], message: [] });
    }
    let hasErrors = false;
    const keys = Object.keys(formData).filter(
      (key) =>
        key !== "type" &&
        key !== "image" &&
        key !== "video" &&
        key !== "description"
    );
    keys.forEach((key) => {
      if (formData[key] === "" || !formData[key]) {
        let errMsg = "Không được để trống";
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
  };

  const create = async () => {
    const error = handleValidate();

    if (error) {
      return;
    }

    let data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    const responseData = await createData("/client/video/upload", data);

    if (responseData) {
      setFormData(init);
      setPreviewVideo(undefined);
      setPreviewThumb(undefined);
      thumbRef.current.files = undefined;
    }
  };

  const update = async () => {
    const error = handleValidateUpdate();

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
        defaultTagRef.current.includes(id)
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
      alert("Không có gì thay đổi");
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

    const rspData = await updateData("/client/video", id, data);

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
        }${shortData?.data?.thumb}`
      );
      setPreviewVideo(
        `${import.meta.env.VITE_BASE_API_URI}${
          import.meta.env.VITE_VIEW_VIDEO_API
        }${shortData?.data?.video}`
      );
    }

    return () => {
      setFormData(init);
      setPreviewVideo(undefined);
      setPreviewThumb(undefined);
    };
  }, [shortData]);

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
    };
  }, []);

  return (
    <div className='size-full  max-w-[1500px] p-[12px] lg:p-[24px]'>
      <div className='bg-black size-full overflow-auto rounded-[5px] shadow-[0_0_8px_#f1f1f1]'>
        <div className='p-[12px] xl:p-[20px]'>
          <div className='flex justify-between'>
            <h1 className='text-nowrap text-[25px] leading-[32px] font-[600]'>
              {title}
            </h1>
            <button
              className='size-[32px] rounded-[50%] flex items-center justify-center hover:bg-black-0.1 active:bg-black-0.2'
              onClick={() => {
                setIsShowing(undefined);
              }}
            >
              <div>
                <CloseIcon size={16} />
              </div>
            </button>
          </div>
          <form
            noValidate
            onSubmit={handleSubmit}
            className=' mb-[20px] my-[24px]'
          >
            <div className='flex gap-[24px] flex-col ite md:flex-row '>
              <div
                className='basis-[70%] md:basis-[55%]  2lg:basis-[60%] flex items-center justify-center
               flex-wrap gap-[36px] 2md:gap-[24px]'
              >
                {/* thumbnail */}
                <div className='h-[80vh] max-h-[720px] aspect-[9/16]'>
                  <label
                    htmlFor='thumbnail'
                    className={`inline-block size-full relative cursor-pointer
                    ${
                      !formData.image && !id && "border-dashed p-[12px]"
                    } border-[2px] rounded-[10px] overflow-hidden`}
                    onDragOver={(e) => {
                      e.preventDefault();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      thumbRef.current.files = e.dataTransfer.files;
                      handleUploadThumb(thumbRef.current);
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
                          <div>
                            <UploadImageIcon />
                          </div>
                          <h2 className='mt-[12px]'>
                            Nhấn vào để tải thumbnail của video hoặc kéo thả
                          </h2>
                          <p className='text-gray-A text-[12px] leading-[18px]'>
                            Chỉ hỗ trợ : JPG, PNG,.. (Tối đa 2MB)
                          </p>
                        </div>
                      )}
                    </div>
                    <input
                      type='file'
                      name='thumbnail'
                      id='thumbnail'
                      accept='image/*'
                      ref={thumbRef}
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

                <div className='h-[80vh] max-h-[720px] aspect-[9/16]'>
                  <label
                    htmlFor='video'
                    className={`inline-block size-full relative 
                    border-[2px] rounded-[10px] p-[12px]
                     ${!formData.image && !id && "border-dashed p-[12px]"}
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
                      videoRef.current.files = e.dataTransfer.files;
                      handleUploadVideo(videoRef.current);
                    }}
                  >
                    <div className='flex items-center justify-center size-full'>
                      {previewVideo ? (
                        <video
                          src={previewVideo}
                          className='h-full object-contain'
                          controls
                        ></video>
                      ) : (
                        <div className='w-full flex flex-col items-center justify-center font-[500] text-center'>
                          <div>
                            <UploadImageIcon />
                          </div>
                          <h2 className='mt-[12px]'>
                            Nhấn vào để tải video hoặc kéo thả
                          </h2>
                          <p className='text-gray-A text-[12px] leading-[18px]'>
                            Chỉ hỗ trợ : MP4, WEBM,...
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
                      ref={videoRef}
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

              <div className='flex-1 flex flex-wrap gap-[16px] h-fit'>
                <div className='basis-[100%]'>
                  <TextArea
                    title={"Title"}
                    name={"title"}
                    value={formData.title}
                    defaultValue={shortData?.data.title}
                    handleOnChange={handleOnChange}
                    errMsg={
                      error.inputName?.includes("title")
                        ? error.message[error.inputName?.indexOf("title")]
                        : ""
                    }
                    placeholder={"Enter short title"}
                  />
                </div>

                <div className='basis-[100%]'>
                  <TextArea
                    title={"Description"}
                    name={"description"}
                    value={formData.description}
                    defaultValue={shortData?.data.description}
                    handleOnChange={handleOnChange}
                    errMsg={
                      error.inputName?.includes("description")
                        ? error.message[error.inputName?.indexOf("description")]
                        : ""
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
                      {error.inputName.includes("videoIdList")
                        ? error.message[error.inputName.indexOf("videoIdList")]
                        : ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className='basis-[100%] order-7 flex justify-center mt-[50px]'>
              <button
                type='submit'
                className='w-full max-w-[160px] btn1 relative'
              >
                <span className='z-[50] relative'>Submit</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ShortUpsertModal;
