"use client";

import { Zone } from "@/lib/api/zones";
import { Customer } from "@/lib/api/customers";
import { Reservation } from "@/lib/api/reservations";
import { ReservationListCard } from "@/app/[lang]/portal/places/[poiid]/calendar/components/ReservationListCard";
import React, { useMemo } from "react";
import LoaderScreen from "@/app/[lang]/portal/places/[poiid]/calendar/components/LoaderScreen";
import { ClosedEvent } from "@/lib/api/closedevents";
import { EventListCard } from "./EventListCard";
import { Place } from "@/lib/api/places";
import { useTranslation } from "@/app/[lang]/i18n/client";

type ReservationListViewProps = {
  place: Place;
  zones: Zone[];
  events: ClosedEvent[];
  customers: Customer[];
  reservations: Reservation[] | null;
  cancelledReservations: Reservation[] | null;
  saveReservation: (poiid: string, date?: Date) => Promise<any>;
};

export default function ReservationListview({
  place,
  zones,
  events,
  customers,
  reservations,
  cancelledReservations,
  saveReservation,
}: ReservationListViewProps) {
  const allSortedByTime = useMemo(() => {
    if (!reservations) return [];
    if (!events) return [];

    let all = [
      ...reservations.map(r => ({
        type: "reservation" as const,
        date: r.date * 1000,
        reservation: r,
      })),
      ...events.map(e => ({
        type: "event" as const,
        date: e.date,
        event: e,
      })),
    ];

    return all.sort((a, b) => {
      return a.date - b.date;
    });
  }, [reservations, events]);

  const { t } = useTranslation("portal/calendar");

  if (reservations === null || cancelledReservations === null) {
    return <LoaderScreen />;
  }

  if (allSortedByTime.length === 0 && cancelledReservations.length === 0) {
    return (
      <div
        className="
        flex flex-col items-center justify center w-full h-full
        relative
        
        px-4 text-primary font-semibold text-xl"
      >
        <div className="m-auto">{t("noReservations")}</div>
      </div>
    );
  }

  return (
    <div
      className="
        overflow-scroll scrollbar-hidden
        relative
        flex flex-col
        items-center md:items-start
        px-2 md:px-4
        bg-neutral-150 
        pb-[8px] md:pb-[0px]
        "
    >
      {allSortedByTime?.map(data => data.type === "reservation" ? (
        <ReservationListCard
          key={`reservation-${data.reservation.uuid}`}
          place={place}
          reservation={data.reservation}
          zones={zones.filter((zone) =>
            data.reservation.zoneId?.includes(zone.uuid)
          )}
          customer={customers.find(
            (customer) => customer.uuid === data.reservation.customer_id
          )}
          onUpdate={() => saveReservation(data.reservation.poiid)}
        />
      ) : (
        <EventListCard
          key={`event-${data.event.uuid}`}
          event={data.event}
        />
      ))}

      {cancelledReservations.length > 0 && allSortedByTime.length > 0 ? (
        <div className="flex items-center justify-center gap-1 pointer-events-none select-none">
          <div className="grow h-0 border-t border-[#000000]/20">
          </div>
          <span className="text-[16px] uppercase text-[#000000]/40">{t("cancelled")}</span>
          <div className="grow h-0 border-t border-[#000000]/20">
          </div>
        </div>
      ) : null}

      {cancelledReservations.length > 0 ? (
        cancelledReservations.map(res => (
          <ReservationListCard
            key={`reservation-${res.uuid}`}
            place={place}
            reservation={res}
            zones={zones.filter((zone) =>
              res.zoneId?.includes(zone.uuid)
            )}
            customer={customers.find(
              (customer) => customer.uuid === res.customer_id
            )}
            onUpdate={() => saveReservation(res.poiid)}
          />
        ))
      ) : null}
    </div>
  );
}
