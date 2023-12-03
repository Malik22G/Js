"use client";

import ModalBox from "@/components/ui/Modal/ModalBox";
import { ReactNode, useContext } from "react";
import Button from "@/components/ui/Button";
import { useTranslation } from "../../i18n/client";
import { PlacePost, PlacePostSchema } from "@/lib/api/places";
import { OnboardingModalContext } from "./OnboardingModalContext";
import OnboardingScreenConnect from "./screens/OnboardingScreenConnect";

const placePostKeys = Object.keys(PlacePostSchema.properties) as (keyof PlacePost)[];
const placePostRequiredKeys = PlacePostSchema.required as (keyof PlacePost)[];

function OnboardingModalInside() {
  const ctx = useContext(OnboardingModalContext);
  const { t } = useTranslation("landing/auth");

  const percentDone = (Object.keys(ctx.data ?? {}).filter(x => placePostRequiredKeys.includes(x as keyof PlacePost) && (ctx.data ?? {})[x as keyof PlacePost] !== "").length / placePostRequiredKeys.length * 100);

  return (
    <>
      <div className="flex gap-[8px] items-center mt-[16px]">
        <div className="w-full h-[6px] bg-neutral-500/50 rounded-full relative">
          <div
            className="absolute top-0 bottom-0 left-0 bg-pink rounded-full transition-all"
            style={{
              right: 100 - percentDone + "%",
            }}
          />
        </div>
        <span className="shrink-0 text-[12px] leading-tight">{percentDone.toFixed(0)}% kész</span>
      </div>

      <OnboardingScreenConnect />

      <Button
        palette="secondary"
        size="small"
        action={() => {
          ctx.update({});
        }}
      >
        Tovább
      </Button>
    </>
  );
}

export default function OnboardingModal({
  children,
}: {
  children: ReactNode,
}) {
  return (
    <ModalBox<Partial<PlacePost>>
      context={OnboardingModalContext}
      siblings={children}
      fixed
    >
      <OnboardingModalInside />
    </ModalBox>
  );
}
