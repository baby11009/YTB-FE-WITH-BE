import { useAuthContext } from "../../../../Auth Provider/authContext";
import { Input, ImageCropper, TextArea } from "../../../../Component";
import { useState, useLayoutEffect, useEffect, useCallback } from "react";
import { PlusIcon } from "../../../../Assets/Icons";
import { updateData } from "../../../../Api/controller";

const initForm = {
  name: "",
  password: "",
  email: "",
  confirm: "",
  description: "",
};

const ChannelSetting = () => {
  const { setIsShowing, user, setRefetch, setNotifyMessage } = useAuthContext();

  const [formData, setFormData] = useState(initForm);

  const [submitLoading, setSubmitLoading] = useState(false);

  const [previewAva, setPreviewAva] = useState("");

  const [avaName, setAvaName] = useState("");

  const [previewBanner, setPreviewBanner] = useState("");

  const [bannerName, setBannerName] = useState("");

  const [error, setError] = useState({
    inputName: [],
    message: [],
  });

  const handleOnChange = useCallback((name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleValidateUpdate = useCallback(
    (formData) => {
      if (error.inputName.length > 0) {
        setError({ inputName: [], message: [] });
      }
      let hasErrors = false;
      const keys = Object.keys(formData).filter(
        (key) =>
          key !== "avatar" &&
          key !== "banner" &&
          key !== "password" &&
          key !== "confirm" &&
          key !== "description",
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

      if (
        (formData.password || formData.confirm) &&
        formData.password !== formData.confirm
      ) {
        setError((prev) => ({
          inputName: [...prev.inputName, "confirm"],
          message: [...prev.message, "Mật khẩu xác nhận không đúng"],
        }));
        hasErrors = true;
      }
      if (hasErrors) {
        return true;
      }
    },
    [error],
  );

  const update = useCallback(
    async (formData, user) => {
      const error = handleValidateUpdate(formData);

      if (error) {
        return;
      }

      let finalData = {
        name: formData.name,
        password: formData.password,
        description: formData.description,
      };

      for (const key in finalData) {
        if (user.hasOwnProperty(key)) {
          if (user[key] === finalData[key]) {
            delete finalData[key];
          }
        }
      }

      if (finalData.password === "") {
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
      console.log(finalData);
      await updateData(
        "/client/user/me",
        undefined,
        data,
        "user",
        () => {
          setRefetch(true);
        },
        undefined,
        setNotifyMessage,
      );
    },
    [error],
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      setSubmitLoading(true);

      await update(formData, user);

      setSubmitLoading(false);
    },
    [error, formData, user],
  );

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
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user?.name,
        email: user?.email,
        description: user?.description,
      }));
      setPreviewAva(
        `${import.meta.env.VITE_BASE_API_URI}${
          import.meta.env.VITE_VIEW_AVA_API
        }${user.avatar}`,
      );
      setPreviewBanner(
        `${import.meta.env.VITE_BASE_API_URI}${
          import.meta.env.VITE_VIEW_AVA_API
        }${user.banner}`,
      );
    }

    return () => {
      setFormData(initForm);
      setPreviewAva("");
    };
  }, [user]);

  return (
    <div>
      <div className='bg-black'>
        <h1 className='pt-[24px] text-nowrap text-[25px] leading-[32px] font-[600]'>
          Channel's setting
        </h1>
        <div className='pt-[24px]'>
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
                <div className='absolute top-[50%] left-[50%] translate-x-[-50%]  translate-y-[-50%]'>
                  <PlusIcon size={48} />
                </div>
              )}
            </div>

            <div className='w-full flex flex-col sm:flex-row sm:gap-[32px] mt-[16px]'>
              <div
                className='size-[72px] min-w-[72px] min-h-[72px] 
                  2xsm:size-[120px]  2xsm:min-w-[120px] 2xsm:min-h-[120px]
                  2md:size-[160px]  2md:min-w-[160px] 2md:min-h-[160px] cursor-pointer'
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
                  <img
                    src={previewAva}
                    alt='avatar'
                    className='size-full rounded-[50%] object-cover object-center'
                  />
                ) : (
                  <div
                    className='size-full rounded-[50%]
                         overflow-hidden border-[2px] border-dashed flex items-center justify-center'
                  >
                    <PlusIcon size={48} />
                  </div>
                )}
              </div>
              <div className='flex-1 flex flex-col mt-[16px]'>
                {/* name */}
                <div className='basis-[100%]  mr-[16px] mt-[16px] '>
                  <Input
                    id={"name"}
                    type={"text"}
                    label={"User name"}
                    value={formData.name}
                    defaultValue={user?.name}
                    handleOnChange={handleOnChange}
                    error={
                      error.inputName.includes("name")
                        ? `${error.message[error.inputName.indexOf("name")]}`
                        : ""
                    }
                  />
                </div>

                <div className='basis-[100%]   mr-[16px] mt-[16px] '>
                  <Input
                    id={"email"}
                    type={"email"}
                    label={"Email"}
                    value={formData.email}
                    defaultValue={user?.email}
                    handleOnChange={handleOnChange}
                    error={
                      error.inputName.includes("email")
                        ? `${error.message[error.inputName.indexOf("email")]}`
                        : ""
                    }
                    readOnly={true}
                  />
                </div>
              </div>
              <div className='flex-1 flex flex-col sm:mt-[16px]'>
                <div className='basis-[100%]  mr-[16px] mt-[16px]'>
                  <Input
                    id={"password"}
                    type={"password"}
                    label={"Password"}
                    value={formData.password}
                    handleOnChange={handleOnChange}
                    error={
                      error.inputName.includes("password")
                        ? `${
                            error.message[error.inputName.indexOf("password")]
                          }`
                        : ""
                    }
                  />
                </div>
                <div className='basis-[100%] mr-[16px] mt-[16px] '>
                  <Input
                    id={"confirm"}
                    type={"password"}
                    label={"Confirm Password"}
                    value={formData.confirm}
                    handleOnChange={handleOnChange}
                    error={
                      error.inputName.includes("confirm")
                        ? `${error.message[error.inputName.indexOf("confirm")]}`
                        : ""
                    }
                  />
                </div>
              </div>
            </div>

            <div className='w-full mt-[16px]'>
              <TextArea
                title={"Description"}
                name={"description"}
                value={formData.description}
                defaultValue={user?.description}
                handleOnChange={handleOnChange}
                errMsg={
                  error.inputName?.includes("description")
                    ? error.message[error.inputName?.indexOf("description")]
                    : ""
                }
                placeholder={"Enter video description"}
              />
            </div>

            <div className='basis-[100%] order-7 flex items-center justify-center mt-[50px]'>
              <button
                type='submit'
                className='w-full max-w-[160px] btn1 relative'
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
export default ChannelSetting;
