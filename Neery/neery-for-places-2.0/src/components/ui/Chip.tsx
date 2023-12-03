import { HTMLProps } from "react";

export type ChipPalette = "primary" | "neutral";

const paletteStyles: { [P in ChipPalette]: string } = {
  primary: "bg-pink text-neutral-100",
  neutral: "",
};

export default function Chip({
  children,
  palette = "neutral",
  className = "",
  ...props
}: HTMLProps<HTMLDivElement> & { palette?: ChipPalette }) {
  return (
    <div
      className={`
        ${paletteStyles[palette]}
        flex items-center justify-center gap-[4px]
        rounded-full font-medium px-[8px] leading-compact
        py-[2px] text-[10px]
        md:py-[4px] md:text-[12px]
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
