import { useState } from "react";
import Navigate from "./Navigate";
import Display from "./Display/Display";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../../../../Auth Provider/authContext";

const Content = ({}) => {
  const params = useParams();

  const { openedMenu } = useAuthContext();

  return (
    <div>
      <div
        className={`fixed top-0 mt-[56px] z-[2000] w-full left-0 pl-[16px] px-[16px] md:px-[24px] ${
          openedMenu ? "md:pl-[279px]" : "md:pl-[90px]"
        }`}
      >
        <div className='bg-black'>
          <h1 className='pt-[24px] text-nowrap text-[25px] leading-[32px] font-[600]'>
            Channel's content
          </h1>
          <div className='pt-[24px]'>
            <Navigate pathParam={Object.values(params)[1]} />
          </div>
        </div>
      </div>
      <Display
        path={Object.values(params)[0]}
        pathParam={Object.values(params)[1]}
      />
    </div>
  );
};
export default Content;
