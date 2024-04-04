import { useRef, useEffect } from "react";

interface Props {
  title?: string;
  className?: string;
  src: string;
}

const ImageCus = (props: Props) => {
  const { title, className, src } = props;
  const imageRef = useRef<HTMLImageElement>(null);
  
  async function loadImage(e: HTMLImageElement) {
    return new Promise((resolve) => {
      e.onload = () => resolve(e);
      e.onerror = () => {
        e.src = "/no_image.jpg";
      };

      if (e.complete) {
        e.src = src;
      }
    });
  }

  useEffect(() => {
    if (imageRef.current) {
      loadImage(imageRef.current);
    }
  }, []);

  return (
    <img
      ref={imageRef}
      src={src}
      title={title}
      alt={title}
      className={className}
    />
  );
};

export default ImageCus;
