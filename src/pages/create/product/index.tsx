import { useRouter } from "next/router";
import { ReactElement, useMemo, Fragment } from "react";

import { ICreateProduct } from "~/interface";
import FormLayout from "~/layouts/FormLayout";

import PrivateLayout from "~/layouts/Private";
import { NextPageWithLayout } from "~/interface/page";
import { useTranslations } from "next-intl";
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { BreadcrumbCore } from "~/components/Core";
import { ProductForm } from "~/components/ProductPage";

const initData: ICreateProduct = {
  title: "",
  description: "",
  meta_description: "",
  meta_title: "",
  shortDescription: "",
  category: "",
  categories: [],
  price: 0,
  promotion_price: 0,
  inventory: 0,
  public: true,
  thumbnail: null,
  gallery: [],
  hotProduct: false,
  options: [],
  specifications: [],
  variants: [],
  sku: null,
  barcode: null,
  sold: 0,
};

const Layout = PrivateLayout;

const CreateProductPage: NextPageWithLayout = () => {
  const router = useRouter();

  const t = useTranslations("ProductPage");
  const tError = useTranslations("Error");
  const tSuccess = useTranslations("Success");

  // validation project form
  const schema = useMemo(() => {
    return object().shape({
      title: string().trim().required(tError("PLEASE_INPUT")),
      meta_title: string().trim().required(tError("PLEASE_INPUT")),
      image: string().required(tError("PLEASE_UPLOAD")),
    });
  }, [router.locale]);

  // form control
  const productForm = useForm<ICreateProduct>({
    defaultValues: initData,
    resolver: yupResolver(schema) as any,
  });

  const handleOnSubmit = async () => {
    setLoading(true);

    try {
      let breadcrumbs: string[] = [];
      if (defaultCategory) {
        breadcrumbs = generalBreadcrumbs(defaultCategory, categories);
      } else {
        breadcrumbs = generalBreadcrumbs(mutipleCategories[0]._id, categories);
      }

      const categoriesProduct = mutipleCategories.map(
        (category: ISelectItem) => {
          return category._id;
        },
      );

      const sendData: ISendProduct = {
        title: product.title,
        description: product.description,
        shortDescription: product.shortDescription,
        meta_title: product.title,
        meta_description: product.description,
        thumbnail,
        gallery,
        category: defaultCategory as string,
        categories: categoriesProduct as string[],
        breadcrumbs,
        specifications,
        price: product.price,
        promotion_price: product.promotion_price,
        inventory: product.inventory,
        public: product.public,
        sku: product.sku,
        barcode: product.barcode,
        options: [],
      };

      const payload = await createProduct(sendData);

      if (payload.status === 201) {
        // toast.success("Success create product", {
        //   position: toast.POSITION.TOP_RIGHT,
        // });
        router.push("/products");
      }

      setLoading(false);
    } catch (error) {
      toast.error("Error in create product", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setLoading(false);
    }
  };

  return (
    <FormLayout
      title={t("create")}
      backLink="/products"
      onSubmit={handleOnSubmit}
      breadcrumb={
        <BreadcrumbCore
          data={[
            {
              title: t("breadcrumb.list"),
              href: "/products",
            },
            {
              title: t("breadcrumb.create"),
            },
          ]}
        />
      }>
      <Fragment>
        <ProductForm form={productForm} />
      </Fragment>
    </FormLayout>
  );
};

export default CreateProductPage;

export async function getStaticProps(context: { locale: string }) {
  return {
    props: {
      messages: (await import(`../../../../messages/${context.locale}.json`))
        .default,
    },
  };
}

CreateProductPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
