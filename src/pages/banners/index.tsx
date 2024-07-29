import {
  useState,
  useEffect,
  Fragment,
  useCallback,
  ReactElement,
  useMemo,
} from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import ShowItemsLayout from "~/layouts/ShowItemsLayout";

import { EPermission, ERole, ORDER_PARAMATER_ENUM } from "~/enums";
import {
  IPagination,
  IBanner,
  IBannerTable,
  ISearch,
  IResponseWithPagination,
} from "~/interface";
import { NextPageWithLayout } from "~/interface/page";

import { ButtonDelete, ButtonEdit } from "~/components/Button";
import { initPagination } from "~/components/Pagination/initData";
import Loading from "~/components/Loading";
import Can from "~/components/Ability/Can";

import LayoutWithHeader from "~/layouts/LayoutWithHeader";

import {
  activeBanner,
  deleteBanner,
  disableBanner,
  getBanners,
} from "~/api-client";

import useAbility from "~/hooks/useAbility";
import { TableCore } from "~/components/Core";
import { Modal, Switch, TableColumnsType } from "antd";
import { formatDate } from "~/helper/format/datetime";
import ImageCus from "~/components/Image/ImageCus";
import { PATH_IMAGE } from "~/common/images";

const Layout = LayoutWithHeader;
const BannersPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { query } = router;

  const pageParam = query.page ? Number(query.page) : 1;
  const takeParam = query.take ? Number(query.take) : 10;
  const searchParam = query.search ? query.search : "";
  const orderParam = query.order ? query.order : ORDER_PARAMATER_ENUM.DESC;

  const tBanner = useTranslations("BannerPage");
  const tError = useTranslations("Error");
  const tAction = useTranslations("Action");

  const { isCan } = useAbility([ERole.ADMIN], [EPermission.ADMIN]);

  const [banners, setBanners] = useState<IBannerTable[]>([]);
  const [paramater, setParamter] = useState<ISearch>({
    take: takeParam,
    page: pageParam,
    search: searchParam as string,
    order: orderParam as ORDER_PARAMATER_ENUM,
  });

  const [message, setMessage] = useState<string | null>(null);

  const [selectDelete, setSelectDelete] = useState<IBannerTable | null>(null);
  const [pagination, setPagination] = useState<IPagination>(initPagination);

  const [loading, setLoading] = useState<boolean>(true);
  const [modalDelete, setModalDelete] = useState<boolean>(false);

  const onActiveBanner = async (reccord: IBannerTable) => {
    try {
      await activeBanner(reccord.bannerId);

      const indexItem: number = banners.findIndex(
        (banner: IBannerTable) => banner.bannerId === reccord.bannerId,
      );

      if (indexItem > -1) {
        const newBanners: IBannerTable[] = [...banners];
        newBanners[indexItem] = { ...reccord, public: true };
        setBanners(newBanners);
      }
    } catch (error) {
      toast.error(tError("TRY_AGAIN"), {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const onDisableBanner = async (reccord: IBannerTable) => {
    try {
      await disableBanner(reccord.bannerId);

      const indexItem: number = banners.findIndex(
        (banner: IBannerTable) => banner.bannerId === reccord.bannerId,
      );

      if (indexItem > -1) {
        const newBanners: IBannerTable[] = [...banners];
        newBanners[indexItem] = { ...reccord, public: false };
        setBanners(newBanners);
      }
    } catch (error) {
      toast.error(tError("TRY_AGAIN"), {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handlePopup = () => {
    if (modalDelete) {
      setSelectDelete(null);
    }

    setModalDelete(!modalDelete);
  };

  const handleGetData = async (query: ISearch) => {
    setMessage(null);
    setLoading(true);

    try {
      const res: IResponseWithPagination<IBanner[]> =
        await getBanners(paramater);
      if (res.status === 200) {
        const data: IBannerTable[] = res.payload.map((item: IBanner) => ({
          key: item._id,
          bannerId: item._id,
          title: item.title,
          public: item.public,
          image: item.image,
          createdAt: item.createdAt,
        }));

        setPagination(res.pagination);
        setBanners(data);
      }
    } catch (error) {
      setMessage("Error in server");
    }
    setLoading(false);
  };

  const onDeleteBanner = useCallback(async () => {
    if (!selectDelete) return;

    try {
      await deleteBanner(selectDelete.bannerId);
      setModalDelete(false);
      setSelectDelete(null);
      handleGetData(paramater);

      toast.success("Success delete banner", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      toast.error("Error delete banner", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }, [selectDelete]);

  const columns: TableColumnsType<IBannerTable> = useMemo(() => {
    return [
      {
        title: tBanner("table.id"),
        dataIndex: "bannerId",
        className: "whitespace-nowrap",
        align: "center",
      },
      {
        title: tBanner("table.title"),
        dataIndex: "title",
        className: "whitespace-nowrap",
        align: "center",
      },
      {
        title: tBanner("table.thumbnail"),
        dataIndex: "image",
        className: "whitespace-nowrap",
        align: "center",
        render: (image: string) => {
          return (
            <ImageCus
              src={PATH_IMAGE + image}
              title="banner thumbnail"
              className="w-[260px] min-w-[260px] h-[140px] object-cover object-center rounded-md mx-auto"
            />
          );
        },
      },
      {
        title: tBanner("table.status"),
        dataIndex: "public",
        className: "whitespace-nowrap",
        render: (isPublic: boolean, reccord: IBannerTable) => (
          <Switch
            checked={isPublic}
            onClick={() => {
              if (isPublic) {
                onDisableBanner(reccord);
              } else {
                onActiveBanner(reccord);
              }
            }}
          />
        ),
        align: "center",
      },
      {
        title: tBanner("table.createdAt"),
        dataIndex: "createdAt",
        className: "whitespace-nowrap",
        align: "center",
        render: (date: string) => {
          return (
            <span className="whitespace-nowrap capitalize block text-sm mx-auto">
              {formatDate(date)}
            </span>
          );
        },
      },
      {
        title: tBanner("table.action"),
        dataIndex: "action",
        className: "whitespace-nowrap",
        align: "center",
        render: (_, record: IBannerTable) => {
          return (
            <div className="flex items-center justify-center gap-2">
              <ButtonDelete
                onClick={() => {
                  setSelectDelete(record);
                  handlePopup();
                }}
              />
              <ButtonEdit />
            </div>
          );
        },
      },
    ];
  }, [router.locale, banners]);

  useEffect(() => {
    handleGetData(paramater);
  }, [paramater]);

  if (!router.isReady) {
    return <Loading />;
  }

  return (
    <ShowItemsLayout
      title={tBanner("title")}
      titleCreate={isCan ? tBanner("create") : null}
      link="/create/banner">
      <Fragment>
        <TableCore
          dataSource={banners}
          loading={loading}
          columns={columns}
          size="large"
          showPagination={false}
        />

        <Modal
          open={modalDelete}
          onCancel={handlePopup}
          centered
          destroyOnClose
          okText={tAction("confirm")}
          onOk={onDeleteBanner}
          cancelText={tAction("cancel")}
          okButtonProps={{ size: "large", className: "min-w-[100px]" }}
          cancelButtonProps={{ size: "large", className: "min-w-[100px]" }}>
          <h4 className="lg:text-2xl text-xl font-bold text-center capitalize">
            {tBanner("ModalDelete.title")}
          </h4>
          <img
            src="/popup/trash.svg"
            className="size-[200px] mx-auto"
            title="delete image"
            alt="delete image"
          />
          <p className="md:text-lg text-base text-center mb-10">
            {tBanner("ModalDelete.description")}
          </p>
        </Modal>
      </Fragment>
    </ShowItemsLayout>
  );
};

export default BannersPage;

export async function getStaticProps(context: { locale: string }) {
  return {
    props: {
      messages: (await import(`../../../messages/${context.locale}.json`))
        .default,
    },
  };
}

BannersPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
