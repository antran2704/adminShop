import Link from "next/link";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { useState, useEffect, Fragment, useCallback, ChangeEvent } from "react";
import { toast } from "react-toastify";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

import { axiosDelete, axiosGet, axiosPatch } from "~/ultils/configAxios";
import { typeCel } from "~/enums";

import { IPagination } from "~/interface/pagination";
import { IProductHome } from "~/interface/product";
import { ISelectItem } from "~/components/Select/SelectItem/interfaces";
import { IDataCategory } from "~/interface/category";

import Search from "~/components/Search";
import Table from "~/components/Table";
import CelTable from "~/components/Table/CelTable";
import { colHeaderProduct as colHeadTable } from "~/components/Table/colHeadTable";
import ShowItemsLayout from "~/layouts/ShowItemsLayout";
import SelectItem from "~/components/Select/SelectItem";
import ImageCus from "~/components/Image/ImageCus";
import NoResult from "~/components/NoResult";

interface ISelectProduct {
  id: string | null;
  title: string;
}

interface IFilterProduct {
  [x: string]: string;
}

const initPagination: IPagination = {
  currentPage: 1,
  totalItems: 0,
  pageSize: 0,
};

const initSelectProduct: ISelectProduct = {
  id: null,
  title: "",
};

interface Props {
  query: ParsedUrlQuery;
}

const ProductPage = (props: Props) => {
  const { query } = props;
  const currentPage = query.page ? query.page : 1;

  const [categories, setCategories] = useState<ISelectItem[]>([]);
  const [products, setProducts] = useState<IProductHome[]>([]);
  const [selectProduct, setSelectProduct] =
    useState<ISelectProduct>(initSelectProduct);

  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [pagination, setPagination] = useState<IPagination>(initPagination);
  const [filter, setFilter] = useState<IFilterProduct | null>(null);

  const onChangeSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const name = e.target.name;

      setFilter({ ...filter, [name]: value });
    },
    [filter]
  );

  const onSelect = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      const name = e.target.name;

      setFilter({ ...filter, [name]: value });
    },
    [filter]
  );

  const handleGetDataByFillter = useCallback(async () => {
    setMessage(null);
    setLoading(true);

    try {
      const response = await axiosGet(
        `/products/search?search=${filter?.search || ""}&category=${
          filter?.category || ""
        }&page=${currentPage}`
      );

      if (response.status === 200) {
        if (response.payload.length === 0) {
          setProducts([]);
          setMessage("Sorry, we can not find this Product😞");
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
      toast.error("Error in server, please try again", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }, [filter]);

  const onChangePublic = async (id: string, status: boolean) => {
    if (!id) {
      toast.error("False change public", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }

    try {
      const payload = await axiosPatch(`/products/${id}`, {
        public: status,
      });

      if (payload.status === 201) {
        toast.success("Success updated product", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      toast.error("Please try again", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const onReset = useCallback(() => {
    setFilter(null);
    handleGetData();
  }, [filter]);

  const handleGetData = async () => {
    setMessage(null);
    setLoading(true);

    try {
      const response = await axiosGet(`/products?page=${currentPage}`);
      if (response.status === 200) {
        if (response.payload.length === 0) {
          setProducts([]);
          setMessage("Sorry, we can not find this Product😞");
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
      toast.error("Error in server, please try again", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handleGetCategories = async () => {
    try {
      const response = await axiosGet(`/categories/all?title=1`);
      if (response.status === 200) {
        if (response.payload.length === 0) {
          setCategories([]);
          return;
        }

        const data: ISelectItem[] = response.payload.map(
          (item: IDataCategory) => {
            return {
              id: item._id,
              title: item.title,
            };
          }
        );

        setCategories(data);
      }
    } catch (error) {
      toast.error("Error get categories", {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(error);
    }
  };

  const onSelectProduct = (id: string, title: string) => {
    setSelectProduct({ id, title });
  };

  const handlePopup = () => {
    if (showPopup) {
      setSelectProduct(initSelectProduct);
    }

    setShowPopup(!showPopup);
  };

  const handleDeleteProduct = async () => {
    if (!selectProduct || !selectProduct.id) {
      setShowPopup(false);
      toast.error("False delete product", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    try {
      const response = await axiosDelete(`/products/${selectProduct.id}`);
      setShowPopup(false);

      if (response.status === 201) {
        if (filter) {
          handleGetDataByFillter();
        } else {
          handleGetData();
        }
        toast.success("Success delete product", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      toast.error("Error delete product", {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetData();
    handleGetCategories();
  }, []);

  return (
    <ShowItemsLayout
      title="Products"
      titleCreate="Create product"
      link="/create/product"
      selectItem={selectProduct}
      pagination={pagination}
      handleDelete={handleDeleteProduct}
      showPopup={showPopup}
      handlePopup={handlePopup}
    >
      <Fragment>
        <Search
          search={filter?.search ? filter.search : ""}
          onReset={onReset}
          onSearch={onChangeSearch}
          onFillter={handleGetDataByFillter}
          placeholder="Search by product name..."
        >
          <SelectItem
            name="category"
            placeholder="Category"
            value={filter?.category ? filter.category : "all"}
            data={categories}
            onSelect={onSelect}
            width="md:w-2/12 w-full"
          />
        </Search>

          <Table
            colHeadTabel={colHeadTable}
            message={message}
            loading={loading}
          >
            <Fragment>
              {products.map((product: IProductHome) => (
                <tr
                  key={product._id}
                  className="hover:bg-slate-100 border-b border-gray-300"
                >
                  <CelTable type={typeCel.GROUP}>
                    <div className="flex items-center justify-center gap-2">
                      <ImageCus
                        title="product image"
                        src={product.thumbnail}
                        className="min-w-[32px] w-8 h-8 rounded-full"
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
                    onGetChecked={onChangePublic}
                  />
                  <CelTable type={typeCel.GROUP}>
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/`}
                        className="block w-fit px-3 py-2 border-blue-700 border-2 text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none"
                      >
                        <AiOutlineEdit className="text-xl w-fit" />
                      </Link>

                      <button
                        onClick={() => {
                          if (!showPopup) {
                            onSelectProduct(
                              product._id as string,
                              product.title
                            );
                          }

                          handlePopup();
                        }}
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

export default ProductPage;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      query,
    },
  };
};
