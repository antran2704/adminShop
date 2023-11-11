import { useRouter } from "next/router";
import { forwardRef, ForwardRefRenderFunction, Ref, useState } from "react";

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
  const {children, title, backLink = "/", onSubmit} = props

  const router = useRouter();

  return (
    <section className="scrollHidden relative w-full h-screen px-5 pb-5 pt-5 overflow-auto">
      <h1 className="lg:text-2xl text-xl font-bold mb-2">{title}</h1>

      <ul
        ref={ref}
        className="scrollHidden h-[80vh] mt-5 pb-5 gap-3 overflow-auto"
      >
        {children}
      </ul>

      <div className="flex lg:flex-nowrap flex-wrap items-center justify-between pt-5 border-t-2 lg:gap-5 gap-2">
        <button
          onClick={() => router.push(backLink)}
          className="w-fit text-lg text-white font-medium bg-error px-5 py-1 rounded-md"
        >
          Cancle
        </button>
        <button
          onClick={onSubmit}
          className="w-fit text-lg text-white font-medium bg-primary px-5 py-1 rounded-md"
        >
          Save
        </button>
      </div>
    </section>
  );
};

export default forwardRef(FormLayout);
