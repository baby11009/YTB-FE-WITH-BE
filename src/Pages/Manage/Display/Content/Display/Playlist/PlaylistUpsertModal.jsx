import { useAuthContext } from "../../../../../../Auth Provider/authContext";
import {
  CloseIcon,
  DeleteIcon,
  GotoIcon,
} from "../../../../../../Assets/Icons";
import { TextArea, DropDown, Pagination } from "../../../../../../Component";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { getDataWithAuth } from "../../../../../../Api/getData";
import { updateData } from "../../../../../../Api/controller";
import { useQueryClient } from "@tanstack/react-query";
import { timeFormat3 } from "../../../../../../util/timeforMat";

const VideoCard = ({ data, handleRemoveVideo }) => {
  return (
    <div className='flex gap-[12px] items-center text-gray-A'>
      <div className='w-[300px]'>
        <div className='border-[2px] rounded-[5px]'>
          <img
            src={`${import.meta.env.VITE_BASE_API_URI}${
              import.meta.env.VITE_VIEW_THUMB_API
            }${data?.thumb}`}
            className='w-full min-w-[250px] max-h-[200px] h-auto object-contain object-center rounded-[5px] aspect-[16/9]'
          />
        </div>
      </div>
      <div className='w-[250px]'>
        <div className='text-nowrap overflow-hidden text-ellipsis'>
          {data.title} 21 123123123 123 131313 131313
        </div>
      </div>
      <div className='w-[130px]'>{timeFormat3(data.createdAt)}</div>
      <div className='w-[100px] flex items-center gap-[12px]'>
        <a href={`/video/${data?._id}`} target='_blank' title='Xem video'>
          <div className='hover:text-blue-500 transition-all duration-[0.25s] ease text-[12px]'>
            <GotoIcon />
          </div>
        </a>
        <button
          type='button'
          onClick={() => {
            handleRemoveVideo(data?._id);
          }}
          title='Xóa video khỏi playlist'
        >
          <div className='hover:text-red-500 transition-all duration-[0.25s] ease '>
            <DeleteIcon />
          </div>
        </button>
      </div>
    </div>
  );
};

const init = {
  title: "",
  type: "public",
};
const initPlaylistParams = {
  videoLimit: 4,
  videoPage: 1,
};

