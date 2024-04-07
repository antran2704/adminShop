import { useState, memo } from "react";
import { AiOutlinePlus, AiOutlineMinus, AiOutlineFile } from "react-icons/ai";

import Tree from ".";
import { ICategorySelect } from "~/interface/category";
import { toast } from "react-toastify";

interface Props {
  parent_id: string | null;
  node_id: string;
  title: string;
  childrens: string[];
  checkOnMove?: boolean;
  categories: any;
  categoriesParent: any;
  categorySelect: ICategorySelect;
  defaultSelect?: ICategorySelect;
  onSelect: (title: string | null, node_id: string | null) => void;
}

const TreeNode = (props: Props) => {
  const {
    title,
    parent_id,
    node_id,
    childrens,
    categories,
    checkOnMove = false,
    categoriesParent,
    categorySelect,
    defaultSelect,
    onSelect,
  } = props;
  const [open, setOpen] = useState<boolean>(false);

  const onOpen = () => {
    setOpen(!open);
  };

  const handleSelect = () => {
    if (!parent_id && title === "Home") {
      onSelect("Home", null);
      return;
    }

    if (checkOnMove && defaultSelect) {
      toast.success("Can't move parent category into children category", {
        position: toast.POSITION.TOP_RIGHT,
      });

      return;
    }
    onSelect(title, node_id);
  };

  return (
    <li>
      <div
        className={`flex items-center w-fit ${
          categorySelect.title === title && "bg-primary text-white"
        } ${
          defaultSelect?.node_id === node_id && "bg-success text-white"
        } dark:text-darkText cursor-pointer px-3 py-1 rounded-md gap-2`}
      >
        {childrens.length === 0 && <AiOutlineFile className="text-lg w-5" />}
        {childrens.length > 0 && !open && (
          <AiOutlinePlus onClick={onOpen} className="text-lg w-5" />
        )}
        {childrens.length > 0 && open && (
          <AiOutlineMinus onClick={onOpen} className="text-lg w-5" />
        )}
        <span onClick={handleSelect}>{title}</span>
      </div>

      <div className={`${open ? "h-auto" : "h-0 overflow-hidden"}`}>
        {childrens.length > 0 &&
          childrens.map((item) => (
            <Tree
              key={item}
              parent_id={node_id}
              node_id={item}
              checkOnMove={
                defaultSelect && defaultSelect.node_id === item
                  ? true
                  : checkOnMove
              }
              defaultSelect={defaultSelect}
              categories={categories}
              categoriesParent={categoriesParent}
              categorySelect={categorySelect}
              onSelect={onSelect}
            />
          ))}
      </div>
    </li>
  );
};

export default memo(TreeNode);
