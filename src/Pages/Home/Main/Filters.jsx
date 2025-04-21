import { useState, useRef, memo, useEffect } from "react";
import { ButtonHorizonSlider } from "../../../Component";
import { getData } from "../../../Api/getData";
const Filters = ({ setSortQuery }) => {
  const [currentSort, setCurrentSort] = useState("all");

  const { data: tagData } = getData("/data/tags", {});

  const handleSort = (data) => {
    setSortQuery(data);
    setCurrentSort(data.id);
  };

  const buttonList = useRef([
    {
      id: "all",
      title: "All",
      value: undefined,
      type: "sort",
      handleOnClick: handleSort,
    },
    {
      id: "latest",
      title: "Latest",
      type: "sort",
      value: { createdAt: -1 },
      handleOnClick: handleSort,
    },
    {
      id: "view",
      title: "Popular",
      value: { view: -1 },
      type: "sort",
      handleOnClick: handleSort,
    },
    {
      id: "oldest",
      title: "Oldest",
      value: { createdAt: 1 },
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
          value: tag.slug,
          type: "search",
          handleOnClick: handleSort,
        });
      }
    }
  }, [tagData]);

  return (
    <ButtonHorizonSlider
      buttonList={buttonList.current}
      currentId={currentSort}
    />
  );
};
export default memo(Filters);
