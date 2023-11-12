import { GetServerSideProps } from "next";
import Link from "next/link";
import { ParsedUrlQuery } from "querystring";
import { useState, useEffect, Fragment, useCallback } from "react";
import { toast } from "react-toastify";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

import { axiosGet, axiosPatch, axiosPost } from "~/ultils/configAxios";
import { typeCel, typeInput } from "~/enums";

import { INewVariant, IVariant } from "~/interface";

import ShowItemsLayout from "~/layouts/ShowItemsLayout";

import Table from "~/components/Table";
import CelTable from "~/components/Table/CelTable";
import { colHeaderAttributeValue as colHeadTable } from "~/components/Table/colHeadTable";
import { IPagination } from "~/interface/pagination";
import PopupForm from "~/components/Popup/PopupForm";
import Input from "~/components/Input";
import ButtonCheck from "~/components/Button/ButtonCheck";

interface ISelectAttribute {
  id: string | null;
  title: string;
  public: boolean;
}

const initSelect: ISelectAttribute = {
  id: null,
  title: "",
  public: true,
};

const initNewVariant: INewVariant = {
  name: "",
  public: true,
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
  const [showFormUpdate, setShowFormUpdate] = useState<boolean>(false);
  const [showFormCreate, setShowFormCreate] = useState<boolean>(false);
  const [newVarinat, setNewVariant] = useState<INewVariant>(initNewVariant);
  const [selectItem, setSelectItem] = useState<ISelectAttribute>(initSelect);
  const [pagination, setPagination] = useState<IPagination>(initPagination);

  const changePublic = useCallback(
    (name: string, value: boolean) => {
      setSelectItem({ ...selectItem, [name]: value });
    },
    [selectItem]
  );

  const changePublicNewVariant = useCallback(
    (name: string, value: boolean) => {
      setNewVariant({ ...newVarinat, [name]: value });
    },
    [newVarinat]
  );

  const changeValue = useCallback(
    (name: string, value: string) => {
      // if (fieldsCheck.includes(name)) {
      //   const newFieldsCheck = handleRemoveCheck(fieldsCheck, name);
      //   setFieldsCheck(newFieldsCheck);
      // }
      setSelectItem({ ...selectItem, [name]: value });
    },
    [selectItem]
  );

  const changeValueNewVariant = useCallback(
    (name: string, value: string) => {
      // if (fieldsCheck.includes(name)) {
      //   const newFieldsCheck = handleRemoveCheck(fieldsCheck, name);
      //   setFieldsCheck(newFieldsCheck);
      // }
      setNewVariant({ ...newVarinat, [name]: value });
    },
    [newVarinat]
  );

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
        handleGetData();
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

  const handleUpdate = async () => {
    if (!selectItem.id) {
      toast.error("False change public", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }

    try {
      const payload = await axiosPatch(`/variants/child/${id}`, {
        children_id: selectItem.id,
        name: selectItem.title,
        public: selectItem.public,
      });

      if (payload.status === 201) {
        toast.success("Success updated attribute", {
          position: toast.POSITION.TOP_RIGHT,
        });
        handleGetData();
        handlePopupFormUpdate();
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
      setSelectItem(initSelect);
    }

    setShowPopup(!showPopup);
  };

  const handlePopupFormUpdate = (data?: ISelectAttribute | null) => {
    if (showFormUpdate) {
      setSelectItem(initSelect);
    }

    if (!showFormUpdate && data) {
      setSelectItem(data);
    }

    setShowFormUpdate(!showFormUpdate);
  };

  const handlePopupFormCreate = () => {
    if (showFormCreate) {
      setNewVariant(initNewVariant);
    }

    setShowFormCreate(!showFormCreate);
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

  const handleAddVarinat = async () => {
    try {
      const payload = await axiosPost(`variants/child/${id}`, {
        name: newVarinat.name,
        public: newVarinat.public,
      });

      if (payload.status === 201) {
        handlePopupFormCreate();
        handleGetData();
        toast.success("Success add attribute value", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      toast.error("Add attribute value failed", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  useEffect(() => {
    handleGetData();
  }, []);

  return (
    <ShowItemsLayout
      title="Attribute Values"
      titleCreate="Add value"
      selectItem={{
        title: selectItem?.title ? selectItem.title : "",
        id: selectItem?.id || null,
      }}
      onCreate={handlePopupFormCreate}
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
                    <button
                      onClick={() =>
                        handlePopupFormUpdate({
                          id: item._id as string,
                          title: item.name,
                          public: item.public,
                        })
                      }
                      className="block w-fit px-3 py-2 border-blue-700 border-2 text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none"
                    >
                      <AiOutlineEdit className="text-xl w-fit" />
                    </button>

                    <button
                      onClick={() =>
                        onSelectDeleteItem({
                          id: item._id as string,
                          title: item.name,
                          public: item.public,
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

        {/* Popup Form for update */}
        <PopupForm
          title="Update Attribute Value"
          description="Update your attribute values and necessary information from here"
          show={showFormUpdate}
          onClose={handlePopupFormUpdate}
        >
          <Fragment>
            {selectItem && selectItem.id && (
              <div className="flex flex-col justify-between h-full">
                <div className="w-full flex flex-col px-5 gap-5">
                  <Input
                    title="Attribute Title"
                    width="w-full"
                    value={selectItem.title}
                    name="title"
                    type={typeInput.input}
                    getValue={changeValue}
                    placeholder="Color or Size or Material"
                  />

                  <ButtonCheck
                    title="Public"
                    name="public"
                    width="w-fit"
                    isChecked={selectItem.public}
                    onChange={changePublic}
                  />
                </div>

                <div className="flex items-center justify-between p-5 mt-5 border-t gap-5">
                  <button
                    onClick={() => handlePopupFormUpdate()}
                    className="w-fit text-lg text-white font-medium bg-error px-5 py-1 rounded-md"
                  >
                    Cancle
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="w-fit text-lg text-white font-medium bg-primary px-5 py-1 rounded-md"
                  >
                    Update
                  </button>
                </div>
              </div>
            )}
          </Fragment>
        </PopupForm>

        {/* Popup Form for add value */}
        <PopupForm
          title="Add Attribute Value"
          description="Add your attribute values and necessary information from here"
          show={showFormCreate}
          onClose={handlePopupFormCreate}
        >
          <Fragment>
            <div className="flex flex-col justify-between h-full">
              <div className="w-full flex flex-col px-5 gap-5">
                <Input
                  title="Attribute Title"
                  width="w-full"
                  name="name"
                  type={typeInput.input}
                  value={newVarinat.name}
                  getValue={changeValueNewVariant}
                  placeholder="Color or Size or Material"
                />

                <ButtonCheck
                  title="Public"
                  name="public"
                  width="w-fit"
                  isChecked={newVarinat.public}
                  onChange={changePublicNewVariant}
                />
              </div>

              <div className="flex items-center justify-between p-5 mt-5 border-t gap-5">
                <button
                  onClick={() => handlePopupFormCreate()}
                  className="w-fit text-lg text-white font-medium bg-error px-5 py-1 rounded-md"
                >
                  Cancle
                </button>
                <button
                  onClick={handleAddVarinat}
                  className="w-fit text-lg text-white font-medium bg-primary px-5 py-1 rounded-md"
                >
                  Add
                </button>
              </div>
            </div>
          </Fragment>
        </PopupForm>
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
