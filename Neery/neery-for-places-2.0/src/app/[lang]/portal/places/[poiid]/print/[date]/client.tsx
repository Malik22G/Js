"use client";

import { useEffect } from "react";

function iOS() {
  return [
    "iPad Simulator",
    "iPhone Simulator",
    "iPod Simulator",
    "iPad",
    "iPhone",
    "iPod",
  ].includes(navigator.platform)
  // iPad on iOS 13 detection
  || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
}

export function PrintPop() {
  useEffect(() => {
    if (typeof globalThis["window"] !== "object") return;

    window.print();

    if (!iOS()) {
      setTimeout(() => {
        window.history.back();
      }, 2000);
    }
  }, []);

  return null;
}
