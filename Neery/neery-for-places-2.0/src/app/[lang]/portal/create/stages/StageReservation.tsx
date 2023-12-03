import { useTranslation } from "@/app/[lang]/i18n/client";
import { StageProps, stages } from ".";
import OnboardingBox from "../components/OnboardingBox";
import OnboardingButtons from "../components/OnboardingButtons";
import { OnboardingInputRow, OnboardingSectionTitle, OnboardingInput as Input } from "../components/OnboardingUtils";
import OnboardingInfoBar from "../components/OnboardingInfoBar";
import Select from "@/components/ui/Select";
import Labelled from "@/components/ui/Labelled";

export default function StageReservation({ data, setData, next, back, reset, valid }: StageProps) {
  const { t } = useTranslation("portal/create/reservation");

  return (
    <>
      <OnboardingInfoBar
        title={t("title")}
        blurb={t("blurb")}
      />
      <OnboardingBox>
        <OnboardingSectionTitle>{t("notifications")}</OnboardingSectionTitle>
        <OnboardingInputRow>
          <Input
            label={t("notificationEmail")}
            type="email"
            placeholder={t("notificationEmail_ph")}
            autoComplete="email"
            value={data.notificationEmail ?? ""}
            onChange={e => setData({ notificationEmail: e.target.value })}
            required
          />
        </OnboardingInputRow>
        <OnboardingSectionTitle>{t("rules")}</OnboardingSectionTitle>
        <OnboardingInputRow>
          <Input
            label={t("granularity")}
            type="number"
            placeholder="15"
            min="15"
            step="15"
            max="180"
            value={data.granularity ?? ""}
            onChange={e => setData({ granularity: parseInt(e.target.value, 10) || undefined })}
            required
          />
          <Input
            label={t("deadline")}
            type="number"
            placeholder="60"
            min="15"
            step="15"
            value={data.deadline ?? ""}
            onChange={e => setData({ deadline: parseInt(e.target.value, 10) || undefined })}
            required
          />
        </OnboardingInputRow>
        <OnboardingInputRow>
          <Input
            label={t("maxCount")}
            type="number"
            placeholder="10"
            min="1"
            step="1"
            value={data.maxCount ?? ""}
            onChange={e => setData({ maxCount: parseInt(e.target.value, 10) || undefined })}
            required
          />
          <Input
            label={t("maxDistance")}
            type="number"
            placeholder="60"
            min="1"
            step="1"
            value={data.maxDistance ?? ""}
            onChange={e => setData({ maxDistance: parseInt(e.target.value, 10) || undefined })}
            required
          />
        </OnboardingInputRow>
        <OnboardingInputRow>
          <Input
            label={t("defaultLength")}
            type="number"
            placeholder="120"
            min={data.granularity || 15}
            step={data.granularity || 15}
            value={data.defaultLength ?? ""}
            onChange={e => setData({ defaultLength: parseInt(e.target.value, 10) || undefined })}
            required
          />
        </OnboardingInputRow>
        <OnboardingInputRow>
          <Labelled
            label={t("autotable")}
          >
            <Select<number>
              value={data.autotable}
              values={[
                [0, t("autotable_manual")],
                [1, t("autotable_fullauto")],
              ]}
              setValue={autotable => setData({ autotable })}
            />
          </Labelled>
        </OnboardingInputRow>
        <OnboardingButtons
          valid={valid}
          next={next}
          back={back}
          reset={reset}
          i={stages.indexOf("reservation")}
        />
      </OnboardingBox>
    </>
  );
}
