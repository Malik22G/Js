"use client";

import i18next from "i18next";
import { usePathname } from "next/navigation";
import { initReactI18next, useTranslation as useTranslationOrg } from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { getOptions, languages } from "./settings";

i18next
  .use(initReactI18next)
  .use(resourcesToBackend((language, namespace) => import(`../../../../public/locales/${language}/${namespace}.json`)))
  .init(getOptions(
    // Load selected language from location
    globalThis.window !== undefined
      ? languages.find(x => window.location.pathname.startsWith(`/${x}/`))
      : undefined
  ));

export function useTranslation(ns, options) {
  const pathname = usePathname() ?? "";

  const lang = languages.find(x => pathname.startsWith(`/${x}/`));
  if (lang !== undefined && i18next.resolvedLanguage !== lang) i18next.changeLanguage(lang);
  
  return useTranslationOrg(ns, options);
}
