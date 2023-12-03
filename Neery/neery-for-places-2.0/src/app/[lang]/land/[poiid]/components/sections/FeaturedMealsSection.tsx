import { i18n } from "i18next";

import "./FeaturedMealsSection.css";
import { Meal } from "@/lib/api/meals";
import { H2 } from "@/components/ui/Headings";
import MealCard from "../MealCard";
import { useTranslation } from "@/app/[lang]/i18n";

export default function FeaturedMealsSection({
  i18n,
  meals,
}: {
  i18n: i18n,
  meals: Meal[],
}) {
  const { t } = useTranslation(i18n, "land");

  const featuredMeals = meals.filter(x => x.featured);

  return featuredMeals.length > 0 ? (
    <div className="flex flex-col gap-[16px] md:gap-[24px] overflow-visible">
      <H2 className="mx-[24px] md:mx-0">{t("featuredMeals")}</H2>

      <div
        className="flex gap-[16px] md:gap-[32px] overflow-x-scroll fms-overhang scrollbar-hidden"
      >
        {featuredMeals.map(meal => (
          <MealCard
            key={meal.uuid}
            i18n={i18n}
            meal={meal}
            size="small"
          />
        ))}
      </div>
    </div>
  ) : null;
}
