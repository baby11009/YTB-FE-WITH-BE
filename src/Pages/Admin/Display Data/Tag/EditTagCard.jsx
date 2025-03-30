import { EditIcon, CloseIcon, UploadImageIcon } from "../../../../Assets/Icons";
import { useAuthContext } from "../../../../Auth Provider/authContext";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { updateData } from "../../../../Api/controller";
const initForm = {
  title: "",
  image: undefined,
};

const EditTagCard = ({ data, setCurrMode, handleUpdate }) => {
  const { addToaster } = useAuthContext();

  const [formData, setFormData] = useState(initForm);

  const [previewImage, setPreviewImage] = useState();

  const [submitErrs, setSubmitErrs] = useState({});

  const errorTimeout = useRef(undefined);

  const imageInputRef = useRef();

  const checkImage = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const imgSrc = URL.createObjectURL(file);
      img.src = imgSrc;
      img.onload = () => {
        if (img.naturalWidth < 150 || img.naturalHeight < 150) {
          reject("Image width/height must be at least 150px");
        } else {
          resolve();
        }
        URL.revokeObjectURL(imgSrc);
      };
      img.onerror = () => reject("Invalid image file");
    });
  };

  const handleUploadAvatar = async (e) => {
    const file = e.files[0];

    if (!file) {
      setSubmitErrs((prev) => ({
        ...prev,
        image: "Failed to upload image",
      }));
      return;
    }

    if (!file.type.startsWith("image/")) {
      setSubmitErrs((prev) => ({
        ...prev,
        image: "Just accepted image file",
      }));
      imageInputRef.current.value = "";
      return;
    }
    const maxSize = 3;
    const maxsizeByte = maxSize * 1024 * 1024; //10MB

    if (file.size > maxsizeByte) {
      setSubmitErrs((prev) => ({
        ...prev,
        image: `File size > ${maxSize}MB`,
      }));
      imageInputRef.current.value = "";
      return;
    }

    try {
      await checkImage(file);
      // remove image errors
      setSubmitErrs((prev) => {
        const { image, ...rest } = prev;
        return rest;
      });

      setFormData((prev) => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    } catch (error) {
      setSubmitErrs((prev) => ({ ...prev, image: error }));
    }
  };

  const validateFormData = () => {
    const errors = {};
    const handlerValidate = {
      title: (title) => {
        if (!title) {
          errors.title = "Title is required";
        }
      },
    };

    for (const key in formData) {
      if (handlerValidate[key]) {
        handlerValidate[key](formData[key]);
      }
    }

    if (Object.keys(errors).length > 0) {
      setSubmitErrs(errors);

      return false;
    }

    return true;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateFormData()) return;

    const finalData = new FormData();

    // append all the changed values to the final update data object
    for (const key in formData) {
      if (data[key] !== formData[key]) {
        finalData.append(key, formData[key]);
      }
    }

    if (Array.from(finalData.entries()).length < 1) {
      alert("Nothing changed");
      return;
    }

    await updateData(
      "admin/tag",
      data?._id,
      finalData,
      "Tag",
      (rsp) => {
        handleUpdate(rsp.data?.data);
        setCurrMode(undefined);
      },
      undefined,
      addToaster,
    );
  };

  useLayoutEffect(() => {
    if (data) {
      const { icon, title } = data;
      setFormData({ title, image: undefined });

      setPreviewImage(
        `${import.meta.env.VITE_BASE_API_URI}${
          import.meta.env.VITE_VIEW_TAG_API
        }${icon}`,
      );
    }
  }, [data]);

  useEffect(() => {
    if (Object.keys(submitErrs).length > 0) {
      errorTimeout.current = setTimeout(() => {
        setSubmitErrs({});
      }, 2500);
    }

    return () => {
      clearTimeout(errorTimeout.current);
    };
  }, [submitErrs]);

  return (
    <form
      className='h-[280px] flex flex-col items-center relative'
      onSubmit={handleFormSubmit}
    >
      <div className='absolute z-[1] w-full h-[90px] cursor-default '>
        <div className='flex justify-between'>
          <div
            className='m-[1px] w-[24px] text-blue-500'
          >
            <EditIcon />
          </div>
          <button
            type='button'
            onClick={() => {
              setCurrMode(undefined);
            }}
          >
            <div className='m-[1px] w-[24px]'>
              <CloseIcon />
            </div>
          </button>
        </div>
      </div>
      <div
        className={`absolute z-[2] size-[150px] rounded-[50%] bg-black 
        bg-center bg-no-repeat bg-cover cursor-pointer `}
        style={{
          backgroundImage: `url('${previewImage}')`,
        }}
      >
        <label
          htmlFor='image'
          className='inline-block size-full sm:max-w-[360px] relative cursor-pointer'
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDrop={(e) => {
            e.preventDefault();
            imageInputRef.current.files = e.dataTransfer.files;
            handleUploadAvatar(imageInputRef.current);
          }}
        >
          <div className='flex items-center justify-center size-full'>
            {!previewImage && (
              <div className='w-full flex flex-col items-center justify-center font-[500] text-center'>
                <div className='w-[40px]'>
                  <UploadImageIcon />
                </div>
              </div>
            )}
          </div>
          <input
            type='file'
            name='image'
            id='image'
            accept='image/*'
            ref={imageInputRef}
            onChange={(e) => handleUploadAvatar(e.target)}
            className='hidden'
            onProgress={(e) => console.log(e)}
          />
        </label>
      </div>

      <div
        className='size-full flex flex-col justify-between mt-[90px] pt-[70px] border-[2px] rounded-[5px] p-[8px]
       border-blue-500'
      >
        <div className='text-center'>
          <div className='w-full h-[20px] line-clamp-1 text-ellipsis'>
            <input
              type='text'
              placeholder='........Title........'
              className='border-none outline-none bg-transparent text-[16px] leading-[20px] font-[500] placeholder:text-center'
              minLength={5}
              maxLength={30}
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              autoFocus
            />
          </div>
        </div>
        {Object.keys(submitErrs).length > 0 &&
          Object.keys(submitErrs).map((error, id) => (
            <div className='text-red-500 text-sm text-center' key={id}>
              {submitErrs[error]}
            </div>
          ))}
        <div className='ml-auto'>
          <button className='p-[8px] hover:text-blue-500' type='submit'>
            Save
          </button>
        </div>
      </div>
    </form>
  );
};
export default EditTagCard;
