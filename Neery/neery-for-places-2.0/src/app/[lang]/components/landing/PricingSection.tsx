import type React from "react";

export default function PricingSection({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full" id="pricingsection">
      <div
        className="absolute w-full h-[50%] z-10 [transform:skewY(-12deg)] md:[transform:skewY(-6deg)] bg-neutral-100"
        style={{
          transformOrigin: "0% 100%",
        }}
      />
      <div className="relative z-20 w-full px-8 py-8 md:px-[10vw] md:py-[12vh] bg-white text-center flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-6">Árazás</h2>
        <div className="flex flex-col lg:grid lg:grid-rows-1 lg:grid-cols-2 w-[75%] gap-14 lg:gap-36">
          <div className="text-left">
            <h3 className="text-2xl font-bold text-center mb-6">Csomag 1</h3>
            <ul>
              <li className="font-bold">Foglalás</li>
              <ul className="list-disc ml-4 mb-4">
                <li>Korlátlan foglalás</li>
                <li>Azonnali e-mail visszajelzés a helynek és vendégeknek</li>
                <li>Saját naptáras nézet asztal bontásban</li>
                <li>Automatikus asztal management</li>
                <li>Minden eszközre optimalizáltan (Telefon, table, PC)</li>
              </ul>
              <li className="font-bold">Digitális étlap</li>
              <ul className="list-disc ml-4 mb-4">
                <li>Wolt, Foodpanda integráció</li>
                <li>Képek feltöltése</li>
                <li>Azonnali változtatás, különböző árak hozzáadása</li>
                <li>Ételek kiemelése a widgeten</li>
              </ul>
              <li className="font-bold">Kedvezmények</li>
              <ul className="list-disc ml-4 mb-4">
                <li>Statikus kedvezmények</li>
                <li>Időzített leárazások foglalással egybekötve</li>
                <li>Adatgyűjtés</li>
              </ul>
            </ul>
            <div className="lg:hidden text-center">
              <p className="font-bold text-lg">10X-es érték teremtés</p>
              {/*<p className='font-bold text-lg'>9900 Ft + Áfa / hó</p>
              <p className='text-sm'>(25 Euro + Tax)</p>
              <p className='text-sm font-bold'>Első foglalástól számított 20 nap ingyenes!</p>*/}
            </div>
          </div>
          <div className="text-left">
            <h3 className="text-2xl font-bold text-center mb-6">Csomag 2</h3>
            <ul className="">
              <li>Csomag 1, plusz:</li>
              <ul className="list-disc ml-4 mb-4">
                <li>Dinamikus leárazások kapacitás függvényében</li>
                <li>Garantált min 20% bevétel növekedés 3. hónaptól</li>
                <li>Étel rendelés</li>
              </ul>
            </ul>
            <div className="lg:hidden text-center">
              <p className="font-bold text-lg">Hamarosan!</p>
              <p className="text-md">Csomag 1 használata előfeltétel.</p>
            </div>
          </div>
        </div>
        <div className="hidden lg:grid grid-cols-2 w-[75%] gap-36">
          <div className="text-center">
            <p className="font-bold text-lg">10X-es érték teremtés</p>
            {/*<p className='font-bold text-lg'>9900 Ft + Áfa / hó</p>
              <p className='text-sm'>(25 Euro + Tax)</p>
              <p className='text-sm font-bold'>Első foglalástól számított 20 nap ingyenes!</p>*/}
          </div>
          <div className="text-center">
            <p className="font-bold text-lg">Hamarosan!</p>
            <p className="text-md">Csomag 1 használata előfeltétel.</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
