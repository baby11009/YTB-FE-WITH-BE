import { useState, useRef, memo, useEffect } from "react";
import { ButtonHorizonSlider } from "../../../Component";
import { getData } from "../../../Api/getData";
const Filters = ({ handleQueryChange }) => {
  const [currentSort, setCurrentSort] = useState("all");

  const { data: tagData, isLoading } = getData("/data/tags", {});

  const handleOnClick = (data) => {
    handleQueryChange(data);
    setCurrentSort(data.id);
  };

  const buttonList = useRef([
    {
      id: "all",
      title: "All",
      value: undefined,
      type: "default",
      handleOnClick,
    },
    {
      id: "recently",
      title: "Recently uploaded",
      type: "sort",
      handleOnClick,
    },
    {
      id: "oldest",
      title: "Oldest uploads",
      type: "sort",
      handleOnClick,
    },
    {
      id: "popular",
      title: "Popular",
      type: "sort",
      handleOnClick,
    },
  ]);

  useEffect(() => {
    if (tagData) {
      for (const tag of tagData.data) {
        buttonList.current.push({
          id: tag.title,
          title: tag.title,
          type: "search",
          handleOnClick,
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
