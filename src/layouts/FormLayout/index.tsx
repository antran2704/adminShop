import { useRouter } from "next/router";
import { forwardRef, ForwardRefRenderFunction, Ref } from "react";
import LayoutWithoutHeader from "~/layouts/LayoutWithoutHeader";

interface props {
  children: JSX.Element;
  title: string;
  backLink?: string;
  onSubmit: () => void;
}

const FormLayout: ForwardRefRenderFunction<HTMLUListElement, props> = (
  props: props,
  ref: Ref<HTMLUListElement> | undefined
) => {
  const { children, title, backLink = "/", onSubmit } = props;

  const router = useRouter();

  return (
    <LayoutWithoutHeader>
      <section className="scrollHidden relative w-full h-screen overflow-auto">
        <div className="flex items-center justify-between px-5 py-5 dark:bg-[#1f2937cc] backdrop-blur-[8px] dark:border-0 border-b-2 z-20">
          <h1 className="lg:text-xl text-lg font-semibold dark:text-darkText max-w-[60%] line-clamp-1">
            {title}
          </h1>
          <button
            onClick={onSubmit}
            className="w-fit text-lg text-white font-medium bg-primary px-5 py-1 rounded-md"
          >
            Save
          </button>
        </div>

        <ul
          ref={ref}
          className="scrollHidden h-[80vh] pb-20 px-5 gap-3 overflow-auto"
        >
          {children}
        </ul>

        <div className="absolute bottom-0 left-0 right-0 flex lg:flex-nowrap flex-wrap items-center justify-between bg-[#ffffffbf] dark:bg-[#1f293733] backdrop-blur-[6px] py-4 px-5 border-t-2 dark:border-transparent lg:gap-5 gap-2">
          <button
            onClick={() => router.push(backLink)}
            className="w-fit text-lg text-white font-medium bg-[#111926] px-5 py-1 opacity-90 hover:opacity-100 border-2 rounded-md"
          >
            Back
          </button>
        </div>
      </section>
    </LayoutWithoutHeader>
  );
};

export default forwardRef(FormLayout);
