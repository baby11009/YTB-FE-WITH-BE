import { useState, useRef, memo, useEffect } from "react";
import { getData } from "../../../../Api/getData";
import { ButtonHorizonSlider } from "../../../../Component";
const Filters = ({  buttonList = [], currentQuery }) => {
  
  return (
    <ButtonHorizonSlider buttonList={buttonList} currentId={currentQuery} />
  );
};
export default memo(Filters);
