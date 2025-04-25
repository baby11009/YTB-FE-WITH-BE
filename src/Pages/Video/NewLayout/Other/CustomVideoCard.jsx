import { VideoCard2, PlaylistModal } from "../../../../Component";
import { useAuthContext } from "../../../../Auth Provider/authContext";
import {
  BlockIcon,
  AddWLIcon,
  DownloadIcon,
  ShareIcon,
  NoSuggetIcon,
  WatchedIcon,
  DiaryIcon,
  SaveIcon,
} from "../../../../Assets/Icons";
import request from "../../../../util/axios-base-url";

const CustomVideoCard = ({ data, index }) => {
  const { setIsShowing, user, addToaster } = useAuthContext();

  const funcList1 = [
    {
      id: 1,
      text: "Add to queue",
      icon: <AddWLIcon />,
    },
    {
      id: 2,
      text: "Save to watch later",
      icon: <WatchedIcon />,
      renderCondition: !!user,
      handleOnClick: async () => {
        await request
          .patch("/user/playlist/watchlater", {
            videoIdList: [data?._id],
          })
          .then((rsp) => {
            addToaster(rsp.data.msg);
          })
          .catch((err) => {
            console.error(err);
          });
      },
    },
    {
      id: 3,
      text: "Save to Playlist",
      icon: <SaveIcon />,
      handleOnClick: () => {
        setIsShowing(
          <PlaylistModal videoId={data?._id} key={new Date().getTime()} />,
        );
      },
      renderCondition: !!user,
    },
    {
      id: 4,
      text: "Download",
      icon: <DownloadIcon />,
    },
    {
      id: 5,
      text: "Share",
      icon: <ShareIcon />,
    },
  ];

  const funcList2 = [
    {
      id: 1,
      text: "Not interested",
      icon: <BlockIcon />,
    },
    {
      id: 2,
      text: "Don't recommend channel",
      icon: <NoSuggetIcon />,
    },
    {
      id: 3,
      text: "Report",
      icon: <DiaryIcon />,
    },
  ];

  return (
    <VideoCard2
      data={data}
      index={index}
      funcList1={funcList1}
      funcList2={funcList2}
      containerStyle={"mt-[8px] h-[94px]"}
    />
  );
};
export default CustomVideoCard;
