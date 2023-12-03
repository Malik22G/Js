import React from "react";

export default function WhySection({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="w-full bg-neutral-150 border-t-neutral-400 border-t-2 border-dashed"
      id="whysection"
    >
      <div className="relative z-20 w-full px-8 py-8 md:px-[10vw] md:py-[12vh] bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-6">Miért a NeerY?</h2>
        <p className="md:w-2/3 block mx-auto">
          A vendégek <b>50%</b>-a <b>social média</b> hatására látogat el új
          étterembe. Így ezeken a felületeken kapják a megismételhetetlen{" "}
          <b>első benyomást</b>. A NeerY-nél létrehoztunk egy olyan felületet,
          ami ösztönzi, méri és kezeli a helyben fogyasztó vendégeket,
          garantálva nekik a <b>legjobb árat és vendég élményt</b>.
        </p>
        {children}
      </div>
    </div>
  );
}
