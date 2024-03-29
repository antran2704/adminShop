import DefaultLayout from "../DefaultLayout";

interface Props {
  children: JSX.Element;
}

const LayoutWithoutHeader = ({ children }: Props) => {
  return (
    <DefaultLayout>
        {children}
    </DefaultLayout>
  );
};

export default LayoutWithoutHeader;
