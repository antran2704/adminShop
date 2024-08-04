import { Button } from "antd";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";

interface props {
  children: JSX.Element;
  title: string;
  loading?: boolean;
  backLink?: string;
  okText?: string;
  cancelText?: string;
  breadcrumb?: JSX.Element;
  onSubmit: () => void;
}

const FormLayout = (props: props) => {
  const {
    children,
    title,
    backLink = "/",
    loading = false,
    breadcrumb,
    okText,
    cancelText,
    onSubmit,
  } = props;
  const tCommon = useTranslations("Common");

  const router = useRouter();

  return (
    <section className="relative lg:w-2/4 w-full mx-auto p-5">
      {breadcrumb}

      <h1 className="lg:text-2xl md:text-xl text-lg font-semibold text-primary line-clamp-1">
        {title}
      </h1>

      {children}

      <div className="sticky bottom-0 flex items-center justify-end bg-white py-4 px-5 mt-2 border rounded-md gap-5 z-20">
        <Button
          size="large"
          type="default"
          onClick={() => router.push(backLink)}
          className="min-w-[100px] w-fit text-lg text-white font-medium bg-[#111926] px-5 py-1 opacity-90 hover:opacity-100 rounded-md">
          {cancelText ? cancelText : tCommon("btn.back")}
        </Button>
        <Button
          size="large"
          type="primary"
          onClick={onSubmit}
          loading={loading}
          disabled={loading}
          className="min-w-[100px] w-fit text-lg font-medium bg-primary px-5 py-1 rounded-md z-10">
          {okText ? okText : tCommon("btn.create")}
        </Button>
      </div>
    </section>
  );
};

export default FormLayout;
