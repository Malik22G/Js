import { LunchMenu } from "@/lib/api/lunchmenu";
import type { i18n } from "i18next";
import LunchMenuCard from "@/app/[lang]/land/[poiid]/components/LunchMenuCard";
import { Min } from "@/lib/wme";
import { Place } from "@/lib/api/places";

function getLunchDurationStr(duration: [number, number]): [string, string] {
  return duration.map((curr) => {
    const hours = Min.getHours(curr);
    const minutes = Min.getMinutes(curr);
    const time2Str = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;

    return time2Str;
  }) as [string, string];
}

export function getLunchDays({ menus }: LunchMenu) {
  const currentDate = new Date();
  const currentDay = currentDate.getDay();
  const mCurrentDay = (currentDay + 7 - 1) % 7;

  const filteredMenus = menus
    .sort((a, b) => a.day - b.day)
    .filter((menu) => {
      const savedDate = new Date(menu.savedFor);
      if (savedDate < currentDate) return false;

      return mCurrentDay === 6 || mCurrentDay <= menu.day;
    });

  return filteredMenus;
}

export default function LunchMenuSection({
  i18n,
  lunchMenu,
  place,
}: {
  i18n: i18n;
  lunchMenu?: LunchMenu;
  place: Place;
}) {
  if (!lunchMenu) return null;

  const filteredMenus = getLunchDays(lunchMenu);

  return (
    <div className="flex flex-col gap-[16px] md:gap-[24px] overflow-visible">
      <div className="flex justify-start gap-[16px] md:gap-[32px] overflow-x-scroll fms-overhang scrollbar-hidden">
        {filteredMenus.map((menu, i) => (
          <LunchMenuCard
            key={i}
            menu={menu}
            i18n={i18n}
            backgroundImage={lunchMenu.image_url}
            poiid={place.poiid}
            duration={getLunchDurationStr(lunchMenu.duration)}
          />
        ))}
      </div>
    </div>
  );
}
