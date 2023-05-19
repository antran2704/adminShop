import { AiOutlineLoading3Quarters } from "react-icons/ai";
import IBtnShowMore from "./interface";


const ButtonShowMore = ({loading, onClick}: IBtnShowMore) => {
  return (
    <div className="flex items-center justify-center w-full mt-5">
      <button
        onClick={onClick}
        className="flex items-center justify-center w-[130px] h-11 md:text-lg text-base text-white bg-primary px-10 py-2 rounded-md"
      >
        {loading ? (
          <AiOutlineLoading3Quarters className="spinner text-xl text-white" />
        ) : (
          "More"
        )}
      </button>
    </div>
  );
};

export default ButtonShowMore;
