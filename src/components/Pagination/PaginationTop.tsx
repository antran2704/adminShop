import { useRouter } from "next/router";
import { Fragment, memo, useEffect, useState } from "react";
import { IoIosArrowDropright, IoIosArrowDropleft } from "react-icons/io";
import { IPagination } from "~/interface";

interface Props {
  pagination: IPagination;
}

const PaginationTop = (props: Props) => {
  const router = useRouter();
  const { pagination } = props;

  const [start, setStart] = useState<number>(0);
  const [end, setEnd] = useState<number>(0);
  console.log("re-render paginatrion");
  const onPrevPage = (page: number) => {
    if (start <= 1) return;

    router.replace({
      query: { ...router.query, page },
    });
  };

  const onNextPage = (page: number) => {
    if (end >= pagination.totalItems) return;

    router.replace({
      query: { ...router.query, page },
    });
  };

  useEffect(() => {
    const calcStart =
      (pagination.currentPage - 1) * pagination.pageSize <= 0
        ? 1
        : (pagination.currentPage - 1) * pagination.pageSize;

    const calcEnd =
      pagination.currentPage * pagination.pageSize >= pagination.totalItems
        ? pagination.totalItems
        : pagination.currentPage * pagination.pageSize;

    setStart(calcStart);
    setEnd(calcEnd);
  }, [pagination, router]);

  return (
    <div className="flex items-center justify-end mt-5 gap-5">
      {start <= pagination.totalItems && (
        <Fragment>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPrevPage(pagination.currentPage - 1)}
              className={`flex items-center justify-center ${
                start <= 1 ? "opacity-40 pointer-events-none" : ""
              }`}
            >
              <IoIosArrowDropleft className="hover:text-primary w-8 h-8 transition-all ease-linear duration-100" />
            </button>
            <button
              onClick={() => onNextPage(pagination.currentPage + 1)}
              className={`flex items-center justify-center ${
                end >= pagination.totalItems
                  ? "opacity-40 pointer-events-none"
                  : ""
              }`}
            >
              <IoIosArrowDropright className="hover:text-primary w-8 h-8 transition-all ease-linear duration-100" />
            </button>
          </div>
          <div className="w-[120px]">
            {start} to {end} of {pagination.totalItems}
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default memo(PaginationTop);
