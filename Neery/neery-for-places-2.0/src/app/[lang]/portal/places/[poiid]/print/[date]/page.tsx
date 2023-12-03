import { loadAndUseTranslation } from "@/app/[lang]/i18n";
import { LangProps } from "@/app/[lang]/props";
import { getReservations } from "@/lib/api/reservations";
import { ReservationCard } from "./components/ReservationPrintElement";
import { PrintPop } from "./client";
import { getPlace } from "@/lib/api/places";
import { getZones } from "@/lib/api/zones";
import "./style.css";

export default async function PlacePrint({
  params: { poiid, date, lang },
}: {
  params: { poiid: string, date: string }
} & LangProps) {
  const d = new Date(decodeURIComponent(date));

  const { i18n } = await loadAndUseTranslation(lang, "translation");

  const place = await getPlace(poiid);
  const reservations = (await getReservations(
    poiid,
    {
      status: "ACCEPTED",
      after: new Date(d).setHours(0, 0, 0, 0).valueOf(), // midnight, today
      before: new Date(d).setHours(24, 0, 0, 0).valueOf(), // midnight, tomorrow
    }
  )).sort((a, b) => a.date.valueOf() - b.date.valueOf()).filter(x => x.state !== "LEFT");
  const zones = await getZones(poiid);

  return (
    <div className={`
      absolute left-0 top-0 bottom-0 right-0 z-50
      grid ${place.print_mode === 0 ? "grid-cols-2" : "grid-cols-1"}
      gap-2 grid-flow-row auto-rows-min
      w-full p-[8px] bg-neutral-100
    `}>
      {reservations.map(res => (
        <ReservationCard
          key={res.uuid}
          place={place}
          zones={zones}
          zone={place.timezone}
          reservation={res}
          i18n={i18n}
        />
      ))}
      <PrintPop />
    </div>
  );
}
