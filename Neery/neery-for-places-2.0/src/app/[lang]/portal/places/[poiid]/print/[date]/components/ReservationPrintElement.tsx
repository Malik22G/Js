import { useTranslation } from "@/app/[lang]/i18n";
import { Comment, List, PenPaper } from "@/components/ui/icons";
import { Clock, MapPin, Person, WheatAllergy } from "@/components/ui/icons";
import { Place } from "@/lib/api/places";
import { Reservation } from "@/lib/api/reservations";
import { Zone } from "@/lib/api/zones";
import { i18n } from "i18next";
import { DateTime } from "luxon";

export function ReservationCard({
  place,
  zone,
  zones,
  reservation,
  i18n,
  rotated,
}: {
  place: Place,
  zone: string,
  zones: Zone[],
  reservation: Reservation,
  i18n: i18n,
  rotated?: boolean
}) {
  const { t: tagT } = useTranslation(i18n, "tags");

  return (
    <div
      className={`flex flex-col p-3 gap-1 border border-neutral-500 rounded-lg ${rotated ? "rotate-180" : "rotate-0"}`}
      style={{
        breakInside: "avoid",
        display: "inline-flex",
        width: "100%",
        verticalAlign: "top",
      }}
    >
      <div className="flex flex-row gap-3 text-lg justify-between">
        <p className="uppercase h-min font-semibold grow">{reservation.name}</p>
        <div className="flex gap-1 justify-center items-center">
          <Clock className="w-[1.25rem] h-[1.25rem]" />
          <p className="">
            {DateTime.fromMillis(reservation.date * 1000, { zone, locale: i18n.language }).toLocaleString({ weekday: "long", hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <div className="flex gap-2 items-center h-min">
          <Person />
          {reservation.count}
        </div>
      </div>
      <div className="flex flex-col gap-1 font-normal items-start text-sm">
        <div className="flex justify-center">
          <p>
            {!place.hide_zones ? reservation.zoneId?.map(x => zones.find(z => z.uuid === x)).filter(x => x !== undefined).map(z => z?.name ?? "").join(", ") : null}
          </p>
        </div>
        {reservation.comment.trim().length > 0 ? (
          <div className="flex gap-1 justify-center items-center">
            <Comment className="w-[1rem] h-[1rem]" />
            <p className="">
              {reservation.comment}
            </p>
          </div>
        ) : null}
        {(reservation.place_note !== undefined && reservation.place_note.trim().length > 0) ? (
          <div className="flex gap-1 justify-center items-center">
            <PenPaper className="w-[1rem] h-[1rem]" />
            <p className="">
              {reservation.place_note}
            </p>
          </div>
        ) : null}
        {reservation.allergens.length > 0 || reservation.services.length > 0
          ? (
            <div className={`grid w-full mt-1 gap-2 ${reservation.allergens.length > 0 && reservation.services.length > 0 ? "grid-cols-2" : "grid-cols-1"}`}>
              {reservation.allergens.length > 0 ? (
                <div className="flex gap-1 justify-center items-center">
                  <WheatAllergy className="w-[1.25rem] h-[1.25rem]" />
                  <p className="">
                    {reservation.allergens.map(x => tagT(x)).join(", ")}
                  </p>
                </div>
              ) : null}
              {reservation.services.length > 0 ? (
                <div className="flex gap-1 justify-center items-center">
                  <List className="w-[1rem] h-[1rem]" />
                  <p className="">
                    {reservation.services.map(x => tagT(x)).join(", ")}
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}
      </div>
    </div>
  );
}

export default function ReservationPrintElement({
  place,
  zone,
  zones,
  reservation,
  i18n,
}: {
  place: Place,
  zone: string,
  zones: Zone[],
  reservation: Reservation,
  i18n: i18n,
}) {
  return (
    <div>
      <ReservationCard place={place} zones={zones} zone={zone} reservation={reservation} i18n={i18n} rotated />
      <div className="flex border-b border-neutral-500 border-dashed" />
      <ReservationCard place={place} zones={zones} zone={zone} reservation={reservation} i18n={i18n} />
      <div className="border-b border-neutral-500 border-dashed" />
      <div className="flex px-3 flex-row gap-3 items-center mt-1">
        <MapPin className="w-[1.25rem] h-[1.25rem]" />
        {"ASZTALNEVE_VALTOZO"}
      </div>
    </div>
  );
}
