import { useRouter } from "next/navigation";

import { useTranslation } from "@/app/[lang]/i18n/client";
import { ReserveScreenProps } from "../..";
import ResultScreen from "../../ResultScreen";
import accepted from "./accepted.jpg";

export default function ReserveAccepted({
  fullscreen,
  place,
}: ReserveScreenProps) {
  const router = useRouter();
  const { t } = useTranslation("land", { keyPrefix: "reserve.screens.accepted" });

  return (
    <ResultScreen
      image={accepted}
      imageAlt={t("alt")}
      title={t("title")}
      text={t("text")}
      showButton={fullscreen}
      button={t("button")}
      action={() => router.push(`/land/${place.poiid}/`)}
    />
  );
}
