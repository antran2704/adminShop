import { useEffect } from "react";

interface Props {
  dissableScroll?: boolean;
  onClose: () => void;
}

const LayoutClose = (props: Props) => {
  const { onClose, dissableScroll = true } = props;


  useEffect(() => {
    if(dissableScroll) {
      const el = document.querySelector("#body");

      if(!el) return;

      el.classList.add("dissableScroll");

      return () => {
        el.classList.remove("dissableScroll");
      }
    }
  }, [])

  return (
    <div
      onClick={onClose}
      className="absolute w-full h-full bg-black opacity-60 z-10"
    ></div>
  );
};

export default LayoutClose;
