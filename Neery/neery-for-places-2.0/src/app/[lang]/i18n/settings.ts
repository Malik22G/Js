import { InitOptions } from "i18next";

export const fallbackLang = "en";
export const languages = ["en", "hu"] as ["en", "hu"];

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type Language = ArrayElement<typeof languages>;
export type Namespace =
  | "translation"
  | "tags"
  | "land"
  | "portal/navbar"
  | "portal/settings/navbar"
  | "portal/calendar"
  | "portal/statistics"
  | "portal/settings/profile"
  | "portal/settings/images"
  | "portal/settings/widget"
  | "portal/settings/reservation"
  | "portal/settings/tables"
  | "portal/settings/menu"
  | "portal/settings/lunchMenu"
  | "portal/settings/calls"
  | "portal/settings/subscription"
  | "portal/settings/access"
  | "portal/reviews"
  | "portal/reviews/reply"
  | "portal/customers"
  | "portal/calls"
  | "portal/statistics"
  | "portal/create"
  | "portal/create/basics"
  | "portal/create/useful1"
  | "portal/create/useful2"
  | "portal/create/reservation"
  | "portal/create/infobar"
  | "manage/reservation"
  | "landing/auth"
  | "portal/settings/appearance";

export function getOptions<T>(
  lang = fallbackLang,
  ns: Namespace | Namespace[] = [
    "translation",
    "tags",
    "land",
    "portal/navbar",
    "portal/settings/navbar",
    "portal/calendar",
    "portal/settings/profile",
    "portal/settings/images",
    "portal/settings/reservation",
    "portal/settings/tables",
    "portal/settings/menu",
    "portal/settings/lunchMenu",
    "portal/settings/calls",
    "portal/settings/subscription",
    "portal/settings/access",
    "portal/reviews",
    "portal/reviews/reply",
    "portal/customers",
    "portal/calls",
    "portal/statistics",
    "portal/create",
    "portal/create/basics",
    "portal/create/useful1",
    "portal/create/useful2",
    "portal/create/reservation",
    "portal/create/infobar",
    "manage/reservation",
    "landing/auth",
    "portal/settings/appearance",
  ]
): InitOptions<T> {
  return {
    // debug: true,
    supportedLngs: languages,
    fallbackLng: fallbackLang,
    lng: lang,
    fallbackNS: "translation",
    ns,
  };
}
