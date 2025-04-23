import { useState, useRef, memo, useEffect } from "react";
import { ButtonHorizonSlider } from "../../../Component";
import { getData } from "../../../Api/getData";
const Filters = ({ setSortQuery }) => {
  const [currentSort, setCurrentSort] = useState("all");

  const { data: tagData, isLoading } = getData("/data/tags", {});

  const handleSort = (data) => {
    setSortQuery(data);
    setCurrentSort(data.id);
  };

  const buttonList = useRef([
    {
      id: "all",
      title: "All",
      value: undefined,
      type: "default",
      handleOnClick: handleSort,
    },
    {
      id: "recently",
      title: "Recently uploaded",
      type: "sort",
      handleOnClick: handleSort,
    },
    {
      id: "oldest",
      title: "Oldest uploads",
      type: "sort",
      handleOnClick: handleSort,
    },
    {
      id: "popular",
      title: "Popular",
      type: "sort",
      handleOnClick: handleSort,
    },
  ]);

  useEffect(() => {
    if (tagData) {
      for (const tag of tagData.data) {
        buttonList.current.push({
          id: tag.title,
          title: tag.title,
          type: "search",
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
export default memo(Filters);
