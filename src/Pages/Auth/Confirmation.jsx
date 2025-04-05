import { useState, useRef, useEffect, useLayoutEffect } from "react";
import request from "../../util/axios-base-url";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const length = 5;

const Confirmation = () => {
  const { state } = useLocation();

  const navigate = useNavigate();

  const [otp, setOtp] = useState(Array(length).fill(""));

  const inputs = useRef([]);

  const [isConfirm, setIsConfirm] = useState(false);

  const [error, setError] = useState("");

  const handleChange = (e, index) => {
    const { value } = e.target;

    // Only allow single digit input
    if (value.match(/^\d$/)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to the next input
      if (index < length - 1) {
        inputs.current[index + 1].focus();
      }
    }

    // Move focus to previous input on backspace
    if (value === "" && index >= 0) {
      console.log(1);

      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      inputs.current[Math.max(0, index - 1)].focus();
    }
  };

  const handleKeyUp = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "") {
      // Move focus to previous input on backspace if current input is empty

      inputs.current[Math.max(0, index - 1)].focus();
    }
  };

  const verifyAccount = async (otp) => {
    await request
      .patch("/auth/validate-verify-otp", {
        email: state.data.email,
        code: otp,
        type: state.type,
      })
      .then((rsp) => {
        console.log(rsp);
        alert(rsp.data.msg || "Thành công");
        setIsConfirm(false);
        navigate(`/auth/success/${rsp.data.msg}`, { replace: true });
      })
      .catch((err) => {
        setIsConfirm(false);
        console.log("🚀 ~ err:", err);
        alert(err.response.data.msg || err.response.data || "Bị lỗi rồi");
      });
  };

  const verifyOtp = async (otp) => {
    await request
      .patch("/auth/validate-otp", {
        email: state.data.email,
        type: state.type,
        code: otp,
      })
      .then((rsp) => {
        console.log(rsp);
        alert(rsp.data.msg || "Thành công");
        setIsConfirm(false);
        let path;
        switch (state.type) {
          case "forgot":
            path = "/auth/forgot-pwd-2";
            break;
          case "change":
            path = "/auth/change-pwd-2";
            break;
          default:
            path = "/auth/forgot-pwd-2";
            break;
        }
        navigate(path, {
          replace: true,
          state: { access: true, data: { email: state.data.email } },
        });
      })
      .catch((err) => {
        setIsConfirm(false);
        console.log("🚀 ~ err:", err);
        alert(err.response.data.msg || err.response.data || "Bị lỗi rồi");
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsConfirm(true);
    setError("");

    const validate = otp.filter((num, index) => num === "");

    if (validate.length > 0) {
      setIsConfirm(false);
      setError("Hãy điền đầy đủ mã OTP");
      return;
    }

    const finalOtp = otp.join("");

    switch (state.type) {
      case "verify":
        verifyAccount(finalOtp);
        break;
      default:
        verifyOtp(finalOtp);
        break;
    }
  };

  useEffect(() => {
    let timeOut;
    if (error) {
      timeOut = setTimeout(() => {
        setError("");
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
        className='w-screen xsm:w-[80vw] xsm:max-w-[400px] backdrop-blur-[10px] bg-[#212121] p-[30px] rounded-[10px]'
      >
        <div className='flex items-center justify-between'>
          {otp.map((_, index) => (
            <input
              key={index}
              type='text'
              name=''
              id=''
              maxLength={1}
              autoFocus={index === 0}
              ref={(el) => (inputs.current[index] = el)}
              value={otp[index]}
              onChange={(e) => handleChange(e, index)}
              onKeyUp={(e) => handleKeyUp(e, index)}
              className='bg-transparent size-[60px] rounded-[5px] outline-none border-[2px] text-center text-[22px] leading-[24px]'
            />
          ))}
        </div>

        <div className='text-[14px] leading-[16px] text-red-FF my-[15px]'>
          {error}
        </div>

        <button
          type='submit'
          disabled={isConfirm}
          className={`w-full my-[20px] py-[10px] rounded-[20px] font-bold flex items-center justify-center
            ${isConfirm ? "bg-[#1b468b] " : "bg-[#2d79f3]"}
            `}
        >
          {isConfirm ? (
            <div className='size-[30px] rounded-[50%] border-[2px] border-t-[transparent] border-r-[transparent] border-[#aeaeae] animate-spin'></div>
          ) : (
            <span className='text-[16px] leading-[30px]'>Confirm</span>
          )}
        </button>
      </form>
    </div>
  );
};
export default Confirmation;
