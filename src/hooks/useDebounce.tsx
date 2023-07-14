import { useState, useEffect } from "react";

const useDebounce = (value: string | null, timer: number) => {
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    const hanlder = setTimeout(() => {
      setData(value);
    }, timer);

    return () => clearTimeout(hanlder);
  }, [value, timer]);

  return data;
};

export default useDebounce;
