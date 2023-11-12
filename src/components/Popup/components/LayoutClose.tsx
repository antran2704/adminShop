interface Props {
  onClose: () => void;
}

const LayoutClose = (props: Props) => {
  const { onClose } = props;
  return (
    <div
      onClick={onClose}
      className="absolute w-full h-full bg-black opacity-60 z-10"
    ></div>
  );
};

export default LayoutClose;
