import { useTranslation } from "@/app/[lang]/i18n/client";
import { ReserveScreenProps } from "../..";
import ResultScreen from "../../ResultScreen";
import error from "./error.jpg";

export default function ReserveError({
  navigate,
}: ReserveScreenProps) {
  const { t } = useTranslation("land", { keyPrefix: "reserve.screens.error" });

  return (
    <ResultScreen
      image={error}
      imageAlt={t("alt")}
      title={t("title")}
      text={t("text")}
      showButton={true}
      button={t("button")}
      action={() => navigate("date")}
    />
  );
}
