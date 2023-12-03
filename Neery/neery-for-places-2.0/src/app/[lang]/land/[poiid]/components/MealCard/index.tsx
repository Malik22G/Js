import Image from "next/image";
import { i18n } from "i18next";

import { Meal } from "@/lib/api/meals";
import { useTranslation } from "@/app/[lang]/i18n";
import { resolveI18n } from "@/lib/api/util";
import MealCardInteractor from "./interact";
import Chip from "@/components/ui/Chip";
import { Star } from "@/components/ui/icons";
import { Tag } from "../Tag";
import { FC, createElement } from "react";

export type MealCardSize = "small" | "large";

function SmallMealInfo({ meal, i18n }: { meal: Meal, i18n: i18n }) {
  const name = resolveI18n(meal.name, i18n) ?? "";
  const description = resolveI18n(meal.description, i18n) ?? "";
  const price: number | undefined =
    meal.price.inplace
    || Object.values(meal.price)[0]
  ;

  return (
    <div className={`
      flex flex-col grow mx-[4px] text-center overflow-hidden justify-between
      my-[8px] text-[10px]
      md:my-[12px] md:text-[14px]
    `}>
      <h3 className="shrink-0 font-semibold text-[12px] md:text-[16px] line-clamp-1 lg:line-clamp-1">{name}</h3>

      {description.length > 0 ? (
        <p
          className={`
            text-ellipsis overflow-hidden
            ${meal.image_url ? "line-clamp-2 h-[28px] md:h-[42px]" : "line-clamp-2 h-[90px] md:h-[126px]"}
          `}
          title={description}
        >
          {description}
        </p>
      ) : null}

      {price !== undefined ? (
        <span className="shrink-0 font-semibold text-[12px] md:text-[16px] text-primary">{price} Ft</span>
      ) : null}
    </div>
  );
}

function LargeMealInfo({ meal, i18n }: { meal: Meal, i18n: i18n }) {
  const name = resolveI18n(meal.name, i18n) ?? "";
  const description = resolveI18n(meal.description, i18n) ?? "";
  const price: number | undefined =
    meal.price.inplace
    || Object.values(meal.price)[0]
  ;

  return (
    <div className={`
      grow h-full
      flex flex-col items-between gap-[8px]
    `}>
      <div className="flex flex-col gap-[2px]">
        <h3 className="shrink-0 font-semibold text-[14px] md:text-[16px] leading-compact line-clamp-1 mt-1">{name}</h3>

        {price !== undefined ? (
          <span className="shrink-0 font-semibold text-[14px] md:text-[16px] text-primary">{price} Ft</span>
        ) : null}
      </div>

      {description.length > 0 ? (
        <p
          className={`
            text-ellipsis overflow-hidden text-[12px] md:text-[14px]
            ${meal.image_url && meal.tags.length > 0 ? `
              line-clamp-2 h-[28px] md:h-[42px]
            ` : `
              line-clamp-2 max-h-[84px] md:max-h-[126px]
            `}
          `}
          title={description}
        >
          {description}
        </p>
      ) : null}

      {meal.tags.length > 0 ? (
        <div
          className="flex gap-[8px] overflow-x-hidden scrollbar-hidden flex-wrap"
        >
          {meal.tags.map(tag => (
            <Tag key={tag} tag={tag} i18n={i18n} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

const sizeStyles: {
  [S in MealCardSize]: {
    box: string,
    imageBox: string,
    image: string,
    info: FC<{meal: Meal, i18n: i18n}>,
  }
} = {
  "small": {
    box: `
      flex-col

      w-[155px] h-[177px]
      md:w-[201px] md:h-[211px]
    `,
    imageBox: `
      w-full
      rounded-t-[16px]
      h-[87px] md:h-[95px]
    `,
    image: `
      rounded-t-[16px]
    `,
    info: SmallMealInfo,
  },
  "large" : {
    box: `
      items-center gap-[16px]
      w-full py-[8px] px-[12px]
    `,
    imageBox: `
      w-[105px] h-[93px]
      rounded-[16px]
      my-[8px]
    `,
    image: `
      rounded-[16px]
    `,
    info: LargeMealInfo,
  },
};

export default function MealCard({
  i18n,
  meal,
  size = "large",
  icl = false,
  className,
}: {
  i18n: i18n,
  meal: Meal,
  size?: MealCardSize,
  icl?: boolean,
  className?: string,
}) {
  const { t } = useTranslation(i18n, "translation");

  const name = resolveI18n(meal.name, i18n) ?? "";

  return (
    <MealCardInteractor
      meal={meal}
      icl={icl}
      className={`
        bg-neutral-100 rounded-[16px] shadow-2
        flex shrink-0
        relative
        font-work
        
        ${sizeStyles[size].box}
        ${className}
      `}
    >
      {meal.featured ? (
        <div className={`
          absolute top-0 bottom-full left-0 right-0 overflow-visible z-10
          flex items-center justify-end
        `}>
          <Chip palette="primary">
            <Star className="w-[1em] h-[1em]" />
            {t("featured")}
          </Chip>
        </div>
      ) : null}

      {meal.image_url ? (
        <div className={`
          relative shrink-0
          ${sizeStyles[size].imageBox}
        `}>
          <Image
            src={meal.image_url}
            alt={name ?? ""}
            className={`
              object-cover
              ${sizeStyles[size].image}
            `}
            fill
            priority
            sizes="(max-width 787px) 155px, 201px"
          />
        </div>
      ) : null}

      {createElement(sizeStyles[size].info, {
        meal,
        i18n,
      })}
    </MealCardInteractor>
  );
}
