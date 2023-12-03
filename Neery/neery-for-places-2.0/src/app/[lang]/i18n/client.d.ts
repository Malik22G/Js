import { i18n } from "i18next";

import { Namespace } from "./settings";

export type ReturnType = {
  i18n: i18n,
  t: (key: string,{returnObjects}?:{returnObjects:boolean}) => string,
}

export function useTranslation(ns: Namespace, options?: { keyPrefix: string }): ReturnType;
