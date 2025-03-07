import { SaveIcon, CloseIcon } from "../../../../Assets/Icons";
import { useState, useRef, useEffect } from "react";
import { UploadImageIcon } from "../../../../Assets/Icons";
import { createData } from "../../../../Api/controller";
import { useAuthContext } from "../../../../Auth Provider/authContext";

const initForm = {
  title: "",
  image: undefined,
};

const InsertTagCard = ({ setCurrMode, handleAddNewData }) => {
  const { addToaster } = useAuthContext();

  const [formData, setFormData] = useState(initForm);

  const [previewImage, setPreviewImage] = useState(undefined);

  const [submitErrs, setSubmitErrs] = useState({});

  const errorTimeout = useRef(undefined);

  const imageInputRef = useRef();

  const handleUploadAvatar = (e) => {
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

    const img = new Image();
    const imgSrc = URL.createObjectURL(file);
    img.src = imgSrc;
    img.onload = function () {
      if (img.naturalHeight < 150) {
        setSubmitErrs((prev) => ({
          ...prev,
          image: "Image width less than 150px",
        }));
      } else if (img.naturalWidth < 150) {
        setSubmitErrs((prev) => ({
          ...prev,
          image: "Image height less than 150px",
        }));
      }
      URL.revokeObjectURL(img.src);
    };

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    if (submitErrs?.image) {
      setSubmitErrs((prev) => {
        const prevClone = structuredClone(prev);
        delete prevClone.image;
        return prevClone;
      });
    }

    setPreviewImage({ src: imgSrc, name: file.name });
  };

  const validateFormData = () => {
    const errors = {};
    const handlerValidate = {
      title: (title) => {
        if (!title) {
          errors.title = "Title is required";
        }
      },
      image: (image) => {
        if (!image) {
          errors.image = "Image is required";
        }
      },
    };

    for (const key in formData) {
      handlerValidate[key](formData[key]);
    }

    if (Object.keys(errors).length > 0) {
      setSubmitErrs(errors);

      return false;
    }

    return true;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const valid = validateFormData();

    if (!valid) return;

    const finalData = new FormData();

    for (const key in formData) {
      finalData.append(key, formData[key]);
    }

    await createData(
      "tag",
      finalData,
      "Tag",
      (rsp) => {
        handleAddNewData(rsp.data.data);
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
      className='h-[280px] flex flex-col items-center relative group'
      onClick={() => {}}
      onSubmit={handleFormSubmit}
    >
      <div
        className={`absolute z-[2] size-[150px] rounded-[50%] bg-black
         ${
           !previewImage && "border-[2px]"
         } bg-center bg-no-repeat bg-cover cursor-pointer `}
        style={{
          backgroundImage: `url('${previewImage?.src}')`,
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
      <div className='absolute z-[1] w-full h-[90px] cursor-default '>
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

      <div className='size-full flex flex-col justify-between mt-[90px] pt-[70px] border-[2px] rounded-[5px] p-[8px]'>
        <div className='w-full h-[24px] line-clamp-1 text-ellipsis text-center'>
          <input
            type='text'
            placeholder='................Title................'
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
          <button className='p-[8px] hover:text-green-400' type='submit'>
            Save
          </button>
        </div>
      </div>
    </form>
  );
};
export default InsertTagCard;
