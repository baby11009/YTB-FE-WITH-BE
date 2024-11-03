const VideoSection = ({ url }) => {
  return (
    <div className='video-container'>
      <video
        src={`${import.meta.env.VITE_BASE_API_URI}${
          import.meta.env.VITE_VIEW_VIDEO_API
        }${url}`}
        controls
        className='w-full h-full object-container absolute top-0 left-0'
      ></video>
    </div>
  );
};
export default VideoSection;
