import Link from "next/link";
import { ReactElement } from "react";
import ImageCus from "~/components/Image/ImageCus";
import { NextPageWithLayout } from "~/interface/page";
import LayoutWithoutHeader from "~/layouts/LayoutWithoutHeader";

const Layout = LayoutWithoutHeader;

const NotFoundPage: NextPageWithLayout = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="md:w-1/2 sm:w-3/4 w-full">
        {/* <img src="/404.svg" alt="404 Image" /> */}
        <ImageCus
            src="/404.png"
            title="404"
            className="w-full lg:h-[80vh] md:h-[70vh] h-[60vh] object-cover"
          />
        <Link
          href="/"
          className="block w-fit lg:text-2xl text-xl font-medium px-6 py-2 rounded-lg bg-primary text-white mx-auto mt-5 opacity-80 hover:opacity-100 transition-all ease-linear duration-150"
        >
          Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

NotFoundPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};