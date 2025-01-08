import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { PlusIcon } from "../../../../Assets/Icons";
import { Input, DropDown, ImageCropper } from "../../../../Component";
import { createData, updateData } from "../../../../Api/controller";
import { getDataWithAuth } from "../../../../Api/getData";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../../../Auth Provider/authContext";

const initForm = {
  name: "",
  email: "",
  password: "",
  role: "user",
  confirmed: false,
};

const UpsertUser = () => {
  const { setIsShowing, setNotifyMessage } = useAuthContext();

  const { id } = useParams();

  const queryClient = useQueryClient();
  const { data: userData, refetch } = getDataWithAuth(
    `user/${id}`,
    {},
    id !== undefined,
    false,
  );

  const [formData, setFormData] = useState(initForm);

  const [previewAva, setPreviewAva] = useState("");

  const [avaName, setAvaName] = useState("");

  const [previewBanner, setPreviewBanner] = useState("");

  const [bannerName, setBannerName] = useState("");

  const [error, setError] = useState({
    inputName: [],
    message: [],
  });

  const roles = useRef(["user", "admin"]);

  const confirms = useRef([true, false]);

  const avatarRef = useRef();

  const thumbRef = useRef();

  const handleOnChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleValidate = () => {
    if (error.inputName.length > 0) {
      setError({ inputName: [], message: [] });
    }
    let hasErrors = false;

    const keys = Object.keys(formData).filter(
      (key) =>
        key !== "role" &&
        key !== "confirmed" &&
        key !== "image" &&
        key !== "banner",
    );

    keys.forEach((key) => {
      if (formData[key] === "") {
        setError((prev) => ({
          inputName: [...prev.inputName, key],
          message: [...prev.message, "Không được để trống"],
        }));
        hasErrors = true;
      }
    });

    const emailRegex = new RegExp(
      "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$",
    );

    if (!emailRegex.test(formData.email)) {
      setError((prev) => ({
        inputName: [...prev.inputName, "email"],
        message: [...prev.message, "Không đúng định dạng"],
      }));
      hasErrors = true;
    }

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
        key !== "role" &&
        key !== "confirmed" &&
        key !== "avatar" &&
        key !== "password" &&
        key !== "banner",
    );
    keys.forEach((key) => {
      if (formData[key] === "") {
        setError((prev) => ({
          inputName: [...prev.inputName, key],
          message: [...prev.message, "Không được để trống"],
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
      if (key === "image") {
        data.append(key, formData[key], avaName);
      } else if (key === "banner") {
        data.append(key, formData[key], bannerName);
      } else {
        data.append(key, formData[key]);
      }
    }

    for (const item of data) {
      console.log(item);
    }

    await createData(
      "user",
      data,
      "user",
      () => {
        setFormData(initForm);
        setPreviewAva("");
        setAvaName("");
        setPreviewBanner("");
        setBannerName("");
      },
      undefined,
      setNotifyMessage,
    );
  };

  const update = async () => {
    const error = handleValidateUpdate();

    if (error) {
      return;
    }

    let finalData = {
      name: formData.name,
      password: formData.password,
      role: formData.role,
      confirmed: formData.confirmed,
    };
    for (const key in finalData) {
      if (userData.data.hasOwnProperty(key)) {
        if (userData.data[key] === finalData[key]) {
          delete finalData[key];
        }
      }
    }

    if (id && finalData.password === "") {
      delete finalData.password;
    }

    if (formData.image) {
      finalData.image = formData.image;
    }

    if (formData.banner) {
      finalData.banner = formData.banner;
    }

    if (Object.keys(finalData).length === 0) {
      alert("Không có gì thay đổi");
      return;
    }

    let data = new FormData();
    for (const key in finalData) {
      if (key === "image") {
        data.append(key, finalData[key], avaName);
      } else if (key === "banner") {
        data.append(key, finalData[key], bannerName);
      } else {
        data.append(key, finalData[key]);
      }
    }

    await updateData(
      "user",
      id,
      data,
      "user",
      () => {
        refetch();
      },
      undefined,
      setNotifyMessage,
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
    if (userData) {
      setFormData({
        name: userData.data.name,
        email: userData.data.email,
        password: "",
        role: userData.data.role,
        confirmed: userData.data.confirmed,
      });
      setPreviewAva(
        `${import.meta.env.VITE_BASE_API_URI}${
          import.meta.env.VITE_VIEW_AVA_API
        }${userData.data.avatar}`,
      );
      setPreviewBanner(
        `${import.meta.env.VITE_BASE_API_URI}${
          import.meta.env.VITE_VIEW_AVA_API
        }${userData.data.banner}`,
      );
    }

    return () => {
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "user",
        confirmed: false,
      });
      setPreviewAva("");
    };
  }, [userData]);

  useEffect(() => {
    return () => {
      queryClient.clear();
    };
  }, []);

  return (
    <div className='w-full'>
      <header
        className='py-[16px] 
      '
      >
        <h2 className='text-[28px] leading-[44px] font-[500]'>Users</h2>
      </header>

      <form
        noValidate
        onSubmit={handleSubmit}
        className='flex items-center flex-wrap mb-[36px]'
      >
        <div
          className={`w-full pt-[16.12%] h-0 relative rounded-[12px] overflow-hidden
             ${!previewBanner && "border-[2px] border-dashed cursor-pointer"}`}
          style={{
            backgroundImage: `url('${previewBanner}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          onClick={() => {
            setIsShowing(
              <ImageCropper
                minWidth={1284}
                minHeight={208}
                aspectRatio={1284 / 208}
                setPreview={(url) => {
                  setPreviewBanner(url);
                }}
                setFileName={(name) => {
                  setBannerName(name);
                }}
                setData={(file) => {
                  setFormData((prev) => ({
                    ...prev,
                    banner: file,
                  }));
                }}
              />,
            );
          }}
        >
          {!previewBanner && (
            <div className='absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[18px] xsm:w-[24px] sm:w-[36px] lg:w-[48px]'>
              <PlusIcon />
            </div>
          )}
        </div>
        <div className='flex flex-col sm:flex-row gap-[32px] xl:gap-[48px] mt-[16px]'>
          <div
            className='size-[72px] 2xsm:size-[120px] 2md:size-[160px] cursor-pointer'
            onClick={() => {
              setIsShowing(
                <ImageCropper
                  minWidth={160}
                  minHeight={160}
                  setPreview={(url) => {
                    setPreviewAva(url);
                  }}
                  setFileName={(name) => {
                    setAvaName(name);
                  }}
                  setData={(file) => {
                    setFormData((prev) => ({
                      ...prev,
                      image: file,
                    }));
                  }}
                />,
              );
            }}
          >
            {previewAva ? (
              <img src={previewAva} alt='avatar' className='rounded-[50%]' />
            ) : (
              <div
                className='size-full rounded-[50%]
            overflow-hidden border-[2px] border-dashed flex items-center justify-center'
              >
                <div className='w-[18px] xsm:w-[24px] sm:w-[36px] lg:w-[48px]'>
                  <PlusIcon size={48} />
                </div>
              </div>
            )}
          </div>
          <div className='flex-1 flex flex-wrap gap-[16px] mt-[28px]'>
            {/* name */}
            <div className='basis-[100%]  md:basis-[45%] xl:basis-[30%] mr-[16px]'>
              <Input
                id={"name"}
                type={"text"}
                label={"User name"}
                value={formData.name}
                defaultValue={userData?.data?.name}
                handleOnChange={handleOnChange}
                error={
                  error.inputName.includes("name")
                    ? `${error.message[error.inputName.indexOf("name")]}`
                    : ""
                }
              />
            </div>

            <div className='basis-[100%] md:basis-[45%] xl:basis-[30%] mr-[16px] '>
              <Input
                id={"email"}
                type={"email"}
                label={"Email"}
                value={formData.email}
                defaultValue={userData?.data?.email}
                handleOnChange={handleOnChange}
                error={
                  error.inputName.includes("email")
                    ? `${error.message[error.inputName.indexOf("email")]}`
                    : ""
                }
                readOnly={id !== undefined}
              />
            </div>

            <div className='basis-[100%]  md:basis-[45%] xl:basis-[30%] mr-[16px] '>
              <Input
                id={"password"}
                type={"password"}
                label={"Password"}
                value={formData.password}
                defaultValue={userData?.data?.password}
                handleOnChange={handleOnChange}
                error={
                  error.inputName.includes("password")
                    ? `${error.message[error.inputName.indexOf("password")]}`
                    : ""
                }
                readOnly={id !== undefined}
              />
            </div>

            {/* Role */}
            <div className='basis-[100%]  md:basis-[45%] xl:basis-[30%]  mr-[16px]  z-[100]'>
              <DropDown
                list={roles.current}
                title={"Role"}
                value={formData.role}
                handleOnClick={(role) => {
                  setFormData((prev) => ({ ...prev, role }));
                }}
              />
            </div>
            {/* Confirm */}
            <div className='basis-[100%] md:basis-[45%] xl:basis-[30%] mr-[16px]'>
              <DropDown
                list={confirms.current}
                title={"Confirm"}
                value={formData.confirmed}
                handleOnClick={(confirmed) => {
                  setFormData((prev) => ({ ...prev, confirmed }));
                }}
              />
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
export default UpsertUser;
