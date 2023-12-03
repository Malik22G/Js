import React from "react";
import { GenericClickable, GenericClickableAnchorProps, GenericClickableButtonProps, GenericClickableProps } from "./util";

export type ButtonPalette = "primary" | "secondary" | "tertiary" | "red" | "portalNav";
export type ButtonSize = "smallBulky" | "small" | "medium" | "large";

const paletteStyles: { [P in ButtonPalette]: string } = {
  primary: `
    bg-primary-gradient text-neutral-100 rounded-full justify-center
    aria-disabled:bg-none disabled:bg-neutral-200 disabled:text-neutral-500
    aria-disabled:bg-none aria-disabled:bg-neutral-200 aria-disabled:text-neutral-500
  `,
  secondary: `
    bg-neutral-100 text-primary border border-primary rounded-full justify-center
    hover:bg-primary-xlight hover:text-primary-hover
    active:bg-primary-light active:text-primary-hover
    disabled:bg-neutral-100 disabled:text-neutral-500 disabled:border-neutral-200
    aria-disabled:bg-neutral-100 aria-disabled:text-neutral-500 aria-disabled:border-neutral-200
  `,
  tertiary: `
    bg-neutral-100 text-primary rounded-full justify-center
    hover:bg-primary-xlight hover:text-primary-hover
    active:bg-primary-light active:text-primary-hover
    disabled:bg-neutral-100 disabled:text-neutral-500
    aria-disabled:bg-neutral-100 aria-disabled:text-neutral-500
  `,
  red: `
    bg-neutral-100 text-red border border-red rounded-full justify-center
    hover:bg-primary-xlight
    active:bg-primary-light
    disabled:bg-neutral-100 disabled:text-neutral-500 disabled:border-neutral-200
    aria-disabled:bg-neutral-100 aria-disabled:text-neutral-500 aria-disabled:border-neutral-200
  `,
  portalNav: `
    bg-primary-primary text-white rounded-[8px] justify-start px-[8px]
    hover:bg-primary-light hover:text-primary
    active:bg-neutral-100 active:text-primary
    aria-checked:bg-neutral-100 aria-checked:text-primary
  `,
};

const sizeStyles: { [S in ButtonSize]: string} = {
  smallBulky: "h-[40px] px-[24px] text-[12px]", 
  small: "h-[32px] px-[32px] text-[12px]",
  medium: "h-[40px] px-[32px] text-[14px]",
  large: "h-[48px] px-[32px] text-[16px]",
};

type ButtonExtraProps = { palette?: ButtonPalette, size?: ButtonSize };
export type ButtonButtonProps = ButtonExtraProps & GenericClickableButtonProps;
export type ButtonAnchorProps = ButtonExtraProps & GenericClickableAnchorProps;
export type ButtonProps = ButtonExtraProps & GenericClickableProps;

const Button = React.forwardRef((
  {
    size = "small",
    palette = "primary",
    children,
    className,
    ...props
  }: ButtonProps,
  ref,
) => {
  return (
    <GenericClickable
      ref={ref}
      className={`
        ${className}
        flex items-center
        font-sans font-semibold
        transition-colors
        select-none
        ${paletteStyles[palette]} ${sizeStyles[size]}
      `}
      {...props}
    >
      {children}
    </GenericClickable>
  );
});
Button.displayName = "Button";
export default Button;
