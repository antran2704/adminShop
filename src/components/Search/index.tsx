import { useRouter } from "next/router";
import { FC, memo, useEffect, useState, useCallback } from "react";
import { InputText } from "../InputField";
import { useTranslation } from "react-i18next";

interface Props {
  placeholder?: string;
  search: string;
  children?: JSX.Element;
  onReset: () => void;
  onFilter: () => void;
  onSearch: (name: string, value: string) => void;
}

const Search: FC<Props> = (props: Props) => {
  const { search, placeholder, children, onReset, onSearch, onFilter } = props;
  const router = useRouter();

  const { t } = useTranslation();

  const handleFilter = () => {
    const page = Number(router.query.page);

    if (search) {
      router.replace({
        query: { searchText: search, page: "1" },
      });
    } else {
      router.replace({
        query: { page: "1" },
      });
    }

    if (!page || page === 1) {
      onFilter();
    }
  };

  const handleReset = () => {
    router.replace({
      query: {},
    });

    onReset();
  };

  return (
    <div className={`flex flex-wrap items-end min-h-10 mt-5 mb-10 gap-5`}>
      <InputText
        width="lg:w-4/12 md:w-6/12 w-full"
        name="search"
        size="M"
        value={search}
        getValue={onSearch}
        placeholder={placeholder ? placeholder : "Search..."}
        enableEnter={true}
        onEnter={handleFilter}
      />

      {children}

      <div className="md:w-fit w-full flex md:flex-row flex-col items-center md:gap-5 gap-2">
        <button
          onClick={handleFilter}
          className={`flex md:w-fit w-full items-center justify-center h-10 text-lg text-white bg-primary font-medium px-8 py-1 rounded-md`}
        >
          {t("Search.filter")}
        </button>
        <button
          onClick={handleReset}
          className={`flex md:w-fit w-full items-center justify-center h-10 text-lg text-text bg-[#e5e7eb] font-medium px-8 py-1 rounded-md`}
        >
          {t("Search.reset")}
        </button>
      </div>
    </div>
  );
};

export default memo(Search);
