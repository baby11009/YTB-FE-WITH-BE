import { ThinArrowIcon } from "../../Assets/Icons";
import { useState, useLayoutEffect } from "react";

const Pagination = ({ setParams, currPage, totalPage, handleSetPage }) => {
  const [pageArr, setPageArr] = useState([]);

  const handleNavPage = (pageNum) => {
    if (!totalPage) {
      return;
    }
    if (setParams) {
      setParams((prev) => ({ ...prev, page: pageNum }));
    } else {
      handleSetPage(pageNum);
    }
  };

  const getPagesToShow = (page, totalPage) => {
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
      (_, i) => startPage + i
    );
  };

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
        onClick={() => handleNavPage(Math.max(1, currPage - 1))}
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
                  setParams((prev) => ({ ...prev, page: page }));
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
        onClick={() => handleNavPage(Math.min(totalPage, currPage + 1))}
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
