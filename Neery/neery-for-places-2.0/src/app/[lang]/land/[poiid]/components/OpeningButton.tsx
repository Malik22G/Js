import { i18n } from "i18next";

import { Place } from "@/lib/api/places";
import { Min, osm2wme } from "@/lib/wme";

export default function OpeningButton({
  i18n,
  place,
  className,
  children,
}: {
  i18n: i18n,
  place: Place,
  className: string,
  children?: React.ReactNode,
}) {
  const weekdays = new Array(7).fill(0).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay() + i);
    return d.toLocaleDateString(i18n.language, { weekday: "long" });
  });

  const wme = osm2wme(place.opening ?? "");

  const spans = new Array(7).fill(0).map((_, d) => {
    const spans = wme.filter(x => x[0] >= d * 24 * 60 && x[0] < (d + 1) * 24 * 60);
    return {
      day: weekdays[d === 6 ? 0 : d + 1],
      spans,
    };
  });

  return (
    <button
      className={`
        ${className}
        group relative
      `}
      tabIndex={0}
    >
      {children}

      <div className={`
        absolute top-[24px] left-[-100vw] right-0
        text-neutral-600 font-normal
        pointer-events-none
        flex justify-end
        opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity
      `}>
        <div
          className={`
            rounded-lg shadow-md bg-neutral-100
            z-50
            border border-neutral-200 rounded-[8px]
            px-[10px] py-[8px]
            pointer-events-auto select-text cursor-text
            text-left
            hidden group-hover:flex group-focus:flex gap-[16px]
            shadow-1
          `}
        >
          <div className="shrink-0 flex flex-col">
            {spans.map(span => (<span key={span.day}>{span.day}</span>))}
          </div>
          <div className="grow flex flex-col">
            {spans.map(span => {
              if (span.spans.length === 0) {
                return (
                  <span key={span.day} className="font-bold text-red">
                    Zárva
                  </span>
                );
              } else {
                return (
                  <span key={span.day} className="font-bold">
                    {span.spans.map(span => (
                      `${
                        Min.toDate(span[0])
                          .toLocaleString(i18n.language, {hour: "2-digit", minute: "2-digit"})
                      }-${
                        Min.toDate(span[1] + 1)
                          .toLocaleString(i18n.language, {hour: "2-digit", minute: "2-digit"})
                      }`
                    )).join(", ")}
                  </span>
                );
              }
            })}
          </div>
        </div>
      </div>
    </button>
  );
}
