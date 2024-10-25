import { TagBox } from "../../../../Component";
import { useRef } from "react";

const TagBlock = ({ tagList, activeIndex, handleOnClick }) => {
  const defaultRef = useRef([
    {
      id: 1,
      title: "Mới nhất",
      sort: { createdAt: -1 },
      handleOnClick: handleOnClick,
    },
    {
      id: 2,
      title: "Phổ biến",
      sort: { view: -1 },
      handleOnClick: handleOnClick,
    },
    {
      id: 3,
      title: "Cũ nhất",
      sort: { createdAt: 1 },
      handleOnClick: handleOnClick,
    },
  ]);

  return (
    <div className='my-[16px]'>
      <TagBox
        tagList={tagList || defaultRef.current}
        activeIndex={activeIndex}
      />
    </div>
  );
};
export default TagBlock;
