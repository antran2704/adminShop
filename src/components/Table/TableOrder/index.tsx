import { FC, Fragment } from "react";
import { AiOutlineEdit } from "react-icons/ai";

import { colHeadOrder as colHeadTable } from "~/components/Table/colHeadTable";

import { typeCel } from "~/enums";

import { orderStatus } from "~/components/Table/statusCel";

import Table from "~/components/Table";
import CelTable from "~/components/Table/CelTable";
import { IOrder } from "~/interface/order";
import Pagination from "~/components/Pagination";
import { IPagination } from "~/interface/pagination";

interface Props {
  message: string | null;
  pagination: IPagination;
  loading: boolean;
  orders: IOrder[];
}

const TableOrder: FC<Props> = (props: Props) => {
  const { message, loading, orders, pagination } = props;
  return (
    <Fragment>
      <Table colHeadTabel={colHeadTable} message={message} loading={loading}>
        <Fragment>
          {orders.map((order: IOrder) => (
            <tr
              key={order._id}
              className="hover:bg-slate-100 border-b border-gray-300"
            >
              <CelTable type={typeCel.TEXT} value={order._id} />
              <CelTable type={typeCel.TEXT} value={order.name} />
              <CelTable type={typeCel.TEXT} value={order.email} />
              <CelTable type={typeCel.TEXT} value={order.phoneNumber} />
              <CelTable
                type={typeCel.STATUS}
                value={order.status}
                status={orderStatus[order.status]}
              />
              <CelTable type={typeCel.DATE} value={order.createdAt} />
              <CelTable
                type={typeCel.BUTTON_LINK}
                href={`/orders/${order._id}`}
                value={""}
                icon={<AiOutlineEdit className="text-xl w-fit" />}
              />
            </tr>
          ))}
        </Fragment>
      </Table>

      {pagination.totalItems > pagination.pageSize && <Pagination pagination={pagination} />}
    </Fragment>
  );
};

export default TableOrder;
