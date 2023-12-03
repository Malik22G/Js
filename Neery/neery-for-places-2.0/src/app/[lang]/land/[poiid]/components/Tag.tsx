import { useTranslation } from "@/app/[lang]/i18n";
import { PlaceTag } from "@/lib/api/places";
import { i18n } from "i18next";

export function Tag({
  tag,
  className = "",
  i18n,
}: {
  tag: PlaceTag | string,
  className?: string,
  i18n: i18n,
}) {
  const { t } = useTranslation(i18n, "tags");

  return (
    <span className={`flex items-center justify-center text-center px-[8px] py-[1px] text-[14px] font-work font-medium rounded-[12px] bg-neutral-200 ${className}`}>
      {t(tag as any)}
    </span>
  );
}
