import {
  useState,
  useRef,
  FC,
  useEffect,
  createContext,
  Dispatch,
  SetStateAction,
} from "react";
import { typeInput } from "~/enums";

import Input from "~/components/Input";
import Thumbnail from "~/components/Image/Thumbnail";

import FormLayout from "~/layouts/FormLayout";
import Popup from "~/components/Popup";
import { IThumbnailUrl, IOption, IDataCategory } from "~/interface/category";
import { axiosGet } from "~/ultils/configAxios";
import Tree from "~/components/Tree";

interface Props {
  data: IDataCategory;
  selectOptionIndex: number | null;
  thumbnailUrl: IThumbnailUrl;
  handleChangeValue: (
    name: string | undefined,
    value: string | number | boolean
  ) => void;
  uploadThumbnail: (source: object, url: string) => void;
  addOption: (newOption: string) => void;
  selectOption: (index: number) => void;
  editOption: (newOption: string) => void;
  deleteOption: () => void;
  handleOnSubmit: () => void;
}

interface ICategorySelect {
  title: string | null;
  node_id: string | null;
}

interface ICategoryContext {
  categorySelect: ICategorySelect;
  setCategorySelect: Dispatch<SetStateAction<ICategorySelect>>;
}

const initData: IDataCategory = {
  parent_id: null,
  title: "",
  description: "",
  meta_title: "",
  meta_description: "",
  public: true,
  slug: null,
  thumbnail: null,
  breadcrumbs: "",
  childrens: [],
};

export const CategoryContext = createContext<ICategoryContext>({
  categorySelect: {
    title: null,
    node_id: null,
  },
  setCategorySelect: () => null,
});

const HandleLayout: FC<Props> = (props: Props) => {
  const [data, setData] = useState<IDataCategory>(initData);
  const [categories, setCategories] = useState({});
  const [categoriesParent, setCategoriesParent] = useState([]);
  const [showOption, setShowOption] = useState<boolean>(false);
  const [categorySelect, setCategorySelect] = useState<ICategorySelect>({title: null, node_id: null});

  const changeValue = (name: string, value: string) => {
    setData({ ...data, [name]: value });
  };

  const handleShowPopup = () => {
    setShowOption(!showOption);
  };

  const handleGetCategories = async () => {
    let data: any = {};
    try {
      const response = await axiosGet("category/getCategories");

      for (const item of response.payload) {
        const { _id, parent_id, title, childrens } = item;
        data[_id] = { _id, parent_id, title, childrens };
      }

      setCategories(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetCategoriesParent = async () => {
    try {
      const response = await axiosGet("category/parentCategories");
      const data = response.payload.map((item: any) => item._id);

      setCategoriesParent(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetCategories();
    handleGetCategoriesParent();
  }, []);
  return (
    <FormLayout onSubmit={props.handleOnSubmit}>
      <div>
        <div className="w-full flex lg:flex-nowrap flex-wrap items-center justify-between lg:gap-5 gap-3">
          <Input
            title="Title"
            width="lg:w-2/4 w-full"
            value={data.title}
            name="title"
            type={typeInput.input}
            getValue={changeValue}
          />
        </div>

        <div className="w-full flex lg:flex-nowrap flex-wrap items-center justify-between mt-5 lg:gap-5 gap-3">
          <Input
            title="Description"
            width="lg:w-2/4 w-full"
            value={data.description}
            name="description"
            type={typeInput.textarea}
            getValue={changeValue}
          />
        </div>

        <div className="w-full mt-5">
          <Input
            title="Parent Category"
            width="lg:w-2/4 w-full"
            value={categorySelect.title ? categorySelect.title : ""}
            name="parent_id"
            type={typeInput.input}
            readonly={true}
          />

          <CategoryContext.Provider value={{ categorySelect, setCategorySelect }}>
            {categoriesParent.length > 0 &&
              Object.keys(categories).length > 0 &&
              categoriesParent.map((id) => (
                <Tree
                  categories={categories}
                  node_id={id}
                  parent_id="null"
                  key={id}
                />
              ))}
          </CategoryContext.Provider>
        </div>

        <div className="w-full flex lg:flex-nowrap flex-wrap items-start justify-between mt-5 lg:gap-5 gap-3">
          <Thumbnail
            thumbnailUrl={props.thumbnailUrl.url}
            onChange={props.uploadThumbnail}
          />
         
        </div>

        {/* Popup add Options name */}
        {/* <Popup show={showOption} onClose={handleShowPopup}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!isEditOption) {
                handleAddOption();
              } else {
                handleEditOption();
              }
              setShowOption(!showOption);
            }}
          >
            <div>
              <span className="block text-base text-[#1E1E1E] font-medium mb-2">
                Option name
              </span>
              <input
                required
                ref={optionRef}
                type="text"
                className="w-full rounded-md px-2 py-1 border-2 focus:border-gray-600 outline-none"
              />
            </div>

            {!isEditOption && (
              <div className="flex lg:flex-nowrap flex-wrap items-center justify-between pt-5 lg:gap-5 gap-2">
                <button
                  type="button"
                  onClick={() => setShowOption(!showOption)}
                  className="lg:w-fit w-full text-lg text-white font-medium bg-error px-5 py-1 rounded-md"
                >
                  Cancle
                </button>
                <button className="lg:w-fit w-full text-lg text-white font-medium bg-primary px-5 py-1 rounded-md">
                  Add
                </button>
              </div>
            )}

            {isEditOption && (
              <div className="flex lg:flex-nowrap flex-wrap items-center justify-between pt-5 lg:gap-5 gap-2">
                <button
                  type="button"
                  onClick={handleDeleteOption}
                  className="lg:w-fit w-full text-lg text-white font-medium bg-error px-5 py-1 rounded-md"
                >
                  Delete
                </button>
                <button className="lg:w-fit w-full text-lg text-white font-medium bg-primary px-5 py-1 rounded-md">
                  Save
                </button>
              </div>
            )}
          </form>
        </Popup> */}
      </div>
    </FormLayout>
  );
};

export default HandleLayout;
