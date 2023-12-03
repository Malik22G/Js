import { ReactNode } from "react";
import ConfigNavbar from "./ConfigNavbar";
import { loadAndUseTranslation } from "@/app/[lang]/i18n";
import { LangProps } from "@/app/[lang]/props";
import { Namespace } from "@/app/[lang]/i18n/settings";
export default function ConfigLayout(pages: string[], ns: Namespace) {
  return async function ({
    children,
    params,
  }: {
    children: ReactNode;
    params: { poiid: string };
  } & LangProps) {
    const { i18n } = await loadAndUseTranslation(params.lang, ns);
    return (
      <div
        className={`
        grow p-[64px]
        flex gap-[64px]
        overflow-scroll scrollbar-hidden
      `}
      >
        {/* @ts-expect-error: async component */}
        <ConfigNavbar i18n={i18n} poiid={params.poiid} pages={pages} />
        {children}
      </div>
    );
  };
}
