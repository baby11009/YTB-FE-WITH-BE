import {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import {
  PlusIcon,
  LongArrowIcon,
  ThinArrowIcon,
} from "../../../../Assets/Icons";
import { Input, DropDown, ImageCropper, TextArea } from "../../../../Component";
import { createData, updateData } from "../../../../Api/controller";
import { getDataWithAuth } from "../../../../Api/getData";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../../../Auth Provider/authContext";
import { isEmpty, notmatchTheRegex } from "../../../../util/validateFunc";

const initForm = {
  name: "",
  email: "",
  password: "",
  role: "user",
  description: "",
  confirmed: false,
};

const UpsertUser = () => {
  const navigate = useNavigate();

  const { setIsShowing, addToaster } = useAuthContext();

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

  const [realTimeErrs, setRealTimeErrs] = useState({});

  const [submitErrs, setSubmitErrs] = useState({});

  const roles = useRef([
    { id: "user", label: "User" },
    { id: "admin", label: "Admin" },
  ]);

  const confirms = useRef([
    { id: "true", label: "True" },
    { id: "false", label: "False" },
  ]);

  const handleOnChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  const handleValidate = () => {
    const notValidatedValues = [];

    const keys = Object.keys(formData).filter(
      (key) =>
        key !== "role" &&
        key !== "confirmed" &&
        key !== "image" &&
        key !== "banner",
    );

    const validateFormValueFuncs = {
      name: (name) => {
        let err = isEmpty("name", name, setSubmitErrs);
        return err;
      },
      email: (email) => {
        let err = isEmpty("email", email, setSubmitErrs);

        if (!err) {
          const emailRegex = new RegExp(
            "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$",
          );
          err = notmatchTheRegex("email", email, emailRegex, setSubmitErrs);
        }

        return err;
      },
      password: (password) => {
        let err = isEmpty("password", password, setSubmitErrs);

        return err;
      },
    };

    keys.forEach((key) => {
      if (
        validateFormValueFuncs[key] &&
        validateFormValueFuncs[key](formData[key])
      ) {
        notValidatedValues.push(key);
      }
    });

    return notValidatedValues.length > 0;
  };

  const handleValidateUpdate = () => {
    const notValidatedValues = [];

    const keys = Object.keys(formData).filter(
      (key) =>
        key !== "role" &&
        key !== "confirmed" &&
        key !== "avatar" &&
        key !== "password" &&
        key !== "banner",
    );

    const validateFormValueFuncs = {
      name: (name) => {
        let err = isEmpty("name", name, setSubmitErrs);
        return err;
      },
      email: (email) => {
        let err = isEmpty("email", email, setSubmitErrs);

        if (!err) {
          const emailRegex = new RegExp(
            "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$",
          );
          err = notmatchTheRegex("email", email, emailRegex, setSubmitErrs);
        }
        return err;
      },
    };
    keys.forEach((key) => {
      if (
        validateFormValueFuncs[key] &&
        validateFormValueFuncs[key](formData[key])
      ) {
        notValidatedValues.push(key);
      }
    });

    return notValidatedValues.length > 0;
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
      addToaster,
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
      description: formData.description,
    };

    for (const key in finalData) {
      if (userData.data.hasOwnProperty(key)) {
        if (userData.data[key] == finalData[key]) {
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

    await updateData(
      "user",
      id,
      data,
      "user",
      () => {
        refetch();
      },
      undefined,
      addToaster,
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
    if (submitErrs) {
      timeOut = setTimeout(() => {
        setSubmitErrs({});
      }, 2500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [submitErrs]);

  useLayoutEffect(() => {
    if (userData) {
      setFormData({
        name: userData.data.name,
        email: userData.data.email,
        password: "",
        role: userData.data.role,
        confirmed: userData.data.confirmed,
        description: userData.data.description,
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
    <div className='max-w-[1284px] mx-auto relative'>
      <div className=' sticky top-[56px]  py-[8px] bg-black z-[10] flex items-center'>
        <h1 className='text-[25px] leading-[32px] font-[500] flex-1'>Users</h1>
        <button
          className='flex-shrink-0 size-[40px] rounded-[50%] hover:bg-black-0.1 p-[8px]'
          onClick={() => {
            navigate(-1);
          }}
        >
          <div className='w-[24px]'>
            <LongArrowIcon />
          </div>
        </button>
      </div>

      <form
        noValidate
        onSubmit={handleSubmit}
        className='flex items-center flex-wrap mb-[36px] relative z-[2] flex-1 overflow-auto scrollbar-3'
      >
        <div
          className={` pt-[16.12%] w-full h-0 relative rounded-[12px] overflow-hidden
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
                minWidth={2560}
                minHeight={1440}
                aspectRatio={16 / 9}
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
        <div className='w-full flex flex-col sm:flex-row gap-[32px] xl:gap-[48px] mt-[16px]'>
          <div
            className='size-[72px] 2xsm:size-[120px] 2md:size-[160px] cursor-pointer flex-shrink-0'
            onClick={() => {
              setIsShowing(
                <ImageCropper
                  minWidth={800}
                  minHeight={800}
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
            <div className='flex-[1_0_200px] min-w-[200px] mr-[16px]'>
              <Input
                id={"name"}
                type={"text"}
                label={"User name"}
                value={formData.name}
                defaultValue={userData?.data?.name}
                handleOnChange={handleOnChange}
                error={submitErrs["name"] ? submitErrs["name"] : ""}
              />
            </div>

            <div className='flex-[1_0_200px] min-w-[200px] mr-[16px] '>
              <Input
                id={"email"}
                type={"email"}
                label={"Email"}
                value={formData.email}
                defaultValue={userData?.data?.email}
                handleOnChange={handleOnChange}
                error={submitErrs["email"] ? submitErrs["email"] : ""}
                readOnly={id !== undefined}
              />
            </div>

            <div className='flex-[1_0_200px] min-w-[200px] mr-[16px] '>
              <Input
                id={"password"}
                type={"password"}
                label={"Password"}
                value={formData.password}
                defaultValue={userData?.data?.password}
                handleOnChange={handleOnChange}
                error={submitErrs["password"] ? submitErrs["password"] : ""}
              />
            </div>
          </div>
        </div>

        <div className='w-full mt-[16px] flex gap-[16px] flex-wrap'>
          <div className='flex-[1_1_500px] '>
            <TextArea
              title={"Description"}
              name={"description"}
              value={formData.description}
              defaultValue={userData?.data.description}
              handleOnChange={handleOnChange}
              handleSetRealTimeErr={handleSetRealTimeErr}
              handleRemoveRealTimeErr={handleRemoveRealTimeErr}
              errMsg={submitErrs["description"] ? description : ""}
              placeholder={"Enter video description"}
            />
          </div>
          <div className='flex-[1_0_30%] lg:flex-[1_0_0%] xl:max-w-[360px]  flex flex-wrap gap-[16px] '>
            {/* Role */}
            <div className='flex-[1_1_250px] '>
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
            <div className='flex-[1_1_250px]'>
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
          <button
            type='submit'
            className='w-full max-w-[160px] btn1 relative'
            disabled={Object.keys(realTimeErrs).length > 0 ? true : false}
          >
            <span className='z-[50] relative'>Submit</span>
          </button>
        </div>
      </form>
    </div>
  );
};
export default UpsertUser;
