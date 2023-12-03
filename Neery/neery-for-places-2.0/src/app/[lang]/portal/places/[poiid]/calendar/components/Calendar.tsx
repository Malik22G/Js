"use client";

import React, {
  MouseEvent,
  SetStateAction,
  TouchEvent,
  UIEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { Place } from "@/lib/api/places";
import {
  Reservation,
  date2ndt,
  updateReservation,
} from "@/lib/api/reservations";
import { Zone } from "@/lib/api/zones";
import LoaderScreen from "./LoaderScreen";
import { Min, getPossiblePicks, osm2wme } from "@/lib/wme";
import {
  Comment,
  GuestArrived,
  InfoCircle,
  List,
  PenPaper,
  /* Percent, */ Person,
  Repeat,
  Utensils,
  WheatAllergy,
} from "@/components/ui/icons";
import IconButton from "@/components/ui/IconButton";
import { ReservationModalContext } from "../../components/ReservationModal";
import { ClosedEvent } from "@/lib/api/closedevents";
import { ClosedEventModalContext, closedEventToData } from "./ClosedEventModal";
import { Customer } from "@/lib/api/customers";
import { ReservationConfirmModalContext } from "../../components/ReservationConfirmModal";
import { useTranslation } from "@/app/[lang]/i18n/client";
import Button from "@/components/ui/Button";

const scrollFactor = 10;

function ReservationCardIconWithText({
  thick,
  narrow,
  value,
  icon,
  link,
  valueStyle,
  iconStyle,
}: {
  thick?: boolean;
  narrow?: boolean;
  value?: string | number;
  icon?: React.FC<{ className: string }>;
  link?: string;
  valueStyle?: string;
  iconStyle?: string;
}) {
  const valueClass = icon !== undefined ? "w-[calc(100%-1.25rem)]" : "w-full";

  return value !== undefined ? (
    <div
      className={`
        leading-compact
        flex items-center ${narrow ? "gap-[4px]" : "gap-[8px]"}
        ${thick ? "font-medium" : ""}
      `}
    >
      {icon !== undefined
        ? React.createElement(icon, {
            className: `h-[0.75rem] w-[0.75rem] shrink-0 ${iconStyle}`,
          })
        : null}
      {link !== undefined ? (
        <a className={valueClass} href={link}>
          {value}
        </a>
      ) : (
        <span className={`${valueClass} ${valueStyle}`}>{value}</span>
      )}
    </div>
  ) : null;
}

function ReservationCardIcon({
  icon,
  link,
  className,
}: {
  icon?: React.FC<{ className: string }>;
  link?: string;
  className?: string;
}) {
  return (
    <div className="flex items-center h-fit">
      {icon !== undefined ? (
        link !== undefined ? (
          <a href={link}>
            {React.createElement(icon, {
              className: `h-[1rem] w-[1rem] ${className}`,
            })}
          </a>
        ) : (
          React.createElement(icon, {
            className: `h-[1rem] w-[1rem] ${className}`,
          })
        )
      ) : null}
    </div>
  );
}

function ReservationCard({
  reservation: res,
  zone,
  customer,
  className,
  onUpdate,
}: {
  reservation: Reservation;
  zone: Zone;
  customer?: Customer;
  className?: string;
  onUpdate(): any;
}) {
  const resCtx = useContext(ReservationModalContext);

  return (
    <div
      className={`
        w-[calc(100%-16px)] h-[calc(100%-16px)]
        rounded-[8px] py-[8px]
        bg-neutral-100 shadow-1
        relative
        
        font-work text-[14px]
        flex flex-col 
        overflow-scroll scrollbar-hidden
        select-none

        calendar-reservation
        ${className ?? ""}
      `}
      data-id={res.uuid}
      data-zone={zone.uuid}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col px-[8px]">
        {(res.endDate || res.date) - res.date > 30 * 60 ? (
          <div className="flex gap-1">
            <ReservationCardIconWithText value={res.name} thick />
          </div>
        ) : null}

        {(res.endDate || res.date) - res.date > 1.5 * 60 * 60 ? (
          <>
            <div className="flex mx-4 mt-4 justify-center">
              <ReservationCardIconWithText
                icon={Person}
                thick
                value={res.count}
                iconStyle="h-[1rem] w-[1rem] text-primary"
                valueStyle="text-lg text-primary"
              />
            </div>
            <div className="flex flex-col gap-3 mt-4">
              <div className="grid grid-cols-3 place-items-center">
                <ReservationCardIcon
                  icon={WheatAllergy}
                  className={res.allergens.length ? "" : "text-neutral-200"}
                />
                <ReservationCardIcon
                  icon={List}
                  className={res.services.length ? "" : "text-neutral-200"}
                />
                <ReservationCardIcon
                  icon={Comment}
                  className={
                    res.comment.length ||
                    (res.place_note !== undefined && res.place_note.length > 0)
                      ? ""
                      : "text-neutral-200"
                  }
                />
              </div>
              <div className="grid grid-cols-3 place-items-center">
                {/* <ReservationCardIconWithText icon={Percent} value={"10"} thick narrow valueStyle="text-primary" iconStyle="text-primary h-[1rem] w-[1rem]" /> */}

                <ReservationCardIcon
                  icon={Utensils}
                  className={res.is_lunch ? "" : "text-neutral-200"}
                />
                <ReservationCardIconWithText
                  icon={Repeat}
                  value={customer?.visits ?? 1}
                  thick
                  narrow
                  valueStyle={
                    (customer?.visits ?? 0) > 1
                      ? "text-green"
                      : "text-neutral-200"
                  }
                  iconStyle={`
                    ${
                      (customer?.visits ?? 0) > 1
                        ? "text-green"
                        : "text-neutral-200"
                    }
                    h-[1rem] w-[1rem]
                  `}
                />

                <ReservationCardIcon
                  icon={PenPaper}
                  className={
                    customer?.comment !== undefined ? "" : "text-neutral-200"
                  }
                />
              </div>
            </div>
          </>
        ) : null}

        <div className="absolute left-0 right-0 bottom-[20px] flex justify-evenly pointer-events-none">
          <IconButton
            icon={InfoCircle}
            className="pointer-events-auto"
            iconClass="w-[0.8rem] h-[0.8rem]"
            action={() => resCtx.update(res)}
          />
          {/* <IconButton
            icon={GuestLeft}
            className="pointer-events-auto"
            iconClass="w-[0.8rem] h-[0.8rem]"
            action={() => {
              let now = new Date();
              if (now.valueOf() / 1000 < res.date) return;

              updateReservation(res.poiid, res.uuid, {
                endDate: date2ndt(now),
              })
                .then(onUpdate);
            }}
          /> */}
        </div>
      </div>
      <div className="grow cursor-grab"></div>
      <div
        className={`
          absolute left-0 right-0 bottom-0 h-[16px]
          bg-primary rounded-b-[8px]
          cursor-ns-resize
          calendar-scale-grip
        `}
      ></div>
    </div>
  );
}

function ZoneCell({ zone, span }: { zone: Zone; span: number }) {
  // let zoneCtx = useContext(ZoneModalContext);
  // let delCtx = useContext(ZoneDeleteModalContext);

  return (
    <div
      key={zone.uuid}
      className={`
        flex items-center justify-center
        bg-neutral-100 border-b border-r border-neutral-300
      `}
      style={{
        gridColumn: new Array(2).fill(`span ${span}`).join(" / "),
      }}
    >
      <div className="grow flex flex-col items-center justify-center">
        <span className="font-medium">{zone.name}</span>
        <span className="flex items-center gap-2">
          <Person />
          {zone.count}
        </span>
      </div>
      {/* <div className="shrink-0 flex flex-col items-center justify-evenly h-full">
        <IconButton
          icon={Pen}
          iconClass="w-[0.7rem] h-[0.7rem]"
          action={() => zoneCtx.update(zoneToData(zone))}
        />

        <IconButton
          icon={X}
          className="mx-[8px]"
          iconClass="w-[0.7rem] h-[0.7rem]"
          palette="red"

          action={() => delCtx.update(zone)}
        />
      </div> */}
    </div>
  );
}

let lastX = 0,
  lastY = 0;

export default function Calendar({
  place,
  zones,
  events,
  customers,
  date,
  dateDir,
  setDate,
  reservations,
  saveReservations,
}: {
  place: Place;
  zones: Zone[];
  events: ClosedEvent[];
  customers: Customer[];
  date: Date;
  dateDir: number;
  setDate(date: Date): void;
  reservations: Reservation[] | null;
  saveReservations: (poiid: string, date?: Date) => Promise<any>;
}) {
  const [op, setOp] = useState<{
    mode: "scale" | "move";
    res: Reservation;
    grabbedZone: number;
    yOffset: number;
    locked?: boolean;
  } | null>(null);
  const grid = useRef<HTMLDivElement>(null);
  const eventCtx = useContext(ClosedEventModalContext);
  let cfmCtx = useContext(ReservationConfirmModalContext);

  const { t } = useTranslation("portal/calendar");
  const picks: [number, number][] = getPossiblePicks(
    place,
    date,
    false,
    false
  ).flatMap((x) => x[1].map((y) => [x[0], y])) as [number, number][];

  if (picks.length === 0) {
    setDate(new Date(new Date(date).setDate(date.getDate() + dateDir)));
    return null;
  }

  if (reservations === null) {
    return <LoaderScreen />;
  }

  const sortedZones = [...zones].sort((a, b) => {
    return (
      reservations.filter((x) => x.zoneId && x.zoneId.includes(b.uuid)).length -
      reservations.filter((x) => x.zoneId && x.zoneId.includes(a.uuid)).length
    );
  });

  const zoneCols = sortedZones.map((zone) => {
    const zoneReservations = reservations.filter((nRes) => {
      const res = op?.res.uuid === nRes.uuid ? op.res : nRes;
      return res.zoneId?.includes(zone.uuid);
    });

    const perPick = picks.map(([hour, minute]) => {
      const pickDate = new Date(new Date(date).setHours(hour, minute, 0, 0));
      const nextPickDate = new Date(
        pickDate.valueOf() + place.granularity * 60 * 1000
      );

      return zoneReservations
        .map((res) => (op?.res.uuid === res.uuid ? op.res : res))
        .filter((res) => {
          const date = new Date(res.date * 1000);
          const endDate = new Date((res.endDate ?? res.date) * 1000);

          return date < nextPickDate && endDate > pickDate;
        });
    });

    const maxIntersecting = Math.max(...perPick.map((x) => x.length), 1);

    const resIndexes: Record<string, number> = {};

    return {
      zone,
      pp: perPick.map((x) => {
        const out: (Reservation | null)[] = new Array(maxIntersecting).fill(
          null
        );

        x.filter((res) => resIndexes[res.uuid] !== undefined).forEach((res) => {
          out[resIndexes[res.uuid]] = res;
        });

        x.forEach((res) => {
          if (resIndexes[res.uuid] === undefined) {
            resIndexes[res.uuid] = out.indexOf(null);
          }

          out[resIndexes[res.uuid]] = res;
        });

        return out;
      }),
    };
  });

  const colToZone: string[] = sortedZones.flatMap((zone, i) =>
    new Array(zoneCols[i].pp[0].length).fill(zone.uuid)
  );

  function interactHandler(
    e:
      | MouseEvent<HTMLDivElement>
      | TouchEvent<HTMLDivElement>
      | UIEvent<HTMLDivElement>
  ) {
    if (place.tier < 1) return;

    const target = e.target as HTMLElement;

    const remSize = parseFloat(
      getComputedStyle(document.documentElement).fontSize
    );
    const rowSize = (remSize * place.granularity) / 7.5;
    const colSize = remSize * 10;

    if (reservations === null) return;
    if (grid.current === null) return;

    function getClientX() {
      lastX = e.type.startsWith("touch")
        ? (e as TouchEvent<HTMLDivElement>).changedTouches[0].clientX
        : e.type.startsWith("mouse")
        ? (e as MouseEvent<HTMLDivElement>).clientX
        : lastX;

      return lastX;
    }

    function getClientY() {
      lastY = e.type.startsWith("touch")
        ? (e as TouchEvent<HTMLDivElement>).changedTouches[0].clientY
        : e.type.startsWith("mouse")
        ? (e as MouseEvent<HTMLDivElement>).clientY
        : lastY;

      return lastY;
    }

    if ((e.type === "touchstart" || e.type === "mousedown") && op === null) {
      if (target.classList?.contains("calendar-scale-grip")) {
        const resId = target.parentElement?.dataset?.id;
        if (resId === undefined) return;

        const res = reservations.find((x) => x.uuid === resId);
        if (res === undefined) return;

        setOp({
          mode: "scale",
          res,
          yOffset: getClientY() + grid.current.scrollTop,
          grabbedZone: (res.zoneId ?? []).indexOf(
            target.parentElement?.dataset.zone as string
          ),
        });
      } else if (
        target.parentElement?.classList?.contains("calendar-reservation")
      ) {
        const resId = target.parentElement?.dataset?.id;
        if (resId === undefined) return;

        const res = reservations.find((x) => x.uuid === resId);
        if (res === undefined) return;

        setOp({
          mode: "move",
          res,
          yOffset: getClientY() + grid.current.scrollTop,
          grabbedZone: (res.zoneId ?? []).indexOf(
            target.parentElement?.dataset.zone as string
          ),
        });
      }

      e.target.addEventListener("touchmove", interactHandler as any);
      e.target.addEventListener("touchend", interactHandler as any);
    } else if (
      (e.type === "touchmove" ||
        e.type === "mousemove" ||
        e.type === "scroll") &&
      op !== null &&
      !op.locked
    ) {
      const clientX = getClientX(),
        x = clientX + grid.current.scrollLeft;
      const clientY = getClientY(),
        y = clientY + grid.current.scrollTop;
      const gridRect = grid.current.getBoundingClientRect();

      if (gridRect.top + 50 > clientY) {
        grid.current.scrollTop -= scrollFactor;
      }

      if (gridRect.bottom - 50 < clientY) {
        grid.current.scrollTop += scrollFactor;
      }

      if (gridRect.left + 50 > clientX) {
        grid.current.scrollLeft -= scrollFactor;
      }

      if (gridRect.right - 50 < clientX) {
        grid.current.scrollLeft += scrollFactor;
      }

      if (op.mode === "scale") {
        const grans = Math.round((y - op.yOffset) / rowSize);

        const ogRes = reservations.find((res) => res.uuid === op.res.uuid);
        if (ogRes === undefined) {
          setOp(null);
          return;
        }

        let endDate =
          (ogRes.endDate ?? ogRes.date) + grans * place.granularity * 60;
        if (endDate <= op.res.date) {
          endDate = op.res.date + place.granularity * 60;
        }

        setOp({
          ...op,
          res: {
            ...op.res,
            endDate,
          },
        });
      } else if (op.mode === "move") {
        const zoneColI = Math.max(
          Math.min(
            Math.floor(
              (x - grid.current.getBoundingClientRect().left - 7.5 * remSize) /
                colSize
            ),
            colToZone.length - 1
          ),
          0
        );

        const grans = Math.round((y - op.yOffset) / rowSize);

        const ogRes = reservations.find((res) => res.uuid === op.res.uuid);
        if (ogRes === undefined) {
          setOp(null);
          return;
        }

        let date = ogRes.date + grans * place.granularity * 60;

        let minDate = new Date(date * 1000);
        minDate.setHours(picks[0][0], picks[0][1], 0, 0);
        date = Math.max(date, minDate.valueOf() / 1000);

        let endDate = date + ((ogRes.endDate ?? ogRes.date) - ogRes.date);

        setOp({
          ...op,
          res: {
            ...op.res,
            date,
            endDate,
            zoneId: op.res.zoneId
              ? op.res.zoneId.map((x, i) =>
                  i === op.grabbedZone ? colToZone[zoneColI] : x
                )
              : op.res.zoneId,
          },
        });
      }
    } else if ((e.type === "touchend" || e.type === "mouseup") && op !== null) {
      if (e.target.removeEventListener) {
        e.target.removeEventListener("touchmove", interactHandler as any);
        e.target.removeEventListener("touchend", interactHandler as any);
      }

      const ogRes = reservations.find((res) => res.uuid === op.res.uuid);
      if (ogRes === undefined) {
        setOp(null);
        return;
      }

      // if (op.res.date !== ogRes.date) {
      // open warning modal
      /*} else*/ if (
        op.res.date !== ogRes.date ||
        op.res.endDate !== ogRes.endDate ||
        op.res.zoneId !== ogRes.zoneId
      ) {
        setOp({
          ...op,
          locked: true,
        });

        let date = new Date(op.res.date * 1000);
        let endDate = new Date((op.res.endDate ?? 0) * 1000);

        cfmCtx.update({
          old: ogRes,
          new: op.res,
          zones: sortedZones,
          async op() {
            updateReservation(place, ogRes, {
              date: date2ndt(date),
              endDate: date2ndt(endDate),
              zoneId: op.res.zoneId,
            }).finally(() => saveReservations(place.poiid));
          },
        });

        setOp(null);
      } else {
        setOp(null);
      }
    }
  }

  return (
    <div
      className={`
        grow
        overflow-scroll scrollbar-hidden
        relative
        grid
        bg-neutral-150
      `}
      style={{
        gridTemplateColumns: `7.5rem repeat(${zoneCols.reduce(
          (a, x) => a + (x.pp[0]?.length || 1),
          0
        )}, 10rem)`,
        gridTemplateRows: `5rem repeat(${picks.length}, ${
          place.granularity / 7.5
        }rem)`,
      }}
      onMouseDown={interactHandler}
      onMouseMove={interactHandler}
      onMouseUp={interactHandler}
      onTouchStart={interactHandler}
      onTouchMove={interactHandler}
      onTouchEnd={interactHandler}
      onScroll={interactHandler}
      ref={grid}
    >
      {date.toDateString() === new Date().toDateString() &&
      Min.currentRange(
        Min.fromDate(new Date()),
        osm2wme(place.opening ?? "24/7")
      ) ? (
        <div
          className="absolute h-0 border-t border-t-2 border-red left-[7.5rem]"
          style={{
            top:
              ((new Date().valueOf() % 86400000) -
                (picks[0][0] +
                  new Date().getTimezoneOffset() / 60 +
                  picks[0][1] / 60) *
                  3600000) /
                450000 +
              5 +
              "rem",
            width:
              zoneCols.reduce((a, x) => a + (x.pp[0]?.length || 1), 0) * 10 +
              "rem",
          }}
        ></div>
      ) : null}

      <div className="bg-neutral-100 border-b border-r border-neutral-300"></div>

      {sortedZones.map((zone, i) => (
        <ZoneCell
          key={zone.uuid}
          zone={zone}
          span={zoneCols[i].pp[0]?.length || 1}
        />
      ))}

      {picks.map(([hour, minute], pickI) => {
        const pickDate = new Date(new Date(date).setHours(hour, minute, 0, 0));
        const nextPickDate = new Date(
          new Date(date).setHours(hour, minute + place.granularity, 0, 0)
        );

        return [
          minute === 0 || pickI === 0 ? (
            <div
              key={`time_${pickI}`}
              className={`
                  flex items-center justify-center
                  font-medium
                  bg-neutral-100 border-b border-r border-neutral-300
                `}
              style={{
                gridRow: new Array(2)
                  .fill(`span ${picks.filter(([h]) => h === hour).length}`)
                  .join(" / "),
              }}
            >
              {hour.toString().padStart(2, "0")}:
              {minute.toString().padStart(2, "0")}
            </div>
          ) : null,
          zoneCols.flatMap((x, zoneI) =>
            x.pp[pickI].map((nRes, i) => {
              const res =
                op !== null && op?.res.uuid === nRes?.uuid ? op.res : nRes;
              const event = res
                ? events.find(
                    (event) =>
                      (event.date <= res.date * 1000 &&
                        event.endDate > res.date * 1000) ||
                      (event.date < (res.endDate ?? res.date) * 1000 &&
                        event.endDate >= (res.endDate ?? res.date) * 1000) ||
                      (event.date > res.date * 1000 &&
                        event.endDate < (res.endDate ?? res.date) * 1000)
                  )
                : events.find(
                    (event) =>
                      event.date <= pickDate.valueOf() &&
                      event.endDate >= nextPickDate.valueOf()
                  );

              return res === null ? (
                <div
                  className={`
                      ${
                        event
                          ? `
                        bg-red/10 cursor-pointer

                        ${
                          event.endDate === nextPickDate.valueOf()
                            ? "border-b border-neutral-200"
                            : ""
                        }
                      `
                          : `
                        border-r border-r-neutral-300

                        border-b border-neutral-200

                        ${
                          picks[pickI + 1] === undefined ||
                          picks[pickI + 1][0] !== hour
                            ? "border-b-neutral-300"
                            : ""
                        }
                      ` + (i > 0 ? "bg-warning/5" : "")
                      }
                    `}
                  key={`time_${pickI}_zone_${zoneI}_res_${i}`}
                  data-dbg={`time_${pickI}_zone_${zoneI}_res_${i}`}
                  onClick={
                    event
                      ? () => {
                          eventCtx.update(closedEventToData(event));
                        }
                      : undefined
                  }
                >
                  {event && pickDate.valueOf() === event.date && zoneI === 0 ? (
                    <div className="flex w-full h-full p-[8px]">
                      {t("event")}
                    </div>
                  ) : null}
                </div>
              ) : new Date(res.date * 1000) >= pickDate &&
                new Date(res.date * 1000) < nextPickDate ? (
                <div
                  className={`
                      ${
                        event
                          ? `
                        bg-red/10 cursor-pointer
                        flex items-center justify-center

                        ${
                          event.endDate === nextPickDate.valueOf()
                            ? "border-b border-neutral-200"
                            : ""
                        }
                      `
                          : `
                        border-r border-r-neutral-300

                        border-b border-neutral-200
                        flex items-center justify-center
                        ${
                          picks[pickI + 1] === undefined ||
                          picks[pickI + 1][0] !== hour
                            ? "border-b-neutral-300"
                            : ""
                        }
                      ` + (i > 0 ? "bg-warning/5" : "")
                      }
                    `}
                  key={`time_${pickI}_zone_${zoneI}_res_${i}`}
                  style={{
                    gridRow: new Array(2)
                      .fill(
                        `span ${Math.ceil(
                          ((res.endDate || res.date) -
                            pickDate.valueOf() / 1000) /
                            60 /
                            place.granularity
                        )}`
                      )
                      .join(" / "),
                  }}
                  onClick={
                    event
                      ? () => {
                          eventCtx.update(closedEventToData(event));
                        }
                      : undefined
                  }
                >
                  <ReservationCard
                    className={`
                        ${op?.res.uuid === res.uuid ? "opacity-75" : ""}
                        ${
                          res.date !== pickDate.valueOf() / 1000
                            ? "outline outline-warning"
                            : ""
                        }
                      `}
                    reservation={res}
                    zone={x.zone}
                    customer={customers.find((x) => x.uuid === res.customer_id)}
                    onUpdate={() => saveReservations(place.poiid)}
                  />
                </div>
              ) : null;
            })
          ),
        ];
      })}
    </div>
  );
}
