import { GetServerSideProps } from "next";
import Link from "next/link";
import { ParsedUrlQuery } from "querystring";
import { useState, useEffect, Fragment, useCallback } from "react";
import { toast } from "react-toastify";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

import { axiosDelete, axiosGet, axiosPatch } from "~/ultils/configAxios";
import { typeCel } from "~/enums";

import { IAttribute, IVariant } from "~/interface";

import ShowItemsLayout from "~/layouts/ShowItemsLayout";

import Table from "~/components/Table";
import CelTable from "~/components/Table/CelTable";
import { colHeaderAttributeValue as colHeadTable } from "~/components/Table/colHeadTable";
import { IPagination } from "~/interface/pagination";

interface ISelectAttribute {
  id: string | null;
  title: string;
}

const initSelect: ISelectAttribute = {
  id: null,
  title: "",
};

const initPagination: IPagination = {
  currentPage: 1,
  totalItems: 0,
  pageSize: 0,
};

interface Props {
  query: ParsedUrlQuery;
}

const AttributeValuesPage = (props: Props) => {
  const { query } = props;
  const { id } = query;

  const [attributes, setAttribute] = useState<IVariant[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectItem, setSelectItem] = useState<ISelectAttribute>(initSelect);
  const [pagination, setPagination] = useState<IPagination>(initPagination);

  const onChangePublic = async (
    children_id: string,
    status: boolean,
    data: any = null
  ) => {
    if (!children_id) {
      toast.error("False change public", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }

    try {
      const payload = await axiosPatch(`/variants/child/${id}`, {
        children_id,
        ...data,
        public: status,
      });

      if (payload.status === 201) {
        toast.success("Success updated attribute", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      toast.error("Please try again", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const onSelectDeleteItem = (item: ISelectAttribute) => {
    setSelectItem(item);
    handlePopup();
  };

  const handlePopup = () => {
    if (showPopup) {
      console.log("close");
      setSelectItem(initSelect);
    }

    setShowPopup(!showPopup);
  };

  const handleGetData = async () => {
    setMessage(null);
    setLoading(true);

    try {
      const response = await axiosGet(`/variants/${id}`);
      if (response.status === 200) {
        if (response.payload.variants.length === 0) {
          setAttribute([]);
          setMessage("No attribute value");
          setLoading(false);
          return;
        }
        console.log(response);
        const data: IVariant[] = response.payload.variants.map(
          (item: IVariant) => {
            return {
              _id: item._id,
              name: item.name,
              public: item.public,
            };
          }
        );
        // setPagination(response.pagination);
        setAttribute(data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setMessage("Error in server");
      setLoading(false);
    }
  };

  const handleDeleteAttribute = useCallback(async () => {
    if (!selectItem) {
      setShowPopup(false);
      toast.error("False delete attribute value", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    try {
      await axiosPatch(`/variants/child/delete`, {
        parent_id: id,
        children_id: selectItem.id,
      });
      setShowPopup(false);
      handleGetData();
      toast.success("Success delete attribute value", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      toast.error("Error delete attribute value", {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(error);
    }
  }, [selectItem]);

  useEffect(() => {
    handleGetData();
  }, []);

  return (
    <ShowItemsLayout
      title="Attribute Values"
      titleCreate="Add value"
      link="/create/attribute"
      selectItem={{
        title: selectItem?.title ? selectItem.title : "",
        id: selectItem?.id || null,
      }}
      pagination={pagination}
      handleDelete={handleDeleteAttribute}
      showPopup={showPopup}
      handlePopup={handlePopup}
    >
      <Fragment>
        <Table colHeadTabel={colHeadTable} message={message} loading={loading}>
          <Fragment>
            {attributes.map((item: IVariant) => (
              <tr
                key={item._id}
                className="hover:bg-slate-100 border-b border-gray-300"
              >
                <CelTable type={typeCel.TEXT} value={item.name} />
                <CelTable
                  id={item._id as string}
                  type={typeCel.PUBLIC}
                  data={item}
                  checked={item.public}
                  onGetChecked={onChangePublic}
                />
                <CelTable type={typeCel.GROUP}>
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/edit/category/${item._id}`}
                      className="block w-fit px-3 py-2 border-blue-700 border-2 text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none"
                    >
                      <AiOutlineEdit className="text-xl w-fit" />
                    </Link>

                    <button
                      onClick={() =>
                        onSelectDeleteItem({
                          id: item._id as string,
                          title: item.name,
                        })
                      }
                      className="block w-fit px-3 py-2 border-error border-2 text-error rounded transition duration-300 hover:bg-error hover:text-white focus:outline-none"
                    >
                      <AiOutlineDelete className="text-xl" />
                    </button>
                  </div>
                </CelTable>
              </tr>
            ))}
          </Fragment>
        </Table>
      </Fragment>
    </ShowItemsLayout>
  );
};

export default AttributeValuesPage;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      query,
    },
  };
};
