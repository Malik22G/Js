"use client";

import { Meal } from "@/lib/api/meals";
import { HTMLAttributes, ReactNode, useContext } from "react";
import { ICLItem } from "../InteractiveCategoryList";
import { MealModalContext } from "../MealModal";

export default function MealCardInteractor({
  icl,
  meal,
  children,
  ...divProps
}: {
  icl: boolean,
  meal: Meal,
  children: ReactNode,
} & HTMLAttributes<HTMLDivElement>) {
  const { setMeal } = useContext(MealModalContext);

  if (icl) {
    return (
      <ICLItem
        category={meal.category}
        role="button"
        onClick={() => setMeal(meal)}
        {...divProps}
      >
        {children}
      </ICLItem>
    );
  } else {
    return (
      <div
        role="button"
        onClick={() => setMeal(meal)}
        {...divProps}
      >
        {children}
      </div>
    );
  }
}
