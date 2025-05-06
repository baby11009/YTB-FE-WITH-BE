import { useState, useRef, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const useGetLocationSearchValue = (initalValue) => {
  const location = useLocation();

  const valueKeys = useRef(Object.keys(initalValue));

  const [searchValue, setSearchValue] = useState(initalValue);

  useLayoutEffect(() => {
    const searchValue = new URLSearchParams(location.search);
    const searchObj = {};
    valueKeys.current.forEach((key) => {
      searchObj[key] = searchValue.get(key);
    });

    if (Object.keys(searchObj).length) {
      setSearchValue(searchObj);
    }
  }, [location.search]);

  return searchValue;
};

export default useGetLocationSearchValue;
