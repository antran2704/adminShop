import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="lg:w-1/2 w-3/4">
        <img src="/404.svg" alt="404 Image" />
        <Link
          href="/"
          className="block w-fit lg:text-2xl text-xl font-medium px-6 py-2 rounded-lg bg-success text-white mx-auto mt-5 opacity-80 hover:opacity-100 transition-all ease-linear duration-150"
        >
          Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
