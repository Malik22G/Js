"use client";

import { Context } from "react";
import { ModalContextType } from "./ModalContext";
import { useState } from "react";
import { ReactNode } from "react";

export default function ModalBox<T>({
  context,
  children,
  siblings,
  fixed,
  onHide,
}: {
  context: Context<ModalContextType<T>>;
  children: ReactNode;
  siblings: ReactNode;
  fixed?: boolean;
  onHide?(): any;
}) {
  let [data, update] = useState<T | null>(null);
  let [error, setError] = useState<string | null>(null);
  return (
    <context.Provider
      value={{
        data,
        update,
        error,
        setError,
      }}
    >
      <div
        className={`
          ${fixed ? "fixed" : "absolute"}
          left-0 right-0 top-0 bottom-0 z-50
          bg-neutral-700/50
          flex items-center justify-center

          transition-opacity
          ${
            data === null
              ? `
            opacity-0 pointer-events-none
          `
              : `
            opacity-100 pointer-events-auto
          `
          }

          overflow-auto
        `}
        onClick={() => {
          update(null);
          setError(null);
          if (onHide) onHide();
        }}
      >
        <div
          className={`
            bg-neutral-100 p-[16px] pt-[0px] rounded-[8px]
            font-work
            w-full md:w-[90vw] xl:w-[50vw] 2xl:w-[40vw]
            flex flex-col gap-[8px]
            max-h-[100%] md:max-h-[90%]
            overflow-scroll scrollbar-hidden
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
      {siblings}
    </context.Provider>
  );
}
