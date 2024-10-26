import { useRef, useState, useEffect, useLayoutEffect, Suspense } from "react";
import { UploadImageIcon } from "../../../../Assets/Icons";
import {
  Input,
  DropDown,
  InfiniteDropDown,
  InfiniteDropDownWithCheck,
} from "../../../../Component";
import { createData, updateData } from "../../../../Api/controller";
import { getData, getDataWithAuth } from "../../../../Api/getData";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const init = {
  userId: "",
  title: "",
  image: undefined,
  video: undefined,
  type: "video",
  tag: [],
  view: 0,
  like: 0,
  dislike: 0,
};

const initUserParams = {
  email: "",
  limit: 10,
  page: 1,
  clearCache: "user",
};

const initTagParams = {
  title: "",
  page: 1,
  limit: 10,
  clearCache: "tag",
};

const currUserInit = {
  userId: "",
  email: "",
};

const UpsertVideo = () => {
  const { id } = useParams();

  const queryClient = useQueryClient();

  const [openedUsers, setOpenedUsers] = useState(false);

  const [openedTags, setOpenedTags] = useState(false);

  const [userParams, setUserParams] = useState(initUserParams);

  const [tagParams, setTagParams] = useState(initTagParams);

  const {
    data: videoData,
    refetch,
    error: queryError,
    isLoading: videoLoading,
    isError: videoisError,
  } = getDataWithAuth(`video/${id}`, {}, id !== undefined, false);

  const {
    data,
    error: userError,
    isLoading,
    isError,
  } = getDataWithAuth("user", userParams, openedUsers, false);

  const {
    data: tagList,
    error: tagErr,
    isLoading: tagIsLoading,
    isError: tagIsErr,
  } = getDataWithAuth("tag", tagParams, openedTags, false);

  const [formData, setFormData] = useState(init);

  const [previewThumb, setPreviewThumb] = useState("");

  const [previewVideo, setPreviewVideo] = useState("");

  const [currUser, setCurrUser] = useState(currUserInit);

  const [error, setError] = useState({
    inputName: [],
    message: [],
  });

  const types = useRef(["video", "short"]);

  const thumbRef = useRef();

  const videoRef = useRef();

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
        inputName: [...prev.inputName, "thumbnail"],
        message: [...prev.message, "Không thể tải file"],
      }));
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError((prev) => ({
        inputName: [...prev.inputName, "thumbnail"],
        message: [...prev.message, "Chỉ nhận file hình ảnh"],
      }));
      e.value = "";
      return;
    }
    const maxSize = 15 * 1024 * 1024; //10MB
    if (file.size > maxSize) {
      setError((prev) => ({
        inputName: [...prev.inputName, "avatar"],
        message: [...prev.message, "Kích thước file lớn hơn 15MB"],
      }));
      e.value = "";
      return;
    }

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
    setPreviewThumb(URL.createObjectURL(file));
  };

  const handleUploadVideo = (e) => {
    const file = e.files[0];

    if (!file) {
      setError((prev) => ({
        inputName: [...prev.inputName, "video"],
        message: [...prev.message, "Không thể tải file"],
      }));
      return;
    }
    if (!file.type.startsWith("video/")) {
      setError((prev) => ({
        inputName: [...prev.inputName, "video"],
        message: [...prev.message, "Chỉ nhận file video"],
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
      (key) =>
        key !== "type" && key !== "like" && key !== "dislike" && key !== "view"
    );

    keys.forEach((key) => {
      if (formData[key] === "" || !formData[key]) {
        let errMsg = "Không được để trống";
        if (key === "image" || key === "video") {
          errMsg = "Chưa upload file";
        }
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
        key !== "type" &&
        key !== "image" &&
        key !== "video" &&
        key !== "view" &&
        key !== "like" &&
        key !== "dislike"
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

    let data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    await createData("video/upload", data, "video", () => {
      setFormData(init);
      setPreviewVideo(undefined);
      setPreviewThumb(undefined);
      setCurrUser(currUserInit);
    });
  };

  const update = async () => {
    const error = handleValidateUpdate();

    if (error) {
      return;
    }

    let finalData = {
      title: formData.title,
      type: formData.type,
      view: formData.view,
      like: formData.like,
      dislike: formData.dislike,
      tag: formData.tag,
    };

    for (const key in finalData) {
      if (videoData?.data?.hasOwnProperty(key)) {
        if (videoData?.data[key] === finalData[key]) {
          delete finalData[key];
        }
      }
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

    await updateData("video", id, data, "video", () => {
      refetch();
    });
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
        userId: videoData?.data?.user_info?._id,
        title: videoData?.data?.title,
        image: undefined,
        video: undefined,
        type: videoData?.data?.type,
        view: videoData?.data?.view,
        like: videoData?.data?.like,
        dislike: videoData?.data?.dislike,
      };
      if (videoData?.data?.tag_info) {
        dataForm.tag = videoData?.data?.tag_info.map((tag) => tag._id);
      }
      setFormData(dataForm);
      setCurrUser({
        userId: videoData?.data?.user_info?._id,
        email: videoData?.data?.user_info?.email,
      });
      setPreviewThumb(
        `${import.meta.env.VITE_BASE_API_URI}${
          import.meta.env.VITE_VIEW_THUMB_API
        }${videoData?.data?.thumb}`
      );
      setPreviewVideo(
        `${import.meta.env.VITE_BASE_API_URI}${
          import.meta.env.VITE_VIEW_VIDEO_API
        }${videoData?.data?.video}`
      );
    }

    return () => {
      setFormData(init);
      setPreviewVideo(undefined);
      setPreviewThumb(undefined);
      setCurrUser(currUserInit);
    };
  }, [videoData]);

  useEffect(() => {
    if (!openedUsers) {
      queryClient.removeQueries("user");
    }
  }, [openedUsers]);

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
    <div>
      <header className='pt-[16px] pb-[32px]'>
        <h2 className='text-[28px] leading-[44px] font-[500]'>Videos</h2>
      </header>

      <form noValidate onSubmit={handleSubmit} className=' mb-[100px]'>
        <div className='flex items-center justify-center flex-wrap gap-[24px]'>
          {/* thumbnail */}
          <div
            className='basis-[100%]  2md:basis-[40%] 
            max-h-[360px] h-[40vh] 2md:h-[45vh]'
          >
            <label
              htmlFor='thumbnail'
              className='inline-block size-full relative cursor-pointer 
          border-[2px] border-dashed rounded-[10px] p-[16px]'
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
                      Chỉ hỗ trợ : JPG, PNG,.. (Tối đa 10MB)
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
                {error.inputName.includes("image")
                  ? error.message[error.inputName.indexOf("image")]
                  : ""}
              </span>
            </div>
          </div>

          {/* Video */}

          <div
            className='basis-[100%]  2md:flex-1
            max-h-[360px] h-[50vh] 2md:h-[45vh]'
          >
            <label
              htmlFor='video'
              className={`inline-block size-full relative 
                border-[2px] border-dashed rounded-[10px] p-[16px]
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
                {error.inputName.includes("video")
                  ? error.message[error.inputName.indexOf("video")]
                  : ""}
              </span>
            </div>
          </div>
        </div>

        <div className='flex flex-wrap gap-[16px] mt-[48px]'>
          <div className='basis-[100%]  2md:basis-[32%]'>
            <Input
              dataId={id}
              maxWidth={"lg:max-w-[360px]"}
              id={"title"}
              type={"text"}
              label={"Video title"}
              value={formData.title}
              defaultValue={videoData?.data?.title}
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
              disabled={videoData ? true : false}
              title={"User"}
              value={currUser.email || "Chưa chọn"}
              setIsOpened={setOpenedUsers}
              list={data?.data}
              isLoading={isLoading}
              isError={isError}
              errorMsg={userError?.response?.data?.msg}
              handleSetParams={(value, pageInc) => {
                setUserParams((prev) => {
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
              params={userParams}
              handleSetCurr={(data) => {
                setCurrUser({
                  userId: data?._id,
                  email: data?.email,
                });
              }}
            />
            <div className='text-[12px] text-red-FF font-[500] leading-[16px] h-[16px] my-[6px] px-[8px]'>
              <span>
                {error.inputName.includes("userId")
                  ? error.message[error.inputName.indexOf("userId")]
                  : ""}
              </span>
            </div>
          </div>

          {/* Type*/}
          <div className='basis-[100%] sm:basis-[48%] 2md:basis-[32%] z-[90]'>
            <DropDown
              list={types.current}
              title={"Type"}
              value={formData.type}
              handleOnClick={(type) => {
                setFormData((prev) => ({ ...prev, type }));
              }}
            />
          </div>

          {/* View */}
          <div className='basis-[100%] sm:basis-[48%] 2md:basis-[32%] '>
            <Input
              maxWidth={"lg:max-w-[360px]"}
              id={"view"}
              type={"number"}
              label={"View"}
              value={formData.view || 0}
              defaultValue={videoData?.data?.view}
              handleOnChange={handleOnChange}
              error={
                error.inputName.includes("view")
                  ? `${error.message[error.inputName.indexOf("view")]}`
                  : ""
              }
            />
          </div>
          {/* Like */}
          <div className='basis-[100%] sm:basis-[48%] 2md:basis-[32%] '>
            <Input
              maxWidth={"lg:max-w-[360px]"}
              id={"like"}
              type={"number"}
              label={"Like"}
              value={formData.like || 0}
              defaultValue={videoData?.data?.like}
              handleOnChange={handleOnChange}
              error={
                error.inputName.includes("like")
                  ? `${error.message[error.inputName.indexOf("like")]}`
                  : ""
              }
            />
          </div>

          {/* Dislike */}
          <div className='basis-[100%] sm:basis-[48%] 2md:basis-[32%] '>
            <Input
              maxWidth={"lg:max-w-[360px]"}
              id={"dislike"}
              type={"number"}
              label={"Dislike"}
              value={formData.dislike || 0}
              defaultValue={videoData?.data?.dislike}
              handleOnChange={handleOnChange}
              error={
                error.inputName.includes("dislike")
                  ? `${error.message[error.inputName.indexOf("dislike")]}`
                  : ""
              }
            />
          </div>

          <div className='basis-[100%] sm:basis-[48%] 2md:basis-[32%] '>
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
