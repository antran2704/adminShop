import { forwardRef, ForwardRefRenderFunction, Ref } from "react";

interface prop {
    children: JSX.Element;
}

const AddLayout: ForwardRefRenderFunction<HTMLUListElement, prop> = (prop: prop, ref: Ref<HTMLUListElement> | undefined) => {
  return (
    <section className="scrollHidden w-full h-screen px-5 pb-5 lg:pt-5 pt-24 overflow-auto">
      <h1 className="lg:text-2xl text-xl font-bold mb-2">Add Category</h1>

      <ul ref={ref} className="scrollHidden h-[80vh] mt-5 pb-5 gap-3 overflow-auto">
        <div className="w-full flex lg:flex-nowrap flex-wrap items-center justify-between lg:gap-5 gap-3">
          <div className="lg:w-1/2 w-full">
            <span className="block text-base text-[#1E1E1E] font-medium mb-1">
              Title
            </span>
            <input
              required
              type="text"
              className="w-full rounded-md px-2 py-1 border-2 focus:border-gray-600 outline-none"
            />
          </div>
          <div className="lg:w-1/2 w-full">
            <span className="block text-base text-[#1E1E1E] font-medium mb-1">
              Slug
            </span>
            <input
              required
              type="text"
              className="w-full rounded-md px-2 py-1 border-2 focus:border-gray-600 outline-none"
            />
          </div>
        </div>

        <div className="w-full flex lg:flex-nowrap flex-wrap items-center justify-between mt-5 lg:gap-5 gap-3">
          <div className="w-full">
            <span className="block text-base text-[#1E1E1E] font-medium mb-1">
              Description
            </span>
            <textarea
              className="w-full rounded-md px-2 py-1 border-2 focus:border-gray-600 outline-none"
              name="description"
              placeholder="Description about product..."
              cols={30}
              rows={6}
            ></textarea>
          </div>
        </div>

        {prop.children}
      </ul>

      <div className="flex lg:flex-nowrap flex-wrap items-center justify-between pt-5 border-t-2 lg:gap-5 gap-2">
        <button className="w-fit text-lg text-white font-medium bg-error px-5 py-1 rounded-md">
          Cancle
        </button>
        <button className="w-fit text-lg text-white font-medium bg-primary px-5 py-1 rounded-md">
          Save
        </button>
      </div>
    </section>
  );
};

export default forwardRef(AddLayout);
