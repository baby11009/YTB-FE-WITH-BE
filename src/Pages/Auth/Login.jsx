import { PasswordIcon } from "../../Assets/Icons";
import { Input2 } from "../../Component";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import request from "../../util/axios-base-url";
import { setCookie } from "../../util/tokenHelpers";
import { useAuthContext } from "../../Auth Provider/authContext";

const initForm = {
  email: "",
  password: "",
  remember: false,
};

const initError = {
  inputName: [],
  message: [],
};

const Login = () => {
  const navigate = useNavigate();

  const { setUser } = useAuthContext();

  const [formData, setFormData] = useState(initForm);

  const [isLogin, setIsLogin] = useState(false);

  const [error, setError] = useState(initError);

  const formValidate = () => {
    if (error.inputName.length > 0) {
      setError(initError);
    }

    let hasErrors = false;

    const keys = Object.keys(formData).filter((key) => key !== "remember");

    keys.forEach((key) => {
      if (formData[key] === "") {
        setError((prev) => ({
          inputName: [...prev.inputName, key],
          message: [...prev.message, "Không được để trống"],
        }));
        hasErrors = true;
      }
    });

    const emailRegex = new RegExp(
      "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$"
    );

    if (!emailRegex.test(formData.email)) {
      setError((prev) => ({
        inputName: [...prev.inputName, "email"],
        message: [...prev.message, "Không đúng định dạng"],
      }));
      hasErrors = true;
    }

    if (hasErrors) {
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLogin(true);

    const isErr = formValidate();

    if (isErr) {
      setIsLogin(false);
      return;
    }

    const login = await request
      .post("/auth/login", { ...formData })
      .then((rsp) => {
        console.log(rsp.data);
        setCookie(import.meta.env.VITE_AUTH_TOKEN, rsp.data.token);
        setUser(rsp.data?.data);
        navigate("/", { replace: true });
      })
      .catch((err) => {
        console.log("🚀 ~ err:", err);
        return alert(err.response.data.msg);
      })
      .finally(() => {
        setIsLogin(false);
      });
  };

  useEffect(() => {
    let timeOut;
    if (error.inputName.length > 0) {
      timeOut = setTimeout(() => {
        setError(initError);
      }, 2500);
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
          value={formData.email}
          setValue={(value) => {
            setFormData((prev) => ({ ...prev, email: value }));
          }}
          errorMsg={
            error.inputName.includes("email")
              ? `${error.message[error.inputName.indexOf("email")]}`
              : ""
          }
        />

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

        <div className='flex items-center justify-between text-[14px] leading-[16px]'>
          <div className='flex items-center gap-[8px]'>
            <input
              type='checkbox'
              name=''
              id='rem'
              className='w-[16px] h-[24px] cursor-pointer'
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  remember: e.target.checked,
                }));
              }}
            />
            <label htmlFor='rem' className=' cursor-pointer '>
              Remember me
            </label>
          </div>

          <Link to={"/auth/forgot-pwd-1"}>
            <span className=' text-blue-3E font-bold'>Forgot password ?</span>
          </Link>
        </div>

        <button
          type='submit'
          disabled={isLogin}
          className={`w-full my-[20px] py-[10px] rounded-[20px] font-bold flex items-center justify-center
            ${isLogin ? "bg-[#1b468b] " : "bg-[#2d79f3]"}
            `}
        >
          {isLogin ? (
            <div className='size-[30px] rounded-[50%] border-[2px] border-t-[transparent] border-r-[transparent] border-[#aeaeae] animate-spin'></div>
          ) : (
            <span className='text-[16px] leading-[30px]'>Sign in</span>
          )}
        </button>

        <div className='flex items-center justify-between pt-[10px] '>
          <Link to='/auth/register'>
            <span className='text-blue-3E font-bold'>Sign up</span>
          </Link>
          <Link to={"/auth/change-pwd-1"}>
            <span className=' text-blue-3E font-bold'>Change password</span>
          </Link>
        </div>
      </form>
    </div>
  );
};
export default Login;
