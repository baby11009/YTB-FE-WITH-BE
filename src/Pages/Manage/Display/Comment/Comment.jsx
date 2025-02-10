import Display from "./Display/Display";
import Navigate from "./Navigate";
import { useParams } from "react-router-dom";

const Comment = () => {
  const params = useParams();

  return (
    <div>
      <div className='z-[2000] bg-black px-[8px] md:px-0'>
        <div>
          <h1 className='pt-[24px] text-nowrap text-[25px] leading-[32px] font-[600]'>
            Channel's comment
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
export default Comment;
