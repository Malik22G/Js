"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";

const STGContext = createContext({
  activeCategory: "?",
  setCategory(_category: string) {
    console.warn("Placeholder STGContext.setCategory called!");
  },
});

export function ScrollTabGroup({
  categories,
  children,
}: {
  categories: string[],
  children: ReactNode,
}) {
  const [activeCategory, setCategory] = useState(categories[0] ?? "?");
  const [visibleCategories, setVisibleCategories] = useState<string[]>([]);

  useEffect(() => {
    setCategory(category => 
      categories.find(x => x === category) ?? categories[0] ?? ""
    );

    const box = document.getElementById("stg_box");
    const observers = categories.map(cat => {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleCategories(vc =>
              [...new Set([...vc, cat])]
                .sort((a, b) =>
                  categories.indexOf(a) - categories.indexOf(b)
                )
            );
          } else {
            setVisibleCategories(vc => vc.filter(x => x !== cat));
          }
        });
      }, {
        root: box,
        rootMargin: "0px 0px 0px 0px",
        threshold: [0.0, 1.0],
      });

      const elem = document.getElementById("stg_cat:" + cat);
      if (elem !== null) {
        obs.observe(elem);
      }

      return obs;
    });

    return () => {
      observers.forEach(obs => obs.disconnect());
    };
  }, [categories]);

  useEffect(() => {
    setCategory(visibleCategories[0] ?? "?");
  }, [visibleCategories]);

  useEffect(() => {
    if (globalThis.window !== undefined) {
      const menu = document.getElementById("stg_menu");
      const tab = document.getElementById("stg_tab:" + activeCategory);

      if (menu !== null && tab !== null) {
        menu.scrollBy({
          top: 0,
          left: tab.getBoundingClientRect().left - 24,
          behavior: "smooth",
        });
      }
    }
  }, [activeCategory]);

  return (
    <STGContext.Provider
      value={{
        activeCategory,
        setCategory: category => {
          if (globalThis.window !== undefined) {
            const box = document.getElementById("stg_box");
            const cat = document.getElementById("stg_cat:" + category);
      
            if (cat !== null && box !== null) {
              box.scrollBy({
                top: cat.getBoundingClientRect().top - 133 - 24,
                left: 0,
                behavior: "smooth",
              });
            }
          }
        },
      }}
    >
      {children}
    </STGContext.Provider>
  );
}

export function ScrollTab({
  category,
  children,
}: {
  category: string,
  children: ReactNode,
}) {
  const { activeCategory, setCategory } = useContext(STGContext);

  return (
    <button
      role="radio"
      id={"stg_tab:" + category}
      aria-checked={activeCategory === category}
      className={`
        shrink-0
        first:ml-[24px] last:mr-[24px]
        select-none

        transition-colors
        text-neutral-500 pb-[12px]
        aria-checked:text-primary aria-chekced:pb-[10px]
          aria-checked:border-b-2 aria-checked:border-primary
      `}
      onClick={() => setCategory(category)}
    >
      {children}
    </button>
  );
}

