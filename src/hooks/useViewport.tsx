import { useState, useEffect } from "react";

const useViewport = () => {
  const [width, setWidth] = useState<number>(0);

  const updateWidth = () => {
    const currentWidth = window.innerWidth || window.screen.width;
    setWidth(currentWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", updateWidth);
  }, [width]);

  useEffect(() => {
    updateWidth();
  }, [])

  return width;
};

export default useViewport;
