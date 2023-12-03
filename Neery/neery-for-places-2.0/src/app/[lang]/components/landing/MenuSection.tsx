import menu from "@/images/menu.svg";
import Image from "next/image";

export default function MenuSection() {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full bg-white border-t-neutral-400 border-t-2 border-dashed px-8 pt-8 pb-[calc(2rem+7.5vh)] md:px-[10vw] md:pt-[24vh] md:pb-[calc(6vh+2*15vh)] h-[100vh]">
        <div>
          <p className="font-semibold text-primary">A jövő étlapja</p>
          <h2 className="text-3xl font-bold lg:w-3/5 mb-6">
            Saját mérhető digitális étlapod percek alatt
          </h2>
          <div className="grid gap-4">
            <div className="w-full text-justify text-lg">
              <p className="mb-6">
                Felejtsd el a Facebook, Instagram, Google-re befotózott
                étlapokat. Változtasd a képeket mérhető digitális étlapra. A
                NeerY-vel az összes online felületen az árak, tételek 1
                gombnyomásra változtathatóak, kiemelhetőek.
              </p>
              <p className="mb-6 font-bold">És a legjobb?</p>
              <p className="mb-6">
                Ha Wolt-al rendelkeztek, az étlap képekkel történő áthúzása
                mindössze 2 gombnyomás, de saját magad is könnyedén fel tudod
                tölteni rendszerünkön keresztül.
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <Image
            src={menu}
            alt="Neery widget menu screenshot"
            className="w-[50%] rounded-xl shadow-2xl"
          />
        </div>
      </div>
    </>
  );
}
