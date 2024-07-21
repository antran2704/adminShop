import { Table, TableProps } from "antd";
import { IPagination } from "~/interface";

interface Props extends TableProps {
  pagination?: IPagination;
  onPagination?: (nextPage: number, pageSize: number) => void;
}

const TableCore = (props: Props) => {
  const { pagination, onPagination, ...rest } = props;
  return (
    <div className="w-full">
      <Table {...rest} />
    </div>
  );
};

export default TableCore;
