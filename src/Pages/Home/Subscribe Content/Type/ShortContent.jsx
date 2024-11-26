import { useQuery } from "@tanstack/react-query";
import request from "../../../../util/axios-base-url";
import { useEffect, useState, useRef } from "react";
import { IsEnd } from "../../../../util/scrollPosition";
import { getCookie } from "../../../../util/tokenHelpers";
import { ShortCard } from "../../../../Component";

const ShortContent = () => {
  const [shortQueriese, setShortQueriese] = useState({
    page: 1,
    limit: 12,
    type: "short",
  });

  const [shortList, setShortList] = useState([]);
  //   console.log("🚀 ~ shortList:", shortList);

  const [isEnd, setIsEnd] = useState(false);

  const { data: shortData } = useQuery({
    queryKey: [...Object.values(shortQueriese)],
    queryFn: async () => {
      try {
        const rsp = await request.get(
          "/client/user/subscribed-channels-videos",
          {
            headers: {
              Authorization: `${import.meta.env.VITE_AUTH_BEARER} ${getCookie(
                import.meta.env.VITE_AUTH_TOKEN
              )}`,
            },
            params: shortQueriese,
          }
        );

        return rsp.data;
      } catch (error) {
        alert("Failed to get channel list");
        console.error(error);
      }
    },
    suspense: true,
    cacheTime: 0,
  });

  const shortIdsSet = useRef(new Set());

  useEffect(() => {
    if (shortData) {
      const finalData = [];
      shortData?.data.forEach((item) => {
        if (!shortIdsSet.current.has(item?._id)) {
          shortIdsSet.current.add(item._id);
          finalData.push(item);
        }
      });
      setShortList((prev) => [...prev, ...finalData]);
    }
  }, [shortData]);

  useEffect(() => {
    if (isEnd) {
      if (shortData?.totalPage > shortQueriese.page) {
        setShortQueriese((prev) => ({ ...prev, page: prev.page + 1 }));
      }
    }
  }, [isEnd]);

  useEffect(() => {
    window.addEventListener("scroll", (e) => {
      IsEnd(setIsEnd);
    });

    return () => {
      window.removeEventListener("scroll", (e) => {
        IsEnd(setIsEnd);
      });
    };
  }, []);

  return (
    <div className='flex items-center justify-center'>
      <div className='max-w-[1334px] min-w-[224px]'>
        <div className='mt-[24px]'>
          <h2 className='text-[20px] leading-[28px] font-bold'>Shorts</h2>
        </div>
        <div
          className='pt-[24px] grid grid-cols-1 xsm:grid-cols-2 610:grid-cols-3
         880:grid-cols-4 1075:grid-cols-5 1275:grid-cols-6'
        >
          {shortList.map((short) => (
            <ShortCard
              key={short?._id}
              data={short}
              noDesc={true}
              imgStyle={"h-[393px] !rounded-[0]"}
              containerStyle={"mx-[2px] mb-[4px] max-w-[220px] box-content"}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default ShortContent;
