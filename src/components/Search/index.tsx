import { useRouter } from "next/router";
import { FC, memo, KeyboardEvent, ChangeEvent } from "react";
import { InputText } from "../InputField";

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

  const handleFilter = () => {
    if (router.query.page && Number(router.query.page) !== 1) {
      router.replace({
        query: {},
      });
    }

    if (!router.query.page || Number(router.query.page) === 1) {
      onFilter();
    }
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
