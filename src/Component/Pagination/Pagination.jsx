import { ThinArrowIcon } from "../../Assets/Icons";
import { useState, useLayoutEffect, useCallback } from "react";

const Pagination = ({ setQueriese, currPage, totalPage, handleSetPage }) => {
  const [pageArr, setPageArr] = useState([]);

  const handleNavPage = useCallback(
    (pageNum) => {
      if (!totalPage) {
        return;
      }

      if (setQueriese) {
        setQueriese((prev) => ({ ...prev, page: pageNum }));
      } else {
        handleSetPage(pageNum);
      }
    },
    [totalPage],
  );

  const getPagesToShow = useCallback((page, totalPage) => {
    let startPage = page - 2;
    let endPage = page + 2;

    if (page <= 3) {
      startPage = 1;
      endPage = Math.min(totalPage, 5);
    } else if (page >= totalPage - 2) {
      startPage = Math.max(1, totalPage - 4);
      endPage = totalPage;
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i,
    );
  }, []);

  useLayoutEffect(() => {
    setPageArr(getPagesToShow(currPage, totalPage));
  }, [totalPage, currPage]);

  return (
    <div className='mb-[12px] mt-[16px] flex items-center justify-end gap-[16px]'>
      <button
        className={`size-[32px] rounded-[5px] border-[2px] flex items-center justify-center 
          ${
            (!totalPage || currPage === 1) &&
            "cursor-default border-[rgba(255,255,255,0.4)] text-[rgba(255,255,255,0.4)]"
          }`}
        onClick={() => {
          if (totalPage && currPage !== 1) {
            handleNavPage(currPage - 1);
          }
        }}
        type='button'
      >
        <div className='rotate-180'>
          <ThinArrowIcon size={24} color={"currentColor"} />
        </div>
      </button>
      <div>
        {pageArr.length > 0 ? (
          pageArr.map((page) => (
            <button
              key={page}
              type='button'
              className={`
                size-[32px]
                mx-[3px]
            ${
              page === currPage
                ? "text-white"
                : "text-[rgba(255,255,255,0.4)] hover:text-white transition-colors duration-[0.2s] ease-in font-[500]"
            }`}
              onClick={() => {
                if (page !== currPage) {
                  handleNavPage(page);
                }
              }}
            >
              {page}
            </button>
          ))
        ) : (
          <button className='size-[32px] mx-[3px] text-white font-[500]'>
            1
          </button>
        )}
      </div>
      <button
        className={`size-[32px] rounded-[5px] border-[2px] flex items-center justify-center
          ${
            (currPage === totalPage || !totalPage) &&
            "cursor-default border-[rgba(255,255,255,0.4)] text-[rgba(255,255,255,0.4)]"
          }`}
        onClick={() => {
          if (totalPage && currPage !== totalPage) {
            handleNavPage(currPage + 1);
          }
        }}
        type='button'
      >
        <div>
          <ThinArrowIcon size={24} color={"currentColor"} />
        </div>
      </button>
    </div>
  );
};
export default Pagination;
