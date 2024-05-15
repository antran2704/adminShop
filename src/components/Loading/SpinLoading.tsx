import { CgSpinner } from "react-icons/cg";

interface Props {
    className?: string;
}

const SpinLoading = (props: Props) => {
    const { className } = props;
    return <CgSpinner className={`animate-spin ${className}`} />;
};

export default SpinLoading;
