import { ButtonHorizonSlider } from "../../../Component";
import { useRe, useState } from "react";

const Filters = ({ setQueries }) => {
  const [currentSort, setCurrentSort] = useState("all");

  const handleSort = (data) => {
    setCurrentSort(data.id);
    // setQueries(setQueries)
  };

  const buttonList = [
    {
      id: "all",
      title: "All",
      value: undefined,
      handleOnClick: handleSort,
    },
    {
      id: "video",
      title: "Videos",
      value: { createdAt: -1 },
      handleOnClick: handleSort,
    },
    {
      id: "short",
      title: "Shorts",
      value: { view: -1 },
      handleOnClick: handleSort,
    },
    {
      id: "Gaming",
      title: "Gaming",
      value: { createdAt: 1 },
      handleOnClick: handleSort,
    },
    {
      id: "playlist",
      title: "Playlists",
      value: { view: -1 },
      handleOnClick: handleSort,
    },
    {
      id: "user",
      title: "Channels",
      value: { view: -1 },
      handleOnClick: handleSort,
    },
    {
      id: "test1",
      title: "Hello World",
    },
    {
      id: "test2",
      title: "Hello VOHUYTHANH",
    },
    {
      id: "test3",
      title: "THIS IS MY CODE",
    },
  ];

  return (
    <ButtonHorizonSlider buttonList={buttonList} currentId={currentSort} />
  );
};
export default Filters;
