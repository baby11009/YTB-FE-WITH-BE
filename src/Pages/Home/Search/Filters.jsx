import { ButtonHorizonSlider } from "../../../Component";
import { useEffect, useRef, useState } from "react";
import { getData } from "../../../Api/getData";
import { useQueryClient } from "@tanstack/react-query";
const Filters = ({ setQueries, newSearchQuery }) => {
  const queryClient = useQueryClient();

  const { data: tagData, isLoading } = getData("/data/tags", {});

  const [currentSort, setCurrentSort] = useState("all");

  const handleSort = (data) => {
    setCurrentSort(data.id);
    newSearchQuery.current = true;
    setQueries((prev) => {
      queryClient.removeQueries({
        queryKey: ["/data/search", ...Object.values(prev)],
        exact: true,
      });
      const queriesClone = { search: prev.search, sort: prev.sort };

      if (data.type === "search") {
        return {
          ...queriesClone,
          type: data.id,
        };
      }

      if (data.type === "tag") {
        return {
          ...queriesClone,
          type: "all",
          tag: data.id,
        };
      }

      return {
        ...queriesClone,
        sort: data.id,
      };
    });
  };

  const buttonList = useRef([
    {
      id: "all",
      title: "All",
      type: "search",
      handleOnClick: handleSort,
    },
    {
      id: "video",
      title: "Videos",
      type: "search",
      handleOnClick: handleSort,
    },
    {
      id: "short",
      title: "Shorts",
      type: "search",
      handleOnClick: handleSort,
    },
    {
      id: "playlist",
      title: "Playlists",
      type: "search",
      handleOnClick: handleSort,
    },
    {
      id: "user",
      title: "Channels",
      type: "search",
      handleOnClick: handleSort,
    },
    // {
    //   id: "createdAt",
    //   title: "Recently Uploaded",
    //   type: "sort",
    //   handleOnClick: handleSort,
    // },
  ]);

  useEffect(() => {
    if (tagData) {
      for (const tag of tagData.data) {
        buttonList.current.push({
          id: tag.title,
          title: tag.title,
          type: "tag",
          handleOnClick: handleSort,
        });
      }
    }
  }, [tagData]);

  return (
    <ButtonHorizonSlider
      buttonList={isLoading ? [] : buttonList.current}
      currentId={currentSort}
    />
  );
};
export default Filters;
