import logo from "@/images/logo.svg";
import type React from "react";
import Image from "next/image";

export default function TopMenu({ children }: { children: React.ReactNode }) {
  const links = {
    whysection: "Miért a NeerY?",
    reservationsection: "Widget",
    integrationsection: "Funkciók",
    pricingsection: "Árak",
    expectsection: "Küldetés",
  };

  return (
    <>
      <div
        className="absolute top-0 left-0 h-14 bg-transparent right-0 flex justify-center items-center text-[#000] gap-8 lg:px-[15vw] z-50 pointer-events-none"
      >
        <div className="flex flex-row gap-8 h-full items-center justify-center pointer-events-auto">
          {/*Object.entries(links).map((x) => (
            <a
              className="hidden lg:inline opacity-60 hover:opacity-100 transition-opacity font-bold"
              href={"#" + x[0]}
              key={x[0]}
            >
              {x[1]}
            </a>
          ))*/}
          <a
            className="hidden lg:inline opacity-60 hover:opacity-100 transition-opacity font-bold"
            href="https://blog.neery.net/"
            target="_blank"
            rel="noreferrer"
          >
            Blog
          </a>
        </div>
      </div>
      <div
        className="absolute top-0 left-0 h-14 bg-transparent right-0 flex justify-between items-center text-[#000] gap-8 lg:px-[15vw] z-40"
        id="#nav"
      >
        <a href="/" className="w-10">
          <Image
            src={logo}
            className="h-10"
            alt="logo"
          />
        </a>

        

        {children}
      </div>
    </>
  );
}
