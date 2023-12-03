import { createInstance } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next/initReactI18next";
import { getOptions } from "./settings";

export function useTranslation(i18n, ns, options = {}) {
  return {
    t: i18n.getFixedT(i18n.language, ns, options.keyPrefix),
    i18n,
  };
}

export async function loadAndUseTranslation(lang, ns, options = {}) {
  const i18n = createInstance();
  await i18n
    .use(initReactI18next)
    .use(resourcesToBackend((language, namespace) => import(`../../../../public/locales/${language}/${namespace}.json`)))
    .init(getOptions(lang));
  
  /* eslint-disable react-hooks/rules-of-hooks */
  return useTranslation(i18n, ns, options);
  /* eslint-enable react-hooks/rules-of-hooks */
}

