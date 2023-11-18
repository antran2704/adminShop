interface Props {
  title: string;
  className?: string;
}

const NoResult = (props: Props) => {
  const { title = "No result", className } = props;

  return (
    <div className={`flex flex-col items-center md:w-4/12 w-6/12 mx-auto ${className} gap-5`}>
      <img
        src="/no_result.svg"
        alt="no result"
        className="w-full object-center"
      />

      <p className="md:text-lg text-base font-medium">{title}</p>
    </div>
  );
};

export default NoResult;
