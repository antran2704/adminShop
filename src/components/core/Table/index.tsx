import { Pagination, Table, TableProps, PaginationProps } from "antd";

interface Props extends TableProps {
  showPagination?: boolean;
  paginationOptions?: PaginationProps;
}

const TableCore = (props: Props) => {
  const { showPagination = true, paginationOptions, ...rest } = props;

  return (
    <div className="w-full">
      <div className="scroll w-full max-w-[100vw] overflow-x-auto">
        <Table {...rest} pagination={false} />
      </div>

      {showPagination && (
        <Pagination align="end" className="py-5" {...paginationOptions} />
      )}
    </div>
  );
};

export default TableCore;
