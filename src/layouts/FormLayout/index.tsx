import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { BreadcrumbCore } from "~/components/Core";
import SpinLoading from "~/components/Loading/SpinLoading";

interface props {
  children: JSX.Element;
  title: string;
  dataBreadcrumb?: ItemType[];
  loading?: boolean;
}

const FormLayout = (props: props) => {
  const { children, title, dataBreadcrumb, loading = false } = props;

  return (
    <section className="relative w-full mx-auto p-5">
      <h1 className="lg:text-2xl md:text-xl text-lg font-semibold text-primary line-clamp-1">
        {title}
      </h1>

      {!!dataBreadcrumb?.length && <BreadcrumbCore data={dataBreadcrumb} />}

      <div className="p-5 bg-white rounded-md border-2">{children}</div>

      {loading && (
        <div className="sticky bottom-0 w-full h-screen z-20">
          <SpinLoading className="text-3xl" />
        </div>
      )}
    </section>
  );
};

export default FormLayout;
