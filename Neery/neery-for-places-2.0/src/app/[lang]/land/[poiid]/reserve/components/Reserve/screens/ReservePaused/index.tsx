import { useTranslation } from "@/app/[lang]/i18n/client";
import ResultScreen from "../../ResultScreen";
import pending from "../ReservePending/pending.jpg";
import { ReserveScreenProps } from "../..";
import { useRouter } from "next/navigation";

export default function ReservePaused({
  fullscreen,
  place,
}: ReserveScreenProps) {
  const router = useRouter();
  const { t } = useTranslation("land", { keyPrefix: "reserve.screens.paused" });

  return (
    <ResultScreen
      image={pending}
      imageAlt={t("alt")}
      title={t("title")}
      text={t("text")}
      showButton={fullscreen}
      button={t("button")}
      action={() => router.push(`/land/${place.poiid}/`)}
    />
  );
}
