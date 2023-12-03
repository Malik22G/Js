import { Check } from "@/components/ui/icons";
import { Place } from "@/lib/api/places";
import { ReactNode } from "react";
import { ReserveScreen } from ".";
import { useTranslation } from "@/app/[lang]/i18n/client";

function ScreenStep({
  status,
  num,
  text,
  onClick,
}: {
  status: "done" | "current" | "upcoming",
  num: number,
  text: string | ReactNode,
  onClick(): any,
}) {
  return (
    <button
      className={`
        ${status === "current" ? `
          bg-primary text-neutral-100
        ` : status === "upcoming" ? `
          bg-primary-light text-primary
        ` : status === "done" ? `
          bg-primary text-neutral-100
        ` : ""}
        h-[24px] w-[24px] shrink-0 rounded-full
        flex items-center justify-center
        font-semibold leading-[0px] text-[14px]
        relative
      `}
      onClick={onClick}
      disabled={status !== "done"}
    >
      {status === "done" ? (
        <Check />
      ) : num}

      <div className={`
        absolute top-[calc(100%+4px)]
        text-neutral-700 leading-[20px] font-medium
      `}>
        {text}
      </div>
    </button>
  );
}

function ScreenSteps<K>({
  screens,
  screen,
  navigate,
}: {
  screens: [K, string | ReactNode][],
  screen: K,
  navigate(screen: K): any,
}) {
  const currentI = screens.findIndex(x => x[0] === screen);

  return (
    <div className={`
      w-full
      flex items-center justify-center
      mb-[24px]
    `}>
      {screens.flatMap((x, i) => [
        (
          <ScreenStep
            key={i}
            status={i < currentI ? "done" : i === currentI ? "current" : "upcoming"}
            num={i + 1}
            text={x[1]}
            onClick={() => navigate(x[0])}
          />
        ),
        i !== screens.length - 1 ? (
          <div key={i + "_line"} className="w-[15%] border-t border-primary" />
        ) : null,
      ])}
    </div>
  );
}

export default function ReserveHeader({
  place,
  screen,
  navigate,
}: {
  place: Place,
  screen: ReserveScreen,
  navigate(screen: ReserveScreen): any,
}) {
  const { t } = useTranslation("land", { keyPrefix: "reserve.header" });

  return (
    <div className={`
      font-work
      text-center
      flex flex-col gap-[24px] items-center justify-center
    `}>
      <div className="font-sans">
        <h1 className="font-bold text-[24px]">{place.name}</h1>
        <h2 className="font-semibold text-[18px]">{t("reservation")}</h2>
      </div>
      <ScreenSteps
        screens={[
          ["date", t("date") as string],
          ["info", t("info") as string],
        ]}
        screen={screen}
        navigate={navigate}
      />
    </div>
  );
}
