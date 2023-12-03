"use client";

import { ReactNode, createContext, useContext, useState } from "react";
import Image from "next/image";

import { useTranslation } from "@/app/[lang]/i18n/client";
import { Meal } from "@/lib/api/meals";
import { resolveI18n } from "@/lib/api/util";
import { Tag } from "./Tag";
import IconButton from "@/components/ui/IconButton";
import { X } from "@/components/ui/icons";

export const MealModalContext = createContext({
  meal: null as Meal | null,
  setMeal(_meal: Meal | null) {
    console.warn("Placeholder MealModalContext.setMeal called!");
  },
});

function MealModal() {
  const { i18n } = useTranslation("land");
  const { meal, setMeal } = useContext(MealModalContext);

  const name = resolveI18n(meal?.name, i18n);
  const description = resolveI18n(meal?.description, i18n);
  const price = meal?.price.inplace ?? Object.values(meal?.price ?? {})[0];

  return (
    <div
      className={`
        z-50 fixed left-0 right-0 top-0 bottom-0
        bg-neutral-700/50
        ${meal === null ? "hidden" : "flex"}

        items-end
        md:items-center md:justify-center
        font-work
      `}
      onClick={() => setMeal(null)}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`
          grow relative
          md:mx-[10%] lg:mx-[20%]
          rounded-t-[32px] md:rounded-[16px]
          bg-neutral-100
        `}
        onClick={e => e.stopPropagation()}
      >
        <IconButton
          icon={X}
          palette="black"
          size="large"
          action={() => setMeal(null)}
          className="absolute top-[16px] right-[16px] z-10"
        />
        
        {meal?.image_url ? (
          <div className="w-full h-[200px] md:h-[400px] relative">
            <Image
              alt={name ?? ""}
              src={meal.image_url}
              fill
              sizes="100vw"
              className={`
                rounded-t-[32px] object-cover
                md:rounded-t-[16px]
              `}
            />
          </div>
        ) : null}
        <div className={`
          w-full py-[16px] px-[24px]
          flex flex-col gap-[16px]
        `}>
          <div className={`
            flex flex-col gap-[8px] font-semibold
          `}>
            <h3 className="text-[20px]">{name}</h3>
            {price !== undefined ? (
              <span className="text-[18px] text-primary">{price} Ft</span>
            ) : null}
          </div>
          {description !== undefined ? (
            <p className="leading-normal text-[14px]">
              {description}
            </p>
          ) : null}
          {meal && meal.tags.length > 0 ? (
            <div className="flex gap-[8px] flex-wrap">
              {meal.tags.map(tag => (
                <Tag
                  key={tag}
                  i18n={i18n}
                  tag={tag}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function MealModalProvider({
  children,
}: {
  children: ReactNode,
}) {
  const [meal, setMeal] = useState<Meal | null>(null);

  return (
    <MealModalContext.Provider value={{
      meal,
      setMeal,
    }}>
      <MealModal />
      {children}
    </MealModalContext.Provider>
  );
}
