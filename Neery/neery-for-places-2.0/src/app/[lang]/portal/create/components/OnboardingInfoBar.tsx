import Image from "next/image";
import { ReactNode } from "react";
import { useTranslation } from "@/app/[lang]/i18n/client";
import {
  Calendar as CalendarIcon,
  WidgetExample,
  ChartArrowUp,
  MenuPlaceholder,
  People,
  StatisticsPlaceholder,
} from "@/components/ui/icons";

import logoText from "@/images/logo_text.svg";
import wolt from "@/images/wolt.svg";

const info = [
  {
    icon: (className: string) => <CalendarIcon className={className} />,
  },
  {
    icon: (className: string) => <ChartArrowUp className={className} />,
  },
  { icon: (className: string) => <WidgetExample className={className} /> },
  {
    icon: (className: string) => (
      <Image src={wolt} alt={"wolt logo"} className={className} />
    ),
  },
  { icon: (className: string) => <MenuPlaceholder className={className} /> },
  { icon: (className: string) => <People className={className} /> },
  {
    icon: (className: string) => (
      <StatisticsPlaceholder className={className} />
    ),
  },
];

export default function OnboardingInfoBar({
  title,
  blurb,
}: {
  title?: ReactNode;
  blurb?: ReactNode;
}) {
  const { t } = useTranslation("portal/create/infobar");

  return (
    <>
      <div
        className={`
        hidden
        bg-gradient-to-b from-primary to-primary-light
        text-neutral-100
        lg:flex flex-col gap-[16px]
        p-[16px]
      `}
      >
        {title !== undefined && title !== null ? (
          <h1 className="text-[24px] font-semibold shrink-0">{title}</h1>
        ) : null}
        <p className="font-work">{blurb}</p>
        <div className="flex flex-row flex-wrap p-4 justify-between items-center">
          {info.map(({ icon }, i) => (
            <div
              key={`sidebar-info-${i}`}
              className="flex flex-col min-w-[40%] my-4 mx-2"
            >
              <div className="w-12 h-12">{icon("w-8 h-8")}</div>
              <div className="text-primary-100 font-semibold text-sm">
                {t(`cards.${i}.title`)}
              </div>
            </div>
          ))}
        </div>
        <Image
          src={logoText}
          height={32}
          className="shrink-0 mx-auto mt-auto"
          alt="NeerY"
        />
      </div>
    </>
  );
}
