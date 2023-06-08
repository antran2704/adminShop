import { forwardRef, ForwardRefRenderFunction, Ref } from "react";

interface prop {
    children: JSX.Element;
    onSubmit?: () => void;
}

const AddLayout: ForwardRefRenderFunction<HTMLUListElement, prop> = (prop: prop, ref: Ref<HTMLUListElement> | undefined) => {
  return (
    <section className="scrollHidden w-full h-screen px-5 pb-5 lg:pt-5 pt-24 overflow-auto">
      <h1 className="lg:text-2xl text-xl font-bold mb-2">Add Category</h1>

      <ul ref={ref} className="scrollHidden h-[80vh] mt-5 pb-5 gap-3 overflow-auto">
        {prop.children}
      </ul>

      <div className="flex lg:flex-nowrap flex-wrap items-center justify-between pt-5 border-t-2 lg:gap-5 gap-2">
        <button className="w-fit text-lg text-white font-medium bg-error px-5 py-1 rounded-md">
          Cancle
        </button>
        <button onClick={prop.onSubmit} className="w-fit text-lg text-white font-medium bg-primary px-5 py-1 rounded-md">
          Save
        </button>
      </div>
    </section>
  );
};

export default forwardRef(AddLayout);
