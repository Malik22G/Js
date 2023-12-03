import type React from "react";

export default function ExpectSection({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="w-full mb-[calc(7.5vh)] md:mb-[calc(15vh)] border-t-neutral-400 border-t-2 border-dashed"
      id="expectsection"
    >
      <div className="relative z-20 w-full px-8 py-8 md:px-[10vw] md:py-[12vh] bg-white text-center">
        <h2 className="text-3xl font-bold mb-6">
          &quot;Kezdd el&quot; velünk a holnapot{" "}
        </h2>
        <p className="md:w-2/3 block mx-auto">
          Segítsd küldetésünk, mert biztosak vagyunk benne, hogy együtt képesek
          vagyunk a lehető legjobb vendéglátói élményt megteremteni. Csatlakozz
          most korai tesztelőinkhez kockázat és kezdeti költségek nélkül.
          Hiszünk egy olyan vendéglátásban, ahol a kooperáció, a lokális
          vállalkozások és a személyes élmények vannak a középpontban.
        </p>
        {children}
      </div>
    </div>
  );
}
