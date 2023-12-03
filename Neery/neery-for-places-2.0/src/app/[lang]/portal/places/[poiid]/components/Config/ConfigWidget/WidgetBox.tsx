"use client";

import { Context } from "react";
import { WidgetContextType } from "./WidgetContext";
import { useState } from "react";
import { ReactNode } from "react";

export default function WidgetBox<T>({
  context,
  children,
  siblings,
}: {
  context: Context<WidgetContextType<T>>;
  children: ReactNode;
  siblings: ReactNode;
}) {
  let [data, update] = useState<T | null>(null);
  return (
    <context.Provider
      value={{
        data,
        update,
      }}
    >
      <div
        className={`
          top-0 right-0 z-50 h-full w-[450px] fixed hidden 2xl:flex
           flex-col items-center justify-center
           ${
             data === null
               ? `
            opacity-0 pointer-events-none
          `
               : `
            opacity-100 pointer-events-auto
          `
           }
        `}
      >
        {children}
      </div>
      {siblings}
    </context.Provider>
  );
}
