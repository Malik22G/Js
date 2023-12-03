import { i18n } from "i18next";

import { Language, Namespace } from "./settings";

export type ReturnType = {
  i18n: i18n,
  t: (key: string) => string,
}

export function useTranslation(i18n: i18n, ns: Namespace, options?: { keyPrefix: string }): ReturnType;
export async function loadAndUseTranslation(lang: Language, ns: Namespace, options?: { keyPrefix: string }): Promise<ReturnType>;
