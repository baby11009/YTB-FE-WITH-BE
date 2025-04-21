import Filters from "./Filters";
import { getData } from "../../../Api/getData";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useQuery } from "../../../util/path";
import {
  NoResult,
  VideoCard4,
  ChannelCard2,
  PlaylistCard3,
} from "../../../Component";
import { useSearchParams } from "react-router-dom";
import { IsEnd } from "../../../util/scrollPosition";

const initQueries = { search: "", type: "all", sort: "relavance" };

const SearchPage = () => {
  const [, setSearchParams] = useSearchParams();

  const searchQuery = useQuery().get("search_query");

  const newSearchQuery = useRef(true);

  const [emptySearch, setEmptySearch] = useState(false);

  const [queries, setQueries] = useState(undefined);

  const [isEnd, setIsEnd] = useState(undefined);

  const searchCursors = useRef();

  const [dataList, setDataList] = useState([]);

  const rerender = useRef(0);

  const { data } = getData("/data/search", queries, queries ? true : false);

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

  useEffect(() => {
    if (data) {
      rerender.current += 1;

      if (newSearchQuery.current) {
        console.log(newSearchQuery.current);
        setDataList(data.data);
        newSearchQuery.current = false;
      } else {
        setDataList((prev) => [...prev, ...data.data]);
      }

      searchCursors.current = data.cursors;
    }
  }, [data]);

  useEffect(() => {
    if (isEnd && searchCursors.current) {
      setQueries((prev) => ({ ...prev, cursors: searchCursors.current }));
    }
  }, [isEnd]);

  useEffect(() => {
    const handleScroll = () => {
      IsEnd(setIsEnd);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.addEventListener("scroll", handleScroll);
    };
  }, []);

  if (emptySearch) {
    return (
      <div className='px-[24px] pb-[16px]'>
        <NoResult />
      </div>
    );
  }

  return (
    <div className='px-[24px] pb-[16px] max-w-[1280px] mx-auto'>
      <Filters newSearchQuery={newSearchQuery} setQueries={setQueries} />
      <div>
        {dataList.length > 0 &&
          dataList.map((data, index) => (
            <div className='mt-4' key={data._id + index}>
              {data.type ? (
                <VideoCard4 data={data} />
              ) : data.name ? (
                <ChannelCard2 data={data} />
              ) : (
                <PlaylistCard3
                  data={data}
                  thumbStyle={"flex-1 min-w-[240px] max-w-[500px]"}
                />
              )}
            </div>
          ))}
      </div>
    </div>
  );
};
export default SearchPage;
