import { useRef, useLayoutEffect } from "react";

const Video = ({ data, refetch }) => {
  const videoRef = useRef();

  const videoSrc = useRef();

  useLayoutEffect(() => {
    if (data && videoSrc.current !== data?.video) {
      videoSrc.current = data?.video;
      videoRef.current.src = `${import.meta.env.VITE_BASE_API_URI}${
        import.meta.env.VITE_VIEW_VIDEO_API
      }${data?.video}`;
    }
  }, [data, videoRef.current]);

  return (
    <div className='bg-[#000000] rounded-[12px] overflow-hidden'>
      <video
        controls
        className='w-full aspect-video object-contain'
        ref={videoRef}
      ></video>
    </div>
  );
};
export default Video;
