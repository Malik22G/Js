import Select from "@/components/ui/Select";
import { InputContainer, InputLabel, useDateDate } from "./kit";
import { useTranslation } from "@/app/[lang]/i18n/client";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { m, y, ym } from "@/lib/ym";
import { Place } from "@/lib/api/places";
import { getPossiblePicks } from "@/lib/wme";

function getMonths(place: Place, mrd?: number) {
  const now = new Date();
  const max = new Date(now);
  max.setDate(max.getDate() + (mrd ?? place.max_reservation_distance));

  const nym = ym(now);
  const mym = ym(max);

  return new Array(mym - nym + 1)
    .fill(0)
    .map(
      (_, i) =>
        new Date(
          y(nym + i),
          m(nym + i),

          // If current month, use today. If not, start from the 1st.
          i === 0 ? now.getDate() : 1,

          // HACK: Using minute: 1 to avoid pre-selecting a time.
          // Because noone could ever use granularity: 1, I guess. -MG
          0,
          1,
          0,
          0
        )
    )
    .filter((x) => getDays(x, place).length > 0);
}

function getDays(dateDate: Date | null, place: Place, mrd?: number) {
  const month = dateDate?.getMonth();

  const now = new Date();

  const nowZero = new Date(now);
  nowZero.setHours(0, 1, 0, 0);

  const max = new Date(nowZero);
  max.setDate(max.getDate() + (mrd ?? place.max_reservation_distance));

  const d = new Date(dateDate ?? nowZero);

  // If d is the current month, remove past days.
  if (ym(d) === ym(nowZero)) {
    d.setDate(nowZero.getDate());
  } else {
    d.setDate(1);
  }

  d.setHours(0, 0, 0, 0);

  const days = [] as Date[];
  for (
    ;
    d.getMonth() === month &&
    // Don't go over the max reservation distance.
    (ym(d) !== ym(max) || d.getDate() <= max.getDate());
    d.setDate(d.getDate() + 1)
  ) {
    // Get open time picks of place on date
    let picks = getPossiblePicks(place, d, false, true, true);
    // If date is today, filter picks to the future
    if (d.toDateString() === nowZero.toDateString()) {
      picks = picks
        .filter((x) => (x[0] as number) >= now.getHours())
        .map((x) =>
          x[0] === now.getHours()
            ? [x[0], (x[1] as number[]).filter((x) => x >= now.getMinutes())]
            : x
        );
    }

    // Only add to days if place is open that day
    if (picks.length > 0) {
      days.push(new Date(d));
    }
  }

  return days;
}

export default function InputDate({
  place,
  count,
  date,
  setDate,
  setDateValid,
  mrd,
}: {
  place: Place;
  count: number;
  date: Date | null;
  setDate(date: Date | null): void;
  setDateValid: Dispatch<SetStateAction<boolean>>;
  mrd?: number;
}) {
  const { i18n, t: genT } = useTranslation("translation");
  const { t } = useTranslation("land", { keyPrefix: "reserve.inputs.date" });

  const dateDate = useDateDate(date);
  const [months, setMonths] = useState<Date[]>([]);
  const [days, setDays] = useState<Date[]>([]);
  const scrollableElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const months = getMonths(place, mrd);

    setMonths(months);
    setDate(
      date === null ? getDays(months[0] ?? null, place, mrd)[0] ?? null : date
    );
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [place]);
  /* eslint-enable react-hooks/exhaustive-deps */

  useEffect(() => {
    const days = getDays(dateDate, place, mrd);

    setDays(days);
  }, [dateDate, months, place]);

  useEffect(() => {
    const currentDay = days.findIndex(
      (x) => x.toDateString() === dateDate?.toDateString()
    );
    setDateValid(dateDate !== null && currentDay >= 0);
    scrollableElement.current &&
      scrollableElement.current?.scrollTo({ left: currentDay * 52 - 52 * 2 });
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [dateDate, days]);
  /* eslint-enable react-hooks/exhaustive-deps */
  return (
    <InputContainer
      className={`
      flex flex-col gap-[24px] px-0
      ${count === 0 ? "hidden" : ""}
    `}
    >
      <div className="flex justify-between items-center px-[12px]">
        <InputLabel>{t("title")}</InputLabel>

        <Select
          values={months.map((d) => [
            ym(d),
            d.toLocaleDateString(i18n.language, {
              year: "numeric",
              month: "long",
            }),
          ])}
          value={date ? ym(date) : 0}
          setValue={(date) =>
            setDate(
              getDays(
                months.find((x) => ym(x) === date) ?? null,
                place,
                mrd
              )[0] ?? null
            )
          }
        />
      </div>

      <div
        role="radiogroup"
        className="flex overflow-x-scroll scrollbar-hidden gap-[6px]"
        ref={scrollableElement}
      >
        {days.map((day) => (
          <button
            role="radio"
            key={day.toDateString()}
            aria-checked={day.toDateString() === date?.toDateString()}
            className={`
              flex flex-col items-center justify-evenly
              h-[64px] w-[46px] shrink-0
              rounded-[12px]

              text-neutral-600 bg-neutral-100
              transition-colors
              hover:bg-primary-xlight
              aria-checked:bg-primary aria-checked:text-neutral-100
              disabled:bg-neutral-200 disabled:text-neutral-500
              aria-disabled:bg-neutral-200 aria-disabled:text-neutral-500

              first:ml-[12px] last:mr-[12px]
            `}
            onClick={() => setDate(day)}
          >
            <span>{genT(("daysShort." + day.getDay()) as any)}</span>
            <span>{day.getDate()}</span>
          </button>
        ))}
      </div>
    </InputContainer>
  );
}
