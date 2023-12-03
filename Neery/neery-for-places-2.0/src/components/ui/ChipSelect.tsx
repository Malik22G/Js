import { ReactNode } from "react";

export default function ChipSelect<K>({
  chips,
  value,
  onChange,
}: {
  chips: [K, string | ReactNode][],
  value: K[],
  onChange(values: K[]): any,
}) {
  return (
    <div className={`
      flex flex-wrap gap-[8px]
    `}>
      {chips.map(chip => (
        <button
          key={chip[0] + ""}
          role="checkbox"
          aria-checked={value.includes(chip[0])}
          className={`
            px-[16px] py-[8px]
            text-[14px] leading-[20px] font-medium
            border border-neutral-300 rounded-[16px]

            transition-colors
            bg-neutral-100 text-primary
            hover:bg-primary-xlight
            aria-checked:bg-primary aria-checked:text-neutral-100
          `}
          onClick={() => {
            if (value.includes(chip[0])) {
              onChange(value.filter(x => x !== chip[0]));
            } else {
              onChange([...value, chip[0]]);
            }
          }}
        >
          {chip[1]}
        </button>
      ))}
    </div>
  );
}
