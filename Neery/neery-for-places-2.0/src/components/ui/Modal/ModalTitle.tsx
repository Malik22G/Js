"use client";

import { Context, ReactNode, useContext } from "react";
import { ModalContextType } from "./ModalContext";
import IconButton from "../IconButton";
import { X } from "../icons";

export default function ModalTitle<T>({
  children,
  context,
  className,
}: {
  children: ReactNode;
  context: Context<ModalContextType<T>>;
  className?: string;
}) {
  const ctx = useContext(context);

  return (
    <div
      className={`
        flex gap-[16px] items-center justify-between
        font-sans w-full
        ${(className ?? "").includes("pb-") ? "" : "pt-[8px]"}
        ${(className ?? "").includes("pt-") ? "" : "pt-[16px]"}
        bg-neutral-100
        sticky top-0 z-[60]
        ${className ?? ""}
      `}
    >
      <h1
        className={`
          text-[20px] font-semibold
          select-none
        `}
      >
        {children}
      </h1>

      <IconButton
        icon={X}
        iconClass="h-[0.7rem] w-[0.7rem]"
        palette="red"
        rounding="squareish"
        action={() => {
          ctx.update(null);
          ctx.setError(null);
        }}
      />
    </div>
  );
}
