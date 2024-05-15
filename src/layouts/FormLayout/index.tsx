import { useRouter } from "next/router";
import { forwardRef, ForwardRefRenderFunction, Ref } from "react";

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
    // <LayoutWithHeader>
    <section className="scrollHidden relative w-full overflow-auto">
      <ul ref={ref} className="scrollHidden min-h-screen pb-24 px-5 gap-3 overflow-auto">
        <div className="flex items-center justify-between py-5 z-20">
          <h1 className="lg:text-xl text-lg font-semibold dark:text-darkText max-w-[60%] line-clamp-1">
            {title}
          </h1>
        </div>
        {children}
      </ul>

      <div className="fixed bottom-0 w-full flex lg:flex-nowrap flex-wrap items-center justify-between bg-[#ffffffbf] dark:bg-[#1f293733] backdrop-blur-[6px] py-4 px-5 border-t-2 dark:border-transparent lg:gap-5 gap-2 z-10">
        <button
          onClick={() => router.push(backLink)}
          className="w-fit text-lg text-white font-medium bg-[#111926] px-5 py-1 opacity-90 hover:opacity-100 border-2 rounded-md"
        >
          Back
        </button>
      </div>

      <button
        onClick={onSubmit}
        className="fixed bottom-[18px] right-5 w-fit text-lg text-white font-medium bg-primary px-5 py-1 rounded-md z-10"
      >
        Save
      </button>
    </section>
    // </LayoutWithHeader>
  );
};

export default forwardRef(FormLayout);
