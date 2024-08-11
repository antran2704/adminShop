import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, ReactElement, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Button, Input } from "antd";
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";

import ImageCus from "~/components/Image/ImageCus";
import { PublicLayout } from "~/layouts";

import { loginReducer } from "~/store/slice/user";
import { useAppDispatch } from "~/store/hooks";

import { login } from "~/api-client";

import { NextPageWithLayout } from "~/interface/page";
import { ILogin, IResponseLogin, IResponse } from "~/interface";

import { setAuthLocal } from "~/helper/auth";

const initData: ILogin = {
  email: "",
  password: "",
};

const Layout = PublicLayout;

const LoginPage: NextPageWithLayout = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const t = useTranslations("LoginPage");
  const tError = useTranslations("Error");

  // validation project form
  const schema = useMemo(() => {
    return object().shape({
      email: string().trim().required(tError("PLEASE_INPUT")),
      password: string().trim().required(tError("PLEASE_INPUT")),
    });
  }, [router.locale]);

  // form control
  const {
    handleSubmit,
    setValue,
    setError,
    control,
    formState: { errors },
  } = useForm<ILogin>({
    defaultValues: initData,
    resolver: yupResolver(schema) as any,
  });

  const [loading, setLoading] = useState<boolean>(false);

  const onLogin = async (values: ILogin) => {
    setLoading(true);
    const sendData: ILogin = {
      email: values.email.toLowerCase().trim() as string,
      password: values.password.trim(),
    };

    try {
      const { status, payload }: IResponse<IResponseLogin> =
        await login(sendData);

      if (status === 200) {
        setAuthLocal("accessToken", payload.accessToken.value);
        setAuthLocal("refreshToken", payload.refreshToken.value);
        setAuthLocal("apiKey", payload.apiKey);
        setAuthLocal("publicKey", payload.publicKey);
        dispatch(loginReducer(payload));
        router.push("/");
      }
    } catch (err) {
      const error = err as AxiosError;
      if (error?.response) {
        const { status, data: responseErr }: any = error.response;

        if (status === 400) {
          setError("password", { message: responseErr.message });
        }

        if (status === 401 || status === 404) {
          setError("password", { message: tError("EMAIL_PASSWORD_INCORECT") });
          setValue("password", "");
        }
      }

      setLoading(false);
    }
  };

  return (
    <div className="lg:w-8/12 md:w-4/6 sm:w-5/6 w-full flex items-start bg-white dark:bg-[#1f2937] rounded-lg shadow-xl  transition-all ease-linear duration-100 overflow-hidden">
      <div className="lg:block lg:w-6/12 hidden">
        <ImageCus
          src="/login_bg.svg"
          title="Login"
          className="w-[500px] h-[600px] mx-auto"
        />
      </div>
      <div className="lg:w-6/12 w-full md:px-10 px-5 pt-10 pb-20">
        <h1 className="lg:text-3xl text-2xl dark:text-darkText w-fit font-medium mx-auto">
          {t("title")}
        </h1>

        <div className="flex flex-col items-start mt-5 gap-5">
          <div className="w-full">
            <h3 className="md:text-base text-base dark:text-white pb-2">
              {t("email.title")}
            </h3>

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  size="large"
                  placeholder={t("email.placeholder")}
                  status={errors.email ? "error" : ""}
                  {...field}
                />
              )}
            />
          </div>
          <div className="w-full">
            <h3 className="md:text-base text-base dark:text-white pb-2">
              {t("password.title")}
            </h3>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password
                  size="large"
                  placeholder={t("password.placeholder")}
                  status={errors.password ? "error" : ""}
                  onPressEnter={handleSubmit(onLogin)}
                  {...field}
                />
              )}
            />
          </div>

          {errors.password && (
            <p className="text-base text-error">{errors.password.message}</p>
          )}
        </div>

        <div className="mt-5">
          <Button
            loading={loading}
            size="large"
            type="primary"
            onClick={handleSubmit(onLogin)}
            className="w-full flex items-center justify-center py-5">
            {t("submit")}
          </Button>

          <div className="flex items-center justify-center">
            <Link
              className="block hover:underline dark:text-darkText hover:text-primary dark:hover:text-primary text-sm my-5"
              href="/password/reset">
              {t("forgetPassword")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

export async function getStaticProps(context: { locale: string }) {
  return {
    props: {
      messages: (await import(`../../../messages/${context.locale}.json`))
        .default,
    },
  };
}

LoginPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
