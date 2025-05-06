import Navigate from "./Navigate";
import { Outlet } from "react-router-dom";
import { Suspense } from "react";

const Content = () => {
  return (
    <div>
      <div className='z-[2000] bg-black md:mr-[12px]'>
        <div>
          <h1 className='pt-[24px] text-nowrap text-[25px] leading-[32px] font-[600]'>
            Channel's content
          </h1>
          <div className='pt-[12px]'>
            <Navigate />
          </div>
        </div>
      </div>
      <Suspense>
        <div className='md:mr-[12px] h-[calc(100vh-170px)]'>
          <Outlet />
        </div>
      </Suspense>
    </div>
  );
};
export default Content;
