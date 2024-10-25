import MainLayOut from "../../../Layout/MainLayOut";

import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const SuccessPage = () => {
  const { msg } = useParams();

  return (
    <MainLayOut>
      <div className='w-screen h-screen flex items-center justify-center relative'>
        <div className='w-screen xsm:w-[80vw] xsm:max-w-[400px] backdrop-blur-[10px] bg-[#212121] p-[30px] rounded-[10px]'>
          <div className='flex flex-col gap-[16px] items-center'>
            <span className='text-[36px] leading-[38px] font-bold'>
              Thông báo
            </span>
            <span className='text-[22px] leading-[24x] font-[500]'>{msg}</span>
            <Link to={"/"}>
              <span className=' text-blue-3E font-bold underline'>Quay lại trang chủ</span>
            </Link>
          </div>
        </div>
      </div>
    </MainLayOut>
  );
};
export default SuccessPage;
