interface Props {
  children: JSX.Element;
}

const DefaultLayout = ({ children }: Props) => {
  return (
    <main className="flex items-start justify-between bg-[#f9fafb] dark:bg-[#111827] transition-all ease-linear duration-100">
      {children}
    </main>
  );
};

export default DefaultLayout;
