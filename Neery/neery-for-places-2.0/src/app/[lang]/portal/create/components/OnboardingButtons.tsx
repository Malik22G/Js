"use client";

import { useTranslation } from "@/app/[lang]/i18n/client";
import Button from "@/components/ui/Button";
import { ArrowLeft, Check, X } from "@/components/ui/icons";
import { stages } from "../stages";
import LoadingButton from "@/components/ui/LoadingButton";

export default function OnboardingButtons({
  i,
  next, reset, back,
  valid = true,
}: {
  i: number,
  next(): void,
  reset(): void,
  back(): void,
  valid?: boolean,
}) {
  const { t } = useTranslation("portal/create", { keyPrefix: "buttons" });

  return (
    <div className="flex items-center justify-between mt-8">
      <Button
        palette={i === 0 ? "red" : "tertiary"}
        className="flex gap-[8px] items-center" 
        action={i === 0 ? reset : back}
      >
        {
          i === 0 
            ? <X className="w-[0.6rem] h-[0.6rem]" />
            : <ArrowLeft className="w-[1rem] h-[1rem]" />
        }
        {i === 0 ? t("reset") : t("back")}
      </Button>
      <LoadingButton
        palette="secondary"
        className="flex gap-[8px] items-center"
        action={next}
        disabled={!valid}
      >
        {i === stages.length - 1 ? t("finish") : t("continue")}
        {
          i === stages.length - 1
            ? <Check />
            : <ArrowLeft className="rotate-180 w-[1rem] h-[1rem]" />
        }
      </LoadingButton>
    </div>
  );
}
