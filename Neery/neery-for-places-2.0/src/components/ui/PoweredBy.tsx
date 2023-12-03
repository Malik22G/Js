import Image from "next/image";

import logoText from "@/images/logo_text.svg";
import { GenericClickable } from "./util";

export default function PoweredBy({
  className = "",
}: {
  className?: string,
}) {
  return (
    <GenericClickable
      action="/"
      className={`
        w-full
        flex items-center justify-center gap-[4px]
        text-neutral-500 text-[10px] font-medium
        ${className}
      `}
    >
      <span>Powered by</span>
      <Image
        src={logoText}
        height={20}
        alt="NeerY"
      />
    </GenericClickable>
  );
}