const VideoUpsertModal = ({ title, id }) => {
  const queryClient = useQueryClient();

  const { setIsShowing } = useAuthContext();

  const [playlistPrs, setPlaylistPrs] = useState(initPlaylistParams);

  const {
    data: playlistData,
    refetch,
    error: queryError,
    isLoading: playlistLoading,
    isError: playlistIsError,
  } = getDataWithAuth(
    `/client/playlist/${id}`,
    playlistPrs,
    id !== undefined,
    false
  );
  const [videoList, setVideoList] = useState([]);

  const [formData, setFormData] = useState(init);

  const typesRef = useRef(["public", "private"]);

  const [error, setError] = useState({
    inputName: [],
    message: [],
  });

  const handleOnChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleValidateUpdate = () => {
    if (error.inputName.length > 0) {
      setError({ inputName: [], message: [] });
    }
    let hasErrors = false;
    const keys = Object.keys(formData);
    keys.forEach((key) => {
      if (formData[key] === "" || !formData[key]) {
        let errMsg = "Không được để trống";
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
  };

  const update = async () => {
    const error = handleValidateUpdate();

    if (error) {
      return;
    }

    let finalData = {
      title: formData.title,
      type: formData.type,
    };

    for (const key in finalData) {
      if (
        playlistData?.data?.hasOwnProperty(key) &&
        playlistData?.data[key] === finalData[key]
      ) {
        delete finalData[key];
      }
    }
    await updateData("/client/playlist", id, finalData, "playlist", () => {
      refetch();
    });
  };

  const handleRemoveVideo = async (videoId) => {
    await updateData(
      "/client/playlist",
      id,
      { videoIdList: [videoId] },
      "playlist",
      () => {
        refetch();
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (id) {
      await update();
    }
  };

  useLayoutEffect(() => {
    if (playlistData) {
      setFormData({
        title: playlistData?.data?.title,
        type: playlistData?.data?.type,
      });

      setVideoList(playlistData.data?.video_list);
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

  useEffect(() => {
    return () => {
      queryClient.clear();
    };
  }, []);

  return (
    <div className='size-full max-w-[1500px] p-[8px] md:p-[24px]'>
      <div className='bg-black size-full overflow-auto rounded-[5px] shadow-[0_0_8px_#f1f1f1]'>
        <div className='p-[8px] xl:p-[20px]'>
          <div className='flex justify-between'>
            <h1 className='text-nowrap text-[25px] leading-[32px] font-[600]'>
              {title}
            </h1>
            <button
              className='size-[32px] rounded-[50%] flex items-center justify-center hover:bg-black-0.1 active:bg-black-0.2'
              onClick={() => {
                setIsShowing(undefined);
              }}
            >
              <div>
                <CloseIcon size={16} />
              </div>
            </button>
          </div>
          <form
            noValidate
            onSubmit={handleSubmit}
            className=' mb-[20px] my-[24px]'
          >
            <div className='flex flex-wrap gap-[24px] mt-[48px]'>
              <div className='basis-[100%] md:basis-[40%]'>
                <div className='basis-[100%]  2md:basis-[49%]'>
                  <TextArea
                    title={"Title"}
                    name={"title"}
                    value={formData.title}
                    defaultValue={playlistData?.data.title}
                    handleOnChange={handleOnChange}
                    errMsg={
                      error.inputName?.includes("title")
                        ? error.message[error.inputName?.indexOf("title")]
                        : ""
                    }
                    placeholder={"Enter video title"}
                  />
                </div>
                {/* Type*/}
                <div className='basis-[100%] sm:basis-[48%] 2md:basis-[32%] z-[90]'>
                  <DropDown
                    list={typesRef.current}
                    title={"Type"}
                    value={formData.type}
                    handleOnClick={(type) => {
                      setFormData((prev) => ({ ...prev, type }));
                    }}
                  />
                </div>
              </div>
              <div className='flex-1 relative overflow-hidden'>
                <div className='w-full overflow-hidden '>
                  <div className='font-[500] absolute left-0 top-0'>
                    Video list
                  </div>
                  <div
                    className='h-[65vh]
                   max-h-[800px] mt-[32px] border-b-[2px] px-[8px] pb-[8px] rounded-[5px] overflow-auto relative  '
                  >
                    {/* Head */}
                    <div
                      className='w-fit text-[12px] font-[500] leading-[48px] text-gray-A flex items-center gap-[12px]
                      border-b-[2px] border-gray-A sticky left-0 top-0 bg-black'
                    >
                      <div className='w-[300px]'>Thumbnail</div>
                      <div className='w-[250px]'>Title</div>
                      <div className='w-[130px]'>Created date</div>
                      <div className='w-[100px]'>Function</div>
                    </div>
                    {/* Body */}
                    <div className='w-fit h-full flex flex-col gap-[8px] mt-[8px]'>
                      {videoList.map((video, index) => (
                        <VideoCard
                          data={video}
                          key={index}
                          handleRemoveVideo={handleRemoveVideo}
                        />
                      ))}
                    </div>
                  </div>
                  <Pagination
                    handleSetPage={(pageNum) => {
                      setPlaylistPrs((prev) => ({
                        ...prev,
                        videoPage: pageNum,
                      }));
                    }}
                    currPage={playlistPrs.videoPage}
                    totalPage={playlistData?.totalPages}
                  />
                </div>
              </div>
            </div>

            <div className='flex items-center justify-center mt-[50px]'>
              <button
                type='submit'
                className='w-full max-w-[160px] btn1 relative'
              >
                <span className='z-[50] relative'>Submit</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default VideoUpsertModal;
