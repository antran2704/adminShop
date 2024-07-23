import Link from "next/link";
import { useRouter } from "next/router";

interface LanguageItem {
  title: string;
  icon: string;
}

interface Language {
  [k: string]: LanguageItem;
}

const initListLanguages: Language = {
  en: { title: "English", icon: "/flags/usa.png" },
  vi: {
    title: "Vietnam",
    icon: "/flags/vietnam.png",
  },
};

const Translation = () => {
  const router = useRouter();
  const selected = initListLanguages[router.locale as string];

  return (
    <div>
      {selected && (
        <div className="group relative">
          <p className="flex items-center text-base dark:text-darkText gap-2">
            <img
              className="w-6 h-6 object-contain"
              src={selected.icon}
              alt="flag"
            />
            {selected.title}
          </p>
          <ul className="absolute top-[110%] group-hover:top-full right-0 min-w-[160px] bg-white border-2 dark:border-none rounded opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all ease-linear duration-100 overflow-hidden">
            {router.locales?.map((keyLng: string) => (
              <li key={keyLng} className="w-full">
                <Link
                  href={router.asPath}
                  locale={keyLng}
                  className={`flex items-center w-full hover:bg-primary hover:text-white text-start px-5 py-2 ${
                    router.locale === keyLng
                      ? "text-primary font-medium pointer-events-none"
                      : ""
                  } gap-2`}>
                  <img
                    className="w-6 h-6 object-contain"
                    src={initListLanguages[keyLng].icon}
                    alt="flag"
                  />
                  {initListLanguages[keyLng].title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Translation;
