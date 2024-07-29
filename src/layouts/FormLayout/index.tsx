import { useRouter } from "next/router";
import SpinLoading from "~/components/Loading/SpinLoading";

interface props {
  children: JSX.Element;
  title: string;
  loading?: boolean;
  backLink?: string;
  onSubmit: () => void;
}

const FormLayout = (props: props) => {
  const { children, title, backLink = "/", loading = false, onSubmit } = props;

  const router = useRouter();

  return (
    <section className="relative lg:w-2/4 w-full mx-auto p-5">
      <h1 className="lg:text-2xl md:text-xl text-lg font-semibold text-primary line-clamp-1">
        {title}
      </h1>

      {children}

      <div className="sticky bottom-0 flex items-center justify-end bg-white/60 dark:bg-[#1f293733] backdrop-blur-[6px] py-4 px-5 gap-5">
        <button
          onClick={() => router.push(backLink)}
          className="min-w-[100px] w-fit text-lg text-white font-medium bg-[#111926] px-5 py-1 opacity-90 hover:opacity-100 border-2 rounded-md">
          Back
        </button>
        <button
          onClick={onSubmit}
          className="min-w-[100px] w-fit text-lg text-white font-medium bg-primary px-5 py-1 rounded-md z-10">
          Save
        </button>
      </div>

      {/* loading */}
      {loading && <SpinLoading className="text-3xl" />}
    </section>
  );
};

export default FormLayout;
