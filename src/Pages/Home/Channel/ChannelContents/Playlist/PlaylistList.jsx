import { PlaylistCard } from "../../../../../Component";
import { useAuthContext } from "../../../../../Auth Provider/authContext";

const PlaylistList = ({ playlistList, isLoading }) => {
  const { openedMenu } = useAuthContext();

  return (
    <div
      className={`grid  grid-cols-1 xsm:grid-cols-2 sm:grid-cols-3 2md:grid-cols-4 2lg:grid-cols-5
      ${
        openedMenu
          ? "1312:grid-cols-4 1360:grid-cols-5 1573:grid-cols-6"
          : "1400:grid-cols-6"
      }`}
    >
      {playlistList.map((item, id) => (
        <PlaylistCard
          key={id}
          data={item}
          showL3={false}
          containerStyle={"!ml-0 !mr-[4px] !mb-[24px]"}
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
export default PlaylistList;
