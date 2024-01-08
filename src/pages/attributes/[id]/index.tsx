import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useState, useEffect, Fragment, useCallback } from "react";
import { toast } from "react-toastify";

import { typeCel } from "~/enums";

import { INewVariant, IVariant } from "~/interface";
import { handleCheckFields, handleRemoveCheck } from "~/helper/checkFields";

import ShowItemsLayout from "~/layouts/ShowItemsLayout";

import { Table, CelTable } from "~/components/Table";
import { colHeaderAttributeValue as colHeadTable } from "~/components/Table/colHeadTable";
import { IPagination } from "~/interface/pagination";
import PopupForm from "~/components/Popup/PopupForm";
import { InputText } from "~/components/InputField";
import ButtonCheck from "~/components/Button/ButtonCheck";
import { ButtonDelete, ButtonEdit } from "~/components/Button";
import Loading from "~/components/Loading";
import {
  createChildAttribute,
  deleteChildAttribute,
  getChildAttributes,
  updateChildAttribute,
} from "~/api-client";

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

  const router = useRouter();

  const [attributes, setAttribute] = useState<IVariant[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [showFormUpdate, setShowFormUpdate] = useState<boolean>(false);
  const [showFormCreate, setShowFormCreate] = useState<boolean>(false);
  const [newVarinat, setNewVariant] = useState<INewVariant>(initNewVariant);
  const [selectItem, setSelectItem] = useState<ISelectAttribute>(initSelect);
  const [pagination] = useState<IPagination>(initPagination);

  const [fieldsCheck, setFieldsCheck] = useState<string[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingTable, setLoadingTable] = useState<boolean>(true);

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
      if (fieldsCheck.includes(name)) {
        const newFieldsCheck = handleRemoveCheck(fieldsCheck, name);
        setFieldsCheck(newFieldsCheck);
      }
      setSelectItem({ ...selectItem, [name]: value });
    },
    [selectItem]
  );

  const changeValueNewVariant = useCallback(
    (name: string, value: string) => {
      if (fieldsCheck.includes(name)) {
        const newFieldsCheck = handleRemoveCheck(fieldsCheck, name);
        setFieldsCheck(newFieldsCheck);
      }
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
      const payload = await updateChildAttribute(id as string, children_id, {
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

  const handleUpdate = async () => {
    if (!selectItem.id) {
      toast.error("False change public", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }

    const fields = checkData([
      {
        name: "title",
        value: selectItem.title,
      },
    ]);

    if (fields.length > 0) {
      toast.error("Please input fields", {
        position: toast.POSITION.TOP_RIGHT,
      });

      return;
    }
    setLoading(true);
    try {
      const payload = await updateChildAttribute(
        id as string,
        selectItem.id as string,
        {
          name: selectItem.title,
          public: selectItem.public,
        }
      );

      if (payload.status === 201) {
        toast.success("Success updated attribute", {
          position: toast.POSITION.TOP_RIGHT,
        });
        handleGetData();
        handlePopupFormUpdate();
      }

      setLoading(false);
    } catch (error) {
      toast.error("Please try again", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setLoading(false);
    }
  };

  const onSelectDeleteItem = (item: ISelectAttribute) => {
    setSelectItem(item);
    handlePopup();
  };

  const checkData = (data: any) => {
    let fields = handleCheckFields(data);
    setFieldsCheck(fields);
    if (fields.length > 0) {
      router.push(`#${fields[0]}`);
    }

    return fields;
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
    setLoadingTable(true);

    try {
      const response = await getChildAttributes(id as string);
      if (response.status === 200) {
        if (response.payload.variants.length === 0) {
          setAttribute([]);
          setMessage("No attribute value");
          setLoadingTable(false);
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
        setAttribute(data);
        setLoadingTable(false);
      }
    } catch (error) {
      console.log(error);
      setMessage("Error in server");
      setLoadingTable(false);
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
      await deleteChildAttribute(id as string, selectItem.id as string);
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
    const fields = checkData([
      {
        name: "name",
        value: newVarinat.name,
      },
    ]);

    if (fields.length > 0) {
      toast.error("Please input fields", {
        position: toast.POSITION.TOP_RIGHT,
      });

      return;
    }

    try {
      const payload = await createChildAttribute(id as string, {
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
        <Table
          colHeadTabel={colHeadTable}
          message={message}
          loading={loadingTable}
        >
          <Fragment>
            {attributes.map((item: IVariant) => (
              <tr
                key={item._id}
                className="hover:bg-slate-100 border-b border-gray-300"
              >
                <CelTable type={typeCel.TEXT} center={true} value={item.name} />
                <CelTable
                  id={item._id as string}
                  type={typeCel.PUBLIC}
                  data={item}
                  checked={item.public}
                  onGetChecked={onChangePublic}
                />
                <CelTable type={typeCel.GROUP}>
                  <div className="flex items-center justify-end gap-2">
                    <ButtonEdit
                      onClick={() =>
                        handlePopupFormUpdate({
                          id: item._id as string,
                          title: item.name,
                          public: item.public,
                        })
                      }
                    />

                    <ButtonDelete
                      onClick={() =>
                        onSelectDeleteItem({
                          id: item._id as string,
                          title: item.name,
                          public: item.public,
                        })
                      }
                    />
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
                  <InputText
                    title="Attribute Title"
                    width="w-full"
                    value={selectItem.title}
                    name="title"
                    error={fieldsCheck.includes("title")}
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
                <InputText
                  title="Attribute Title"
                  width="w-full"
                  name="name"
                  value={newVarinat.name}
                  getValue={changeValueNewVariant}
                  error={fieldsCheck.includes("name")}
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

        {loading && <Loading />}
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
