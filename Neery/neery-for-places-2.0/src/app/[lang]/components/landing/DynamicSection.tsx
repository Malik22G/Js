import React from "react";

export default function DynamicSection() {
  return (
    <>
      <div className="md:h-full w-full">
        <div
          className="absolute w-full h-full md:h-[calc(50%+2*15vh)] z-10 [transform:skewY(-12deg)] md:[transform:skewY(-6deg)] bg-deepblue"
          style={{
            transformOrigin: "0% 100%",
          }}
        />
        <div className="grid lg:grid-cols-2 relative z-20 md:h-full w-full px-8 py-8 md:px-[10vw] md:py-[12vh] text-white bg-deepblue">
          <div>
            <p className="font-semibold text-cyan-100">
              Vendég élmény és profit maximalizálás
            </p>
            <h2 className="text-3xl text-neutral-100 font-bold mb-6">
              Csalogass be több vásárlót dinamikus leárazásokkal
            </h2>
            <div className=" gap-4">
              <div className="w-full text-justify text-lg text-neutral-100">
                <p className="mb-6">
                  Tudjuk, hogy nincs két egyforma hely, de még két ugyanolyan
                  nap sincs a vendéglátásban. A NeerY algoritmus
                  étterem-specifikusan veszi számításba a konyha kapacitását és
                  az asztalok kihasználtságát. Mesterséges inteligenciánk a
                  múltbéli rendelési adatokra és az aktuális foglalásokra
                  támaszkodva automatikusan segít fenntartani az étterem
                  optimális kihasználtságát. A rendszer folyamatosan tanul és
                  fejlődik a foglalások függvényében, valamint azonnali
                  reagálásra képes.
                </p>
                <p className="mb-6">
                  A megnövekedett forgalom és a tökéletes kapacitáskihasználás
                  eredményeképpen a NeerY a legjobb árat garantálja, a
                  legmagasabb vendég élménnyel egybekötve.
                </p>
              </div>
            </div>
          </div>
          <div>
            <div className="w-full md:w-4/5 p-2 rounded-md bg-neutral-650 shadow mx-auto">
              <svg
                id="chart"
                className="w-full"
                viewBox="0 0 900 530"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M 0,396 C 20.000000000000004,405.9 59.99999999999999,450.45 100,445.5 C 140,440.55 160,383.625 200,371.25 C 240,358.875 260,457.875 300,383.625 C 340,309.375 360,-12.375000000000002 400,0 C 440,12.375000000000002 460,366.29999999999995 500,445.5 C 540,524.7 560,396 600,396 C 640,396 660,524.7 700,445.5 C 740,366.3 760,9.900000000000006 800,0 C 840,-9.900000000000002 880,316.79999999999995 900,396,L 1000 495,L 0 495Z"
                  fill="#98167c1a"
                />
                <path
                  d="M 0,396 C 20.000000000000004,405.9 59.99999999999999,450.45 100,445.5 C 140,440.55 160,383.625 200,371.25 C 240,358.875 260,457.875 300,383.625 C 340,309.375 360,-12.375000000000002 400,0 C 440,12.375000000000002 460,366.29999999999995 500,445.5 C 540,524.7 560,396 600,396 C 640,396 660,524.7 700,445.5 C 740,366.3 760,9.900000000000006 800,0 C 840,-9.900000000000002 880,316.79999999999995 900,396"
                  fill="none"
                  stroke="#98167c"
                  strokeWidth="2px"
                />
                <g>
                  <circle cx="0" cy="396" r="6" fill="#98167c" />,
                  <circle cx="100" cy="445.5" r="6" fill="#98167c" />,
                  <circle cx="200" cy="371.25" r="6" fill="#98167c" />,
                  <circle cx="300" cy="383.625" r="6" fill="#98167c" />,
                  <circle cx="400" cy="0" r="6" fill="#98167c" />,
                  <circle cx="500" cy="445.5" r="6" fill="#98167c" />,
                  <circle cx="600" cy="396" r="6" fill="#98167c" />,
                  <circle cx="700" cy="445.5" r="6" fill="#98167c" />,
                  <circle cx="800" cy="0" r="6" fill="#98167c" />,
                  <circle cx="900" cy="396" r="6" fill="#98167c" />
                </g>
                <line
                  x1="0"
                  y1="300"
                  x2="322"
                  y2="300"
                  className="stroke-cyan-100 stroke-2"
                  strokeDasharray="8"
                />
                <line
                  x1="469"
                  y1="300"
                  x2="732"
                  y2="300"
                  className="stroke-cyan-100 stroke-2"
                  strokeDasharray="8"
                />
                <text
                  x="0"
                  y="290"
                  className="font-mono fill-cyan-100"
                  fontSize="25px"
                >
                  közbelép az árazás
                </text>
                <text
                  x="400"
                  y="530"
                  textAnchor="middle"
                  className="font-mono fill-neutral-500"
                  fontSize="25px"
                >
                  LUNCH
                </text>
                <text
                  x="800"
                  y="530"
                  textAnchor="middle"
                  className="font-mono fill-neutral-500"
                  fontSize="25px"
                >
                  DINNER
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
