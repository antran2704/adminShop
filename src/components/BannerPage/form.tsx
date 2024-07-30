import { Fragment } from "react";
import { UploadImage } from "../Core/Upload";
import { ButtonCheck } from "../Button";
import { useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import { ICreateBanner } from "~/interface";
import clsx from "clsx";
import { ECompressFormat, ETypeImage } from "~/enums";
import { InputText } from "../Core/Input";

interface Props {
  data?: ICreateBanner | null;
  form: UseFormReturn<ICreateBanner, any, undefined>;
  handleChangeThumbnail: (file: File | null) => void;
}

const FormBanner = (props: Props) => {
  const t = useTranslations("CreateBannerPage");

  const { data, form, handleChangeThumbnail } = props;

  const {
    control,
    formState: { errors },
    clearErrors,
    getValues,
    setValue,
  } = form;

  const onChangeImage = (file: File | null) => {
    if (!file) {
      setValue("image", "");
    } else {
      setValue("image", file.lastModified.toString());
      clearErrors("image");
    }

    handleChangeThumbnail(file);
  };

  return (
    <Fragment>
      <div className="w-full flex flex-col p-5 mt-5 bg-white rounded-md border-2 gap-5">
        {/* title */}
        <div className={clsx("relative w-full", [errors.title && "pb-2"])}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <InputText
                title={t("form.title")}
                width="w-full"
                error={!!errors.title}
                placeholder={t("placeholder.title")}
                {...field}
              />
            )}
          />
          {errors.title?.message && (
            <p className="absolute text-sm text-error">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* meta title */}
        <div className={clsx("relative w-full", [errors.title && "pb-2"])}>
          <Controller
            name="meta_title"
            control={control}
            render={({ field }) => (
              <InputText
                title={t("form.metaTitle")}
                width="w-full"
                error={!!errors.meta_title}
                placeholder={t("placeholder.metaTitle")}
                {...field}
              />
            )}
          />
          {errors.meta_title?.message && (
            <p className="absolute text-sm text-error">
              {errors.meta_title.message}
            </p>
          )}
        </div>
      </div>

      {/* thumbnail */}
      <div className="w-full flex flex-col p-5 mt-5 bg-white rounded-md border-2 gap-5">
        <Controller
          name="image"
          control={control}
          render={({ field: { ref } }) => (
            <Fragment>
              <UploadImage
                title={t("form.thumbnail")}
                height={400}
                src={
                  getValues("image")
                    ? process.env.NEXT_PUBLIC_IMAGE_ENDPOINT +
                      getValues("image")
                    : ""
                }
                error={!!errors.image?.message}
                onChangeImage={onChangeImage}
                option={{
                  quality: 80,
                  maxHeight: 600,
                  maxWidth: 1000,
                  minHeight: 600,
                  minWidth: 1000,
                  compressFormat: ECompressFormat.JPEG,
                  type: ETypeImage.file,
                }}
              />
              <input className="opacity-0 absolute" type="text" ref={ref} />
            </Fragment>
          )}
        />

        {/* status */}
        <Controller
          name="public"
          control={control}
          render={({ field: { value, onChange } }) => (
            <ButtonCheck
              title={t("form.status")}
              name="public"
              width="w-fit"
              isChecked={value}
              onChange={(_, value) => onChange(value)}
            />
          )}
        />
      </div>
    </Fragment>
  );
};

export default FormBanner;
