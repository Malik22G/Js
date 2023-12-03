"use client";

import { ReactNode, createContext, useEffect } from "react";

export const RefererContext = createContext<string | null>(null);

export default function RefererHandler({ referer, cReferer, children }: { referer: string | null, cReferer: string | undefined, children: ReactNode }) {
  useEffect(() => {
    fetch("/land/referer" + (referer !== null ? "?referer=" + encodeURIComponent(referer) : ""), {
      method: "POST",
    });
  }, [referer]);

  return (
    <RefererContext.Provider value={(referer === null || !referer.includes(".neery.net/")) ? referer : (cReferer ?? null)}>
      {children}
    </RefererContext.Provider>
  );
}
