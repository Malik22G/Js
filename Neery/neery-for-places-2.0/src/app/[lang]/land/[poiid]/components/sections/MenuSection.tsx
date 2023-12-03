import { i18n } from "i18next";

import { Menu } from "@/lib/api/meals";
import { H2 } from "@/components/ui/Headings";
import Button from "@/components/ui/Button";
import { useTranslation } from "@/app/[lang]/i18n";
import { Place } from "@/lib/api/places";
import { resolveI18n } from "@/lib/api/util";
import { ICLProvider, ICLSwitch } from "../InteractiveCategoryList";
import { MealCategory } from "@/lib/api/mealcategories";
import MealCard from "../MealCard";

export default function MenuSection({
  i18n,
  place,
  menu,
}: {
  i18n: i18n;
  place: Place;
  menu: Menu;
}) {
  const { t } = useTranslation(i18n, "land", { keyPrefix: "menu" });

  const realCategories: MealCategory[] = menu.categories
    .filter(
      (category) => !!menu.meals.find((meal) => meal.category === category.uuid)
    )
    .sort((a, b) => a.rank - b.rank);

  if (menu.meals.length === 0) {
    return null;
  }

  return (
    <>
      <div className="hidden md:flex flex-col gap-[24px] mx-[24px] md:mx-0">
        <H2>{t("title")}</H2>

        <div className="flex w-full gap-[56px] font-work">
          <ICLProvider categories={realCategories}>
            <div className="flex flex-col max-w-1/3 shrink-0 gap-[16px] items-start">
              {realCategories.map((category) => (
                <ICLSwitch
                  category={category.uuid}
                  key={category.uuid}
                  className={`
                    font-semibold text-[18px] leading-compact
                    text-neutral-500 pb-[12px]
                    aria-checked:border-b-2 aria-checked:border-primary aria-checked:text-primary aria-checked:pb-[10px]
                  `}
                >
                  {resolveI18n(category.name, i18n)}
                </ICLSwitch>
              ))}
            </div>

            <div className="flex flex-col grow gap-[16px]">
              {menu.meals
                .sort((a, b) => a.rank - b.rank)
                .map((meal) => (
                  <MealCard
                    key={meal.uuid}
                    i18n={i18n}
                    meal={meal}
                    size="large"
                    icl
                  />
                ))}
            </div>
          </ICLProvider>
        </div>
      </div>

      <div className="flex md:hidden px-[24px]">
        <Button
          action={`/land/${encodeURIComponent(place.poiid)}/menu?res`}
          size="large"
          palette="secondary"
          className="w-full"
        >
          {t("title")}
        </Button>
      </div>
    </>
  );
}
