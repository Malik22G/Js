"use client";

import IconButton from "./IconButton";
import { Minus, Plus } from "./icons";

export default function PMNumberInput({
  value,
  min, max,
  step = 1,
  onChange,
}: {
  value: number,
  min?: number, max?: number,
  step?: number,
  onChange(value: number): void,
}) {
  return (
    <div className="flex items-center gap-[16px]">
      <IconButton
        rounding="squareish"
        icon={Minus}
        disabled={value === min}
        action={() => onChange(
          Math.max(value - step, min ?? Number.MIN_SAFE_INTEGER)
        )}
      />
      <span>{value}</span>
      <IconButton
        rounding="squareish"
        icon={Plus}
        disabled={value === max}
        action={() => onChange(
          Math.min(value + step, max ?? Number.MAX_SAFE_INTEGER)
        )}
      />
    </div>
  );
}
