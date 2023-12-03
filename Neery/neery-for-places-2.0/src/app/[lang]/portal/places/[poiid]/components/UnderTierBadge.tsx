"use client";

import { useTranslation } from "@/app/[lang]/i18n/client";
import { Warning } from "@/components/ui/icons";
import { PlaceOrID, placeToID } from "@/lib/api/places";
import Link from "next/link";
import { Trans } from "react-i18next/TransWithoutContext";

export default function UnderTierBadge({
  className,
  place,
}: {
  className?: string,
  place: PlaceOrID,
}) {
  const { i18n } = useTranslation("translation");

  return (
    <div className={`
      flex gap-[12px] py-[8px] px-[12px] rounded-lg bg-red/25 items-center
      ${className ?? ""}
    `}>
      <Warning className="h-[1.25rem] w-[1.25rem] text-red shrink-0" />
      <p>
        {/* @ts-ignore stupid i18n thing -MG */}
        <Trans i18n={i18n} ns="translation" i18nKey="expired">
          <span>Your subscription has expired and some functionality is no longer available. </span>
          <Link href={`/portal/places/${encodeURIComponent(placeToID(place))}/settings/subscription`} className="underline">Resubscribe in order to restore these options.</Link>
        </Trans>
      </p>
    </div>
  );
}
