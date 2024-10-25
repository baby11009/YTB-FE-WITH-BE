import { useRef, useState, useEffect, useLayoutEffect, Suspense } from "react";
import { UploadImageIcon } from "../../../../Assets/Icons";
import { Input, DropDown } from "../../../../Component";
import { createData, updateData } from "../../../../Api/controller";
import { getDataWithAuth } from "../../../../Api/getData";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const initForm = {
  title: "",
  image: undefined,
};

const UpsertTag = () => {
  const { id } = useParams();

  const queryClient = useQueryClient();

  const {
    data: tagData,
    refetch,
    error: queryError,
  } = getDataWithAuth(`tag/${id}`, {}, id !== undefined, false);

  const [formData, setFormData] = useState(initForm);
  console.log("🚀 ~ ormData:", formData);

  const [previewImg, setPreviewImg] = useState("");

  const [error, setError] = useState({
    inputName: [],
    message: [],
  });

  const avatarRef = useRef();

  const handleOnChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadAvatar = (e) => {
    const file = e.files[0];
    if (!file) {
      setError((prev) => ({
        inputName: [...prev.inputName, "avatar"],
        message: [...prev.message, "Không thể tải file"],
      }));
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError((prev) => ({
        inputName: [...prev.inputName, "avatar"],
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
    setPreviewImg(URL.createObjectURL(file));
  };

  const handleValidate = () => {
    if (error.inputName.length > 0) {
      setError({ inputName: [], message: [] });
    }

    const keys = Object.keys(formData);

    let hasErrors = false;

    keys.forEach((key) => {
      if (!formData[key]) {
        const messageList = {
          text: "Trường này không được bỏ trống",
          image: "Hãy tải hình ảnh tương ứng",
        };

        let msg = key === "image" ? messageList.image : messageList.text;
        setError((prev) => ({
          inputName: [...prev.inputName, key],
          message: [...prev.message, msg],
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

    const keys = Object.keys(formData);

    const invalidData = keys.every((key) => {
      if (!formData[key]) {
        setError((prev) => ({
          inputName: [...prev.inputName, key],
          message: [...prev.message, "Trường không được để trống"],
        }));
        return true;
      }
    });

    if (invalidData) {
      return true;
    }

    if (hasErrors) {
      return true;
    }
  };

  const create = async () => {
    const error = handleValidate();

    if (error) {
      return;
    }

    const alowedData = {
      title: formData.title,
      image: formData.image,
    };

    let finalData = new FormData();

    for (const key in alowedData) {
      finalData.append(key, alowedData[key]);
    }

    const responseData = await createData("tag", finalData);

    if (responseData) {
      setFormData(initForm);
      setPreviewImg("");
    }
  };

  const update = async () => {
    const error = handleValidateUpdate();

    if (error) {
      return;
    }

    let finalData = {};

    const keys = Object.keys(formData);

    keys.forEach((key) => {
      if (formData[key]) {
        finalData[key] = formData[key];
      }
    });

    for (const key in finalData) {
      if (tagData?.data.hasOwnProperty(key)) {
        if (tagData?.data[key] === finalData[key]) {
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
      data.append(key, finalData[key]);
    }

    const rspData = await updateData("tag", id, data);

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

  useLayoutEffect(() => {
    if (tagData) {
      setFormData({
        title: tagData.data.title,
      });
      setPreviewImg(
        `${import.meta.env.VITE_BASE_API_URI}${
          import.meta.env.VITE_VIEW_TAG_API
        }${tagData.data.icon}`
      );
    }

    return () => {
      setFormData(initForm);
      setPreviewImg("");
    };
  }, [tagData]);

  useEffect(() => {
    return () => {
      queryClient.clear();
    };
  }, []);

  return (
    <div>
      <header className='pt-[16px] pb-[32px]'>
        <h2 className='text-[28px] leading-[44px] font-[500]'>Users</h2>
      </header>

      <form
        noValidate
        onSubmit={handleSubmit}
        className='flex items-center flex-wrap justify-center gap-[24px] mb-[36px]'
      >
        {/* avatar */}
        <div
          className='basis-[100%] sm:basis-[48%] lg:basis-[32%] 
             max-h-[360px] h-[40vh] sm:h-[45vh] xl:h-[40vh]'
        >
          <label
            htmlFor='avatar'
            className='inline-block size-full sm:max-w-[360px] relative cursor-pointer 
              border-[2px] border-dashed rounded-[5%] p-[16px]'
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();
              avatarRef.current.files = e.dataTransfer.files;
              handleUploadAvatar(avatarRef.current);
            }}
          >
            <div className='flex items-center justify-center size-full'>
              {previewImg ? (
                <div
                  className='size-full bg-contain bg-center bg-no-repeat'
                  style={{
                    backgroundImage: `url("${previewImg}")`,
                  }}
                ></div>
              ) : (
                <div className='w-full flex flex-col items-center justify-center font-[500] text-center'>
                  <div>
                    <UploadImageIcon />
                  </div>
                  <h2 className='mt-[12px]'>
                    Nhấn vào để tải hình ảnh hoặc kéo thả
                  </h2>
                  <p className='text-gray-A text-[12px] leading-[18px]'>
                    Chỉ hỗ trợ : JPG, PNG,.. (Tối đa 10MB)
                  </p>
                </div>
              )}
            </div>
            <input
              type='file'
              name='avatar'
              id='avatar'
              accept='image/*'
              ref={avatarRef}
              onChange={(e) => handleUploadAvatar(e.target)}
              className='hidden'
              onProgress={(e) => console.log(e)}
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

        {/* name */}
        <div className='basis-[100%] lg:basis-[47%] flex justify-center'>
          <Input
            id={"title"}
            type={"text"}
            label={"Title"}
            value={formData.title}
            defaultValue={tagData?.data.title}
            handleOnChange={handleOnChange}
            error={
              error.inputName.includes("title")
                ? `${error.message[error.inputName.indexOf("title")]}`
                : ""
            }
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
export default UpsertTag;
