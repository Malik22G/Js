import { ReactNode, TextareaHTMLAttributes, useId } from "react";
import Labelled from "@/components/ui/Labelled";

export type TextBoxProps = {
  label?: string | ReactNode;
  error?: string | ReactNode;
  bare?: boolean;
  wrapperClasses?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function TextBox({
  label,
  className,
  error,
  wrapperClasses,
  bare = false,
  ...props
}: TextBoxProps) {
  const labelId = useId();

  const bareJSX = (
    <textarea
      {...props}
      className={`
        resize-none
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
        ${!bare && "w-full "}
        ${className}
        
      `}
    />
  );

  if (bare) {
    return bareJSX;
  }

  return (
    <Labelled
      label={label}
      labelId={labelId}
      error={error}
      className={wrapperClasses}
    >
      {bareJSX}
      {error !== undefined ? <span className="text-red">{error}</span> : null}
    </Labelled>
  );
}
