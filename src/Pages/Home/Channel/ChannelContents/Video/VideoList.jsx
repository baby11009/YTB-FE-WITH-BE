import { VideoCard } from "../../../../../Component";
import { useAuthContext } from "../../../../../Auth Provider/authContext";

const VideoList = ({ vidList, isLoading }) => {
  const { openedMenu } = useAuthContext();

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 2md:grid-cols-3 2lg:grid-cols-4
      ${openedMenu && "1312:grid-cols-3 1360:grid-cols-4"} `}
    >
      {vidList.map((item, id) => (
        <VideoCard
          data={item}
          key={id}
          showBtn={true}
          style={`inline-block flex-1 mx-[8px] mb-[40px]`}
          thumbStyleInline={{
            borderRadius: "12px",
          }}
          descStyle={"!hidden"}
          titleStyle={"text-[14px] leading-[20px] font-[500] max-h-[40px]"}
          noFuncBox={true}
        />
      ))}
      {isLoading && (
        <div className='mt-[20px] mb-[40px] flex items-center justify-center'>
          <div
            className='w-[40px] h-[40px] rounded-[50px] border-[3px] border-[rgba(255,255,255,0.4)] 
        border-b-[transparent] border-l-[transparent] animate-spin'
          ></div>
        </div>
      )}
    </div>
  );
};
export default VideoList;
