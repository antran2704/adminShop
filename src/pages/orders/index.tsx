import { useState } from "react";
import axios from "axios";
import { AiOutlineEdit } from "react-icons/ai";

import { colHeadOrder as colHeadTable } from "~/components/Table/colHeadTable";

import { typeCel } from "~/enums";

import { orderStatus } from "~/components/Table/statusCel";

import Table from "~/components/Table";
import CelTable from "~/components/Table/CelTable";
import Search from "~/components/Search";

const OrdersPage = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async (id: string) => {
    setLoading(true);
    try {
      const response = await axios
        .get(
          `${process.env.NEXT_PUBLIC_ENDPOINT_API}/category/search?search=${id}`
        )
        .then((payload) => payload.data);

      if (response.status === 200) {
        if (response.payload.length === 0) {
          setMessage(`No category with ID ${id}`);
          setLoading(false);
          return;
        }

        setMessage(null);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setMessage(`No order with id ${id}`);
      setLoading(false);
    }
  };

  return (
    <section className="lg:py-5 px-5 py-24">
      <div className="w-full mb-5">
        <h1 className="lg:text-3xl text-2xl font-bold">List orders</h1>
      </div>
      <div>
        <Search onSearch={handleSearch} placeholder="Seach with ID order"/>
        <Table colHeadTabel={colHeadTable} message={message} loading={loading}>
          <tr className="hover:bg-slate-100 border-b border-gray-300">
            <CelTable type={typeCel.TEXT} value={"1"} />
            <CelTable type={typeCel.TEXT} value={"Antrandev"} />
            <CelTable type={typeCel.TEXT} value={"phamtrangiaan27@gmail.com"} />
            <CelTable
              type={typeCel.TEXT}
              value={"0946003423"}
              className="text-primary"
            />
            <CelTable type={typeCel.STATUS} value={"pending"} status={orderStatus["pending"]}/>
            <CelTable
              type={typeCel.BUTTON_LINK}
              href={`/orders/1`}
              value={""}
              icon={<AiOutlineEdit className="text-xl w-fit" />}
            />
          </tr>
        </Table>
      </div>
    </section>
  );
};

export default OrdersPage;
