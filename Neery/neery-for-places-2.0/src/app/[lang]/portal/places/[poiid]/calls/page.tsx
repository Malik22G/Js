import { LangProps } from "@/app/[lang]/props";
import { getCalls } from "@/lib/api/calls";
import CallItem from "./components/CallItem";
import { loadAndUseTranslation } from "@/app/[lang]/i18n";
import ReservationModal from "../components/ReservationModal";
import { getZones } from "@/lib/api/zones";
import { getPlace } from "@/lib/api/places";
import { getDivvies } from "@/lib/api/divvies";

export default async function Calls({
  params: { poiid, lang },
}: {
  params: { poiid: string };
} & LangProps) {
  const { t } = await loadAndUseTranslation(lang, "portal/navbar");
  const calls = await getCalls(poiid);
  const zones = await getZones(poiid);
  const place = await getPlace(poiid);
  const divisions = await getDivvies(poiid);

  return (
    <ReservationModal zones={zones} place={place} divisions={divisions}>
      <div className="flex flex-col w-full h-full p-[32px] overflow-y-scroll">
        <h1 className="font-semibold text-[24px] mb-[32px]">{t("calls")}</h1>
        <div className="flex flex-col gap-[16px] w-full lg:w-3/5">
          {calls.map((call) => (
            <CallItem key={call.uuid} call={call} lang={lang} />
          ))}
        </div>
      </div>
    </ReservationModal>
  );
}
