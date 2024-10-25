import { Verification, ThinArrowIcon } from "../../../../Assets/Icons";
import { formatNumber } from "../../../../util/numberFormat";
import { SwiperSlide, Swiper } from "swiper/react";
import { Link } from "react-router-dom";

const funcList = [
  {
    id: 1,
    title: "Danh sách phát",
    slug: "playlists",
  },
  {
    id: 2,
    title: "Cộng đồng",
    slug: "comunity",
  },
];

const CustomeButton = ({ data, display, setDisplay }) => {
  return (
    <div
      className={`border-b-[3px] cursor-pointer
              ${
                display.title === data.slug
                  ? " border-white-F1"
                  : "border-[transparent] hover:border-gray-71"
              }
              `}
      onClick={() => {
        setDisplay({
          title: data.slug,
          payload: undefined,
        });
      }}
    >
      {data.title}
    </div>
  );
};

const MyChannelInfor = ({ data, openedMenu, display, setDisplay, refetch }) => {
  return (
    <div
      className={`w-[214px] xsm:w-[428px] sm:w-[642px] 2md:w-[856px]
${
  openedMenu
    ? "1336:w-[1070px] 2xl:w-[1284px]"
    : " 2lg:w-[1070px] 1-5xl:w-[1284px]"
} border-b-[1px] border-[rgba(255,255,255,0.2)]`}
    >
      {/* Infor */}
      <div className='pt-[16px] pb-[4px] flex items-center mb-[12px]'>
        <img
          src={`${import.meta.env.VITE_BASE_API_URI}${
            import.meta.env.VITE_VIEW_AVA_API
          }${data?.avatar}`}
          alt='avatar'
          className='hidden sm:inline-block w-[160px] h-[160px] rounded-[50%] mr-[24px]'
        />

        <div className='flex-1 text-[14px] leading-[20px]'>
          <div className='flex items-center gap-[5px] mb-[4px]'>
            <div className='text-[24px] leading-[32px] sm:text-[36px] sm:leading-[50px] font-bold'>
              {data?.name}
            </div>
            {data?.subscriber > 100000 && <Verification size={"14"} />}
          </div>

          <div className='flex flex-col items-start sm:flex-row sm:items-center text-gray-A'>
            <span className=" after:content-['‧'] after:mx-[4px]">
              @{data?.email}
            </span>
            <span className=" after:content-['‧'] after:mx-[4px]">
              {formatNumber(data?.subscriber)} người đăng ký
            </span>
            <span>{formatNumber(data?.totalVids)} video</span>
          </div>

          {data?.description && (
            <div className='flex items-center py-[10px] text-gray-A'>
              <span className='t-1-ellipsis flex-1 text-nowrap'>
                Không có việc gì khó chỉ sợ lòng không bền
              </span>

              <div className='w-[24px] h-[24px] flex items-center justify-center cursor-pointer'>
                <ThinArrowIcon />
              </div>
            </div>
          )}

          <a
            href='https://www.youtube.com/channel/UCHApD6LBIxIusJy7VVgocfA'
            target='_blank'
            className='text-blue-3E py-[4px] t-1-ellipsis'
          >
            youtube.com/channel/UCHApD6LBIxIusJy7VVgocfA
          </a>

          {/* Func Btn */}
          <div className='pt-[10px] pb-[6px] flex flex-col items-start sm:flex-row sm:items-center gap-[8px]'>
            <Link
              to={"/manage/setting"}
              className='rounded-[20px] leading-[36px] px-[16px] bg-black-0.1 hover:bg-black-0.2 text-[14px] font-[500]'
            >
              Tùy chỉnh kênh
            </Link>
            <Link
              to={"/manage/content/video"}
              className='rounded-[20px] leading-[36px] px-[16px] bg-black-0.1 hover:bg-black-0.2 text-[14px] font-[500]'
            >
              Quản lý video
            </Link>
          </div>
        </div>
      </div>
      <Swiper
        slidesPerView='auto'
        className='flex !mx-0 w-full text-[16px] leading-[48px] font-[500]'
        spaceBetween={24}
        resistanceRatio={0.5}
      >
        {funcList.map((item) => (
          <SwiperSlide className='!w-fit' key={item.id}>
            <CustomeButton
              data={item}
              display={display}
              setDisplay={setDisplay}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
export default MyChannelInfor;
