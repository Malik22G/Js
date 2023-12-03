import { InputHTMLAttributes, ReactNode, useId } from "react";
import Labelled from "./Labelled";

export type InputProps = {
  label?: string | ReactNode;
  error?: string | ReactNode;
  bare?: boolean;
  rootClassName?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function Input({
  label,
  className,
  error,
  bare = false,
  rootClassName,
  ...props
}: InputProps) {
  const labelId = useId();

  const bareJSX = (
    <input
      aria-labelledby={labelId}
      className={`
        px-[16px] py-[8px]
        rounded-[10px]
        text-[14px] leading-[18px] font-work font-regular

        transition-all
        border-[2px]
        ${
    error === undefined
      ? `
          border-neutral-200 outline-neutral-200
          focus:outline-blue
        `
      : `
          border-red outline-red
        `
    }

        ${className}
      `}
      {...props}
    />
  );

  if (bare) {
    return bareJSX;
  } else {
    return (
      <Labelled
        label={label}
        labelId={labelId}
        error={error}
        className={rootClassName}
      >
        {bareJSX}

        {error !== undefined ? <span className="text-red">{error}</span> : null}
      </Labelled>
    );
  }
}
