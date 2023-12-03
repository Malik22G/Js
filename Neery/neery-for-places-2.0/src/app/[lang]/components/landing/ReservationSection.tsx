"use client";

import { useState } from "react";
import widget from "@/images/widget.svg";
import { ChevronRight, ChevronDown } from "@/components/ui/icons";
import Image from "next/image";

type SectionToggleProps = {
  index: number;
  openSection: number | null;
  toggleSection: (index: number) => void;
  title: string;
  text: string;
};

const sectionData: Record<number, { title: string; text: string }> = {
  0: {
    title: "Minden elérhetőség egy helyen",
    text: " Gyors áttekintés, kapcsolatfelvétel egy kattintásra. A felüle a vendég választását egyszerűsíti.",
  },
  1: {
    title: "Dinamikus kedvezmény",
    text: "Az étterem kapacitásának függvényében a NeerY rendszer dinamikus kedvezmény-eket ajánl. Ez ösztönzi a vendégekeket a helyben fogyasztásra ezzel maximalizálva a hely kihasználtságát.",
  },
  2: {
    title: "Étlap",
    text: "A Wolthoz hasonló digitális étlapon a vendégek kategozizáltan. Az étlap nagy előnye, hogy bármilyen platform beleértve a Wolt és Foodpanda rendszereket az árak, fogás azonnal és könnyedén változtathatóak.",
  },
  3: {
    title: "Egyedi címkék",
    text: "Étterem egyedi ismérvei tag-ekként könnyen áttekinthetőek, hozzáadhatóak. Így ezáltal jobban kereshetőek.",
  },
  4: {
    title: "Kiemelt ételek",
    text: "A kiemelt ételek lehetőséget nyújtanak egyes fogások promozására. Így a legkedveltebb ételekkel találkozik a vendég elsőként.",
  },
  5: {
    title: "Direkt foglalás",
    text: "   A widget célja a helyben fogyasztás támogatása és mérhetővé tétele. 0-24 es automatizált foglalási rendszerünkkel nincs többé elveszett foglalás.",
  },
};

function SectionToggle({
  index,
  openSection,
  toggleSection,
  title,
  text,
}: SectionToggleProps) {
  return (
    <div className="flex items-center">
      <div className="flex gap-2">
        <div
          className="w-3 grow-1 mr-2"
          role="button"
          tabIndex={0}
          onClick={() => toggleSection(index)}
        >
          {openSection === index ? (
            <ChevronDown className="text-2xl w-6 h-6 mt-1" />
          ) : (
            <ChevronRight className="text-2xl w-6 h-6 mt-1" />
          )}
        </div>
        <div>
          <div
            role="button"
            tabIndex={0}
            onClick={() => toggleSection(index)}
            className="text-left text-xl font-bold hover:opacity-75 active:opacity-50 bg-neutral-100"
          >
            {title}
          </div>
          {openSection === index ? <p>{text}</p> : null}
        </div>
      </div>
    </div>
  );
}

export default function ReservationSection() {
  const [openSection, setOpenSection] = useState<number | null>(null);

  function toggleSection(index: number) {
    if (openSection === index) {
      setOpenSection(null);
    } else {
      setOpenSection(index);
    }
  }

  return (
    <div
      className="flex flex-col gap-4 lg:gap-0 lg:grid lg:grid-rows-1 lg:grid-cols-3 md:min-h-full w-full bg-white border-t-neutral-400 border-t-2 border-dashed px-8 pt-8 pb-[calc(2rem+7.5vh)] md:px-[10vw] md:pt-[12vh] md:pb-[calc(12vh+2*15vh)]"
      id="reservationsection"
    >
      <div className="flex flex-col gap-4 lg:gap-0 lg:grid lg:grid-rows-3 w-full lg:h-full">
        {Object.keys(sectionData).map((key, i) => {
          if (i > 2) return null;

          return (
            <SectionToggle
              key={sectionData[i].title}
              index={i}
              openSection={openSection}
              toggleSection={toggleSection}
              title={sectionData[i].title}
              text={sectionData[i].text}
            />
          );
        })}
      </div>
      <div className="hidden lg:flex justify-center items-center">
        <Image
          src={widget}
          alt={"Neery restaurant widget screenshot"}
          className="w-[70%] rounded-xl shadow-2xl"
        />
      </div>
      <div className="flex flex-col gap-4 lg:gap-0 lg:grid lg:grid-rows-3 w-full lg:h-full">
        {Object.keys(sectionData).map((key, i) => {
          if (i < 3) return null;

          return (
            <SectionToggle
              key={sectionData[i].title}
              index={i}
              openSection={openSection}
              toggleSection={toggleSection}
              title={sectionData[i].title}
              text={sectionData[i].text}
            />
          );
        })}
      </div>
      <div className="flex lg:hidden justify-center items-center">
        <Image
          src={widget}
          className="w-[70%] rounded-xl shadow-2xl"
          alt={"Neery restaurant widget screenshot"}
        />
      </div>
    </div>
  );
}
