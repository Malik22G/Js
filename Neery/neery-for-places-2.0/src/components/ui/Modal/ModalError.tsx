"use client";

import { Context, useContext } from "react";
import { ModalContextType } from "./ModalContext";
import { ExclamationCircle } from "../icons";
export async function errorHandler(
  action: Promise<any>,
  setError: (error: string | null) => void,
  handler?: (error: string) => string
) {
  setError(null);
  await Promise.resolve(action).catch((e) => {
    if (typeof e === "string") {
      try {
        setError(JSON.parse(e).body.err);
      } catch {}
    } else {
      setError(handler ? handler(e) : e?.body.err || e.body);
    }
    throw e;
  });
}
export default function ModalError<T>({
  context,
}: {
  context: Context<ModalContextType<T>>;
}) {
  const ctx = useContext(context);
  return (
    <>
      {ctx.error && (
        <div className="flex flex-row gap-[8px] p-[5px] text-red font-work font-medium font items-center bg-red-100">
          <ExclamationCircle />
          {ctx.error}
        </div>
      )}
    </>
  );
}
