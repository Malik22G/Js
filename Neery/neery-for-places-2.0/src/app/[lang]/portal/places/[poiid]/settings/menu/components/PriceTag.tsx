export const priceTagStyles = ["inplace", "wolt", "foodpanda"] as const;
export type PriceTagStyle = typeof priceTagStyles[number];

const ptStyleClass: { [S in PriceTagStyle]: string } = {
  inplace: "bg-primary text-neutral-100",
  wolt: "bg-brands-wolt text-neutral-100",
  foodpanda: "bg-brands-foodpanda text-neutral-100",
};

export default function PriceTag({
  style,
  value,
}: {
  style: PriceTagStyle,
  value: number | undefined,
}) {
  if (value === undefined) return null;

  return (
    <div className={`
      px-[6px] rounded-full
      text-[12px] w-fit
      ${ptStyleClass[style]}
    `}>
      {value} Ft
    </div>
  );
}
