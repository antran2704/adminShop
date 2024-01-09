import { AxiosError } from "axios";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { ButtonClassic } from "~/components/Button";
import ImageCus from "~/components/Image/ImageCus";
import { InputText } from "~/components/InputField";
import { axiosPost } from "~/ultils/configAxios";

interface IDataSend {
  email: string | null;
}

const initData: IDataSend = {
  email: null,
};

const PasswordResetPage = () => {
  const [data, setData] = useState<IDataSend>(initData);
  const [message, setMessage] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [sendSuccess, setSendSuccess] = useState<boolean>(false);

  const onChangeData = (name: string, value: string) => {
    if (message) {
      setMessage(null);
    }

    setData({ ...data, [name]: value });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!data.email) return;

    setLoading(true);

    try {
      const { status } = await axiosPost("/admin/forget-password/send-email", {
        email: data.email,
      });

      if (status === 201) {
        setSendSuccess(true);
      }
    } catch (err) {
      const error = err as AxiosError;

      if (!error.response) {
        toast.error("Server is busy, please try again", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setLoading(false);
        return;
      }
      const { status } = error.response;

      if (status === 500) {
        toast.error("Server is busy, please try again", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }

      if (status === 400) {
        setMessage("Email không đúng định dạng");
      }

      if (status === 404) {
        setMessage("Email không tồn tại");
      }
    }
    setLoading(false);
  };

  return (
    <div className="bg_login flex items-center justify-center h-screen">
      <div className="lg:min-w-[1000px] md:w-4/6 sm:w-5/6 w-full flex items-start bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="lg:block hidden">
          <ImageCus
            src="/forget_password.svg"
            title="Login"
            className="w-[500px] h-[600px]"
          />
        </div>
        <div className="lg:w-6/12 w-full md:px-10 px-5 pt-10 pb-20 ">
          {!sendSuccess && (
            <div className="w-full">
              <h1 className="lg:text-3xl text-2xl w-fit font-medium mx-auto">
                Forget Password
              </h1>

              <form onSubmit={onSubmit} method="POST" className="flex flex-col">
                <div className="flex flex-col items-start mt-5 gap-5">
                  <InputText
                    title="Email"
                    width="w-full"
                    value={data.email || ""}
                    name="email"
                    required={true}
                    size="M"
                    placeholder="Your Email..."
                    getValue={onChangeData}
                  />

                  {message && <p className="text-base text-error">{message}</p>}
                </div>

                <div className="mt-5">
                  <ButtonClassic
                    loading={loading}
                    title="Submit"
                    size="L"
                    className="w-full flex items-center justify-center h-[52px] bg-primary"
                  />
                </div>

                <div className="flex items-center justify-center">
                  <Link
                    className="block hover:underline hover:text-primary my-5"
                    href="/login"
                  >
                    Đăng nhập
                  </Link>
                </div>
              </form>
            </div>
          )}

          {sendSuccess && (
            <div className="flex flex-col items-center justify-center gap-5">
              <ImageCus className="w-20 h-20" src="/check.gif" />
              <h1 className="lg:text-3xl text-2xl w-fit font-medium mx-auto">
                Send successfully
              </h1>
              <p className="text-base font-medium">Please check your email</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;
