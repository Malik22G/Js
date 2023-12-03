import { loadAndUseTranslation } from "@/app/[lang]/i18n";
import { getMenu } from "@/lib/api/meals";
import { getPlace } from "@/lib/api/places";
import { resolveI18n } from "@/lib/api/util";
import { ScrollTab, ScrollTabGroup } from "./components/scroll";
import MealCard from "../components/MealCard";
import { ArrowLeft } from "@/components/ui/icons";
import { GenericClickable } from "@/components/ui/util";
import PoweredBy from "@/components/ui/PoweredBy";
import Button from "@/components/ui/Button";
import { MealModalProvider } from "../components/MealModal";
import { LangProps } from "@/app/[lang]/props";

export default async function LandingMenu({
  params: { lang, poiid },
  searchParams: { res },
}: {
  params: { poiid: string };
  searchParams: { res?: string };
} & LangProps) {
  const [{ i18n, t }, place, menu] = await Promise.all([
    loadAndUseTranslation(lang, "land"),
    getPlace(poiid),
    getMenu(poiid),
  ]);

  const realCategories = menu.categories.filter(
    (cat) => !!menu.meals.find((meal) => meal.category === cat.uuid)
  );

  return (
    <main className="w-full h-full">
      <MealModalProvider>
        <div
          className={`
            pt-[16px]
            w-full h-[133px]
            shadow-4 bg-neutral-100
            z-20
            text-center
            flex flex-col gap-[20px] items-center justify-center
          `}
        >
          <div className="relative w-full">
            {res !== undefined ? (
              <GenericClickable
                action={`/land/${place.poiid}/`}
                className="absolute left-[24px] top-0 bottom-0 flex items-center"
              >
                <ArrowLeft />
              </GenericClickable>
            ) : null}
            <h1 className="font-bold text-[24px] leading-normal">
              {place.name}
            </h1>
            <h2 className="font-semibold text-[18px] leading-normal">
              {t("menu.title")}
            </h2>
          </div>
          <ScrollTabGroup categories={realCategories.map((cat) => cat.uuid)}>
            <div
              id="stg_menu"
              role="radiogroup"
              className={`
                w-full
                flex gap-[24px]
                overflow-x-scroll scrollbar-hidden
                font-work font-semibold
              `}
            >
              {realCategories.map((cat) => (
                <ScrollTab key={cat.uuid} category={cat.uuid}>
                  {resolveI18n(cat.name, lang)}
                </ScrollTab>
              ))}
            </div>
          </ScrollTabGroup>
        </div>
        <div
          id="stg_box"
          className={`
            w-full h-[calc(100%-133px)]
            py-[16px] px-[24px]
            flex flex-col gap-[32px]
            overflow-y-scroll
          `}
        >
          {realCategories.map((cat) => {
            const meals = menu.meals.filter(
              (meal) => meal.category === cat.uuid
            );

            return (
              <div
                key={cat.uuid}
                id={"stg_cat:" + cat.uuid}
                className={`
                  flex flex-col gap-[16px]
                `}
              >
                <h3
                  className={`
                    font-semibold
                    text-[18px] md:text-[20px]
                  `}
                >
                  {resolveI18n(cat.name, i18n)}
                </h3>
                {meals.map((meal) => (
                  <MealCard
                    key={meal.uuid}
                    i18n={i18n}
                    meal={meal}
                    size="large"
                  />
                ))}
              </div>
            );
          })}
          <PoweredBy className="mb-[72px]" />
          {res !== undefined ? (
            <Button
              size="large"
              action={`/land/${place.poiid}/reserve`}
              className={`
                fixed bottom-[16px]
                w-[calc(100%-48px)]
                shadow-2
                z-40
              `}
            >
              {t("reserveButton")}
            </Button>
          ) : null}
        </div>
      </MealModalProvider>
    </main>
  );
}
