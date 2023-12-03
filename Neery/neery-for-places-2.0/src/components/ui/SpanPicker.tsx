"use client";

import { Min } from "@/lib/wme";
import { Plus, X } from "./icons";
import Select from "./Select";
import { useEffect, useState } from "react";
import { useTranslation } from "@/app/[lang]/i18n/client";

function SpanPickerCol({
  time,
  update,
  ending,
}: {
  time: number | null,
  update(time: number | null): void,
  ending: boolean,
}) {
  const nEnding = ending ? 1 : 0;
  const [day, setDay] = useState<number | null>(time !== null ? Min.getDay(time + nEnding) : null);
  const [hours, setHours] = useState<number | null>(time !== null ? Min.getHours(time + nEnding) : null);
  const [minutes, setMinutes] = useState<number | null>(time !== null ? Min.getMinutes(time + nEnding) : null);
  const { t } = useTranslation("portal/settings/profile");

  useEffect(() => {
    setDay(time !== null ? Min.getDay(time + nEnding) : null);
    setHours(time !== null ? Min.getHours(time + nEnding) : null);
    setMinutes(time !== null ? Min.getMinutes(time + nEnding) : null);
  }, [time, nEnding]);

  return (
    <div className="flex gap-4">
      <Select<number | null>
        values={[
          [0, t("monday")],
          [1, t("tuesday")],
          [2, t("wednesday")],
          [3, t("thursday")],
          [4, t("friday")],
          [5, t("saturday")],
          [6, t("sunday")],
        ]}
        value={day}
        setValue={day => {
          if (day !== null && hours !== null && minutes !== null) {
            update(Min.fromParams(day, hours, minutes - nEnding));
          } else {
            setDay(day);
          }
        }}
      />
      <input
        type="time"
        value={hours !== null && minutes !== null ? `${
          hours
            .toString()
            .padStart(2, "0")
        }:${
          minutes
            .toString()
            .padStart(2, "0")
        }` : ""}
        onChange={e => {
          let tok = e.target.value.split(":");
          if (tok.length !== 2) {
            tok = ["00", "00"];
          }

          const [hours, minutes] = tok.map(x => parseInt(x, 10));
          if (day !== null) {
            update(Min.fromParams(day, hours, minutes - nEnding));
          } else {
            setHours(hours);
            setMinutes(minutes);
          }
        }}
      />
    </div>
  );
}

function SpanPickerRow({
  span,
  update,
  remove,
}: {
  span: [number | null, number | null],
  update(span: [number | null, number | null]): void,
  remove(): void,
}) {
  return (
    <>
      <button
        className="flex items-center justify-center text-red"
        onClick={remove}
      >
        <X className="w-[0.6rem] h-[0.6rem]" />
      </button>
      {span.map((time, i) => (
        <SpanPickerCol
          key={i}
          time={time}
          ending={i === 1}
          update={time => {
            const nuSpan: [number | null, number | null] = [...span];
            nuSpan[i] = time;
            update(nuSpan);
          }}
        />
      ))}
    </>
  );
}

export default function SpanPicker({
  spans,
  update,
  className,
} : {
  spans: [number | null, number | null][],
  update(spans: [number | null, number | null][]): void,
  className?: string,
}) {
  const { t } = useTranslation("portal/settings/profile");

  return (
    <div
      className={`
        grid gap-x-4 gap-y-2 w-fit
        ${className ?? ""}
      `}
      style={{
        gridTemplateColumns: "1rem minmax(0, 1fr) minmax(0, 1fr)",
      }}
    >
      <div>
        &nbsp;
      </div>
      <span className="font-medium">{t("spanStart")}</span>
      <span className="font-medium">{t("spanEnd")}</span>
      
      {spans.map((span, i) => (
        <SpanPickerRow
          key={i}
          span={span}
          update={span => {
            const nuSpans = [...spans];
            nuSpans[i] = span;
            update(nuSpans);
          }}
          remove={() => {
            const nuSpans = [...spans];
            nuSpans.splice(i, 1);
            update(nuSpans);
          }}
        />
      ))}

      <button
        className="flex items-center justify-center"
        onClick={() => {
          update([...spans, [null, null]]);
        }}
      >
        <Plus className="w-[0.6rem] h-[0.6rem] text-green" />
      </button>
    </div>
  );
}
