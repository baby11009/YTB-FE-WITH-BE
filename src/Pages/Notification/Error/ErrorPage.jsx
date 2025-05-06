import { useGetLocationSearchValue } from "../../../Hooks";

const Error = () => {
  const { status, message } = useGetLocationSearchValue({
    status: 400,
    message: "There is something wrong",
  });

  return (
    <section className='w-screen h-screen flex flex-col items-center justify-center bg-black text-white'>
      <h1 className='text-[120px] leading-[122px] font-bold'>{status}</h1>
      <p className='text-[28px] leading-[30px] font-[500]'>{message}</p>
    </section>
  );
};
export default Error;
