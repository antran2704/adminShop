import axios, { AxiosError } from "axios";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useState, ChangeEvent, FormEvent } from "react";
import { toast } from "react-toastify";

import { ButtonClassic } from "~/components/Button";
import ImageCus from "~/components/Image/ImageCus";
import { AxiosResponseCus } from "~/interface";
import { useAppDispatch } from "~/store/hooks";
import { login } from "~/store/slice";
import { axiosPost } from "~/ultils/configAxios";

interface IDataSend {
  email: string | null;
  password: string | null;
}

const initData: IDataSend = {
  email: null,
  password: null,
};

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<IDataSend>(initData);
  const [message, setMessage] = useState<string | null>(null);

  console.log(data);

  const onChangeData = (e: ChangeEvent<HTMLInputElement>) => {
    if (message) {
      setMessage(null);
    }

    const name = e.target.name;
    const value = e.target.value;

    setData({ ...data, [name]: value });
  };

  const onLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!data.email || !data.password) {
      setMessage("Please input field");
    }

    setLoading(true);

    try {
      const { status, payload } = await axiosPost("/users/login", data);

      if (status === 200) {
        dispatch(login(payload));

        setCookie("accessToken", payload.accessToken);

        setCookie("publicKey", payload.publicKey);

        setCookie("refreshToken", payload.refreshToken);

        setCookie("apiKey", payload.apiKey);

        router.push("/");
      }

      setLoading(false);
    } catch (err) {
      const error = err as AxiosError;

      if (axios.isAxiosError(error) && error?.response) {
        const { status, data: responseErr } =
          error.response as unknown as AxiosResponseCus;

        if (status === 400) {
          setMessage(responseErr.message);
        }

        if (status === 401) {
          setMessage("Email or Password incorrect");
          setData({ ...data, password: null });
        }

        if (status === 500) {
          toast.error("Error in server, please try again", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }

      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="bg_login flex items-center justify-center h-screen">
      <div className="lg:min-w-[1000px] md:w-4/6 sm:w-5/6 w-full flex items-start bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="lg:block hidden">
          <ImageCus src="/login.png" title="Login" />
        </div>
        <div className="lg:w-6/12 w-full md:px-10 px-5 pt-10 pb-20 ">
          <h1 className="lg:text-3xl text-2xl w-fit font-medium mx-auto">
            Login
          </h1>

          <form onSubmit={onLogin} method="POST" className="flex flex-col">
            <div className="flex flex-col items-start mt-5 gap-5">
              <div className="w-full flex flex-col items-start gap-2">
                <span className="block text-base text-[#1E1E1E] font-medium">
                  Email
                </span>
                <input
                  required
                  value={data.email || ""}
                  name="email"
                  placeholder={"Email..."}
                  onInput={onChangeData}
                  type="text"
                  className={`w-full rounded-md px-2 py-2 border-2 focus:border-[#4f46e5] outline-none`}
                />
              </div>

              <div className="w-full flex flex-col items-start gap-2">
                <span className="block text-base text-[#1E1E1E] font-medium">
                  Password
                </span>
                <input
                  required
                  name="password"
                  value={data.password || ""}
                  placeholder={"Password..."}
                  onInput={onChangeData}
                  type="password"
                  className={`w-full rounded-md px-2 py-2 border-2 focus:border-[#4f46e5] outline-none`}
                />
              </div>
              {message && <p className="text-base text-error">{message}</p>}
            </div>

            <div className="mt-5">
              <ButtonClassic
                loading={loading}
                title="Login"
                size="L"
                className="w-full flex items-center justify-center h-[52px] bg-primary"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
