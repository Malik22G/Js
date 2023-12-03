import Segment from "@/components/ui/Segment";
import { InputContainer, InputLabel, useDateDate } from "./kit";
import { Period, Place, getPeriods } from "@/lib/api/places";
import { TimeOfDay } from "../..";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "@/app/[lang]/i18n/client";
import { Skull, Loader, InfoCircle, X } from "@/components/ui/icons";
import { useSearchParams } from "next/navigation";
import IconButton from "@/components/ui/IconButton";

const todFilter: Record<TimeOfDay, (period: { hour: number }) => boolean> = {
  morning: (period) => {
    return period.hour < 12;
  },
  afternoon: (period) => {
    return period.hour >= 12 && period.hour < 18;
  },
  night: (period) => {
    return period.hour >= 18;
  },
};

const tods: TimeOfDay[] = ["morning", "afternoon", "night"];

function TimeGrid({
  date,
  setDate,
  periods,
  timeOfDay,
  fullscreen,
  force,
  setShowComment,
}: {
  date: Date | null;
  setDate(date: Date | null): void;
  periods: Period[];
  timeOfDay: TimeOfDay;
  fullscreen: boolean;
  force?: boolean;
  setShowComment: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const { i18n } = useTranslation("land");

  return (
    <div
      role="radiogroup"
      className={`
      grid gap-x-[10px] gap-y-[14px]
      grid-cols-4
      ${fullscreen ? "lg:grid-cols-8" : ""}
    `}
    >
      {periods.filter(todFilter[timeOfDay]).map((period) => {
        const d = new Date(date ?? 0);
        d.setHours(period.hour, period.minute, 0, 0);

        return (
          <div
            key={d.valueOf()}
            className="relative flex items-center justify-center"
          >
            {!force && period.comment && (
              <IconButton
                icon={InfoCircle}
                className="absolute top-[-16px] right-[-10px] h-[30px] w-[30px]"
                onClick={() => setShowComment(period.comment)}
              />
            )}
            <button
              role="radio"
              className={`
              h-[36px]
              rounded-[8px] border border-neutral-300
              p-[8px]
              flex-1
              flex items-center justify-center
              text-primary
              transition-colors
              hover:bg-primary-xlight
              aria-checked:bg-primary aria-checked:border-primary aria-checked:text-neutral-100
              disabled:bg-neutral-300 disabled:text-neutral-500
            `}
              disabled={!(force || period.free)}
              aria-checked={
                (force || period.free) && date?.valueOf() === d.valueOf()
              }
              onClick={() => setDate(d)}
            >
              {d.toLocaleTimeString(i18n.language, {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false, // TODO: 12-hour doesn't fit with AM/PM. :(
              })}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default function InputTime({
  place,
  count,
  date,
  setDate,
  dateValid,
  setTimeValid,
  fullscreen,
  force,
  mrd,
}: {
  place: Place;
  count: number;
  date: Date | null;
  setDate(date: Date | null): void;
  dateValid: boolean;
  setTimeValid: Dispatch<SetStateAction<boolean>>;
  fullscreen: boolean;
  force?: boolean;
  mrd?: number;
}) {
  const { t } = useTranslation("land", { keyPrefix: "reserve.inputs.time" });
  const params = useSearchParams();

  const [periods, setPeriods] = useState<Period[]>([]);
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");
  const dateDate = useDateDate(date);

  const [timeOfDay, setTimeOfDay] = useState(tods[0]);
  const [showComment, setShowComment] = useState<string | null>(null);

  useEffect(() => {
    if (dateDate === null) {
      setPeriods([]);
      setStatus("done");

      return;
    }

    setStatus("loading");

    (async () => {
      let periods = await getPeriods(place, {
        date: dateDate,
        count: count,
        mrd: mrd,
      });

      const lunchDuration = params.get("hours");

      if (lunchDuration) {
        const [start, end] = lunchDuration.split("-");

        const [startHour, startMin] = [
          Number(start.substring(0, 2)),
          Number(start.substring(2, 4)),
        ];
        const [endHour, endMin] = [
          Number(end.substring(0, 2)),
          Number(end.substring(2, 4)),
        ];

        periods = periods.filter((period) => {
          const { hour, minute } = period;
          const isLaterThanStart =
            hour > startHour || (hour === startHour && minute >= startMin);
          // Added -1 to endHour to not allow reservations for lunch menu that ends for example at 13:00 to 13:00
          const isEarlierThanEnd =
            hour < endHour - 1 || (hour === endHour - 1 && minute <= endMin);

          return isLaterThanStart && isEarlierThanEnd;
        });
      }

      setPeriods(periods);
      setTimeOfDay(
        periods.length > 0
          ? tods.find((x) => todFilter[x](periods[0])) ?? "morning"
          : "morning"
      );
      setStatus("done");
    })();
  }, [place, dateDate, count]);

  useEffect(() => {
    setTimeValid(
      date !== null &&
        !!periods.find(
          (period) =>
            period.hour === date?.getHours() &&
            period.minute === date?.getMinutes() &&
            (force || period.free)
        ) &&
        date.getSeconds() === 0 &&
        date.getMilliseconds() === 0
    );
  }, [periods, date, setTimeValid]);

  return (
    <InputContainer
      className={`
      flex flex-col gap-[24px]
      ${count === 0 || !dateValid ? "hidden" : ""}
    `}
    >
      <div className="flex justify-between items-center">
        <InputLabel>{t("title")}</InputLabel>

        <Segment
          values={tods
            .filter((tod) => !!periods.find(todFilter[tod]))
            .map((tod) => [tod, t(("timesOfDay." + tod) as any)])}
          value={timeOfDay}
          setValue={(val) => setTimeOfDay(val as TimeOfDay)}
        />
      </div>
      {showComment && (
        <div className="flex flex-row items-center justify-center bg-primary-light p-2 rounded-lg relative">
          <InfoCircle className="text-primary" />
          <div className="ml-1 text-primary">{showComment}</div>
          <IconButton
            className="absolute right-3 text-primary"
            icon={X}
            onClick={() => setShowComment(null)}
          />
        </div>
      )}
      {status === "done" ? (
        <TimeGrid
          date={date}
          setDate={setDate}
          periods={periods}
          timeOfDay={timeOfDay}
          fullscreen={fullscreen}
          setShowComment={setShowComment}
          force={force}
        />
      ) : status === "loading" ? (
        <div className="h-[128px] flex items-center justify-center">
          <Loader className="text-primary" />
        </div>
      ) : (
        <div className="h-[128px] w-full flex flex-col items-center justify-center gap-[8px] text-center">
          <Skull />
          <span className="mb-[16px]">{t("somethingWentWrong" as any)}</span>
        </div>
      )}
    </InputContainer>
  );
}
