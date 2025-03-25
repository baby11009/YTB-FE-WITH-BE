import { getData } from "../../../../Api/getData";
import { useQueryClient } from "@tanstack/react-query";
import {
  DropDown,
  InfiniteDropDown,
  DisableDropDown,
  TextArea,
} from "../../../../Component";
import {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
} from "react";
import { createData, updateData } from "../../../../Api/controller";
import { isEmpty } from "../../../../util/validateFunc";
import { isObjectEmpty } from "../../../../util/func";
import { HovUserCard } from "../../../../Component";

const initForm = {
  userId: "",
  email: "",
  title: "",
  privacy: "public",
};

const userQueriesInit = {
  search: {},
  limit: 10,
  page: 1,
  clearCache: "user",
};

const PlaylistDetails = ({ id, playlistData, setQueries, addToaster }) => {
  const queryClient = useQueryClient();

  const [userQueries, setUserQueries] = useState(userQueriesInit);

  const [userOpened, setUserOpened] = useState(false);

  const [formData, setFormData] = useState(initForm);

  const [realTimeErrs, setRealTimeErrs] = useState({});

  const [submitErrs, setSubmitErrs] = useState({});

  const privacy = useRef([
    { id: "public", label: "Public" },
    { id: "private", label: "Private" },
  ]);

  const {
    data: usersData,
    isLoading: userIsLoading,
    error: userError,
  } = getData("/admin/user", userQueries, userOpened, false);

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
    const { email, videoIdList, privacy, ...neededValidateFields } = formData;

    const fieldEntries = Object.entries(neededValidateFields);

    const validateFormValueFuncs = {
      userId: (userId) => {
        return isEmpty("userId", userId, "User not picked yet");
      },
      title: (title) => {
        return isEmpty("title", title, "Video title cannot be empty");
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

  const handleValidateUpdate = () => {
    const { userId, email, privacy, videoIdList, ...neededValidateFields } =
      formData;

    const fieldEntries = Object.entries(neededValidateFields);

    const validateFormValueFuncs = {
      title: (title) => {
        return isEmpty("title", title, "Video title cannot be empty");
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

    const { email, ...finalFormData } = formData;

    await createData(
      "/admin/playlist",
      finalFormData,
      "playlist",
      () => {
        setFormData(initForm);
      },
      undefined,
      addToaster,
    );
  };

  const update = async () => {
    const isValid = handleValidateUpdate();

    if (!isValid) {
      return;
    }

    const { email, userId, ...finalFormData } = formData;

    for (const key in finalFormData) {
      if (finalFormData[key] === playlistData[key]) {
        delete finalFormData[key];
      }
    }

    if (isObjectEmpty(finalFormData)) {
      alert("Nothing changed");
      return;
    }

    await updateData(
      "/admin/playlist",
      id,
      finalFormData,
      "playlist",
      () => {
        setQueries((prev) => ({ ...prev, page: 1 }));
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
    if (playlistData) {
      const data = {
        userId: playlistData.user_info._id,
        email: playlistData.user_info.email,
        title: playlistData.title,
      };

      if (playlistData.type === "playlist") {
        data.privacy = playlistData.privacy;
      }
      setFormData(data);
    }

    return () => {
      setFormData(initForm);
    };
  }, [playlistData]);

  useEffect(() => {
    if (!userOpened) {
      queryClient.removeQueries({ queryKey: Object.values(userQueries) });
    }
  }, [userOpened, userQueries]);

  return (
    <form noValidate onSubmit={handleSubmit} className='my-[28px]'>
      <div className='grid grid-cols-1 2md:grid-cols-2 gap-x-[16px]'>
        <TextArea
          title={"Title"}
          name={"title"}
          preventCharactersList={new Set(["Enter"])}
          value={formData.title}
          defaultValue={playlistData?.title}
          handleOnChange={handleOnChange}
          maxLength={155}
          handleSetRealTimeErr={handleSetRealTimeErr}
          handleRemoveRealTimeErr={handleRemoveRealTimeErr}
          errMsg={submitErrs["title"] ? submitErrs["title"] : ""}
          placeholder={"Enter playlist title"}
        />

        <div className='grid grid-cols-1 2xsm:grid-cols-2 gap-x-[16px]'>
          {/* User */}
          {!playlistData ? (
            <InfiniteDropDown
              prsRemoveValue={userQueriesInit.clearCache}
              title={"User"}
              value={formData.email || "Not picked"}
              setIsOpened={setUserOpened}
              list={usersData?.data}
              isLoading={userIsLoading}
              fetchingError={userError?.response?.data?.msg}
              validateError={submitErrs["userId"] ? submitErrs["userId"] : ""}
              displayData={"email"}
              handleSetQueries={(value, pageInc) => {
                setUserQueries((prev) => {
                  const prevClone = {
                    ...prev,
                  };

                  if (value !== undefined) {
                    prevClone.search["email"] = value;
                    prevClone.page = 1;
                  }

                  if (pageInc !== undefined) {
                    prevClone.page = prevClone.page + pageInc;
                  }

                  return prevClone;
                });
              }}
              handleSetCurr={(data) => {
                setFormData((prev) => ({
                  ...prev,
                  userId: data?._id,
                  email: data?.email,
                }));
              }}
              HoverCard={HovUserCard}
            />
          ) : (
            <DisableDropDown title={"User"} value={formData.email} />
          )}

          {/* Privacy */}

          <DropDown
            list={privacy.current}
            title={"Privacy"}
            value={formData.privacy || ""}
            handleOnClick={(privacy) => {
              setFormData((prev) => ({ ...prev, privacy }));
            }}
          />
        </div>
      </div>

      <div className='flex items-center justify-center mt-[20px]    '>
        <button type='submit' className='w-full max-w-[160px] btn1 relative'>
          <span className='z-[50] relative'>Submit</span>
        </button>
      </div>
    </form>
  );
};
export default PlaylistDetails;
