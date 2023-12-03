import { createElement, FC } from "react";
import { GenericClickable, GenericClickableAnchorProps, GenericClickableButtonProps, GenericClickableProps } from "./util";

export type IconButtonRounding = "circle" | "squareish";
export type IconButtonSize = "small" | "large" | "xlarge";
export type IconButtonPalette = "primary" | "black" | "red" | "green";

const roundingStyles: { [R in IconButtonRounding]: string } = {
  "circle": "rounded-full",
  "squareish": "rounded-[9.82px]",
};

const sizeStyles: { [S in IconButtonSize]: string } = {
  "small": "w-[24px] h-[24px]",
  "large": "w-[32px] h-[32px]",
  "xlarge": "w-[48px] h-[48px]",
};

const paletteStyles: { [S in IconButtonPalette]: string } = {
  "primary": `
    bg-primary-light text-primary
    disabled:bg-neutral-200 disabled:text-neutral-500
    aria-disabled:bg-neutral-200 aria-disabled:text-neutral-500
  `,
  "black": `
    bg-neutral-700 text-neutral-100
  `,
  "red": `
    bg-red-xlight hover:bg-red-light text-red
  `,
  "green": `
    bg-green-xlight hover:bg-green-light text-green
  `,
};

type IconButtonExtras = {
  icon: FC<{ className?: string }>,
  iconClass?: string,
  rounding?: IconButtonRounding,
  size?: IconButtonSize,
  palette?: IconButtonPalette,
};

export type IconButtonButtonProps = IconButtonExtras & GenericClickableButtonProps;
export type IconButtonAnchorProps = IconButtonExtras & GenericClickableAnchorProps;
export type IconButtonProps = IconButtonExtras & GenericClickableProps;

export default function IconButton({
  icon,
  className,
  iconClass,
  rounding = "circle",
  size = "small",
  palette = "primary",
  ...props
}: IconButtonProps) {
  return (
    <GenericClickable
      className={`
        flex items-center justify-center
        transition-colors

        ${sizeStyles[size]}
        ${roundingStyles[rounding]}
        ${paletteStyles[palette]}

        ${className}
      `}
      {...props}
    >
      {createElement(icon, { className: iconClass })}
    </GenericClickable>
  );
}
