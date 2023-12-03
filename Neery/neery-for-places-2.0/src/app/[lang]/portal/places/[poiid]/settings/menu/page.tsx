import { getMenu } from "@/lib/api/meals";
import { ConfigFormStateless } from "../../components/Config/ConfigForm";
import { MealCategory } from "@/lib/api/mealcategories";
import { Meal } from "@/lib/api/meals";
import { LangProps } from "@/app/[lang]/props";
import { loadAndUseTranslation, useTranslation } from "@/app/[lang]/i18n";
import { resolveI18n } from "@/lib/api/util";
import { i18n } from "i18next";
import Image from "next/image";
import PriceTag from "./components/PriceTag";
import {
  _CategoryModal,
  _CreateCategoryButton,
  _CreateMealButton,
  _DeleteCategoryButton,
  _DeleteCategoryModal,
  _DeleteMealButton,
  _DeleteMealModal,
  _EditCategoryButton,
  EditMealButton,
  _MealModal,
  _ReorderCategoryButton,
  _ReorderMealButton,
  WoltUploadButton,
} from "./client";
import { Star } from "@/components/ui/icons";
import UnderTierBadge from "../../components/UnderTierBadge";
import { getPlace } from "@/lib/api/places";

function CategoryItem({
  category,
  i,
  len,
  i18n,
}: {
  category: MealCategory;
  i: number;
  len: number;
  i18n: i18n;
}) {
  return (
    <div className="flex flex-col w-full xl:w-4/5">
      <div className="flex justify-between items-center">
        <h1 className="font-medium text-[20px]">
          {resolveI18n(category.name, i18n)}
        </h1>
        <div className="flex gap-[8px]">
          {i !== 0 ? (
            <_ReorderCategoryButton
              category={category}
              direction={1}
              iconClass="h-[1rem] w-[1rem]"
            />
          ) : null}

          {i !== len - 1 ? (
            <_ReorderCategoryButton
              category={category}
              direction={-1}
              iconClass="h-[1rem] w-[1rem]"
            />
          ) : null}

          <_DeleteCategoryButton
            category={category}
            palette="red"
            iconClass="h-[0.7rem] w-[0.7rem]"
          />

          <_EditCategoryButton
            category={category}
            iconClass="h-[0.7rem] w-[0.7rem]"
          />
        </div>
      </div>
      <p>{resolveI18n(category.description, i18n)}</p>
    </div>
  );
}

function MealItem({
  meal,
  i,
  len,
  i18n,
}: {
  meal: Meal;
  i: number;
  len: number;
  i18n: i18n;
}) {
  return (
    <div className="flex gap-[8px] w-full xl:w-4/5 p-[8px] rounded-[8px] border border-neutral-200">
      {len !== 1 ? (
        <div className="flex flex-col shrink-0 items-center justify-evenly gap-[8px]">
          {i !== 0 ? (
            <_ReorderMealButton
              meal={meal}
              direction={1}
              iconClass="h-[1rem] w-[1rem]"
            />
          ) : null}

          {i !== len - 1 ? (
            <_ReorderMealButton
              meal={meal}
              direction={-1}
              iconClass="h-[1rem] w-[1rem]"
            />
          ) : null}
        </div>
      ) : null}

      {meal.image_url !== undefined ? (
        <div className="flex shrink-0 w-[5rem] relative">
          <Image
            src={meal.image_url}
            className="object-cover rounded-[8px]"
            fill
            alt={resolveI18n(meal.name, i18n) ?? "meal"}
          />
        </div>
      ) : null}

      <div className="flex flex-col grow justify-between gap-[8px]">
        <div>
          <div className="flex gap-[8px] items-center">
            <h2 className="font-medium">{resolveI18n(meal.name, i18n)}</h2>

            {meal.featured ? (
              <Star className="w-[0.75em] h-[0.75em] text-pink" />
            ) : null}
          </div>
          <p className="text-[14px]">{resolveI18n(meal.description, i18n)}</p>
        </div>
        <div className="flex flex-wrap gap-[4px]">
          {(["inplace", "wolt", "foodpanda"] as const).map((x) => (
            <PriceTag key={x} value={meal.price[x]} style={x} />
          ))}
        </div>
      </div>

      <div className="flex flex-col shrink-0 items-center justify-evenly gap-[8px]">
        <EditMealButton meal={meal} iconClass="h-[0.7rem] w-[0.7rem]" />

        <_DeleteMealButton
          meal={meal}
          palette="red"
          iconClass="h-[0.7rem] w-[0.7rem]"
        />
      </div>
    </div>
  );
}

function MenuCategory({
  category,
  i,
  len,
  meals,
  i18n,
}: {
  category: MealCategory;
  i: number;
  len: number;
  meals: Meal[];
  i18n: i18n;
}) {
  const { t } = useTranslation(i18n, "portal/settings/menu");

  return (
    <div className="flex flex-col gap-[16px]">
      <CategoryItem category={category} i={i} len={len} i18n={i18n} />

      {meals.length === 0 ? (
        <p className="text-[14px] w-full xl:w-4/5 text-neutral-500">
          {t("emptyCategory")}
        </p>
      ) : (
        meals.map((meal, i) => (
          <MealItem
            key={meal.uuid}
            meal={meal}
            i={i}
            len={meals.length}
            i18n={i18n}
          />
        ))
      )}
    </div>
  );
}

export default async function PlaceSettingsMenu({
  params,
}: {
  params: { poiid: string };
} & LangProps) {

  let [{ i18n, t }, place, menu] = await Promise.all([
    loadAndUseTranslation(params.lang, "portal/settings/menu"),
    getPlace(params.poiid),
    getMenu(params.poiid),
  ]);

  // let categoryIDs = new Set(menu.categories.map(x => x.uuid));

  return (
    <_MealModal categories={menu.categories}>
      <_DeleteMealModal>
        <_CategoryModal>
          <_DeleteCategoryModal>

            <ConfigFormStateless
              title={t("title")}
              className="relative"
            >
              {
                place.tier >= 1 ? (
                  <div className="grid grid-cols-3 gap-[8px] w-full xl:w-4/5">
                    <_CreateCategoryButton place={params.poiid} palette="secondary">
                      {t("newCategory")}
                    </_CreateCategoryButton>

                    <_CreateMealButton place={params.poiid} palette="secondary">
                      {t("newMeal")}
                    </_CreateMealButton>

                    <WoltUploadButton place={params.poiid} palette="secondary">
                      {t("woltUpload")}
                    </WoltUploadButton>
                  </div>
                ) : (
                  <UnderTierBadge
                    className="w-full xl:w-3/5"
                    place={params.poiid}
                  />
                )
              }

              {menu.categories.map((category, i) => (
                <MenuCategory
                  key={category.uuid}
                  category={category}
                  i={i}
                  len={menu.categories.length}
                  meals={[
                    ...menu.meals.filter(
                      (meal) => meal.category === category.uuid
                    ),
                  ].sort((a, b) => a.rank - b.rank)}
                  i18n={i18n}
                />
              ))}
            </ConfigFormStateless>
          </_DeleteCategoryModal>
        </_CategoryModal>
      </_DeleteMealModal>
    </_MealModal>
  );
}
