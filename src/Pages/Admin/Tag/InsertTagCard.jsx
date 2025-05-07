import { SaveIcon, CloseIcon, CreateIcon } from "../../../Assets/Icons";
import { useState, useRef, useEffect } from "react";
import { UploadImageIcon } from "../../../Assets/Icons";
import { createData } from "../../../Api/controller";
import { useAuthContext } from "../../../Auth Provider/authContext";

const initForm = {
  title: "",
  icon: undefined,
};

const InsertTagCard = ({ setCurrMode, refetch }) => {
  const { addToaster } = useAuthContext();

  const [formData, setFormData] = useState(initForm);

  const [previewImage, setPreviewImage] = useState(undefined);

  const [submitErrs, setSubmitErrs] = useState({});

  const errorTimeout = useRef(undefined);

  const iconInputRef = useRef();

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
        icon: "Failed to upload image",
      }));
      return;
    }

    if (!file.type.startsWith("image/")) {
      setSubmitErrs((prev) => ({
        ...prev,
        icon: "Just accepted image file",
      }));
      iconInputRef.current.value = "";
      return;
    }
    const maxSize = 3;
    const maxsizeByte = maxSize * 1024 * 1024; //10MB

    if (file.size > maxsizeByte) {
      setSubmitErrs((prev) => ({
        ...prev,
        icon: `File size > ${maxSize}MB`,
      }));
      iconInputRef.current.value = "";
      return;
    }

    try {
      await checkImage(file);
      // remove image errors
      setSubmitErrs((prev) => {
        const { icon, ...rest } = prev;
        return rest;
      });

      setFormData((prev) => ({ ...prev, icon: file }));
      setPreviewImage({ src: URL.createObjectURL(file), name: file.name });
    } catch (error) {
      setSubmitErrs((prev) => ({ ...prev, icon: error }));
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
      icon: (icon) => {
        if (!icon) {
          errors.icon = "Image is required";
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

    for (const key in formData) {
      finalData.append(key, formData[key]);
    }

    createData(
      "admin/tag",
      finalData,
      "Tag",
      () => {
        refetch();
        setCurrMode(undefined);
      },
      undefined,
      addToaster,
    );
  };

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
      <div className='absolute z-[1] w-full h-[90px] cursor-default'>
        <div className='flex justify-between'>
          <div className='m-[1px] w-[24px] text-green-500'>
            <CreateIcon />
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
         ${
           !previewImage && "border-[2px] border-green-500"
         } bg-center bg-no-repeat bg-cover cursor-pointer `}
        style={{
          backgroundImage: `url('${previewImage?.src}')`,
        }}
      >
        <label
          htmlFor='icon'
          className='inline-block size-full sm:max-w-[360px] relative cursor-pointer'
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDrop={(e) => {
            e.preventDefault();
            iconInputRef.current.files = e.dataTransfer.files;
            handleUploadAvatar(iconInputRef.current);
          }}
        >
          <div className='flex items-center justify-center size-full'>
            {!previewImage && (
              <div className='w-full flex flex-col items-center justify-center font-[500] text-center'>
                <div className='w-[40px] text-white'>
                  <UploadImageIcon />
                </div>
              </div>
            )}
          </div>
          <input
            type='file'
            name='icon'
            id='icon'
            accept='image/*'
            ref={iconInputRef}
            onChange={(e) => handleUploadAvatar(e.target)}
            className='hidden'
            onProgress={(e) => console.log(e)}
          />
        </label>
      </div>

      <div
        className='size-full flex flex-col justify-between mt-[90px] pt-[70px] border-[2px] rounded-[5px] p-[8px]
       border-green-500'
      >
        <div className='w-full h-[24px] line-clamp-1 text-ellipsis text-center'>
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
        {Object.keys(submitErrs).length > 0 &&
          Object.keys(submitErrs).map((error, id) => (
            <div className='text-red-500 text-sm text-center' key={id}>
              {submitErrs[error]}
            </div>
          ))}
        <div className='ml-auto'>
          <button className='p-[8px] hover:text-green-500' type='submit'>
            Add
          </button>
        </div>
      </div>
    </form>
  );
};
export default InsertTagCard;
