import { Link } from "react-router-dom";

const Button = ({ data, currPath }) => {
  return (
    <Link
      className={`block mx-[12px] rounded-[10px] hover:bg-black-0.1 cursor-pointer
        ${currPath === data?.path && " bg-black-0.2"} `}
      to={data.path}
    >
      <div className='px-[16px] flex items-center h-[40px]'>
        <span className='text-[14px] leading-[20px] font-[500] t-1-ellipsis'>
          {data?.title}
        </span>
      </div>
    </Link>
  );
};

const LeftMenu = ({ currPath }) => {
  const funcList = [
    {
      id: 1,
      title: "Tài khoản",
      path: "/setting/account",
    },
    {
      id: 2,
      title: "Thông báo",
      path: "/setting/notifications",
    },
    {
      id: 3,
      title: "Chức năng phát va hiệu suất",
      path: "/setting/playback",
    },
    {
      id: 4,
      title: "Nội dung tải xuống",
      path: "/setting/downloads",
    },
    {
      id: 5,
      title: "Quyền riêng tư",
      path: "/setting/privacy",
    },
    {
      id: 6,
      title: "Ứng dụng đã kết nối",
      path: "/setting/sharing",
    },
    {
      id: 7,
      title: "Lập hóa đơn và thanh toán",
      path: "/setting/billing",
    },
    {
      id: 1,
      title: "Cài đặt nâng cao",
      path: "/setting/advanced",
    },
  ];

  return (
    <div className='hidden 1-5sm:inline-block fixed py-[18px] w-[240px] left-0 h-screen '>
      <div className='pl-[24px] pb-[20px] text-[20px] leading-[28px] font-[500] text-gray-A'>
        Setting
      </div>
      <div>
        {funcList.map((item, index) => (
          <Button key={index} data={item} currPath={currPath} />
        ))}
      </div>
    </div>
  );
};
export default LeftMenu;
