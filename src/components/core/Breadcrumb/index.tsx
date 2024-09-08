import { Breadcrumb } from "antd";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface Props {
  data: ItemType[];
  separator?: string;
}

const BreadcrumbCompoent = (props: Props) => {
  const { data = [], separator = ">" } = props;

  const t = useTranslations("Common");

  return (
    <div className="py-5">
      <Breadcrumb
        items={[
          {
            title: (
              <Link
                href={"/"}
                className="dark:!text-white dark:hover:!text-primary-200">
                {t("breadcrumb.home")}
              </Link>
            ),
          },
          ...data.map((item: ItemType, index: number) => ({
            ...item,
            title: item.href ? (
              <Link
                href={item.href}
                className={clsx(
                  "block dark:!text-white dark:hover:!text-primary-200",
                  [index === data.length - 1 && "font-semibold"],
                )}>
                {item.title}
              </Link>
            ) : (
              <span
                className={clsx("dark:!text-white", [
                  index === data.length - 1 && "font-semibold",
                ])}>
                {item.title}
              </span>
            ),
            href: undefined,
          })),
        ]}
        separator={<span className="dark:!text-white">{separator}</span>}
      />
    </div>
  );
};

export default BreadcrumbCompoent;
