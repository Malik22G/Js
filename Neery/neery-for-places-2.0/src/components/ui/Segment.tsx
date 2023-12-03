import { ReactNode } from "react";

export default function Segment({
  values,
  value: current,
  setValue,
}: {
  values: (string | [string, ReactNode])[],
  value?: string,
  setValue?(value: string): any,
}) {
  return (
    <div
      className={`
        grid grid-rows-1
        border border-neutral-300 rounded-[10px]
        divide-x divide-neutral-300
        select-none
      `}
      style={{
        gridTemplateColumns: "minmax(0, 1fr) ".repeat(values.length),
      }}
    >
      {values.map(val => {
        const key = Array.isArray(val) ? val[0] : val;
        const value = Array.isArray(val) ? val[1] : val;

        return (
          <button
            role="radio"
            key={key}
            aria-checked={key === current ? "true" : "false"}
            className={`
              flex items-center justify-center
              px-[8px] py-[4px] leading-[20px] text-[12px]
              first:rounded-l-[10px] last:rounded-r-[10px]
              transition-colors

              aria-checked:bg-primary aria-checked:text-neutral-100
            `}
            onClick={() => setValue && setValue(key)}
          >
            {value}
          </button>
        );
      })}
    </div>
  );
}
