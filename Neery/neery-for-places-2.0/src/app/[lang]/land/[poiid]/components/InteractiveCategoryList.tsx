"use client";

import { MealCategory } from "@/lib/api/mealcategories";
import { ButtonHTMLAttributes, HTMLAttributes, ReactNode, createContext, useContext, useEffect, useState } from "react";

const ICLContext = createContext({
  activeCategory: null as string | null,
  setCategory(_category: string) {
    console.warn("Placeholder ICLContext.setCategory called!");
  },
});

export function ICLProvider({
  categories,
  children,
}: {
  categories: MealCategory[],
  children: ReactNode,
}) {
  const [activeCategory, setCategory] = useState(categories[0]?.uuid ?? null);

  useEffect(() => {
    setCategory(category => {
      if (!categories.find(cat => cat.uuid === category)) {
        return categories[0]?.uuid ?? null;
      } else {
        return category;
      }
    });
  }, [categories]);

  return (
    <ICLContext.Provider
      value={{
        activeCategory,
        setCategory,
      }}
    >
      {children}
    </ICLContext.Provider>
  );
}

export function ICLSwitch({
  category,
  children,
  ...props
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "aria-checked" | "role"> & {
  category: string,
  children: ReactNode,
}) {
  const { activeCategory, setCategory } = useContext(ICLContext);

  return (
    <button
      role="checkbox"
      aria-checked={category === activeCategory}
      onClick={() => setCategory(category)}
      {...props}
    >
      {children}
    </button>
  );
}

export function ICLItem({
  category,
  children,
  style,
  ...props
}: HTMLAttributes<HTMLDivElement> & {  category: string, children: ReactNode }) {
  const { activeCategory } = useContext(ICLContext);

  return (
    <div
      {...props}
      style={{
        ...style,
        ...(category !== activeCategory ? {
          display: "none",
        } : {}),
      }}
    >
      {children}
    </div>
  );
}
