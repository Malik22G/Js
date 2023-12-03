import { useTranslation } from "@/app/[lang]/i18n/client";
import { StageProps, stages } from ".";
import OnboardingBox from "../components/OnboardingBox";
import OnboardingButtons from "../components/OnboardingButtons";
import { OnboardingInputRow, OnboardingSectionTitle } from "../components/OnboardingUtils";
import OnboardingInfoBar from "../components/OnboardingInfoBar";
import Labelled from "@/components/ui/Labelled";
import SpanPicker from "@/components/ui/SpanPicker";
import { useEffect, useState } from "react";

export default function StageUseful2({ data, setData, next, back, reset }: StageProps) {
  const { t } = useTranslation("portal/create/useful2");

  const [opening, setOpening] = useState<[number | null, number | null][]>(data.opening);

  useEffect(() => {
    setOpening(data.opening);
  }, [data.opening]);

  return (
    <>
      <OnboardingInfoBar
        title={t("title")}
        blurb={t("blurb")}
      />
      <OnboardingBox>
        <OnboardingSectionTitle>{t("metadata")}</OnboardingSectionTitle>
        <OnboardingInputRow>
          <Labelled
            label={t("openHours")}
          >
            <SpanPicker
              spans={opening}
              update={opening => {
                setOpening(opening);
                
                if (opening.every(x => x.every(x => x !== null))) {
                  setData({ opening: opening as [number, number][] });
                }
              }}
              className="w-full"
            />
          </Labelled>
        </OnboardingInputRow>
        <OnboardingButtons
          next={next}
          back={back}
          reset={reset}
          // i={stages.indexOf("useful2")}
          i={2}
        />
      </OnboardingBox>
    </>
  );
}
