"use client";

import React from "react";
import ShadePlane from "./ShadePlane";
import fragmentShader from "@/lib/shader/hero_frag";

export default function Gradient() {
  return (
    <div
      className="overflow-hidden h-1/3 md:h-2/3 [transform:skewY(-12deg)] md:[transform:skewY(-6deg)] top-0 left-0"
      style={{
        transformOrigin: "0% 100%",
        position: "absolute",
        zIndex: -1,
        width: "100%",
        backgroundColor: "#2f2f2f",
      }}
    >
      <ShadePlane
        fragment={fragmentShader}
        extraHeight={5}
        uniforms={{
          realTime: { type: "1f", get: () => (Date.now() / 1000) % (60 * 60) },
        }}
      />
    </div>
  );
}
