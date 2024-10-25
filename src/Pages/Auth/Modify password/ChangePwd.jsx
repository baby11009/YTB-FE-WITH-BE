import { useNavigate, useLocation, redirect } from "react-router-dom";
import { useState, useEffect, useLayoutEffect } from "react";
import { Input2 } from "../../../Component";
import { Link } from "react-router-dom";
import { PasswordIcon } from "../../../Assets/Icons";
import request from "../../../util/axios-base-url";

const initForm = {
  password: "",
  confirmPassword: "",
};

const initError = {
  inputName: [],
  message: [],
};

const changePwd = ({ type }) => {
  const { state } = useLocation();

  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (!state?.access) {
      navigate("/dont-have-permission");
    }
  }, [state]);

  const [formData, setFormData] = useState(initForm);

  const [isLoading, setIsLoading] = useState();

  const [error, setError] = useState(initError);

  const validatePwd = () => {
    const keys = Object.keys(formData);

    let hasErrors = false;

    keys.forEach((key) => {
      if (formData[key] === "") {
        setError((prev) => ({
          inputName: [...prev.inputName, key],
          message: [...prev.message, "Không được để trống"],
        }));
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setIsLoading(false);
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError((prev) => ({
        inputName: [...prev.inputName, "confirmPassword"],
        message: [...prev.message, "Không trùng với password"],
      }));
      setIsLoading(false);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(initError);
    setIsLoading(true);

    const valid = validatePwd();

    if (!valid) {
      setIsLoading(false);
      return;
    }

    await request
      .patch("/auth/change-password", {
        email: state.data.email,
        password: formData.password,
        type,
      })
      .then((rsp) => {
        console.log(rsp);
        alert(rsp.data.msg || "Thành công");
        setIsLoading(false);
        navigate(`/auth/success/${rsp.data.msg}`, {
          replace: true,
        });
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("🚀 ~ err:", err);
        alert(err.response.data.msg || err.response.data || "Bị lỗi rồi");
      });
  };

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
          label={"Password"}
          icon={<PasswordIcon />}
          type={"password"}
          placeholder={"Enter your password"}
          value={formData.password}
          setValue={(value) => {
            setFormData((prev) => ({ ...prev, password: value }));
          }}
          errorMsg={
            error.inputName.includes("password")
              ? `${error.message[error.inputName.indexOf("password")]}`
              : ""
          }
        />
        <Input2
          label={"Confirm Password"}
          icon={<PasswordIcon />}
          type={"password"}
          placeholder={"Enter your confirm password"}
          value={formData.confirmPassword}
          setValue={(value) => {
            setFormData((prev) => ({ ...prev, confirmPassword: value }));
          }}
          errorMsg={
            error.inputName.includes("confirmPassword")
              ? `${error.message[error.inputName.indexOf("confirmPassword")]}`
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
            <span className='text-[16px] leading-[30px]'>
              {type === "forgot" ? "Reset password" : "Change password"}
            </span>
          )}
        </button>

        <div className='flex items-center justify-between pt-[8px]'>
          <Link to={"/auth/login"}>
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
export default changePwd;
