import { useState, memo } from "react";
import TreeNode from "./TreeNode";
import { ICategorySelect } from "~/interface/category";

interface Props {
  parent_id: string | null;
  node_id: string;
  categories: any;
  categoriesParent: any;
  categorySelect: ICategorySelect;
  onSelect: (title: string | null, node_id: string | null) => void;
}

const Tree = (props: Props) => {
  const { node_id, categories, categoriesParent, categorySelect, onSelect } =
    props;
  const [item] = useState(categories[node_id]);
  return (
    <ul className="list-none text-sm px-2 mt-2">
      {!item && (
        <TreeNode
          title={"Home"}
          parent_id={null}
          node_id={"Home"}
          childrens={categoriesParent}
          categories={categories}
          categoriesParent={categoriesParent}
          categorySelect={categorySelect}
          onSelect={onSelect}
        />
      )}

      {item && (
        <TreeNode
          title={item.title}
          parent_id={item.parent_id}
          node_id={item._id}
          childrens={item.childrens}
          categories={categories}
          categoriesParent={categoriesParent}
          categorySelect={categorySelect}
          onSelect={onSelect}
        />
      )}
    </ul>
  );
};

export default memo(Tree);
