import Link from "next/link";
import { useState, useEffect, Fragment, useCallback, ChangeEvent } from "react";
import { toast } from "react-toastify";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

import { axiosDelete, axiosGet, axiosPatch } from "~/ultils/configAxios";
import { typeCel } from "~/enums";

import { IPagination } from "~/interface/pagination";
import { IProductHome } from "~/interface/product";

import Search from "~/components/Search";
import Table from "~/components/Table";
import CelTable from "~/components/Table/CelTable";
import { colHeaderProduct as colHeadTable } from "~/components/Table/colHeadTable";
import ShowItemsLayout from "~/layouts/ShowItemsLayout";
import SelectItem from "~/components/Select/SelectItem";
import ImageCus from "~/components/Image/ImageCus";

const initPagination: IPagination = {
  currentPage: 1,
  totalItems: 0,
  pageSize: 0,
};

const ProductPage = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [products, setProducts] = useState<IProductHome[]>([]);
  const [pagination, setPagination] = useState<IPagination>(initPagination);

  console.log(products);

  const onChangePublic = async (id: string, status: boolean) => {
    if (!id) {
      toast.error("False change public", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }

    try {
      const payload = await axiosPatch(`/variants/${id}`, {
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

  const handleGetData = async () => {
    setMessage(null);
    setLoading(true);

    try {
      const response = await axiosGet(`/products`);
      if (response.status === 200) {
        if (response.payload.length === 0) {
          setProducts([]);
          setMessage("No product");
          setLoading(false);
          return;
        }

        const data: IProductHome[] = response.payload.map(
          (item: IProductHome) => {
            return {
              _id: item._id,
              title: item.title,
              price: item.price,
              promotionPrice: item.promotionPrice,
              inventory: item.inventory,
              category: item.category,
              thumbnail: item.thumbnail,
              public: item.public,
            };
          }
        );
        setPagination(response.pagination);
        setProducts(data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setMessage("Error in server");
      setLoading(false);
    }
  };

  const handlePopup = () => {
    // if (showPopup) {
    //   console.log("close");
    //   setSelectItem(initSelect);
    // }

    setShowPopup(!showPopup);
  };

  const handleDeleteProduct = async () => {};

  useEffect(() => {
    handleGetData();
  }, []);

  return (
    <ShowItemsLayout
      title="Products"
      titleCreate="Create product"
      link="/create/product"
      selectItem={{
        title: "",
        id: null,
      }}
      //   pagination={pagination}
      handleDelete={handleDeleteProduct}
      showPopup={showPopup}
      handlePopup={handlePopup}
    >
      <Fragment>
        <Search
          search={""}
          onReset={() => {}}
          onSearch={() => {}}
          onFillter={() => {}}
          placeholder="Search by product name..."
        >
          <SelectItem
            name="category"
            placeholder="Category"
            value="all"
            data={[]}
            onSelect={() => {}}
            width="w-2/12"
          />
        </Search>

        <Table colHeadTabel={colHeadTable} message={message} loading={loading}>
          <Fragment>
            {products.map((product: IProductHome) => (
              <tr
                key={product._id}
                className="hover:bg-slate-100 border-b border-gray-300"
              >
                <CelTable type={typeCel.GROUP}>
                  <div className="flex items-center justify-center gap-2">
                    {/* <img
                      src={
                        product.thumbnail ? product.thumbnail : "/no_image.jpg"
                      }
                    /> */}
                    <ImageCus
                      title="product image"
                      src={product.thumbnail}
                      className="w-8 h-8 rounded-full"
                    />
                    <p className="text-sm font-medium">{product.title}</p>
                  </div>
                </CelTable>
                <CelTable
                  type={typeCel.TEXT}
                  value={product.category ? product.category.title : "Home"}
                />
                <CelTable
                  type={typeCel.TEXT}
                  value={product.price.toString()}
                />
                <CelTable
                  type={typeCel.TEXT}
                  value={
                    product.promotionPrice
                      ? product.promotionPrice.toString()
                      : "0"
                  }
                />
                <CelTable
                  type={typeCel.TEXT}
                  value={product.inventory.toString()}
                />
                <CelTable
                  type={typeCel.STATUS}
                  status="bg-success"
                  value={"selling"}
                />
                <CelTable
                  id={product._id as string}
                  type={typeCel.PUBLIC}
                  checked={product.public}
                  onGetChecked={() => {}}
                />
                <CelTable type={typeCel.GROUP}>
                  <div className="flex items-center justify-center gap-2">
                    <Link
                      href={`/`}
                      className="block w-fit px-3 py-2 border-blue-700 border-2 text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none"
                    >
                      <AiOutlineEdit className="text-xl w-fit" />
                    </Link>

                    <button className="block w-fit px-3 py-2 border-error border-2 text-error rounded transition duration-300 hover:bg-error hover:text-white focus:outline-none">
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

export default ProductPage;
