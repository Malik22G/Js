"use client";

import { Context, createContext } from "react";

export type ModalContextType<T> = {
  data: T | null;
  update(data: T | null): void;
  error?: string | null;
  setError(error: string | null): void;
};

export function createModalContext<T>(
  defaultData: T | null = null
): Context<ModalContextType<T>> {
  return createContext<ModalContextType<T>>({
    data: defaultData,
    error: null,
    setError(_error) {
      console.warn("ModelContextType.setError called!");
    },
    update(_data) {
      console.warn("Placeholder ModalContextType.update called!");
    },
  });
}
