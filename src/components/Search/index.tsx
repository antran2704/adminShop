import { useRouter } from "next/router";
import { FC, memo, KeyboardEvent, ChangeEvent } from "react";

interface Props {
  placeholder?: string;
  search: string;
  children?: JSX.Element;
  onReset: () => void;
  onFilter: () => void;
  onSearch: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Search: FC<Props> = (props: Props) => {
  const { search, placeholder, children, onReset, onSearch, onFilter } = props;
  
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

  const onKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;
    if (key === "Enter") {
      onFilter();
    }
  }

  return (
    <div
      className={`flex flex-wrap items-end min-h-10 mt-5 mb-10 gap-5`}
    >
      <input
        value={search}
        type="text"
        name="search"
        onChange={onSearch}
        onKeyUp={onKeyUp}
        className={`lg:w-4/12 md:w-6/12 w-full h-10 border rounded-md focus:outline-none text-xxs lg:text-base text-[#343a40] px-5 bg-transparent`}
        placeholder={placeholder ? placeholder : "Search..."}
      />

      {children}

      <div className="md:w-fit w-full flex md:flex-row flex-col items-center md:gap-5 gap-2">
        <button
        onClick={onFilter}
          className={`flex md:w-fit w-full items-center justify-center h-10 text-lg text-white bg-primary font-medium px-8 py-1 rounded-md`}
        >
          Fillter
        </button>
        <button
          onClick={onReset}
          className={`flex md:w-fit w-full items-center justify-center h-10 text-lg text-text bg-[#e5e7eb] font-medium px-8 py-1 rounded-md`}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default memo(Search);
