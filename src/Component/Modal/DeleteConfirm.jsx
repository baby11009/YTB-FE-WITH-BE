import { useState } from "react";
import { useAuthContext } from "../../Auth Provider/authContext";

const DeleteConfirm = ({ handleDelete, type, data }) => {
  const { setIsShowing } = useAuthContext();

  const [value, setValue] = useState("");

  const handleOnClick = () => {
    if (value === "OK") {
      handleDelete();
      setIsShowing();
    }
  };

  return (
    <div
      className='size-full max-h-[350px] max-w-[500px] bg-black rounded-[5px] py-[12px] px-[24px]'
      style={{ userSelect: "none" }}
    >
      <h1 className='text-center text-[20px] font-[500]'>
        {type}'s delete confirm
      </h1>
      <div className='mt-[20px]'>
        Enter "<span className='font-bold'>OK</span>"" into the form below to
        confirm that you really want to delete this {type.toLowerCase()} with id
        : {data}
      </div>
      <textarea
        name=''
        id=''
        className='w-full resize-none bg-transparent outline-none border-[2px] rounded-[5px] mt-[24px] p-[8px]'
        rows={4}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      ></textarea>
      <div className='flex items-center gap-[24px] justify-center mt-[12px]'>
        <button
          className={`py-[4px] px-[12px] rounded-[5px] bg-blue-600 ${
            value !== "OK" ? "opacity-[0.7]" : ""
          } `}
          disabled={value !== "OK"}
          onClick={handleOnClick}
        >
          <span>Confirm</span>
        </button>
        <button
          className={`py-[4px] px-[12px] rounded-[5px] bg-black-0.1`}
          onClick={() => {
            setIsShowing(undefined);
          }}
        >
          <span>Cancel</span>
        </button>
      </div>
    </div>
  );
};
export default DeleteConfirm;
