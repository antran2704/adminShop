import { useState, memo } from "react";
import { AiOutlinePlus, AiOutlineMinus, AiOutlineFile } from "react-icons/ai";

import Tree from ".";
import { ICategorySelect } from "~/interface/category";

interface Props {
  parent_id: string | null;
  node_id: string;
  title: string;
  childrens: string[];
  categories: any;
  categoriesParent: any;
  categorySelect: ICategorySelect;
  onSelect: (title: string | null, node_id: string | null) => void;
}

const TreeNode = (props: Props) => {
  const {
    title,
    parent_id,
    node_id,
    childrens,
    categories,
    categoriesParent,
    categorySelect,
    onSelect,
  } = props;
  const [open, setOpen] = useState<boolean>(false);

  const onOpen = () => {
    setOpen(!open);
  };

  const handleSelect = () => {
    if (!parent_id && title === "Home") {
      onSelect("Home", null);
    } else {
      onSelect(title, node_id);
    }
  };

  return (
    <li>
      <div
        className={`flex items-center w-fit ${
          categorySelect.title === title && "bg-primary text-white"
        } cursor-pointer px-3 py-1 rounded-md gap-2`}
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
