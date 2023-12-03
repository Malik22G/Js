import Link, { LinkProps } from "next/link";
import React, { AnchorHTMLAttributes, ButtonHTMLAttributes, MouseEventHandler } from "react";

export type GenericClickableButtonProps = (
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "aria-disabled"> & { action?: MouseEventHandler<HTMLButtonElement> }
);

export type GenericClickableAnchorProps = (
  Omit<Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & LinkProps, "href" | "aria-disabled"> & { action: string, disabled?: boolean }
);

export type GenericClickableProps = GenericClickableButtonProps | GenericClickableAnchorProps;

export const GenericClickable = React.forwardRef((
  {
    children,
    className,
    disabled,
    action,
    ...props
  }: GenericClickableProps,
  ref,
) => {
  if (typeof action === "string") {
    return (
      <Link
        ref={ref as any}
        className={className}
        href={action}
        aria-disabled={disabled}
        {...props as Omit<Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & LinkProps, "href" | "aria-disabled">}
      >
        {children}
      </Link>
    );
  } else {
    return (
      <button
        ref={ref as any}
        className={className}
        onClick={action as MouseEventHandler<HTMLButtonElement>}
        disabled={disabled}
        aria-disabled={disabled}
        {...props as (Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "disabled">)}
      >
        {children}
      </button>
    );
  }
});
GenericClickable.displayName = "GenericClickable";
