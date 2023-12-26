import { useEffect, useRef } from "react";
import { animate, motion } from "framer-motion";

interface Props {
  from: Number;
  to: Number;
  className?: string;
  specialCharacter?: string;
}

const SpringCount = (props: Props) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const { from, to, className, specialCharacter = "" } = props;

  useEffect(() => {
    const controls = animate(from, to, {
      duration: 1,
      onUpdate(value) {
        if (ref.current) {
          const price = Number(value);

          if(specialCharacter) {
            ref.current.textContent = `${new Intl.NumberFormat().format(price)} ${specialCharacter}`;
          } else {
            ref.current.textContent = new Intl.NumberFormat().format(price);
          }
        }
      },
    });
    return () => controls.stop();
  }, [to]);

  return (
    <motion.p
      ref={ref}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      className={className}
    />
  );
};

export default SpringCount;
