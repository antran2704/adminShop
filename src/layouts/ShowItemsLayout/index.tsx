import Link from "next/link";
import { Fragment } from "react";
import { IoIosAdd } from "react-icons/io";

import Popup from "~/components/Popup";
import PaginationCus from "~/components/Pagination";

import { IPagination } from "~/interface/pagination";

interface Props {
  children: JSX.Element;
  title: string;
  titleCreate?: string | null;
  link?: string;
}

const ShowItemsLayout = (props: Props) => {
  const { title, titleCreate, link, children } = props;
  return (
    <section className="py-5 px-5">
      <div className="flex items-center justify-between pt-5 pb-10 gap-5">
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

export default ShowItemsLayout;
