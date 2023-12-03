import { ReactNode, useId } from "react";
import IconButton from "./IconButton";
import { Check, Plus } from "./icons";

function Addon({
  checked,
  onClick,
  label,
}: {
  checked: Boolean,
  onClick(): any,
  label: string | ReactNode,
}) {
  const labelId = useId();

  return (
    <div className="flex gap-[8px] items-center">
      <IconButton
        icon={checked ? Check : Plus}
        role="checkbox"
        aria-checked={checked ? "true" : "false"}
        className={`
          my-[4px] shrink-0
          aria-checked:bg-primary aria-checked:text-neutral-100
        `}
        action={() => onClick()}
        aria-labelledby={labelId}
      />

      <span className="text-[14px] grow" id={labelId}>
        {label}
      </span>
    </div>
  );
}

export default function AddonSelect<K>({
  addons,
  value,
  onChange,
}: {
  addons: [K, string | ReactNode][],
  value: K[],
  onChange(values: K[]): any,
}) {
  return (
    <div className={`
      flex flex-col gap-[8px]
    `}>
      {addons.map(addon => (
        <Addon
          key={addon[0] + ""}
          checked={value.includes(addon[0])}
          onClick={() => {
            if (value.includes(addon[0])) {
              onChange(value.filter(x => x !== addon[0]));
            } else {
              onChange([...value, addon[0]]);
            }
          }}
          label={addon[1]}
        />
      ))}
    </div>
  );
}
