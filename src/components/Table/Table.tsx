import { FC, Fragment, memo, SetStateAction } from "react";
import NoResult from "../NoResult";
import PaginationTop from "../Pagination/PaginationTop";
import { IPagination } from "~/interface";

interface Props {
  children: JSX.Element;
  colHeadTabel: string[];
  items?: any[];
  selects?: string[];
  setSelects?: (value: SetStateAction<string[]>) => void;
  isSelected?: boolean;
  selectAll?: boolean;
  message?: string | null;
  loading: boolean;
  pagination?: IPagination;
}

const Table: FC<Props> = (props: Props) => {
  const {
    children,
    colHeadTabel,
    items = [],
    selects = [],
    message,
    loading,
    pagination,
    isSelected = false,
    selectAll = false,
    setSelects,
  } = props;

  const onSelectCheckBoxAll = () => {
    if (!setSelects) return;

    if (selects.length === items.length) {
      setSelects([]);
    } else {
      const newItems = items.map((item: any) => item._id);
      setSelects(newItems as string[]);
    }
  };

  return (
    <Fragment>
      {pagination && pagination.totalItems > pagination.pageSize && (
        <div className="pb-5">
          <PaginationTop pagination={pagination} />
        </div>
      )}
      <div className="scrollHidden overflow-x-auto">
        <div className="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard rounded-lg border dark:border-gray-400">
          <table className="min-w-full">
            <thead className="bg-[#f4f5f7] dark:bg-gray-800">
              <tr>
                {!loading && selectAll && items.length > 0 && (
                  <th className="px-6 py-3 border-b border-gray-300 leading-4 tracking-wider">
                    <input
                      onChange={onSelectCheckBoxAll}
                      checked={isSelected}
                      type="checkbox"
                    />
                  </th>
                )}
                {colHeadTabel.map((item: string, index: number) => (
                  <th
                    key={index}
                    className="border-b border-gray-300  leading-4 tracking-wider"
                  >
                    <p className="text-sm text-[#707275] dark:text-gray-400 font-medium px-6 py-3">
                      {item}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {!loading && <Fragment>{children}</Fragment>}

              {loading &&
                [...new Array(colHeadTabel.length)].map(
                  (item: undefined, index: number) => (
                    <tr className="dark:bg-gray-800 " key={index}>
                      {colHeadTabel.map((item: string, index: number) => (
                        <td
                          key={index}
                          className="px-6 py-4 whitespace-no-wrap border-b"
                        >
                          <div className="animate-pulse bg-gray-300 dark:bg-gray-600 w-[100px] h-5 mx-auto rounded"></div>
                        </td>
                      ))}
                    </tr>
                  )
                )}

              {!loading && message && (
                <tr>
                  <td
                    colSpan={colHeadTabel.length}
                    className="px-6 py-4 dark:bg-gray-800 whitespace-no-wrap"
                  >
                    <NoResult title={message as string} />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Fragment>
  );
};

export default memo(Table);
