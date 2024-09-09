import { useTranslations } from "next-intl";
import { Fragment, useMemo, useState } from "react";
import { object, string } from "yup";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { ModalConfirm } from "../Modal";
import { IChangePassword } from "~/interface";
import { Input, message } from "antd";
import { changePasswordAccount } from "~/api-client/account";
import hanldeErrorAxios from "~/helper/handleErrorAxios";

const initData: IChangePassword = {
  password: "",
  newPassword: "",
  reNewPassword: "",
};

const ChangePasswordModal = () => {
  const t = useTranslations("AccountPage");
  const tSuccess = useTranslations("Success");
  const tError = useTranslations("Error");

  const router = useRouter();

  // validation project form
  const schema = useMemo(() => {
    return object().shape({
      password: string().trim().required(tError("PLEASE_INPUT")),
      newPassword: string().trim().required(tError("PLEASE_INPUT")),
      reNewPassword: string().trim().required(tError("PLEASE_INPUT")),
    });
  }, [router.locale]);

  // form control
  const {
    handleSubmit,
    setError,
    control,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<IChangePassword>({
    defaultValues: initData,
    resolver: yupResolver(schema) as any,
  });

  const [loading, setLoading] = useState<{ submit: boolean }>({
    submit: false,
  });

  const [showPopup, setShowPopup] = useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();

  const onLoading = (key: keyof typeof loading, value: boolean) => {
    setLoading({ ...loading, [key]: value });
  };

  const onShowPopup = () => {
    if (showPopup) {
      reset(initData);
      clearErrors();
    }

    setShowPopup(!showPopup);
  };

  const onSubmit = async (values: IChangePassword) => {
    if (values.newPassword !== values.reNewPassword) {
      setError("reNewPassword", { message: tError("RE_PASSWORD_INCORECT") });
      return;
    }

    onLoading("submit", true);

    await changePasswordAccount({
      newPassword: values.newPassword,
      password: values.password,
    })
      .then(() => {
        onShowPopup();
        messageApi.success(tSuccess("update"));
      })
      .catch((err) => {
        const { message, status } = hanldeErrorAxios(err);

        if (status === 400 && message === "PASSWORD_INCORRECT") {
          setError("password", {
            message: tError("PASSWORD_INCORECT"),
          });
        }
      });

    onLoading("submit", false);
  };

  return (
    <Fragment>
      <button
        onClick={onShowPopup}
        className="bg-primary text-white text-base px-5 py-2 mt-2 rounded-lg">
        {t("form.changePassword")}
      </button>
      <ModalConfirm
        title={t("changePasswordModal.title")}
        open={showPopup}
        onCancel={onShowPopup}
        centered
        type="info"
        destroyOnClose
        okButtonProps={{
          disabled: loading.submit,
          loading: loading.submit,
        }}
        onOk={handleSubmit(onSubmit)}>
        <div className="flex flex-col pt-5 gap-2">
          <div className="w-full">
            <p className="md:text-base text-base dark:text-white pb-2">
              {t("changePasswordModal.currentPassword")}
            </p>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password
                  size="large"
                  placeholder={tError("PLEASE_INPUT")}
                  status={errors.password ? "error" : ""}
                  // onPressEnter={handleSubmit(onLogin)}
                  {...field}
                />
              )}
            />
            {errors.password?.message && (
              <p className="text-sm text-error">{errors.password.message}</p>
            )}
          </div>
          <div className="w-full">
            <p className="md:text-base text-base dark:text-white pb-2">
              {t("changePasswordModal.newPassword")}
            </p>
            <Controller
              name="newPassword"
              control={control}
              render={({ field }) => (
                <Input.Password
                  size="large"
                  placeholder={tError("PLEASE_INPUT")}
                  status={errors.newPassword ? "error" : ""}
                  // onPressEnter={handleSubmit(onLogin)}
                  {...field}
                />
              )}
            />
            {errors.newPassword?.message && (
              <p className="text-sm text-error">{errors.newPassword.message}</p>
            )}
          </div>
          <div className="w-full">
            <p className="md:text-base text-base dark:text-white pb-2">
              {t("changePasswordModal.rePassword")}
            </p>
            <Controller
              name="reNewPassword"
              control={control}
              render={({ field }) => (
                <Input.Password
                  size="large"
                  placeholder={tError("PLEASE_INPUT")}
                  status={errors.reNewPassword ? "error" : ""}
                  // onPressEnter={handleSubmit(onLogin)}
                  {...field}
                />
              )}
            />
            {errors.reNewPassword?.message && (
              <p className="text-sm text-error">
                {errors.reNewPassword.message}
              </p>
            )}
          </div>
        </div>

        {/* Context Antd */}
        {contextHolder}
      </ModalConfirm>
    </Fragment>
  );
};

export default ChangePasswordModal;
