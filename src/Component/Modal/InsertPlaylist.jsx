import { useAuthContext } from "../../Auth Provider/authContext";
import {
  CloseIcon,
  PlusIcon,
  PublicIcon,
  PrivacyIcon,
  PrivateIcon,
} from "../../Assets/Icons";
import request from "../../util/axios-base-url";
import { getDataWithAuth } from "../../Api/getData";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useRef, useCallback } from "react";
import CheckBox2 from "../CheckBox/CheckBox2";
import { IsElementEnd } from "../../util/scrollPosition";

const PlaylistCard = ({ data, videoId }) => {
  const [checked, setChecked] = useState(data?.itemList.includes(videoId));
  const handleAddToPlaylist = useCallback(async (data) => {
    try {
      await request.patch(`/client/playlist/${data?._id}`, {
        videoIdList: [videoId],
      });
    } catch (error) {
      setChecked((prev) => !prev);
      alert("Failed to add to playlist");
      throw error;
    }
  }, []);

  return (
    <div
      className='mb-[16px] flex items-center'
      onClick={async () => {
        setChecked((prev) => !prev);
        await handleAddToPlaylist(data, setChecked);
      }}
    >
      <CheckBox2
        checked={checked}
        setChecked={async () => {
          setChecked((prev) => !prev);
          await handleAddToPlaylist(data, setChecked);
        }}
      />
      <div className='flex-1  overflow-hidden text-ellipsis line-clamp-1 pl-[16px] '>
        {data?.title}
      </div>
      <div className='mt-[3px] ml-[4px]'>
        {data?.type === "public" ? <PublicIcon /> : <PrivateIcon />}
      </div>
    </div>
  );
};

const InsertPlaylist = ({ videoId }) => {
  const queryClient = useQueryClient();

  const { modalContainerRef, setIsShowing, user } = useAuthContext();

  const [queries, setQueries] = useState({
    sort: { createdAt: -1 },
    limit: 2,
    page: 1,
  });

  const [dataList, setDataList] = useState([]);

  const [isEnd, setIsEnd] = useState(false);

  const scrollRef = useCallback((e) => {
    if (e) {
      e.addEventListener("scroll", (e) => {
        IsElementEnd(setIsEnd, e);
      });
    }
  }, []);

  const { data, isLoading, isError, isSuccess } = getDataWithAuth(
    "/client/playlist",
    queries,
    true,
    false
  );

  useEffect(() => {
    if (data && data?.qtt > 0) {
      setDataList((prev) => [...prev, ...data?.data]);
    }
  }, [data]);

  useEffect(() => {
    if (isEnd && data?.totalPage > queries.page) {
      setQueries((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  }, [isEnd]);

  useEffect(() => {
    return () => {
      queryClient.removeQueries(Object.values(queries));
    };
  }, []);

  return (
    <div
      ref={modalContainerRef}
      className='max-w-[648px] min-w-[210px] max-h-[340px] bg-black-21 rounded-[10px] flex flex-col '
    >
      <div className='flex items-center'>
        <h2 className='flex-1 text-[16px] leading-[22px] py-[16px] px-[24px]'>
          Save video to...
        </h2>
        <button
          onClick={() => {
            setIsShowing(false);
          }}
          className='mr-[20px]'
        >
          <div>
            <CloseIcon />
          </div>
        </button>
      </div>

      {/* Playlist */}
      <div
        className='flex-1 overflow-y-auto px-[24px] py-[16px]'
        ref={scrollRef}
      >
        {isLoading ? (
          <div className='h-[100px] w-full flex items-center justify-center '>
            <div className='border-[2px] border-b-transparent border-l-transparent size-[30px] rounded-[50%] animate-spin ease-out'></div>
          </div>
        ) : (
          dataList.length > 0 &&
          isSuccess &&
          dataList.map((item) => (
            <PlaylistCard key={item?._id} data={item} videoId={videoId} />
          ))
        )}

        {isError && (
          <div className='h-[100px] w-full flex items-center justify-center '>
            <span className='text-[14px] text-red-CC font-[500]'>
              Failed to get your playlist list
            </span>
          </div>
        )}
      </div>
      <div className='px-[24px] py-[12px]'>
        <button className='flex items-center justify-center px-[16px] rounded-[20px] bg-black-0.1 w-full hover:bg-black-0.2'>
          <div className='w-[24px] ml-[-6px] mr-[6px]'>
            <PlusIcon />
          </div>
          <span className='text-[14px] leading-[36px] font-[500]'>
            New Playlist
          </span>
        </button>
      </div>
    </div>
  );
};
export default InsertPlaylist;
