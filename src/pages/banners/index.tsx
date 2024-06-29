import { ParsedUrlQuery } from "querystring";
import {
  useState,
  useEffect,
  Fragment,
  useCallback,
  ReactElement,
} from "react";
import { toast } from "react-toastify";

import ShowItemsLayout from "~/layouts/ShowItemsLayout";

import { EPermission, ERole, typeCel } from "~/enums";

import { IFilter, IPagination, Banner } from "~/interface";

import { Table, CelTable } from "~/components/Table";
import { colHeaderBanner as colHeadTable } from "~/components/Table/colHeadTable";
import { ButtonDelete, ButtonEdit } from "~/components/Button";
import { initPagination } from "~/components/Pagination/initData";
import {
  deleteBanner,
  getBanners,
  getCategoriesWithFilter,
  updateBanner,
} from "~/api-client";
import { NextPageWithLayout } from "~/interface/page";
import LayoutWithHeader from "~/layouts/LayoutWithHeader";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import Loading from "~/components/Loading";
import useAbility from "~/hooks/useAbility";
import Can from "~/components/Ability/Can";

interface ISelectBanner {
  _id: string;
  title: string;
  image: string;
}

const Layout = LayoutWithHeader;
const BannersPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { query } = router;

  const currentPage = query.page ? Number(query.page) : 1;

  const { t, i18n } = useTranslation();

  const { isCan } = useAbility([ERole.ADMIN], [EPermission.ADMIN]);

  const [banners, setBanners] = useState<Banner[]>([]);
  const [selectBanners, setSelectBanners] = useState<string[]>([]);

  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectItem, setSelectItem] = useState<ISelectBanner | null>(null);
  const [pagination, setPagination] = useState<IPagination>(initPagination);
  const [filter, setFilter] = useState<IFilter | null>(null);

  const onSelectCheckBox = useCallback(
    (id: string) => {
      const isExit = selectBanners.find((select: string) => select === id);
      if (isExit) {
        const newSelects = selectBanners.filter(
          (select: string) => select !== id
        );
        setSelectBanners(newSelects);
      } else {
        setSelectBanners([...selectBanners, id]);
      }
    },
    [selectBanners]
  );

  const onChangePublish = async (id: string, status: boolean) => {
    if (!id) {
      toast.error("False change publish", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }

    try {
      const payload = await updateBanner(id, { isPublic: status });

      if (payload.status === 201) {
        toast.success("Success updated banner", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      toast.error("Please try again", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const onSelectDeleteItem = (_id: string, title: string, image: string) => {
    setSelectItem({ _id, title, image });
    handlePopup();
  };

  const handlePopup = () => {
    if (showPopup) {
      setSelectItem(null);
    }

    setShowPopup(!showPopup);
  };

  const handleGetData = useCallback(async () => {
    setMessage(null);
    setLoading(true);

    try {
      const response = await getBanners(currentPage);
      if (response.status === 200) {
        if (response.payload.length === 0) {
          setBanners([]);
          setMessage("No banner");
          setLoading(false);
          return;
        }

        const data: Banner[] = response.payload.map((item: Banner) => {
          return {
            _id: item._id,
            title: item.title,
            meta_title: item.meta_title,
            isPublic: item.isPublic,
            image: item.image,
            createdAt: item.createdAt,
          };
        });
        setPagination(response.pagination);
        setBanners(data);
        setLoading(false);
      }
    } catch (error) {
      setMessage("Error in server");
      setLoading(false);
      toast.error("Error in server, please try again", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }, [filter, currentPage]);

  const handleGetDataByFilter = useCallback(async () => {
    setMessage(null);
    setLoading(true);

    try {
      const response = await getCategoriesWithFilter(filter, currentPage);
      if (response.status === 200) {
        if (response.payload.length === 0) {
          setBanners([]);
          setMessage("No banner");
          setLoading(false);
          return;
        }

        const data: Banner[] = response.payload.map((item: Banner) => {
          return {
            _id: item._id,
            title: item.title,
            meta_title: item.meta_title,
            isPublic: item.isPublic,
            image: item.image,
            createdAt: item.createdAt,
          };
        });
        setPagination(response.pagination);
        setBanners(data);
        setLoading(false);
      }
    } catch (error) {
      setMessage("Error in server");
      toast.error("Error in server, please try again", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setLoading(false);
    }
  }, [filter, currentPage]);

  const handleDeleteCategory = useCallback(async () => {
    if (!selectItem || !selectItem._id) {
      setShowPopup(false);
      toast.error("False delete category", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    try {
      await deleteBanner(selectItem._id);
      setShowPopup(false);

      if (filter) {
        handleGetDataByFilter();
      } else {
        handleGetData();
      }

      toast.success("Success delete banner", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      toast.error("Error delete banner", {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(error);
    }
  }, [selectItem]);

  useEffect(() => {
    handleGetData();
  }, [currentPage]);

  useEffect(() => {
    if (selectBanners.length > 0) {
      setSelectBanners([]);
    }
  }, [banners, currentPage]);

  if (!router.isReady) {
    return <Loading />;
  }

  return (
    <ShowItemsLayout
      title={t("BannerPage.title")}
      titleCreate={isCan ? t("BannerPage.create") : null}
      link="/create/banner"
      selectItem={{
        title: selectItem?.title ? selectItem.title : "",
        id: selectItem?._id || null,
      }}
      pagination={pagination}
      handleDelete={handleDeleteCategory}
      showPopup={showPopup}
      handlePopup={handlePopup}
    >
      <Fragment>
        <Table
          items={banners}
          selects={selectBanners}
          setSelects={setSelectBanners}
          selectAll={true}
          isSelected={selectBanners.length === banners.length ? true : false}
          colHeadTabel={colHeadTable[i18n.resolvedLanguage as string]}
          message={message}
          loading={loading}
        >
          <Fragment>
            {banners.map((item: Banner, index: number) => (
              <tr
                key={item._id}
                className={`hover:bg-slate-100 dark:bg-gray-800 dark:hover:bg-gray-900 dark:text-white border-gray-300 last:border-none`}
              >
                <CelTable
                  type={typeCel.SELECT}
                  isSelected={
                    selectBanners.includes(item._id as string) ? true : false
                  }
                  onSelectCheckBox={() => onSelectCheckBox(item._id as string)}
                />
                <CelTable
                  type={typeCel.LINK}
                  value={item.title}
                  href={`/edit/banner/${item._id}`}
                />
                <CelTable
                  type={typeCel.THUMBNAIL}
                  value={item.image as string}
                  href={`/edit/banner/${item._id}`}
                />
                <CelTable
                  id={item._id as string}
                  type={typeCel.PUBLIC}
                  checked={item.isPublic}
                  onGetChecked={onChangePublish}
                />
                <CelTable
                  type={typeCel.DATE}
                  center={true}
                  value={item.createdAt}
                />
                <CelTable type={typeCel.GROUP}>
                  <Can I={ERole.ADMIN} A={EPermission.ADMIN}>
                    <div className="flex items-center justify-center gap-2">
                      <ButtonEdit link={`/edit/banner/${item._id}`} />

                      <ButtonDelete
                        onClick={() =>
                          onSelectDeleteItem(
                            item._id as string,
                            item.title,
                            item.image as string
                          )
                        }
                      />
                    </div>
                  </Can>
                </CelTable>
              </tr>
            ))}
          </Fragment>
        </Table>
      </Fragment>
    </ShowItemsLayout>
  );
};

export default BannersPage;

BannersPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
