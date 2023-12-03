"use client";

import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import type React from "react";

type CardInteractionProps = {
  buttonText: string;
  day: number;
  hours: [string, string];
  poiid: string;
  children: React.ReactNode;
};

export default function CardInteraction({
  buttonText,
  day,
  hours,
  poiid,
  children,
}: CardInteractionProps) {
  const router = useRouter();

  async function handleButtonClick() {
    const start = hours[0].replace(":", "");
    const end = hours[1].replace(":", "");
    await router.push(
      `/land/${poiid}/reserve?day=${day}&hours=${start}-${end}`
    );
  }

  return (
    <>
      {children}
      <Button
        palette="secondary"
        onClick={handleButtonClick}
        className="absolute lg:bottom-6 bottom-7 right-5 z-30"
      >
        {buttonText}
      </Button>
    </>
  );
}
