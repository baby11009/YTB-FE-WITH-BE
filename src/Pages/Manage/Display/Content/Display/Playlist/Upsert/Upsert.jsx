import {
  useState,
  useLayoutEffect,
  useRef,
  useEffect,
} from "react";
import Details from "./Details";
import VideoList from "./VideoList.jsx";
import { Slider } from "../../../../../../../Component";
import {
  EditIcon,
  ActiveEditIcon,
  MyChannel2Icon,
  ActiveMyChannel2Icon,
  CloseIcon,
} from "../../../../../../../Assets/Icons";
import { getData } from "../../../../../../../Api/getData";
import { useQueryClient } from "@tanstack/react-query";

const initQueriese = {
  videoLimit: 4,
  videoPage: 1,
};

const Upsert = ({ playlistId, func, handleClose }) => {
  const queryClient = useQueryClient();

  const [currFunc, setCurrFunc] = useState();

  const [trackerInfo, setTrackerInfo] = useState({ width: 0, left: 0 });

  const [queriese, setQueriese] = useState(initQueriese);

  const [playlistInfo, setPlaylistInfo] = useState(undefined);

  const [videoList, setVideoList] = useState([]);

  const navContainer = useRef();

  const navList = useRef([
    {
      id: "detail",
      text: "Details",
      icon: <EditIcon />,
      activeIcon: <ActiveEditIcon />,
    },
    {
      id: "list",
      text: "Videos",
      icon: <MyChannel2Icon />,
      activeIcon: <ActiveMyChannel2Icon />,
    },
  ]);

  const { data, refetch } = getData(
    `/client/playlist/${playlistId}`,
    queriese,
    !!playlistId,
    false,
  );

  const funcList = {
    detail: <Details playlistData={playlistInfo} refetch={refetch} />,
    list: (
      <VideoList
        playlistId={playlistInfo?._id}
        videoList={videoList}
        currPage={queriese?.videoPage}
        totalPage={data?.totalPages}
        setPage={(page) => {
          setQueriese((prev) => ({ ...prev, videoPage: page }));
        }}
        refetch={refetch}
      />
    ),
  };

  useLayoutEffect(() => {
    setCurrFunc(func);
  }, [func]);

  useLayoutEffect(() => {
    if (data) {
      const dataClone = structuredClone(data?.data);
      setVideoList(dataClone.video_list);
      delete dataClone.video_list;
      setPlaylistInfo(dataClone);
    }
  }, [data]);

  useLayoutEffect(() => {
    if (navContainer.current) {
      for (const child of navContainer.current.children) {
        if (child.dataset.id === currFunc) {
          const childRect = child.getBoundingClientRect();
          const containerRect = navContainer.current.getBoundingClientRect();
          setTrackerInfo({
            width: child.clientWidth,
            left: childRect.left - containerRect.left,
          });
          break;
        }
      }
    }
  }, [currFunc]);

  useEffect(() => {
    return () => {
      queryClient.clear();
    };
  }, []);

  return (
    <div
      className='bg-black max-w-[95vw] max-h-[90vh] shadow-[0_0_8px_2px_rgba(140,140,140,0.5)]
     rounded-[5px] transition-[height] overflow-hidden'
    >
      <header className='flex items-center justify-between mx-[16px] xl:mx-[24px] pt-[24px]'>
        <h1 className='text-nowrap text-[25px] leading-[32px] font-[600]'>
          Playlist edtting
        </h1>
        <button
          className='size-[40px] rounded-[50%] p-[8px] hover:bg-black-0.1 '
          onClick={handleClose}
        >
          <div className='size-[24px]'>
            <CloseIcon />
          </div>
        </button>
      </header>
      <Slider>
        <div
          className='relative ml-[8px] xl:ml-[16px] mr-[4px] xl:mr-[12px]'
          ref={navContainer}
        >
          {navList.current.map((nav) => (
            <button
              className=' inline-flex items-center py-[8px] ml-[8px] mr-[12px] border-b-[2px] 
            border-[transparent] hover:border-gray-A'
              key={nav.id}
              onClick={() => {
                setCurrFunc(nav.id);
              }}
              data-id={nav.id}
            >
              <div className='size-[24px] '>
                {currFunc === nav.id ? nav.activeIcon : nav.icon}
              </div>
              <span className='pl-[12px]'>{nav.text}</span>
            </button>
          ))}
          <div
            className='absolute h-[2px] bottom-0 bg-white transition-[left_width] ease-in-out'
            style={{
              left: trackerInfo.left + "px",
              width: trackerInfo.width + "px",
            }}
          ></div>
        </div>
      </Slider>
      <div className=' mx-[16px] xl:mx-[24px]'>{funcList[currFunc]}</div>
    </div>
  );
};
export default Upsert;
