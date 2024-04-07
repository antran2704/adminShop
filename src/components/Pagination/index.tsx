import { useRouter } from "next/router";
import Pagination from "rc-pagination/lib/Pagination";
import { memo, useState, useEffect, Fragment } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IPagination } from "~/interface";

interface Props {
  pagination: IPagination;
}

const PaginationCus = (props: Props) => {
  const router = useRouter();
  const { pagination } = props;

  const onPagination = (page: number) => {
    router.replace({
      query: { ...router.query, page },
    });
  };

  return (
    <Pagination
      className="pagination"
      total={pagination.totalItems}
      pageSize={pagination.pageSize}
      current={pagination.currentPage}
      onChange={onPagination}
      prevIcon={() => (
        <button className="flex items-center justify-center hover:bg-primary dark:text-darkText hover:text-white w-10 h-10 border transition-all ease-linear duration-100">
          <IoIosArrowBack />
        </button>
      )}
      nextIcon={() => (
        <button className="flex items-center justify-center hover:bg-primary dark:text-darkText hover:text-white w-10 h-10 border transition-all ease-linear duration-100">
          <IoIosArrowForward />
        </button>
      )}
    />
  );
};

export default memo(PaginationCus);
