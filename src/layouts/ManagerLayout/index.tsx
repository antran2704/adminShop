import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import Link from "next/link";
import { IoIosAdd } from "react-icons/io";
import { BreadcrumbCore } from "~/components/Core";

interface Props {
  children: JSX.Element;
  title: string;
  titleCreate?: string | null;
  dataBreadcrumb?: ItemType[];
  link?: string;
}

const ManagerLayout = (props: Props) => {
  const { title, titleCreate, link, dataBreadcrumb = [], children } = props;
  return (
    <section className="px-5">
      <BreadcrumbCore data={dataBreadcrumb} />

      <div className="flex items-center justify-between pb-10 gap-5">
        <h1 className="lg:text-2xl text-xl font-bold dark:text-darkText">
          {title}
        </h1>

        {titleCreate && (
          <div className="flex items-center gap-2">
            {link && (
              <Link
                href={link}
                className="flex items-center font-medium md:text-base text-sm text-white bg-primary px-3 py-2 rounded-md gap-1">
                <IoIosAdd className="md:text-2xl text-xl" />
                {titleCreate}
              </Link>
            )}
          </div>
        )}
      </div>

      {children}
    </section>
  );
};

export default ManagerLayout;
