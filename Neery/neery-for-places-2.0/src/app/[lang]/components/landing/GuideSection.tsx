import {
  Play,
  PenPaperNoSize,
  PlusNoSize,
} from "../../../../components/ui/icons";

import type React from "react";

export default function GuideSection({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full mb-[calc(7.5vh)] md:mb-[calc(15vh)]">
      <div
        className="absolute w-full h-[50%] z-10 [transform:skewY(-12deg)] md:[transform:skewY(-6deg)] bg-white"
        style={{
          transformOrigin: "0% 100%",
        }}
      />
      <div className="relative z-50 w-full px-8 py-8 md:px-[10vw] md:py-[12vh]">
        <p className="font-semibold text-primary">Csatlakozz a forradalomhoz</p>
        <h2 className="text-3xl font-bold mb-6">
          Légy részese 3 egyszerű lépésben
        </h2>
        <div className="w-full grid md:grid-cols-3 md:grid-rows-1 grid-rows-3 grid-cols-1 gap-4 md:gap-[5vw] md:px-[5vw]">
          <div>
            <div className="w-12 h-12 text-left">
              <PlusNoSize className="w-7/12 h-full mb-2 text-primary block" />
            </div>
            <h2 className="border-l border-l-primary pl-2 font-semibold mb-2">
              Hozd létre üzleted
            </h2>
            <p className="px-2">
              Nyomj a &quot;Kezdd el&quot; gombra és töltsd ki a 4 kérdésből
              álló regisztrációt.
            </p>
          </div>
          <div>
            <div className="w-12 h-12 text-left">
              <PenPaperNoSize className="w-7/12 h-full mb-2 text-primary block" />
            </div>
            <h2 className="border-l border-l-primary pl-2 font-semibold mb-2">
              Tedd egyedivé widgeted
            </h2>
            <p className="px-2">
              Válaszolj a kérdésekre és szabd személyre megjelenésed.
            </p>
          </div>
          <div>
            <div className="relative w-12 h-12 text-left mr-12">
              <Play className="w-full h-full absolute -left-2 mb-2 text-primary block" />
            </div>
            <h2 className="border-l border-l-primary pl-2 font-semibold mb-2">
              Élesítsd oldalad
            </h2>
            <p className="px-2">
              Illeszd be widgetünket üzleted oldalaira, és a hitelesítés után
              készen is állsz.
            </p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
