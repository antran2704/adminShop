import { FC, useState, memo } from "react";

import { ISelectItem } from "~/interface";
import SelectMutipleItem from "./SelectMultipleItem";

interface IObjectSelect {
  [key: string]: ISelectItem[];
}

interface Props {
  className?: string;
  data: IObjectSelect;
  selects: IObjectSelect;
  selectItem: (items: ISelectItem, key: string) => void;
  removeItem: (items: ISelectItem[], id: string, key: string) => void;
  selectAll: (items: ISelectItem[], key: string) => void;
}

const SelectMultipleWrap: FC<Props> = (props: Props) => {
  const { className, data, selects, selectItem, removeItem, selectAll } = props;
  const [selectIndex, setSelectIndex] = useState<number | null>(null);

  const onSetSelectIndex = (value: number | null) => {
    if (value === selectIndex) {
      setSelectIndex(null);
    } else {
      setSelectIndex(value);
    }
  };

  return (
    <div className={`grid ${className ? className : "lg:grid-cols-4 md:grid-cols-3 grid-cols-2"} gap-5`}>
      {Object.keys(data || {}).map((key: any, index: number) => (
        <SelectMutipleItem
          key={key}
          title={`Select ${key === "default" ? "Atrribute" : key}`}
          data={data[key]}
          show={selectIndex === index ? true : false}
          name={key}
          selectItem={selectItem}
          selectIndex={index}
          onSetSelectIndex={onSetSelectIndex}
          removeItem={removeItem}
          selectAll={selectAll}
          selects={selects[key] || []}
        />
      ))}

      <div
        onClick={() => setSelectIndex(null)}
        className={`fixed ${
          selectIndex !== null ? "block" : "hidden"
        } top-0 left-0 bottom-0 right-0 bg-transparent z-10`}
      ></div>
    </div>
  );
};

export default memo(SelectMultipleWrap);
