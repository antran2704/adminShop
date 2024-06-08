import { CgSpinner } from "react-icons/cg";

interface Props {
  className?: string;
}

const SpinLoading = (props: Props) => {
  const { className } = props;
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-white/30 backdrop-blur-lg z-[9999]">
      <CgSpinner className={`animate-spin dark:text-white ${className}`} />
    </div>
  );
};

export default SpinLoading;
