import { useRouter } from "next/router";
import { FC, memo, useState, useEffect, ChangeEvent } from "react";
import useDebounce from "~/hooks/useDebounce";

interface Props {
  placeholder?: string;
  onSearch: (text: string) => void;
}

const Search: FC<Props> = (props: Props) => {
  const router = useRouter();
  const currentSearch = router.query.search;
  const [search, setSearch] = useState<string | null>(null);
  const debouncedValue = useDebounce(search, 1000);
  
  const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchText = e.target.value;

    if (searchText.length > 0) {
      router.replace({
        query: { search: searchText },
      });
    } else {
      router.replace({});
    }

    setSearch(searchText);
  };

  useEffect(() => {
    if (search !== null) {
      props.onSearch(search);
    }
  }, [debouncedValue]);

  return (
    <div className="flex justify-end py-5">
      <div className="inline-flex border-2 rounded lg:w-4/12 md:w-6/12 w-full lg:px-2 px-5 h-10 bg-transparent">
        <div className="flex flex-wrap items-center w-full h-full mb-6 relative">
          <div className="flex">
            <span className="flex items-center leading-normal bg-transparent rounded rounded-r-none border border-r-0 border-none lg:px-2 py-2 whitespace-no-wrap text-grey-dark text-sm">
              <svg
                width="18"
                height="18"
                className="w-4 lg:w-auto"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.11086 15.2217C12.0381 15.2217 15.2217 12.0381 15.2217 8.11086C15.2217 4.18364 12.0381 1 8.11086 1C4.18364 1 1 4.18364 1 8.11086C1 12.0381 4.18364 15.2217 8.11086 15.2217Z"
                  stroke="#455A64"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16.9993 16.9993L13.1328 13.1328"
                  stroke="#455A64"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
          <input
            value={currentSearch || ""}
            type="text"
            onChange={onChangeSearch}
            className="flex-shrink flex-grow leading-normal tracking-wide w-px flex-1 border border-none border-l-0 rounded rounded-l-none px-3 relative focus:outline-none text-xxs lg:text-base text-[#343a40]"
            placeholder={props?.placeholder ? props.placeholder : "Search..."}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(Search);
