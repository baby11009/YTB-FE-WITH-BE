const Dashboard = () => {
  return (
    <div>
      <h1 className='pt-[24px] text-nowrap text-[25px] leading-[32px] font-[600]'>
        Trang tổng quan của kênh
      </h1>
      <div className='overflow-auto pt-[24px]'>
        <h2 className='text-nowrap text-[18px] leading-[24px] font-[500]'>
          Số liệu phân tích về kênh
        </h2>
        <div className='pt-[12px]'>
          <div className='text-[13px] leading-[20px]'>
            Số liệu người đăng ký hiện tại
          </div>
          <div className='text-[34px] leading-[40xp]'>23123213</div>
        </div>

        <div className='pt-[24px] max-w-[500px]'>
          <h3 className="text-nowrap text-[18px] leading-[24px] font-[500]">Tóm tắt</h3>
          <div className='flex flex-col gap-[12px] pt-[12px]'>
            <div className='flex justify-between items-center'>
              <div>Tổng lượt xem</div>
              <div>213123123</div>
            </div>
            <div className='flex justify-between items-center'>
              <div>Số lượng video đã đăng tải</div>
              <div>213123123</div>
            </div>
            <div className='flex justify-between items-center'>
              <div>Số lượng comment đã đăng tải</div>
              <div>213123123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
