import { useEffect, useState } from "react";
import { useAppSelector } from "~/store/hooks";

interface Props {
  I: string;
  A: string;
  children: JSX.Element;
}

const Can = (props: Props) => {
  const { I, A, children } = props;

  const { permission, role } = useAppSelector((state) => state.user);

  const [isCan, setIsCan] = useState<boolean>(false);

  useEffect(() => {
    if (I === role && A === permission) {
      setIsCan(true);
    }
  }, [permission, role]);

  return isCan ? children : null;
};

export default Can;
