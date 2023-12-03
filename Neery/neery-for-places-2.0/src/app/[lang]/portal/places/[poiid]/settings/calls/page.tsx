import { LangProps } from "@/app/[lang]/props";
import { getPlace } from "@/lib/api/places";
import { ConfigFormStateless } from "../../components/Config/ConfigForm";
import { SetupButton } from "./client";
import { loadAndUseTranslation } from "@/app/[lang]/i18n";

export default async function RoboCallSetup({
  params: { poiid, lang },
}: {
  params: { poiid: string };
} & LangProps) {
  const [{ t }, place] = await Promise.all([
    loadAndUseTranslation(lang, "portal/settings/calls"),
    getPlace(poiid),
  ]);

  return (
    <ConfigFormStateless title={t("title")}>
      {place.robocall_number !== undefined ? (
        <p>
          {t("currentPhoneDescription")} {place.robocall_number}
          <br />
          {t("redirectPhoneDescription")} {place.phone}
        </p>
      ) : (
        <SetupButton poiid={poiid} />
      )}
    </ConfigFormStateless>
  );
}
