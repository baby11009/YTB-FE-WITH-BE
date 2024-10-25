import { useParams } from "react-router-dom";

const Error = () => {
  const { code, msg } = useParams();
  console.log("🚀 ~ code, msg:", code, msg);

  return (
    <section className='w-screen h-screen flex flex-col items-center justify-center bg-black text-white'>
      <h1 className='text-[120px] leading-[122px] font-bold'>{code}</h1>
      <p className='text-[28px] leading-[30px] font-[500]'>{msg}</p>
    </section>
  );
};
export default Error;
