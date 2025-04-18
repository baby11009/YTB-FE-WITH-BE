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
  UploadImageIcon,
} from "../../../../Assets/Icons";
import { Input, DropDown, ImageCropper, TextArea } from "../../../../Component";
import { createData, updateData } from "../../../../Api/controller";
import { getData } from "../../../../Api/getData";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../../../Auth Provider/authContext";
import {
  isEmpty,
  notmatchTheRegex,
  minMaxLength,
} from "../../../../util/validateFunc";
import { isObjectEmpty } from "../../../../util/func";

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

  const { data: userData, refetch } = getData(
    `/admin/user/${id}`,
    {},
    id !== undefined,
    false,
  );

  const [formData, setFormData] = useState(initForm);

  const [previewAva, setPreviewAva] = useState("");

  const [previewBanner, setPreviewBanner] = useState("");

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
    const { role, confirmed, avatar, banner, ...neededVaildateFields } =
      formData;

    const fieldEntries = Object.entries(neededVaildateFields);

    const validateFormValueFuncs = {
      name: (name) => {
        let error = isEmpty("name", name, "User name cannot be empty");
        if (!error) {
          error = minMaxLength("name", name, 20);
        }
        return error;
      },
      email: (email) => {
        let error = isEmpty("email", email, "User email cannot be empty");

        if (!error) {
          const emailRegex = new RegExp(
            "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$",
          );
          error = notmatchTheRegex(
            "email",
            email,
            emailRegex,
            "Email is invalid",
          );
        }

        return error;
      },
      password: (password) => {
        const error = isEmpty("password", password, "Password cannot be empty");

        return error;
      },
    };

    const errors = fieldEntries.reduce((acc, [key, value]) => {
      const err = validateFormValueFuncs[key](value) || undefined;
      if (err) {
        acc = { ...acc, ...err };
      }

      return acc;
    }, {});

    const isValid = isObjectEmpty(errors);

    if (!isValid) {
      setSubmitErrs(errors);
    }

    return isValid;
  };

  const create = async () => {
    const isValid = handleValidate();

    if (!isValid) {
      return;
    }

    let data = new FormData();

    for (const key in formData) {
      data.append(key, formData[key]);
    }

    await createData(
      "/admin/user",
      data,
      "user",
      () => {
        setFormData(initForm);
        setPreviewAva("");
        setPreviewBanner("");
      },
      undefined,
      addToaster,
    );
  };

  const update = async () => {
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

    if (finalData.password === "") {
      delete finalData.password;
    }

    if (formData.avatar) {
      finalData.avatar = formData.avatar;
    }

    if (formData.banner) {
      finalData.banner = formData.banner;
    }

    if (Object.keys(finalData).length === 0) {
      alert("Nothing changed");
      return;
    }

    const data = new FormData();

    for (const key in finalData) {
      data.append(key, finalData[key]);
    }

    await updateData(
      "/admin/user",
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
    <div className='max-w-[1500px] mx-auto md:px-[16px]'>
      <div className=' sticky top-[56px]  py-[8px] bg-black z-[10] flex items-center'>
        <h1 className='text-[28px] leading-[44px] font-[500] flex-1'>Users</h1>
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
          className={`aspect-[2560/423] w-full min-h-[75px] relative rounded-[8px] overflow-hidden
          bg-cover bg-center bg-no-repeat cursor-pointer mb-[32px]
          ${
            !previewBanner &&
            "border-[2px] border-gray-A hover:border-white transition-[border] ease-in duration-150 group"
          }`}
          style={{
            backgroundImage: `url('${previewBanner}')`,
          }}
          onClick={() => {
            setIsShowing(
              <ImageCropper
                minWidth={2560}
                minHeight={423}
                aspectRatio={2560 / 423}
                setPreview={(url) => {
                  setPreviewBanner(url);
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
            <div
              className='absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[36px] lg:w-[48px]
               text-gray-A group-hover:text-white transition-[color] ease-in duration-150'
            >
              <UploadImageIcon />
            </div>
          )}
        </div>
        <div className='w-full flex flex-col sm:flex-row gap-x-[32px]'>
          <div
            className={`size-[80px] md:size-[120px] lg:size-[160px] cursor-pointer flex-shrink-0 rounded-[50%] 
            flex items-center justify-center bg-cover bg-center bg-no-repeat mb-[32px]
            ${
              !previewAva &&
              "border-[2px] border-gray-A hover:border-white transition-[border] ease-in duration-150 group"
            }`}
            style={{
              backgroundImage: `url('${previewAva}')`,
            }}
            onClick={() => {
              setIsShowing(
                <ImageCropper
                  minWidth={800}
                  minHeight={800}
                  setPreview={(url) => {
                    setPreviewAva(url);
                  }}

                  setData={(file) => {
                    setFormData((prev) => ({
                      ...prev,
                      avatar: file,
                    }));
                  }}
                />,
              );
            }}
          >
            {!previewAva && (
              <div
                className='w-[36px] lg:w-[48px] text-gray-A group-hover:text-white
                transition-[color] ease-in duration-150'
              >
                <UploadImageIcon />
              </div>
            )}
          </div>
          <div className='flex-1 flex flex-wrap gap-x-[16px]'>
            {/* name */}
            <div className='flex-[1_0_200px] min-w-[200px]'>
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

            <div className='flex-[1_0_200px] min-w-[200px] '>
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

            <div className='flex-[1_0_200px] min-w-[200px] '>
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

        <div className='w-full flex gap-x-[16px] flex-wrap'>
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
          <div className='flex-[1_0_30%] lg:flex-[1_0_0%] xl:max-w-[360px]  flex flex-wrap gap-[32px] '>
            {/* Role */}
            <div className='flex-[1_1_250px] h-fit'>
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
            <div className='flex-[1_1_250px] h-fit'>
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
