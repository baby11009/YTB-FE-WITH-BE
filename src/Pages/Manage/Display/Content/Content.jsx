import Navigate from "./Navigate";
import Display from "./Display/Display";
import { useParams } from "react-router-dom";

const Content = ({}) => {
  const params = useParams();

  return (
    <div>
      <div className='z-[2000] bg-black md:mr-[12px]'>
        <div>
          <h1 className='pt-[24px] text-nowrap text-[25px] leading-[32px] font-[600]'>
            Channel's content
          </h1>
          <div className='pt-[12px]'>
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
