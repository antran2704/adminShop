import { useRouter } from "next/router";
import { FC, memo, useState, useEffect, ChangeEvent } from "react";
import useDebounce from "~/hooks/useDebounce";

interface Props {
  placeholder?: string;
  search: string;
  children?: JSX.Element;
  onReset: () => void;
  onFillter: () => void;
  onSearch: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Search: FC<Props> = (props: Props) => {
  const { search, placeholder, children, onReset, onSearch, onFillter } = props;

  const router = useRouter();
  const currentSearch = router.query.search;
  //   const [search, setSearch] = useState<string | null>(null);
  //   const debouncedValue = useDebounce(search, 1000);

  //   const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
  //     const searchText = e.target.value;

  //     if (searchText.length > 0) {
  //       router.replace({
  //         query: { search: searchText },
  //       });
  //     } else {
  //       router.replace({});
  //     }

  //     setSearch(searchText);
  //   };

  //   useEffect(() => {
  //     if (search !== null) {
  //       props.onSearch(search);
  //     }
  //   }, [debouncedValue]);

  return (
    <div
      className={`flex flex-wrap items-end min-h-10 my-5 gap-5`}
    >
      <input
        value={search}
        type="text"
        name="search"
        onChange={onSearch}
        className={`lg:w-4/12 md:w-6/12 w-full h-10 border rounded-md focus:outline-none text-xxs lg:text-base text-[#343a40] px-5 bg-transparent`}
        placeholder={placeholder ? placeholder : "Search..."}
      />

      {children}

      <button
      onClick={onFillter}
        className={`flex items-center justify-center h-10 text-lg text-white bg-primary font-medium px-8 py-1 rounded-md`}
      >
        Fillter
      </button>
      <button
        onClick={onReset}
        className={`flex items-center justify-center h-10 text-lg text-text bg-[#e5e7eb] font-medium px-8 py-1 rounded-md`}
      >
        Reset
      </button>
    </div>
  );
};

export default memo(Search);
