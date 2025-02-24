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
  const { setIsShowing, user, setRefetch, addToaster } = useAuthContext();

  const [formData, setFormData] = useState(initForm);

  const [submitLoading, setSubmitLoading] = useState(false);

  const [previewAva, setPreviewAva] = useState("");

  const [avaName, setAvaName] = useState("");

  const [previewBanner, setPreviewBanner] = useState("");

  const [bannerName, setBannerName] = useState("");

  const [realTimeErrs, setRealTimeErrs] = useState({});

  const [submitErrs, setSubmitErrs] = useState({
    inputName: [],
    message: [],
  });

  const handleOnChange = useCallback((name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const handleValidateUpdate = (formData) => {
    if (Object.keys(submitErrs).length > 0) {
      setSubmitErrs({ inputName: [], message: [] });
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
        setSubmitErrs((prev) => ({ ...prev, [key]: "Cannot be empty" }));
        hasErrors = true;
      }
    });

    if (
      (formData.password || formData.confirm) &&
      formData.password !== formData.confirm
    ) {
      setSubmitErrs((prev) => ({
        ...prev,
        confirm: "Password confirmation is not matching",
      }));
      hasErrors = true;
    }
    if (hasErrors) {
      return true;
    }
  };

  const update = async (formData, user) => {
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
      alert("Nothing changed");
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
      addToaster,
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitLoading(true);

    await update(formData, user);

    setSubmitLoading(false);
  };
  
  useEffect(() => {
    let timeOut;
    if (Object.keys(submitErrs).length > 0) {
      timeOut = setTimeout(() => {
        setSubmitErrs({
          inputName: [],
          message: [],
        });
      }, 2500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [submitErrs]);

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
        <h2 className='pt-[24px] text-nowrap text-[25px] leading-[32px] font-[600]'>
          Channel's setting
        </h2>
        <div className='pt-[24px] max-h-[calc(100vh-110px)] overflow-auto scrollbar-3'>
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
                    error={submitErrs["name"] ? submitErrs["name"] : ""}
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
                    error={submitErrs["email"] ? submitErrs["email"] : ""}
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
                    error={submitErrs["password"] ? submitErrs["password"] : ""}
                  />
                </div>
                <div className='basis-[100%] mr-[16px] mt-[16px] '>
                  <Input
                    id={"confirm"}
                    type={"password"}
                    label={"Confirm Password"}
                    value={formData.confirm}
                    handleOnChange={handleOnChange}
                    error={submitErrs["confirm"] ? submitErrs["confirm"] : ""}
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
                handleRemoveRealTimeErr={handleRemoveRealTimeErr}
                handleSetRealTimeErr={handleSetRealTimeErr}
                errMsg={
                  submitErrs["description"] ? submitErrs["description"] : ""
                }
                placeholder={"Enter video description"}
              />
            </div>

            <div className='basis-[100%] order-7 flex items-center justify-center mt-[50px]'>
              <button
                type='submit'
                className='w-full max-w-[160px] btn1 relative'
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
export default ChannelSetting;
