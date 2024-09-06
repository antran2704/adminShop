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

  const onPrevPage = (page: number) => {
    if (start <= 1) return;

    router.replace({
      query: { ...router.query, page },
    });
  };

  const onNextPage = (page: number) => {
    if (end >= pagination.total) return;

    router.replace({
      query: { ...router.query, page },
    });
  };

  useEffect(() => {
    const calcStart =
      (pagination.page - 1) * pagination.take <= 0
        ? 1
        : (pagination.page - 1) * pagination.take;

    const calcEnd =
      pagination.page * pagination.take >= pagination.total
        ? pagination.total
        : pagination.page * pagination.take;

    setStart(calcStart);
    setEnd(calcEnd);
  }, [pagination, router]);

  return (
    <div className="flex items-center justify-end mt-5 gap-5">
      {start <= pagination.total && (
        <Fragment>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPrevPage(pagination.page - 1)}
              className={`flex items-center justify-center ${
                start <= 1 ? "opacity-40 pointer-events-none" : ""
              }`}>
              <IoIosArrowDropleft className="hover:text-primary dark:text-darkText dark:hover:text-primary w-8 h-8 transition-all ease-linear duration-100" />
            </button>
            <button
              onClick={() => onNextPage(pagination.page + 1)}
              className={`flex items-center justify-center ${
                end >= pagination.total ? "opacity-40 pointer-events-none" : ""
              }`}>
              <IoIosArrowDropright className="hover:text-primary dark:text-darkText dark:hover:text-primary w-8 h-8 transition-all ease-linear duration-100" />
            </button>
          </div>
          <div className="w-[120px] dark:text-darkText">
            {start} to {end} of {pagination.total}
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default memo(PaginationTop);
