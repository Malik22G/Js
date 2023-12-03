import land_screenshot from "@/images/land_screenshot.png";
import Image from "next/image";

export default function IntegrationSection() {
  return (
    <>
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-16 w-full bg-white border-t-neutral-400 border-t-2 border-dashed px-8 pt-8 pb-8 md:px-[10vw] md:pt-[24vh] md:pb-[24vh] items-center"
        id="integrationsection"
      >
        <div>
          <p className="font-semibold text-primary">
            Letisztult foglaláskezelés
          </p>
          <h2 className="text-3xl font-bold lg:w-3/5 mb-6">
            Egy foglalási rendszer, amit élvezni fogsz
          </h2>
          <div className="grid gap-4">
            <div className="w-full text-justify text-lg">
              <p className="mb-6">
                A NeerY lehetővé teszi számodra, hogy a foglalásokat, Wolt és
                Foodpanda rendeléseket egy helyen kezeld. A kevesebb eszköz és
                az adaton alapuló automatizáció időt spórol és gyorsabb
                visszajelzést tesz lehetővé.
              </p>
              <p className="mb-6">
                A foglalási rendszer automatikus visszajelzést küld a
                vendégeknek és az asztal kapacitást figyelembe véve segít az
                ültetésben. A foglalást igény szerint kézileg valamint a
                rendszerre bízva is belehet állítani.
              </p>
            </div>
          </div>
        </div>
        <div>
          <Image
            src={land_screenshot}
            alt={"Neery app reservation manager screen shot"}
            className="rounded-xl shadow-2xl"
          />
        </div>
      </div>
    </>
  );
}
