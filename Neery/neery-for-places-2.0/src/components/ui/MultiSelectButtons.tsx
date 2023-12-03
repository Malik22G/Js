"use client";

import { ReactNode } from "react";

export type MultiSelectProps<K> = {
  values: [K, string | ReactNode, string][] | [K, string | ReactNode][];
  value: K[];
  toggleValue?(value: K): any;
};

export default function MultiSelectButtons<K>({
  values,
  value: current,
  toggleValue,
}: MultiSelectProps<K>) {
  return (
    <div
      role="radiogroup"
      className={`grid gap-x-[10px] gap-y-[14px] grid-cols-3`}
    >
      {values.map((d) => (
        <button
          role="radio"
          key={d[0] + ""}
          className={`
        min-h-[36px]
        rounded-[8px] border border-neutral-300
        p-[8px]
        flex items-center justify-center
        text-primary
        transition-colors
        hover:bg-primary-xlight
        aria-checked:bg-primary aria-checked:border-primary aria-checked:text-neutral-100
        disabled:bg-neutral-300 disabled:text-neutral-500
      `}
          aria-checked={current.includes(d[0])}
          onClick={() => toggleValue && toggleValue(d[0])}
        >
          {d[1]}
        </button>
      ))}
    </div>
  );
}
