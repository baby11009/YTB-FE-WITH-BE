import Other from "./Other/Other";
import Video from "./Video/Video";
import Description from "./Description/Description";
import CommentSection from "./Comment/CommentSection";
import { useState, useEffect, useRef, useCallback } from "react";
import { IsEnd } from "../../../util/scrollPosition";
import { useParams } from "react-router-dom";
import { getData } from "../../../Api/getData";
import { useAuthContext } from "../../../Auth Provider/authContext";
import { useQueryClient } from "@tanstack/react-query";
import { scrollToTop } from "../../../util/scrollCustom";
import connectSocket from "../../../util/connectSocket";

const initVideoParams = {
  page: 1,
  limit: 12,
  createdAt: "mới nhất",
  prevPlCount: 0,
};

const VideoPart = () => {
  const queryClient = useQueryClient();

  const { id } = useParams();

  const { user } = useAuthContext();

  const {
    data: videoDetails,
    refetch,
    isError,
  } = getData(
    `/data/video/${id}`,
    {
      subscriberId: user?._id,
      id: id,
    },
    true,
    true,
  );

  const [videoInfo, setVideoInfo] = useState(undefined);

  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    if (videoDetails) {
      setVideoInfo((prev) =>
        prev ? { ...prev, ...videoDetails.data } : { ...videoDetails.data },
      );
    }
  }, [videoDetails]);

  useEffect(() => {
    if (id && videoInfo) {
      queryClient.clear();
    }
  }, [id]);

  useEffect(() => {
    const handleOnScroll = (e) => {
      IsEnd(setIsEnd);
    };
    window.addEventListener("scroll", handleOnScroll);

    return () => {
      window.removeEventListener("scroll", handleOnScroll);
    };
  }, []);

  if (isError) {
    return <div>Failed to loading data</div>;
  }
  return (
    <div className='max-w-[1754px] flex sm:justify-center lg:min-w-min-360 1356:min-w-min-480 mx-auto'>
      {/* Left side */}
      <div
        className='flex-1 min-w-240-16/9 lg:min-w-360-16/9 lg:max-w-max-16/9
         1356:min-w-480-16/9 ml-[24px] pt-[24px] pr-[24px] overflow-hidden'
      >
        <Video data={videoInfo} refetch={refetch} />
        <Description data={videoInfo} refetch={refetch} />
        <div className=' block lg:hidden  '>
          <Other videoId={id} showMore={true} id={"small"} />
        </div>
        <CommentSection
          videoId={id}
          videoUserId={videoInfo?.channel_info._id}
          totalCmt={videoInfo?.totalCmt}
          refetch={refetch}
          isEnd={isEnd}
        />
      </div>
      {/* Right side */}
      <div className='hidden lg:block pt-[24px] pr-[24px] w-[402px] min-w-[300px] box-content'>
        <Other videoId={id} isEnd={isEnd} id={"large"} />
      </div>
    </div>
  );
};
export default VideoPart;
