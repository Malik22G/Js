import { useRouter } from "next/navigation";

import { useTranslation } from "@/app/[lang]/i18n/client";
import { ReserveScreenProps } from "../..";
import ResultScreen from "../../ResultScreen";
import pending from "./pending.jpg";

export default function ReservePending({
  fullscreen,
  place,
}: ReserveScreenProps) {
  const router = useRouter();
  const { t } = useTranslation("land", { keyPrefix: "reserve.screens.pending" });

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
