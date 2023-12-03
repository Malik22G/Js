"use client";

import Gradient from "./Gradient";

export default function Hero({ children }: { children: React.ReactNode }) {
  const headText = (
    <span>A dinamikus csatorna éttermed és vendégeid között!</span>
  );

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 grid-rows-1 w-full mb-4 md:mb-0 px-8 py-8 md:min-h-full md:px-[10vw]"
      id="home"
    >
      <div className="flex xl:col-span-2 justify-start md:h-full flex-col shrink-0">
        <div className="grid mb-16 md:mb-0 mt-[calc(33vh-3.5*3rem)] md:mt-[calc(50vh-1.5*4.5rem-2.5rem)] 2xl:mt-[calc(50vh-1.5*6rem-2.5rem)]">
          <h1 className="text-5xl md:text-7xl 2xl:text-8xl -z-50 leading-tight font-bold [grid-area:1/1/1/1]">
            {headText}
          </h1>
          <Gradient />
          <h1 className="text-5xl md:text-7xl 2xl:text-8xl z-30 leading-tight font-bold [mix-blend-mode:color-burn] [color:#3a3a3a] [grid-area:1/1/1/1]">
            {headText}
          </h1>
          <h1 className="text-5xl md:text-7xl 2xl:text-8xl z-40 leading-tight font-bold text-black [opacity:.3] [grid-area:1/1/1/1]">
            {headText}
          </h1>
        </div>
        <div className="md:mt-auto md:left-0 md:bottom-0 [padding-bottom:4vh] text-xl">
          <div className="w-full xl:w-2/3 text-justify">
            <i>
              “A digitális élményed már ugyanolyan fontos mint az étel által
              kapott élmény.”
              <span className="text-sm"> - CEO kebab shop, Square</span>
            </i>
            <div className="h-4" />A NeerY-nél te is <b>20 perc</b> alatt,
            beruházási <b>költség nélkül</b> felállíthatod saját digitális
            rendszered.
          </div>

          <p className="flex mt-4  gap-5">{children}</p>
        </div>
      </div>
    </div>
  );
}
