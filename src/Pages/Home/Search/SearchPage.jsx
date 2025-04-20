import Filters from "./Filters";
import { getData } from "../../../Api/getData";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useQuery } from "../../../util/path";
import { NoResult, VideoCard4, ChannelCard2 } from "../../../Component";
import { useSearchParams } from "react-router-dom";

const initQueries = { search: "", type: "all", sort: "relavance" };

const SearchPage = () => {
  const [, setSearchParams] = useSearchParams();

  const searchQuery = useQuery().get("search_query");

  const newSearchQuery = useRef(true);

  const [emptySearch, setEmptySearch] = useState(false);

  const [queries, setQueries] = useState(undefined);

  const searchCursors = useRef();

  const [dataList, setDataList] = useState([]);

  const { data } = getData("/data/search", queries, queries ? true : false);

  useEffect(() => {
    if (data) {
      console.log(newSearchQuery.current);
      if (newSearchQuery.current) {
        setDataList(data.data);
        newSearchQuery.current = false;
      } else {
        setDataList((prev) => [...prev, ...data.data]);
      }

      searchCursors.current = data.cursors;
    }
  }, [data]);

  useLayoutEffect(() => {
    if (searchQuery) {
      setQueries({ ...initQueries, search: searchQuery });
      newSearchQuery.current = true;
      setEmptySearch(false);
    } else {
      setSearchParams({
        searchQuery: "",
      });
      setEmptySearch(true);
      setQueries(undefined);
    }
  }, [searchQuery]);

  if (emptySearch) {
    return (
      <div className='px-[24px] pb-[16px]'>
        <NoResult />
      </div>
    );
  }

  return (
    <div className='px-[24px] pb-[16px] max-w-[1280px] mx-auto'>
      <Filters setQueries={setQueries} />
      <div
        className=''
        onClick={() => {
          if (searchCursors.current) {
            setQueries((prev) => ({ ...prev, cursors: searchCursors.current }));
          }
        }}
      >
        Get more data
      </div>
      <div>
        {dataList.length > 0 &&
          dataList.map((data, index) => (
            <div
              className={`${index !== 0 ? "mt-4" : ""}`}
              key={data._id + index}
            >
              {data.type ? (
                <VideoCard4 key={data._id + index} data={data} />
              ) : data.name ? (
                <ChannelCard2 data={data} />
              ) : (
                ""
              )}
            </div>
          ))}
      </div>
    </div>
  );
};
export default SearchPage;
