import { Link, useParams } from "react-router-dom";
import { LongArrowIcon } from "../../../../Assets/Icons";
import { useState, useEffect } from "react";
import { getData } from "../../../../Api/getData";
import { useQueryClient } from "@tanstack/react-query";

import NavigateBar from "./NavigateBar";
import PlaylistDetails from "./PlaylistDetails";
import PlaylistVideoList from "./PlaylistVideoList";
import { useAuthContext } from "../../../../Auth Provider/authContext";

const intiQueries = {
  videoPage: 1,
  videoLimit: 10,
  search: {},
  sort: {},
};

const UpsertPlaylist = () => {
  const { id, func } = useParams();

  const queryClient = useQueryClient();

  const { addToaster } = useAuthContext();

  const [queries, setQueries] = useState(intiQueries);

  const {
    data: playlistData,
    refetch,
    isLoading,
  } = getData(`playlist/${id}`, queries, !!id, false);

  useEffect(() => {
    return () => {
      queryClient.clear();
    };
  }, []);

  return (
    <div className='max-w-[1500px] md:px-[16px] mx-auto'>
      <div className='sticky left-0 top-0 pt-[8px]  bg-black z-[100] flex justify-between items-center'>
        <h2 className='text-[28px] leading-[44px] font-[500]'>Playlists</h2>
        <Link
          className='size-[40px] rounded-[50%] hover:bg-black-0.1 p-[8px]'
          to={"/admin/playlist"}
        >
          <div className='w-[24px]'>
            <LongArrowIcon />
          </div>
        </Link>
      </div>
      {!isLoading && (
        <>
          {playlistData && playlistData.playlistInfor.type === "playlist" && (
            <NavigateBar id={id} playlistData={playlistData} func={func} />
          )}

          {(playlistData && func === "list") ||
          (playlistData && playlistData.playlistInfor.type !== "playlist") ? (
            <PlaylistVideoList
              id={id}
              playlistData={playlistData}
              refetch={refetch}
              addToaster={addToaster}
              queries={queries}
              setQueries={setQueries}
            />
          ) : (
            <PlaylistDetails
              id={id}
              playlistData={playlistData?.playlistInfor}
              setQueries={setQueries}
              addToaster={addToaster}
            />
          )}
        </>
      )}
    </div>
  );
};
export default UpsertPlaylist;
