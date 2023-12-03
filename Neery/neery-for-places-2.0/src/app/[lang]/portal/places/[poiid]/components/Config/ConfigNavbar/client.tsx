"use client";

import { GenericClickable } from "@/components/ui/util";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export function _PageButton({
  path,
  children,
}: {
  path: string,
  children: ReactNode,
}) {
  const pathname = usePathname() ?? "";

  return (
    <GenericClickable
      role="radio"
      className={`
        font-regular
        focus:font-medium focus:text-primary
        aria-checked:font-medium aria-checked:text-primary

        hover:border-l hover:border-neutral-700
        focus:border-l focus:border-primary
        aria-checked:border-l aria-checked:border-primary

        pl-[8px]
        hover:ml-[-1px]
        focus:ml-[-1px]
        aria-checked:ml-[-1px]
      `}
      aria-checked={pathname.includes(path) ? "true" : "false"}
      action={path}
    >
      {children}
    </GenericClickable>
  );
}
