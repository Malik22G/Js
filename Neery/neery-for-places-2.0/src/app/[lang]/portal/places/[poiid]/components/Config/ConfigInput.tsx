"use client";

import { Context, ReactNode, useContext } from "react";
import _Input, { InputProps } from "@/components/ui/Input";
import { ConfigFormContextType } from "./ConfigForm";

export function Input<K>({
  label,
  name,
  context,
  className,
  type,
  ...props
}: {
  label?: string;
  name: keyof K;
  context: Context<ConfigFormContextType<K>>;
} & Omit<InputProps, "name" | "label" | "onChange" | "value">) {
  const ctx = useContext(context);
  return (
    <_Input
      label={label}
      className={`${className?.includes("w-") ? "" : "w-full xl:w-2/5"} ${
        className ?? ""
      }`}
      value={ctx.form[name] as any}
      {...(type === "checkbox" && {
        checked: Boolean(ctx.form[name]),
      })}
      type={type}
      onChange={(e) => {
        ctx.update({
          [name]:
            type === "number"
              ? parseFloat(e.target.value)
              : type === "checkbox"
                ? Boolean(e.target.checked)
                : e.target.value,
        } as any);
      }}
      {...props}
    />
  );
}

export function InputGroup({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`
      flex flex-col gap-[16px]
    `}
    >
      {title !== undefined ? (
        <h3 className="font-sans font-medium text-[18px]">{title}</h3>
      ) : null}

      {children}
    </div>
  );
}
