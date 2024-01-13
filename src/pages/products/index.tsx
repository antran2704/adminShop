import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { useState, useEffect, Fragment, useCallback } from "react";
import { toast } from "react-toastify";

import { typeCel } from "~/enums";

import { IFilter, IPagination, IProductHome, IDataCategory } from "~/interface";
import { ISelectItem } from "~/interface";

import Search from "~/components/Search";
import { Table, CelTable } from "~/components/Table";
import { colHeaderProduct as colHeadTable } from "~/components/Table/colHeadTable";
import ShowItemsLayout from "~/layouts/ShowItemsLayout";
import SelectItem from "~/components/Select/SelectItem";
import ImageCus from "~/components/Image/ImageCus";
import { ButtonDelete, ButtonEdit } from "~/components/Button";
import Link from "next/link";
import { formatBigNumber } from "~/helper/number/fomatterCurrency";
import { initPagination } from "~/components/Pagination/initData";
import {
  deleteProduct,
  getAllCategories,
  getProducts,
  getProductsWithFilter,
  updateProduct,
} from "~/api-client";

interface ISelectProduct {
  id: string | null;
  title: string;
}

const initSelectProduct: ISelectProduct = {
  id: null,
  title: "",
};

interface Props {
  query: ParsedUrlQuery;
}

const ProductPage = (props: Props) => {
  const { query } = props;
  const currentPage = query.page ? Number(query.page) : 1;
  const [categories, setCategories] = useState<ISelectItem[]>([]);
  const [products, setProducts] = useState<IProductHome[]>([]);
  const [selectProduct, setSelectProduct] =
    useState<ISelectProduct>(initSelectProduct);

  const [selectProducts, setSelectProducts] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [pagination, setPagination] = useState<IPagination>(initPagination);
  const [filter, setFilter] = useState<IFilter | null>(null);

  const onSelectCheckBox = useCallback(
    (id: string) => {
      const isExit = selectProducts.find((select: string) => select === id);
      if (isExit) {
        const newSelects = selectProducts.filter(
          (select: string) => select !== id
        );
        setSelectProducts(newSelects);
      } else {
        setSelectProducts([...selectProducts, id]);
      }
    },
    [selectProducts]
  );

  const onChangeSearch = useCallback(
    (name: string, value: string) => {
      setFilter({ ...filter, [name]: value });
    },
    [filter]
  );

  const onSelect = useCallback(
    (value: string, name: string) => {
      setFilter({ ...filter, [name]: value });
    },
    [filter]
  );

  const handleGetDataByFilter = useCallback(async () => {
    setMessage(null);
    setLoading(true);

    try {
      const response = await getProductsWithFilter(filter, currentPage);

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
              promotion_price: item.promotion_price,
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
      const payload = await updateProduct(id, { public: status });

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
      const response = await getProducts(currentPage);
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
              promotion_price: item.promotion_price,
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
      const response = await getAllCategories({
        title: "1",
      });
      if (response.status === 200) {
        if (response.payload.length === 0) {
          setCategories([]);
          return;
        }

        const data: ISelectItem[] = response.payload.map(
          (item: IDataCategory) => {
            return {
              _id: item._id,
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
      const response = await deleteProduct(selectProduct.id);
      setShowPopup(false);

      if (response.status === 201) {
        if (filter) {
          handleGetDataByFilter();
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
    handleGetCategories();
  }, []);

  useEffect(() => {
    if (filter) {
      handleGetDataByFilter();
    } else {
      handleGetData();
    }
  }, [currentPage]);

  useEffect(() => {
    if (selectProducts.length > 0) {
      setSelectProducts([]);
    }
  }, [products, currentPage]);

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
          onFilter={handleGetDataByFilter}
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
          items={products}
          selects={selectProducts}
          setSelects={setSelectProducts}
          selectAll={true}
          isSelected={selectProducts.length === products.length ? true : false}
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
                <CelTable
                  type={typeCel.SELECT}
                  isSelected={
                    selectProducts.includes(product._id as string)
                      ? true
                      : false
                  }
                  onSelectCheckBox={() =>
                    onSelectCheckBox(product._id as string)
                  }
                />
                <CelTable type={typeCel.GROUP}>
                  <div className="flex items-center gap-2">
                    <ImageCus
                      title="product image"
                      src={product.thumbnail as string}
                      className="min-w-[32px] w-8 h-8 rounded-full"
                    />
                    <Link
                      href={`/edit/product/${product._id}`}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {product.title}
                    </Link>
                  </div>
                </CelTable>
                <CelTable
                  type={typeCel.TEXT}
                  center={true}
                  value={product.category ? product.category.title : "Home"}
                />
                <CelTable
                  type={typeCel.TEXT}
                  center={true}
                  value={formatBigNumber(product.price)}
                />
                <CelTable
                  type={typeCel.TEXT}
                  center={true}
                  value={
                    product.promotion_price
                      ? formatBigNumber(product.promotion_price)
                      : "0"
                  }
                />
                <CelTable
                  type={typeCel.TEXT}
                  center={true}
                  value={product.inventory.toString()}
                />
                <CelTable
                  type={typeCel.STATUS}
                  status={product.inventory > 0 ? "bg-success" : "bg-error"}
                  value={product.inventory > 0 ? "Selling" : "Sold out"}
                />
                <CelTable
                  id={product._id as string}
                  type={typeCel.PUBLIC}
                  checked={product.public}
                  onGetChecked={onChangePublic}
                />
                <CelTable type={typeCel.GROUP}>
                  <div className="flex items-center justify-center gap-2">
                    <ButtonEdit link={`/edit/product/${product._id}`} />

                    <ButtonDelete
                      onClick={() => {
                        if (!showPopup) {
                          onSelectProduct(product._id as string, product.title);
                        }

                        handlePopup();
                      }}
                    />
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
