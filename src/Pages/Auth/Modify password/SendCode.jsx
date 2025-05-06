import { Link } from "react-router-dom";
import { Input2 } from "../../../Component";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import request from "../../../util/axios-base-url";

const initError = {
  inputName: [],
  message: [],
};

const SendCode = ({ type }) => {
  const [email, setEmail] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState(initError);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(initError);
    setIsLoading(true);

    // Validate email
    if (!email) {
      setError((prev) => ({
        inputName: [...prev.inputName, "email"],
        message: [...prev.message, "Không được để trống"],
      }));
      setIsLoading(false);
      return;
    }

    const emailRegex = new RegExp(
      "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$"
    );

    if (!emailRegex.test(email)) {
      setError((prev) => ({
        inputName: [...prev.inputName, "email"],
        message: [...prev.message, "Không đúng định dạng"],
      }));
      setIsLoading(false);
      return;
    }

    await request
      .post("/auth/send-code", {
        email,
        type: type || "forgot",
      })
      .then((rsp) => {
        console.log(rsp);
        setIsLoading(false);
        alert(rsp.data.msg || "Thành công");
        navigate("/auth/confirm", {
          state: { access: true, type: type || "forgot", data: { email } },
        });
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        alert(err.response.data.msg || err.response.data || "Bị lỗi rồi");
      });
  };

  useEffect(() => {
    let timeOut;
    if (error.inputName.length > 0) {
      timeOut = setTimeout(() => {
        setError(initError);
      }, 1500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [error]);

  return (
    <div className='w-screen h-screen flex items-center justify-center relative'>
      <form
        noValidate
        onSubmit={handleSubmit}
        className='w-screen xsm:w-[80vw] xsm:max-w-[450px] backdrop-blur-[10px] bg-[#212121] p-[30px] rounded-[10px]'
      >
        <div className='w-full flex justify-center mb-[16px]'>
          <Link to={"/"}>
            <span className='text-[32px] leading-[34px] font-bold'>LOGO</span>
          </Link>
        </div>
        <Input2
          label={"Email"}
          icon={"@"}
          type={"email"}
          placeholder={"Enter your email"}
          value={email}
          setValue={(value) => {
            setEmail(value);
          }}
          errorMsg={
            error.inputName.includes("email")
              ? `${error.message[error.inputName.indexOf("email")]}`
              : ""
          }
        />

        <button
          type='submit'
          disabled={isLoading}
          className={`w-full my-[8px] py-[10px] rounded-[20px] font-bold flex items-center justify-center
            ${isLoading ? "bg-[#1b468b] " : "bg-[#2d79f3]"}
        `}
        >
          {isLoading ? (
            <div className='size-[30px] rounded-[50%] border-[2px] border-t-[transparent] border-r-[transparent] border-[#aeaeae] animate-spin'></div>
          ) : (
            <span className='text-[16px] leading-[30px]'>Lấy mã OTP</span>
          )}
        </button>

        <div className='flex items-center justify-between pt-[8px]'>
          <Link to={"/auth"}>
            <span className=' text-blue-3E font-bold'>Sign in</span>
          </Link>
          <Link to={"/auth/register"}>
            <span className=' text-blue-3E font-bold'>Sign up</span>
          </Link>
        </div>
      </form>
    </div>
  );
};
export default SendCode;
