import { message } from "antd";
import { ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import { InputText } from "~/components/Core/Input";
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
import ChangePasswordModal from "~/components/AccountPage/ChangePasswordModal";

const initData: IUpdateAccount = {
  email: "",
  name: "",
  avartar: null,
};

const Layout = PrivateLayout;

const SettingPage: NextPageWithLayout = () => {
  const t = useTranslations("AccountPage");
  const tCommon = useTranslations("Common");
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

  const [avartar, setAvartar] = useState<File | null>(null);

  const [loading, setLoading] = useState<{ getData: boolean; submit: boolean }>(
    { getData: false, submit: false },
  );

  const onLoading = (key: keyof typeof loading, value: boolean) => {
    setLoading({ ...loading, [key]: value });
  };

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
            {t("form.password")}
          </span>

          {/* <button
            onClick={onShowPopup}
            className="bg-primary text-white text-base px-5 py-2 mt-2 rounded-lg">
            {t("form.changePassword")}
          </button> */}

          {/* Change Password */}
          <ChangePasswordModal />
        </div>

        <FormFooter
          okProps={{
            loading: loading.submit,
            disabled: loading.submit,
            className: "bg-primary text-white",
          }}
          cancelElement={null}
          okText={tCommon("btn.update")}
          onOk={handleSubmit(handleOnSubmit)}
        />

        {/* Context Antd */}
        {contextHolder}
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
