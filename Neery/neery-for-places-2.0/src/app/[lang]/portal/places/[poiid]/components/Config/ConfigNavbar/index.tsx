import { i18n } from "i18next";

import { useTranslation } from "@/app/[lang]/i18n";
import { _PageButton } from "./client";

export default async function PlaceSettingsNavbar({
  i18n,
  poiid,
  pages,
}: {
  i18n: i18n,
  poiid: string,
  pages: string[],
}) {
  const { t } = await useTranslation(i18n, "portal/settings/navbar");

  return (
    <div className={`
      flex flex-col gap-[8px] shrink-0 sticky top-0
    `}>
      <h2 className="font-semibold">{t("title")}</h2>
      <div
        role="radiogroup"
        className={`
          flex flex-col gap-[4px]
          border-l border-neutral-300
        `}
      >
        {pages.map(page => {
          return (
            <_PageButton
              key={page}
              path={`/portal/places/${encodeURIComponent(poiid)}/settings/${page}`}
            >
              {t(page)}
            </_PageButton>
          );
        })}
      </div>
    </div>
  );
}
