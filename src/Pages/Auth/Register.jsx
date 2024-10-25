import { PasswordIcon, UserIcon } from "../../Assets/Icons";
import { Input2 } from "../../Component";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import request from "../../util/axios-base-url";
import { useNavigate } from "react-router-dom";

const initForm = {
  email: "",
  name: "",
  password: "",
};

const initError = {
  inputName: [],
  message: [],
};

const Register = () => {
  const [formData, setFormData] = useState(initForm);

  const [error, setError] = useState(initError);

  const [isRegister, setIsRegister] = useState(false);

  const navigate = useNavigate();

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
    setIsRegister(true);
    e.preventDefault();

    const isErr = formValidate();
    if (isErr) {
      setIsRegister(false);

      return;
    }
    const email = formData.email;
    const register = await request
      .post("/auth/register", formData)
      .then((rsp) => {
        setIsRegister(false);
        console.log(rsp.data);
        alert(rsp.data.msg);
        navigate("/auth/confirm", {
          state: { access: true, type: "verify", data: { email } },
        });
      })
      .catch((err) => {
        setIsRegister(false);
        console.log("🚀 ~ err:", err);
        return alert(err.response.data.msg);
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
          label={"User name"}
          icon={<UserIcon />}
          placeholder={"Enter your user name"}
          value={formData.name}
          setValue={(value) => {
            setFormData((prev) => ({ ...prev, name: value }));
          }}
          errorMsg={
            error.inputName.includes("name")
              ? `${error.message[error.inputName.indexOf("name")]}`
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

        <button
          type='submit'
          disabled={isRegister}
          className={`w-full my-[12px] py-[10px] rounded-[20px] font-bold flex items-center justify-center
            ${isRegister ? "bg-[#1b468b] " : "bg-[#2d79f3]"}
            `}
        >
          {isRegister ? (
            <div className='size-[30px] rounded-[50%] border-[2px] border-t-[transparent] border-r-[transparent] border-[#aeaeae] animate-spin'></div>
          ) : (
            <span className='text-[16px] leading-[30px]'>Sign up</span>
          )}
        </button>

        <div className='flex items-center justify-between pt-[10px] '>
          <Link to='/auth/login'>
            <span className='text-blue-3E font-bold'>Sign in</span>
          </Link>
          <Link to={"/"}>
            <span className=' text-blue-3E font-bold'>Reconfirm</span>
          </Link>
        </div>
      </form>
    </div>
  );
};
export default Register;
