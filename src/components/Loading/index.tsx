import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Loading = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black opacity-60 z-[9999]">
      <AiOutlineLoading3Quarters className="spinner text-5xl text-white" />
    </div>
  );
};

export default Loading;
