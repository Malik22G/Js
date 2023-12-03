import { useTranslation } from "@/app/[lang]/i18n/client";
import { StageProps, stages } from ".";
import OnboardingBox from "../components/OnboardingBox";
import OnboardingButtons from "../components/OnboardingButtons";
import { OnboardingInputRow, OnboardingSectionTitle, OnboardingInput as Input } from "../components/OnboardingUtils";
import OnboardingInfoBar from "../components/OnboardingInfoBar";

export default function StageUseful1({ data, setData, next, back, reset }: StageProps) {
  const { t } = useTranslation("portal/create/useful1");

  return (
    <>
      <OnboardingInfoBar
        title={t("title")}
        blurb={t("blurb")}
      />
      <OnboardingBox>
        <OnboardingSectionTitle>{t("contactInfo")}</OnboardingSectionTitle>
        <OnboardingInputRow>
          <Input
            label={t("placeEmail")}
            type="email"
            placeholder={t("placeEmail_ph")}
            autoComplete="email"
            value={data.placeEmail ?? ""}
            onChange={e => setData({ placeEmail: e.target.value })}
            required
          />
          <Input
            label={t("placePhone")}
            type="tel"
            placeholder={t("placePhone_ph")}
            autoComplete="phone"
            value={data.placePhone ?? ""}
            onChange={e => setData({ placePhone: e.target.value })}
            required
          />
        </OnboardingInputRow>
        <OnboardingInputRow>
          <Input
            label={t("placeFacebook")}
            type="url"
            placeholder={t("placeFacebook_ph")}
            value={data.placeFacebook ?? ""}
            onChange={e => setData({ placeFacebook: e.target.value })}
          />
        </OnboardingInputRow>
        <OnboardingInputRow>
          <Input
            label={t("placeWebsite")}
            placeholder={t("placeWebsite_ph")}
            value={data.placeWebsite ?? ""}
            onChange={e => setData({ placeWebsite: e.target.value })}
          />
          <Input
            label={t("placeInstagram")}
            placeholder={t("placeInstagram_ph")}
            value={data.placeInstagram ?? ""}
            onChange={e => setData({ placeInstagram: e.target.value })}
          />
        </OnboardingInputRow>
        <OnboardingButtons
          next={next}
          back={back}
          reset={reset}
          i={stages.indexOf("useful1")}
        />
      </OnboardingBox>
    </>
  );
}
