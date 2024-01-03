import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ButtonClassic } from "~/components/Button";
import ImageCus from "~/components/Image/ImageCus";
import { InputPassword } from "~/components/InputField";
import Loading from "~/components/Loading";
import { AxiosResponseCus } from "~/interface";
import { axiosPost } from "~/ultils/configAxios";

interface IDataSend {
  password: string | null;
  confirmPassword: string | null;
}

interface ISearchParams {
  email: string | null;
  token: string | null;
  key: string | null;
}

const initData: IDataSend = {
  password: null,
  confirmPassword: null,
};

const initSearchParams: ISearchParams = {
  email: null,
  token: null,
  key: null,
};

const CheckPasswordKeyPage = () => {
  const router = useRouter();
  const query = useSearchParams();

  const [data, setData] = useState<IDataSend>(initData);
  const [searchParams, setSearchParams] =
    useState<ISearchParams>(initSearchParams);
  const [message, setMessage] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingCheck, setLoadingCheck] = useState<boolean>(false);
  const [checkError, setCheckError] = useState<boolean>(false);

  const onChangeData = (name: string, value: string) => {
    if (message) {
      setMessage(null);
    }

    setData({ ...data, [name]: value });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { password, confirmPassword } = data;
    const { email, key, token } = searchParams;

    if (!password || !confirmPassword) {
      setMessage("Please input field");
      return;
    }

    if (password !== confirmPassword) {
      setData({ ...data, confirmPassword: null });
      setMessage("Confirm password incorect");
      return;
    }

    setLoading(true);
    try {
      const { status } = await axiosPost("/admin/forget-password", {
        email,
        token,
        key,
        password,
      });

      if (status === 201) {
        router.push("/login");
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
      const { status, data: payload } =
        error.response as unknown as AxiosResponseCus;

      if (status === 500) {
        toast.error("Server is busy, please try again", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }

      if (status === 400) {
        setMessage(payload.message);
      }

      if (status === 404) {
        setMessage("Email không tồn tại");
      }
    }
    setLoading(false);
  };

  const handleCheckKey = async (email: string, token: string, key: string) => {
    setLoadingCheck(true);

    try {
      const { status } = await axiosPost("/admin/forget-password/check-key", {
        email,
        t_k: token,
        k_y: key,
      });

      if (status === 200) {
        setSearchParams({ email, token, key });
      }
    } catch (err) {
      toast.error("Server is busy, please try again", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setCheckError(true);
    }
    setLoadingCheck(false);
  };

  useEffect(() => {
    const emailParams = query.get("email");
    const tokenParams = query.get("t_k");
    const keyParams = query.get("k_y");

    if (!emailParams || !tokenParams || !keyParams) {
      setLoadingCheck(false);
      setCheckError(true);
      return;
    }

    handleCheckKey(emailParams, tokenParams, keyParams);
  }, []);

  return (
    <div className="bg_login flex items-center justify-center h-screen">
      <div className="lg:w-1/2 md:w-4/6 sm:w-5/6 w-full flex items-start bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="w-full md:px-10 px-5 pt-10 pb-20 ">
          {!checkError && (
            <div className="w-full">
              <h1 className="lg:text-3xl text-2xl w-fit font-medium mx-auto">
                New Password
              </h1>

              <form onSubmit={onSubmit} method="POST" className="flex flex-col">
                <div className="flex flex-col items-start mt-5 gap-5">
                  <InputPassword
                    title="Password"
                    width="w-full"
                    value={data.password || ""}
                    name="password"
                    required={true}
                    size="M"
                    placeholder="New Password..."
                    getValue={onChangeData}
                  />

                  <InputPassword
                    title="Confirm Password"
                    width="w-full"
                    value={data.confirmPassword || ""}
                    name="confirmPassword"
                    required={true}
                    size="M"
                    placeholder="Confirm Password..."
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
              </form>
            </div>
          )}

          {checkError && !loadingCheck && (
            <div className="flex flex-col items-center justify-center gap-5">
              <ImageCus className="w-20 h-20" src="/error.gif" />
              <h1 className="lg:text-3xl text-2xl w-fit font-medium mx-auto">
                Rất tiếc
              </h1>
              <p className="text-base font-medium text-center">
                Liên kết đặt lại mật khẩu không hợp lệ / đã hết hạn (chỉ hợp lệ
                trong vòng 24 giờ), có thể do liên kết này đã được sử dụng.
              </p>
              <p className="text-base font-medium">
                Vui lòng yêu cầu
                <Link
                  className="underline hover:text-primary px-1"
                  href="/password/reset"
                >
                  đặt lại mật khẩu mới
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>

      {loadingCheck && <Loading />}
    </div>
  );
};

export default CheckPasswordKeyPage;
