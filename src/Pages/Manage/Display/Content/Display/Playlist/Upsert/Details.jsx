import { TextArea, DropDown } from "../../../../../../../Component";
import {
  useCallback,
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
} from "react";
import { updateData } from "../../../../../../../Api/controller";
import { useAuthContext } from "../../../../../../../Auth Provider/authContext";

const init = {
  title: "",
  privacy: "public",
};

const Details = ({ playlistData, refetch }) => {
  const { addToaster } = useAuthContext();

  const [formData, setFormData] = useState(init);

  const [isLoading, setIsLoading] = useState(false);

  const [realTimeErrs, setRealTimeErrs] = useState({});

  const [submitErrs, setSubmitErrs] = useState({});

  const privacyRef = useRef([
    { id: "public", label: "Public" },
    { id: "private", label: "Private" },
  ]);

  const handleOnChange = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [`${name}`]: value }));
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

  const handleValidateUpdate = useCallback(
    (formData) => {
      if (Object.keys(submitErrs).length > 0) {
        setSubmitErrs({});
      }

      let hasErrors = false;

      const keys = Object.keys(formData);

      keys.forEach((key) => {
        if (formData[key] === "" || !formData[key]) {
          let errMsg = "Cannot be empty";
          setSubmitErrs((prev) => ({ ...prev, [key]: errMsg }));
          hasErrors = true;
        }
      });

      if (hasErrors) {
        return true;
      }
    },
    [submitErrs],
  );

  const update = useCallback(
    async (formData, playlistData) => {
      const error = handleValidateUpdate(formData);

      if (error) {
        return;
      }

      let finalData = structuredClone(formData);

      for (const key in finalData) {
        if (
          playlistData?.hasOwnProperty(key) &&
          playlistData[key] === finalData[key]
        ) {
          delete finalData[key];
        }
      }

      if (Object.keys(finalData).length === 0) {
        alert("Không có gì thay đổi");
        return;
      }

      await updateData(
        "/client/playlist",
        playlistData?._id,
        finalData,
        "playlist",
        () => {
          refetch();
        },
        undefined,
        addToaster,
      );
    },
    [submitErrs],
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoading(true);

      await update(formData, playlistData);

      setIsLoading(false);
    },
    [submitErrs, formData, playlistData],
  );

  useLayoutEffect(() => {
    if (playlistData) {
      setFormData({
        title: playlistData?.title,
        privacy: playlistData?.privacy,
      });
    }

    return () => {
      setFormData(init);
    };
  }, [playlistData]);

  useEffect(() => {
    let timeOut;
    if (Object.keys(submitErrs).length > 0) {
      timeOut = setTimeout(() => {
        setSubmitErrs({});
      }, 2500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [submitErrs]);

  return (
    <div className='overflow-hidden'>
      <form
        noValidate
        onSubmit={handleSubmit}
        className='w-full overflow-hidden'
      >
        <div className='overflow-auto pb-[8px] scrollbar-3'>
          <div className=' mt-[48px] w-[1000px] flex'>
            <div className='w-[700px] overflow-hidden'>
              <TextArea
                maxLength={150}
                title={"Title"}
                name={"title"}
                value={formData.title}
                defaultValue={playlistData?.title}
                handleOnChange={handleOnChange}
                handleSetRealTimeErr={handleSetRealTimeErr}
                handleRemoveRealTimeErr={handleRemoveRealTimeErr}
                errMsg={submitErrs["title"] ? submitErrs["title"] : ""}
                placeholder={"Enter playlist title..."}
              />
            </div>
            {/* Type*/}
            <div className='z-[90] pl-[24px]'>
              <DropDown
                list={privacyRef.current}
                title={"Visibility"}
                value={formData.privacy}
                handleOnClick={(privacy) => {
                  setFormData((prev) => ({ ...prev, privacy }));
                }}
              />
            </div>
          </div>
        </div>

        <div className='flex items-center justify-center pt-[40px] pb-[60px]'>
          <button
            type='submit'
            className='w-full max-w-[160px] btn1 relative'
            disabled={Object.keys(realTimeErrs).length > 0 ? true : false}
          >
            {isLoading ? (
              <div
                className='size-[30px] rounded-[50%] border-[3px] border-l-transparent 
              border-b-transparent animate-spin mx-auto'
              ></div>
            ) : (
              <span className='z-[50] relative'>Save</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
export default Details;
