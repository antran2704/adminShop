import { useRouter } from "next/router";
import { memo, useState, useEffect, Fragment } from "react";
import { IPagination } from "~/interface";

interface Props {
  pagination: IPagination;
}

const Pagination = (props: Props) => {
  const router = useRouter();
  const { pagination } = props;
  const [totalPages, setTotalPages] = useState<number[]>([]);

  const onPagination = (page: number) => {
    router.replace({
      query: { ...router.query, page },
    });
  };

  const onNext = () => {
    router.replace({
      query: { ...router.query, page: pagination.currentPage + 1 },
    });
  };

  const onPrev = () => {
    router.replace({
      query: { ...router.query, page: pagination.currentPage - 1 },
    });
  };

  useEffect(() => {
    if (pagination && pagination.totalItems > 0 && totalPages.length === 0) {
      let pages = [];
      const totalItems = pagination.totalItems;
      const pageSize = pagination.pageSize;
      const listPages = Math.ceil(totalItems / pageSize);
      if (listPages !== totalPages.length) {
        for (let x = 1; x <= listPages; x++) {
          pages.push(x);
        }
        setTotalPages(pages);
      }
    }
  }, [pagination]);

  return (
    <Fragment>
        <div className="flex lg:flex-row flex-col-reverse items-center justify-between py-5 work-sans gap-2">
          <div>
            <p className="flex items-center text-sm leading-5 text-blue-700 gap-1">
              Showing
              <span className="font-medium">
                {(pagination.currentPage - 1) * pagination.pageSize + 1}
              </span>
              to
              <span className="font-medium">
                {pagination.currentPage * pagination.pageSize >
                pagination.totalItems
                  ? pagination.totalItems
                  : pagination.currentPage * pagination.pageSize}
              </span>
              of
              <span className="font-medium">{pagination.totalItems}</span>
              results
            </p>
          </div>
          <div className="flex items-center">
            <div
              className={`${
                pagination.currentPage <= 1 && "opacity-60 pointer-events-none"
              }`}
            >
              <button
                onClick={onPrev}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue hover:bg-blue-600 hover:text-white active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <div>
              {totalPages.length > 0 &&
                totalPages.map((page: number) => (
                  <button
                    key={page}
                    onClick={() => onPagination(page)}
                    className={`${
                      page === pagination.currentPage
                        ? "text-white bg-blue-600 pointer-events-none"
                        : "text-blue-600 bg-white"
                    } -ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium hover:bg-blue-600 hover:text-white focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-tertiary active:text-gray-700 transition ease-in-out duration-150 hover:bg-tertiary`}
                  >
                    {page}
                  </button>
                ))}
            </div>
            <div
              className={`${
                pagination.currentPage >= totalPages[totalPages.length - 1] &&
                "opacity-60 pointer-events-none"
              }`}
            >
              <button
                onClick={onNext}
                className="-ml-px relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-white hover:bg-blue-600 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
    </Fragment>
  );
};

export default memo(Pagination);
