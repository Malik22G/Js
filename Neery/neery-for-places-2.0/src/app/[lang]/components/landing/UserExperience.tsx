import {
  ChartArrowUp,
  ClockNoSize,
  LightningBolt,
} from "@/components/ui/icons";
import React from "react";

export default function UserExperienceSection() {
  return (
    <div className="z-50 text-neutral-100 bg-deepblue md:min-h-max w-full border-t-neutral-400 border-t-2 border-dashed p-8 md:px-[10vw] md:py-[12vh] pb-[15vh] md:pb-[35vh]">
      <h1 className="text-center text-3xl font-semibold mb-10">Vendégeidnek</h1>
      <div className="w-full grid md:grid-cols-3 md:grid-rows-1 grid-rows-3 grid-cols-1 gap-4 md:gap-[5vw] md:px-[5vw]">
        <div>
          <div className="w-12 h-12 text-left">
            <ClockNoSize className="w-7/12 h-full mb-2 text-cyan-100 block" />
          </div>
          <h2 className="border-l border-l-cyan-100 pl-2 font-semibold mb-2">
            Minden információ kéznél
          </h2>
          <p className="px-2">
            Étlap, leárazás, vélemények többé nem kell oldalakat bejárni és
            keresgélni.
          </p>
        </div>
        <div>
          <div className="w-12 h-12 text-left">
            <LightningBolt className="w-7/12 h-full mb-2 text-cyan-100 block" />
          </div>
          <h2 className="border-l border-l-cyan-100 pl-2 font-semibold mb-2">
            Azonnali reagálás
          </h2>
          <p className="px-2">
            Automatikus visszajelzéssel nincsen várakozás vagy elveszett
            információ.
          </p>
        </div>
        <div>
          <div className="w-12 h-12 text-left">
            <ChartArrowUp className="w-7/12 h-full mb-2 text-cyan-100 block" />
          </div>
          <h2 className="border-l border-l-cyan-100 pl-2 font-semibold mb-2">
            Legjobb ár és élmény
          </h2>
          <p className="px-2">
            A NeerY garantálja személyes élményüket a legjobb áron , amit egy
            gombnyomással megoszthatnak egymással.
          </p>
        </div>
      </div>
    </div>
  );
}
