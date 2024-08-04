import { CgSpinner } from "react-icons/cg";

interface Props {
  className?: string;
}

const SpinLoading = (props: Props) => {
  const { className } = props;
  return (
    <div className="h-full flex items-center justify-center bg-white/30 backdrop-blur-lg">
      <CgSpinner className={`animate-spin dark:text-white ${className}`} />
    </div>
  );
};

export default SpinLoading;
