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

  const [error, setError] = useState({
    inputName: [],
    message: [],
  });

  const privacyRef = useRef([
    { id: "public", label: "Public" },
    { id: "private", label: "Private" },
  ]);

  const handleOnChange = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [`${name}`]: value }));
  }, []);

  const handleValidateUpdate = useCallback(
    (formData) => {
      if (error.inputName.length > 0) {
        setError({ inputName: [], message: [] });
      }

      let hasErrors = false;

      const keys = Object.keys(formData);

      keys.forEach((key) => {
        if (formData[key] === "" || !formData[key]) {
          let errMsg = "Cannot be empty";
          setError((prev) => ({
            inputName: [...prev?.inputName, key],
            message: [...prev?.message, errMsg],
          }));
          hasErrors = true;
        }
      });

      if (hasErrors) {
        return true;
      }
    },
    [error],
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
    [error],
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoading(true);

      await update(formData, playlistData);

      setIsLoading(false);
    },
    [error, formData, playlistData],
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
                errMsg={
                  error?.inputName?.includes("title")
                    ? error.message[error.inputName?.indexOf("title")]
                    : ""
                }
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
          <button type='submit' className='w-full max-w-[160px] btn1 relative'>
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
