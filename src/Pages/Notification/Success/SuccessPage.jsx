import MainLayOut from "../../../Layout/MainLayOut";

import { Link } from "react-router-dom";

import { useGetLocationSearchValue } from "../../../Hooks";

const SuccessPage = () => {
  const { message } = useGetLocationSearchValue({
    message: "Success on doing something",
  });

  return (
    <MainLayOut>
      <div className='w-screen h-screen flex items-center justify-center relative'>
        <div className='w-screen xsm:w-[80vw] xsm:max-w-[400px] backdrop-blur-[10px] bg-[#212121] p-[30px] rounded-[10px]'>
          <div className='flex flex-col gap-[16px] items-center'>
            <span className='text-[36px] leading-[38px] font-bold'>
              Notification
            </span>
            <span className='text-[22px] leading-[24x] font-[500]'>
              {message}
            </span>
            <Link to={"/"}>
              <span className=' text-blue-3E font-bold underline'>
                Return to Home page
              </span>
            </Link>
          </div>
        </div>
      </div>
    </MainLayOut>
  );
};
export default SuccessPage;
