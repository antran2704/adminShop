import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface LanguageItem {
  title: string;
  icon: string;
}

interface Language {
  [k: string]: LanguageItem;
}

const initListLanguages: Language = {
  "en-US": { title: "English", icon: "/flags/usa.png" },
  "vi-VN": {
    title: "Vietnam",
    icon: "/flags/vietnam.png",
  },
};

const Translation = () => {
  const [select, setSelect] = useState<LanguageItem | null>(null);

  const { i18n } = useTranslation();

  useEffect(() => {
    if (i18n.resolvedLanguage) {
      setSelect(initListLanguages[i18n.resolvedLanguage as string]);
    }
  }, []);
  return (
    <div>
      {select && (
        <div className="group relative">
          <p className="flex items-center text-base dark:text-darkText gap-2">
            <img
              className="w-6 h-6 object-contain"
              src={select.icon}
              alt="flag"
            />
            {select.title}
          </p>
          <ul className="absolute top-[110%] group-hover:top-full right-0 min-w-[160px] bg-white border-2 dark:border-none rounded opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all ease-linear duration-100 overflow-hidden">
            {Object.keys(initListLanguages).map((keyLng: string) => (
              <li key={keyLng} className="w-full">
                <button
                  onClick={() => {
                    i18n.changeLanguage(keyLng);
                    setSelect(initListLanguages[keyLng])
                  }}
                  className={`flex items-center w-full hover:bg-primary hover:text-white text-start px-5 py-2 ${
                    i18n.resolvedLanguage === keyLng
                      ? "text-primary font-medium pointer-events-none"
                      : ""
                  } gap-2`}
                  disabled={i18n.resolvedLanguage === keyLng}
                >
                  <img
                    className="w-6 h-6 object-contain"
                    src={initListLanguages[keyLng].icon}
                    alt="flag"
                  />
                  {initListLanguages[keyLng].title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Translation;
