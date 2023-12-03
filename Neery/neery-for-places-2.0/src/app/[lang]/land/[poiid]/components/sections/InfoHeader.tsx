import React, { createElement } from "react";
import Link from "next/link";
import { i18n } from "i18next";
import { Trans } from "react-i18next/TransWithoutContext";

import { Clock, Envelope, Globe, MapPin, Phone } from "@/components/ui/icons";
import { Tag } from "../Tag";
import OpeningButton from "../OpeningButton";
import { Place } from "@/lib/api/places";
import { useTranslation } from "@/app/[lang]/i18n";
import { H1 } from "@/components/ui/Headings";
import { Min, osm2wme } from "@/lib/wme";
import { DateTime } from "luxon";

type InfoRowData<T> = {
  icon(_props: { className?: string }): JSX.Element,
  linkAction?: React.FC<T & { className: string }> | string,
  actionProps?: T,
  linkText: string | React.ReactNode,
  content: string | React.ReactNode,
};

function InfoRow<T>({
  icon,
  linkAction,
  actionProps,
  linkText,
  children,
}: Omit<InfoRowData<T>, "content"> & { children: React.ReactNode }) {
  const linkClass = "text-blue text-right font-medium shrink-0";
  const _linkAction = linkAction as React.FC<any>;

  return (
    <div className="flex gap-[8px] items-center">
      <div className="w-[16px] h-[16px] flex items-center justify-center shrink-0">
        {createElement(icon, {})}
      </div>

      <span className="grow">
        {children}
      </span>

      {typeof linkAction === "string" ? (
        !linkAction.startsWith("http") ? ( // FIX: tel: and mailto: links stick to every click event
          <a
            href={linkAction}
            className={linkClass}
          >
            {linkText}
          </a>
        ) : (
          <Link
            href={linkAction}
            className={linkClass}
            target={"_blank"}
            rel="noreferrer noopener nofollow"
          >
            {linkText}
          </Link>
        )
      ) : linkAction !== undefined ? (
        createElement(_linkAction, {
          className: linkClass,
          ...actionProps,
        }, linkText)
      ) : (
        <button className={linkClass}>
          {linkText}
        </button>
      )}
    </div>
  );
}

function InfoBox<T>({ rows }: {
  rows: (InfoRowData<T> | undefined | null)[],
}) {
  return (
    <div className="px-[24px] md:px-0 flex flex-col w-full gap-[8px] text-neutral-600 md:text-neutral-500 font-work text-[12px] md:text-[16px]">
      {(rows
        .filter(x => x !== undefined && x !== null) as InfoRowData<T>[])
        .map((row, i) => (
          <InfoRow
            key={i}
            icon={row.icon}
            linkAction={row.linkAction as any}
            actionProps={row.actionProps}
            linkText={row.linkText}
          >
            {row.content}
          </InfoRow>
        ))}
    </div>
  );
}

export default function InfoHeader({ place, i18n }: { place: Place, i18n: i18n }) {
  const { t } = useTranslation(i18n, "land", { keyPrefix: "info" });

  const opening = osm2wme(place.opening ?? "");
  const now = Min.fromDateTime(DateTime.now().setZone(place.timezone));
  const currentPeriod = Min.currentRange(now, opening);
  const nextPeriod = Min.nextRange(now, opening);

  return (
    <div className="flex flex-col w-full gap-[16px] md:gap-[24px]">
      <div className="px-[24px] md:px-0 flex justify-between items-center">
        <H1 className="uppercase">{place.name}</H1>
      </div>

      <div className="w-full border-t border-neutral-200 hidden md:block"></div>

      <InfoBox
        rows={[
          {
            icon: Clock,
            linkText: t("openHours"),
            linkAction: OpeningButton,
            actionProps: {
              i18n,
              place,
            },
            content: currentPeriod !== undefined
              ? (
                <>
                  <span className="text-green font-medium">{t("openNow")}</span>
                  &nbsp;&bull;&nbsp;
                  {/* @ts-ignore stupid shit */}
                  <Trans ns="land" i18nKey="info.closesAt">
                    Closes at {Min.toDate(currentPeriod[1] + 1).toLocaleString(i18n.language, { hour: "2-digit", minute: "numeric" })}
                  </Trans>
                </>
              )
              : (
                <>
                  <span className="text-red font-medium">{t("closedNow")}</span>
                  &nbsp;&bull;&nbsp;
                  <Trans ns="land" i18nKey="info.opensAt">
                    Opens at {Min.toDate(nextPeriod[0]).toLocaleString(i18n.language, { hour: "2-digit", minute: "numeric" })}
                  </Trans>
                </>
              ),
          },
          place.email ? {
            icon: Envelope,
            linkText: t("email"),
            linkAction: `mailto:${place.email}`,
            content: place.email,
          } : null,
          place.phone ? {
            icon: Phone,
            linkText: t("call"),
            linkAction: `tel:${place.robocall_number ?? place.phone}`,
            content: place.robocall_number ?? place.phone,
          } : null,
          {
            icon: MapPin,
            linkText: t("map"),
            linkAction: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${place.name} ${place.country} ${place.city} ${place.street}`
            )}`,
            content: `${place.postal_code ? place.postal_code + " " : ""}${place.city}, ${place.street}`,
          },
          place.webpage ?
            {
              icon: Globe,
              linkText: t("web"),
              linkAction: place.webpage,
              content: place.webpage,
            } : null,
        ]}
      />

      {place.tags.length > 0 ? (
        <div className="w-full flex gap-[16px] overflow-x-scroll scrollbar-hidden">
          {place.tags.map(x => (
            <Tag key={x} i18n={i18n} tag={x} className={`
              first:ml-[24px] last:mr-[24px]
              md:first:ml-0 md:last:mr-0
              shrink-0
            `} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
