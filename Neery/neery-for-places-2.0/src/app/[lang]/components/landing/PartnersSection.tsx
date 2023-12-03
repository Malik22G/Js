import ilab from "@/images/ilab.svg";
import wiseguys from "@/images/wiseguys.svg";
import wolt from "@/images/wolt.svg";
import Image from "next/image";

export default function LandPartnersSection() {
  return (
    <div className="md:min-h-max w-full bg-white border-t-neutral-400 border-t-2 border-dashed p-8 md:px-[10vw] md:py-[6vh]">
      <div className="w-full grid md:grid-cols-3 grid-cols-3 grid-rows-1 gap-4 md:gap-[5vw] md:px-[5vw]">
        <a href="https://ilab.ceu.edu" target="_blank" rel="noreferrer">
          <Image src={ilab} alt={"CEU iLab logo"} className="h-20 mx-auto" />
        </a>
        <a
          href="https://startupwiseguys.com/building/pre-accelerator-program/"
          target="_blank"
          rel="noreferrer"
        >
          <Image
            src={wiseguys}
            alt={"Startup Wise Guys Logo"}
            className="h-20 mx-auto"
          />
        </a>
        <a href="https://wolt.com">
          <Image src={wolt} alt={"Wolt logo"} className="h-20 mx-auto" />
        </a>
      </div>
    </div>
  );
}
