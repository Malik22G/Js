"use client";

import { Context, createContext } from "react";

export type WidgetContextType<T> = {
  data: T | null;
  update(data: T | null): void;
};

export function createWidgetContext<T>(
  defaultData: T | null = null
): Context<WidgetContextType<T>> {
  return createContext<WidgetContextType<T>>({
    data: defaultData,
    update(_data) {
      console.warn("Placeholder ModalContextType.update called!");
    },
  });
}
