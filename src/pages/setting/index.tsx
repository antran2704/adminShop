import { Input, message } from "antd";
import { AxiosError } from "axios";
import { ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import { InputText } from "~/components/Core/Input";
import Loading from "~/components/Loading";
import Popup from "~/components/Popup";
import httpConfig from "~/configs/configAxios";
import { IResponse, IUpdateAccount, IUserInfor } from "~/interface";
import { NextPageWithLayout } from "~/interface/page";
import FormLayout from "~/layouts/FormLayout";
import { PrivateLayout } from "~/layouts";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { loginReducer } from "~/store/slice/user";
import { useTranslations } from "next-intl";
import { object, string } from "yup";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import clsx from "clsx";
import { UploadImage } from "~/components/Core/Upload";
import { ECompressFormat, ETypeImage } from "~/enums";
import { updateAccount, uploadAvartar } from "~/api-client/account";
import FormFooter from "~/components/Footer/FormFooter";

interface IPassword {
  password: string | null;
  newPassword: string | null;
  reNewPassword: string | null;
}

const initPassword: IPassword = {
  password: null,
  newPassword: null,
  reNewPassword: null,
};

const initData: IUpdateAccount = {
  email: "",
  name: "",
  avartar: null,
};

const Layout = PrivateLayout;

const SettingPage: NextPageWithLayout = () => {
  const t = useTranslations("AccountPage");
  const tError = useTranslations("Error");

  const router = useRouter();

  const dispatch = useAppDispatch();
  const { infor } = useAppSelector((state) => state.user);

  // validation project form
  const schema = useMemo(() => {
    return object().shape({
      email: string().trim().required(tError("PLEASE_INPUT")),
      name: string().trim().required(tError("PLEASE_INPUT")),
    });
  }, [router.locale]);

  // form control
  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<IUpdateAccount>({
    defaultValues: initData,
    resolver: yupResolver(schema) as any,
  });

  const [messageApi, contextHolder] = message.useMessage();

  // const [thumbnail, setThumbnail] = useState<File | null>(null);

  // const [user, setUser] = useState<IUserInfor>(infor);
  const [passwordData, setPasswordData] = useState<IPassword>(initPassword);
  const [avartar, setAvartar] = useState<File | null>(null);

  const [loading, setLoading] = useState<{ getData: boolean; submit: boolean }>(
    { getData: false, submit: false },
  );

  const [showPopup, setShowPopup] = useState<boolean>(false);

  const onLoading = (key: keyof typeof loading, value: boolean) => {
    setLoading({ ...loading, [key]: value });
  };

  const onShowPopup = () => {
    setShowPopup(!showPopup);
  };

  const changePassword = useCallback(
    (name: string, value: string) => {
      setPasswordData({ ...passwordData, [name]: value });
    },
    [passwordData],
  );

  const onChangeAvartar = (source: File | null) => {
    setAvartar(source);
  };

  const hanldeUploadAvartar = useCallback(
    async (source: File) => {
      if (!source) return;

      const formData: FormData = new FormData();
      formData.append("image", source);

      return await uploadAvartar(formData)
        .then((res: IResponse<string>) => res.payload)
        .catch(() => {
          messageApi.error(tError("UPLOAD_IMAGE"));
        });
    },
    [avartar],
  );

  const handleChangePassword = async () => {
    const { password, newPassword, reNewPassword } = passwordData;
    if (!password || !newPassword || !reNewPassword) {
      // toast.error("Vui lòng nhập đầy đủ  thông tin", {
      //   position: toast.POSITION.TOP_RIGHT,
      // });

      return;
    }

    if (newPassword !== reNewPassword) {
      setPasswordData({ ...passwordData, reNewPassword: null });
      // toast.error("Vui lòng nhập lại mật khâủ mới", {
      //   position: toast.POSITION.TOP_RIGHT,
      // });

      return;
    }

    try {
      const sendData = {
        email: "",
        password,
        newPassword,
      };

      const { status } = await httpConfig.post(
        "/admin/changePassword",
        sendData,
      );

      if (status === 201) {
        onShowPopup();
        // toast.success("Thay đổi thành công", {
        //   position: toast.POSITION.TOP_RIGHT,
        // });
        setPasswordData(initPassword);
      }
    } catch (err) {
      const error = err as AxiosError;

      if (!error.response) {
        // toast.error("Server is busy, please try again", {
        //   position: toast.POSITION.TOP_RIGHT,
        // });

        return;
      }
      const { status } = error.response;

      if (status === 500) {
        // toast.error("Server is busy, please try again", {
        //   position: toast.POSITION.TOP_RIGHT,
        // });

        return;
      }

      if (status === 401) {
        // toast.error("Mật khẩu không đúng", {
        //   position: toast.POSITION.TOP_RIGHT,
        // });
        setPasswordData(initPassword);
        return;
      }

      if (status === 400) {
        // toast.error("Thay đổi không thành công", {
        //   position: toast.POSITION.TOP_RIGHT,
        // });

        return;
      }

      console.log(error);
    }
  };

  const handleOnSubmit = async (values: IUpdateAccount) => {
    onLoading("submit", true);

    let image: string | null = values.avartar;

    if (avartar) {
      image = (await hanldeUploadAvartar(avartar)) as string;
    }

    await updateAccount(infor._id, {
      name: values.name,
      email: infor.email,
      avartar: image,
    })
      .then(({ payload }: IResponse<IUserInfor>) => {
        dispatch(loginReducer(payload));
      })
      .catch(() => {
        messageApi.error(tError("PLEASE_TRY_AGAIN"));
      });

    onLoading("submit", false);
  };

  useEffect(() => {
    if (infor) {
      reset({ name: infor.name, avartar: infor.avartar, email: infor.email });
    }
  }, [infor]);

  return (
    <FormLayout
      title={t("title")}
      dataBreadcrumb={[
        {
          title: t("title"),
        },
      ]}>
      <div className="w-full flex flex-col gap-5">
        {/* <InputText
          title={t("form.email")}
          value={user.email}
          name="email"
          placeholder="Your Email..."
          onChange={(e) => {
            const name: string = e.target.name;
            const value: string = e.target.value;

            // changeValue(name, value);
          }}
        /> */}

        {/* email */}
        <div className={clsx([errors.email && "pb-2"])}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <InputText
                title={t("form.email")}
                width="w-full"
                error={!!errors.email}
                placeholder={tError("PLEASE_INPUT")}
                {...field}
              />
            )}
          />
          {errors.email?.message && (
            <p className="absolute text-sm text-error">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* name */}
        <div className={clsx([errors.name && "pb-2"])}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <InputText
                title={t("form.name")}
                width="w-full"
                error={!!errors.name}
                placeholder={tError("PLEASE_INPUT")}
                {...field}
              />
            )}
          />
          {errors.name?.message && (
            <p className="absolute text-sm text-error">{errors.name.message}</p>
          )}
        </div>

        {/* <InputText
          title="Name"
          value={user.name}
          name="name"
          placeholder="Your Name..."
          onChange={(e) => {
            const name: string = e.target.name;
            const value: string = e.target.value;

            // changeValue(name, value);
          }}
        /> */}

        {/* avartar */}
        {infor._id && (
          <Controller
            name="avartar"
            control={control}
            render={({ field: { ref } }) => (
              <div className="md:w-1/2 w-full">
                <UploadImage
                  title={t("form.avartar")}
                  height={140}
                  width={140}
                  src={infor.avartar || ""}
                  error={!!errors.avartar?.message}
                  onChangeImage={onChangeAvartar}
                  option={{
                    quality: 80,
                    maxHeight: 100,
                    maxWidth: 100,
                    minHeight: 100,
                    minWidth: 100,
                    compressFormat: ECompressFormat.WEBP,
                    type: ETypeImage.file,
                  }}
                />
                <input className="opacity-0 absolute" type="text" ref={ref} />
              </div>
            )}
          />
        )}

        <div className="my-5">
          <span className="block text-base text-[#1E1E1E] font-medium">
            Password
          </span>

          <button
            onClick={onShowPopup}
            className="bg-primary text-white text-base px-5 py-2 mt-2 rounded-lg">
            Thay đổi mật khẩu
          </button>
        </div>

        {/* {loading && <Loading />} */}

        <FormFooter
          okProps={{
            loading: loading.submit,
            disabled: loading.submit,
          }}
          cancelElement={null}
          onOk={handleSubmit(handleOnSubmit)}
        />

        {/* {showPopup && (
          <Popup
            title="Thay đổi mật khẩu"
            show={showPopup}
            onClose={onShowPopup}>
            <div>
              <div className="mb-10">
                <Input.Password
                  title="Mật khẩu cũ"
                  width="w-full my-5"
                  value={passwordData.password || ""}
                  name="password"
                  onChange={(e) => {
                    const name: string = e.target.name;
                    const value: string = e.target.value;

                    // changeValue(name, value);
                  }}
                />

                <Input.Password
                  title="Mật khẩu mới"
                  width="w-full my-5"
                  value={passwordData.newPassword || ""}
                  name="newPassword"
                  onChange={(e) => {
                    const name: string = e.target.name;
                    const value: string = e.target.value;

                    // changeValue(name, value);
                  }}
                />

                <Input.Password
                  title="Nhập lại mật khẩu mới"
                  width="w-full my-5"
                  value={passwordData.reNewPassword || ""}
                  name="reNewPassword"
                  onPressEnter={handleChangePassword}
                  onChange={(e) => {
                    const name: string = e.target.name;
                    const value: string = e.target.value;

                    // changeValue(name, value);
                  }}
                />
              </div>

              <div className="flex lg:flex-nowrap flex-wrap items-center justify-between mt-5 lg:gap-5 gap-2">
                <button
                  onClick={onShowPopup}
                  className="lg:w-fit w-full text-lg font-medium bg-[#e2e2e2] px-5 py-1 rounded-md transition-cus">
                  Cancle
                </button>
                <button
                  onClick={handleChangePassword}
                  className="lg:w-fit w-full text-lg text-white font-medium bg-primary px-5 py-1 rounded-md">
                  Cập nhật
                </button>
              </div>
            </div>
          </Popup>
        )} */}
      </div>
    </FormLayout>
  );
};

export default SettingPage;

export async function getStaticProps(context: { locale: string }) {
  return {
    props: {
      messages: (await import(`../../../messages/${context.locale}.json`))
        .default,
    },
  };
}

SettingPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
