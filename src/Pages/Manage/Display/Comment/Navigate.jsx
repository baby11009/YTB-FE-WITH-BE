import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";

const funcList = [
  {
    id: 1,
    title: "Video comment",
    param: "video-comment",
  },
  {
    id: 2,
    title: "My comments",
    param: "my-comment",
  },
];

const CustomeButton = ({ data, pathParam }) => {
  return (
    <Link
      to={`/manage/comment/${data.param}`}
      className={`border-b-[3px] cursor-pointer
              ${
                pathParam === data.param
                  ? " border-white-F1"
                  : "border-[transparent] hover:border-gray-71"
              }
              `}
    >
      {data.title}
    </Link>
  );
};

const Navigate = ({ pathParam, refetch }) => {
  return (
    <Swiper
      slidesPerView='auto'
      className='flex !mx-0 w-full text-[16px] leading-[48px] font-[500]'
      spaceBetween={24}
      resistanceRatio={0.5}
    >
      {funcList.map((item) => (
        <SwiperSlide className='!w-fit' key={item.id}>
          <CustomeButton data={item} pathParam={pathParam} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
export default Navigate;
