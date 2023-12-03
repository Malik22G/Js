import { DailyMenu } from "@/lib/api/lunchmenu";
import { useTranslation } from "@/app/[lang]/i18n";
import lunchMenuPlaceholder from "@/images/lunch_menu_placeholder.png";

import type { i18n } from "i18next";
import CardInteraction from "@/app/[lang]/land/[poiid]/components/LunchMenuCard/CardInteraction";

export default function LunchMenuCard({
  i18n,
  menu,
  backgroundImage,
  duration,
  poiid,
}: {
  i18n: i18n;
  menu: DailyMenu;
  backgroundImage: string;
  duration: [string, string];
  poiid: string;
}) {
  const { t } = useTranslation(i18n, "land");
  return (
    <div
      className="relative flex flex-col my-4 2xl:h-72 h-56 bg-cover bg-center rounded-[16px] w-11/12 shrink-0"
      style={{
        backgroundImage: `url(${backgroundImage || lunchMenuPlaceholder.src})`,
      }}
    >
      <CardInteraction
        buttonText={t("lunchMenu.reserve")}
        day={menu.day}
        hours={duration}
        poiid={poiid}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-neutral-700 to-neutral-700/50 rounded-[16px]" />
        <div className="absolute inset-0 flex flex-col justify-evenly my-2 px-8 lg:px-8 rounded-2xl">
          <div className="flex flex-row items-center justify-between xl:justify-start">
            <p className="text-base lg:text-xl text-neutral-100">
              {t(`lunchMenu.days.${menu.day}`)}
            </p>
            <div className="text-base lg:text-xl text-neutral-100 mx-4">{`${duration[0]} - ${duration[1]}`}</div>
          </div>

          <p className="flex text-neutral-100 font-bold text-2xl my-2 lg:my-0 lg:text-3xl whitespace-pre-line overflow-y-auto">
            {menu.menu}
          </p>
          <div className="font-semibold text-lg text-neutral-100">{`${menu.price} HUF`}</div>
        </div>
      </CardInteraction>
    </div>
  );
}
