"use client";

import {
  ReactNode,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ChevronUp } from "./icons";

export type SelectPalette = "blue" | "primary";

const paletteStyles: { [P in SelectPalette]: string } = {
  blue: `
    border-neutral-300
    bg-neutral-100 text-neutral-600
    hover:border-blue aria-expanded:border-blue
  `,
  primary: `
    border-neutral-100
    bg-neutral-100 text-neutral-600
    hover:border-primary-light aria-expanded:border-primary-light
  `,
};

export type MultiSelectProps<K> = {
  palette?: SelectPalette;
  itemHeight?: number;
  padItems?: boolean;
  values: [K, string | ReactNode, string][];
  value: K[];
  toggleValue?(value: K): any;
  className?: string;
};

export default function MultiSelect<K>({
  palette = "blue",
  itemHeight = 20,
  values,
  value: current,
  toggleValue,
  className,
}: MultiSelectProps<K>) {
  const [open, setOpen] = useState(false);

  const normalizedValues = values.map((x) => (Array.isArray(x) ? x : [x, x]));
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={buttonRef}
      className={`
        px-[8px] py-[4px]
        flex gap-[4px] items-center justify-center
        rounded-[10px] border 
        text-[12px] leading-[0px]
        select-none
        group
        transition-colors
relative
        ${paletteStyles[palette]}
        ${className ?? ""}
      `}
      style={{
        height: itemHeight + 8 + "px",
      }}
      onClick={() => setOpen((open) => !open)}
      onBlur={(e) => {
        /*
          BUG: A11Y: For some reason, focusing the last element of the select
          using the Tab key closes the select.
        */
        setOpen(!!(e.relatedTarget && e.target.contains(e.relatedTarget)));
      }}
      aria-expanded={open ? "true" : "false"}
    >
      <span className="grow flex flex-col h-full overflow-hidden items-start justify-start">
        <div className="min-h-[20px] shrink-0 flex justify-start items-center">
          <span>
            {current
              .map((x) => (values.find((y) => y[0] === x) ?? [])[2])
              .filter((x) => x !== undefined)
              .join(", ")}
          </span>
        </div>
      </span>

      <div className="shrink-0 h-full w-[16px] flex items-center justify-center">
        <ChevronUp className="transition-all group-aria-expanded:rotate-180" />
      </div>

      <div
        className={`
          absolute 
          bg-neutral-100 rounded-[10px]
          border border-neutral-200
          pointer-events-none
          p-[4px]
          flex flex-col gap-[4px]
          z-50

          opacity-0
          group-aria-expanded:opacity-100
          hidden
          group-aria-expanded:block
          transition-opacity transition-[margin]
        `}
        style={{
          // HACK: it is 2:30AM is the most unhinged calc statement i've ever
          // wrote, but this is the only way to avoid select bugs in modals. - MG
          // marginTop: "calc(" + normalizedValues.length + "em + " + (10 + (Math.max(normalizedValues.length - 1, 0) * 4) + normalizedValues.length * itemHeight + (itemHeight + 16) * (open ? 1 : -1)) + "px)",
          // top: bottom + 4,
          top: (buttonRef.current?.clientHeight as number) + 2,
          // HACK: meh. ugly but acceptable. it's 4AM now. -MG
          width: buttonRef.current?.clientWidth ?? "fit",
        }}
      >
        {normalizedValues.map((x) => (
          <div
            role="option"
            aria-selected={current.includes(x[0])}
            key={x[0] + ""}
            className={`
              p-[8px] rounded-[10px]
              flex items-center justify-center
              pointer-events-none
              
              bg-neutral-100
              hover:bg-neutral-200
              aria-selected:bg-primary-hover/20
              group-aria-expanded:pointer-events-auto
            `}
            onClick={(e) => {
              e.stopPropagation();
              if (toggleValue) toggleValue(x[0]);
            }}
            style={{
              height: `calc(1em + ${itemHeight}px)`,
            }}
          >
            {x[1]}
          </div>
        ))}
      </div>
    </button>
  );
}
