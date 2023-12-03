import { LangProps } from "@/app/[lang]/props";
import { loadAndUseTranslation, useTranslation } from "@/app/[lang]/i18n";
import { Zone, getZones } from "@/lib/api/zones";
import { ConfigFormStateless } from "../../components/Config/ConfigForm";
import { _CreateDivvyButton, _CreateZoneButton, _DeleteDivvyButton, _DeleteDivvyModal, _DeleteZoneButton, _DivvyModal, _EditDivvyButton, _EditZoneButton, _ZoneDeleteModal, _ZoneModal } from "./client";
import { Divvy, getDivvies } from "@/lib/api/divvies";
import { getPlace } from "@/lib/api/places";
import UnderTierBadge from "../../components/UnderTierBadge";

function UndivviedItem() {
  return (
    <div className="flex flex-col w-full xl:w-3/5">
      <div className="flex justify-between items-center">
        <h1 className="font-medium text-[20px]">Csoportosítatlan</h1>
      </div>
    </div>
  );
}

function DivvyItem({
  divvy,
}: {
  divvy: Divvy,
}) {
  return (
    <div className="flex flex-col w-full xl:w-4/5">
      <div className="flex justify-between items-center">
        <h1 className="font-medium text-[20px]">{divvy.name}</h1>
        <div className="flex gap-[8px]">
          <_DeleteDivvyButton
            divvy={divvy}
            palette="red"
            iconClass="h-[0.7rem] w-[0.7rem]"
          />

          <_EditDivvyButton
            divvy={divvy}
            iconClass="h-[0.7rem] w-[0.7rem]"
          />
        </div>
      </div>
    </div>
  );
}

function ZoneItem({
  zone,
  divvy,
}: {
  zone: Zone,
  divvy?: Divvy,
}) {

  return (
    <div className="flex gap-[8px] w-full xl:w-4/5 p-[8px] rounded-[8px] border border-neutral-200 font-medium">
      <div className="flex grow">
        {zone.name} &bull; {zone.count} fő
      </div>

      <div className="flex shrink-0 items-center justify-evenly gap-[8px]">
        <_EditZoneButton
          zone={zone}
          divvy={divvy}
          iconClass="h-[0.7rem] w-[0.7rem]"
        />

        <_DeleteZoneButton
          zone={zone}
          palette="red"
          iconClass="h-[0.7rem] w-[0.7rem]"
        />
      </div>
    </div>
  );
}

export default async function PageSettingsTables({
  params: { poiid, lang },
}: LangProps & {
  params: { poiid: string },
}) {
  const [{ t }, place, zones, divvies] = await Promise.all([
    loadAndUseTranslation(lang, "portal/settings/tables"),
    getPlace(poiid),
    getZones(poiid),
    getDivvies(poiid),
  ]);

  const unascZones = zones.filter(zone => divvies.every(div => !div.zones.includes(zone.uuid)));

  return (
    <_DivvyModal place={place}>
      <_DeleteDivvyModal place={place}>
        <_ZoneModal divvies={divvies} place={place}>
          <_ZoneDeleteModal place={place}>
            <ConfigFormStateless
              title={t("title")}
            >
              {
                place.tier >= 1 ? (
                  <div className="grid grid-cols-2 gap-[8px] w-full xl:w-4/5">
                    <_CreateDivvyButton place={poiid} palette="secondary">
                      {t("createGroup")}
                    </_CreateDivvyButton>

                    <_CreateZoneButton place={poiid} palette="secondary">
                      {t("createTable")}
                    </_CreateZoneButton>
                  </div>
                ) : (
                  <UnderTierBadge
                    className="w-full xl:w-3/5"
                    place={poiid}
                  />
                )
              }

              {divvies.map(divvy => (
                <div key={divvy.uuid} className="flex flex-col gap-[8px]">
                  <DivvyItem key={divvy.uuid} divvy={divvy} />
                  {zones.filter(x => divvy.zones.includes(x.uuid)).map(zone => (
                    <ZoneItem
                      key={divvy.uuid + "_" + zone.uuid}
                      zone={zone}
                      divvy={divvy}
                    />
                  ))}
                </div>
              ))}

              <div className="flex flex-col gap-[8px]">
                <UndivviedItem />
                {unascZones.map(zone => {
                  return (
                    <ZoneItem
                      key={zone.uuid}
                      zone={zone}
                    />
                  );
                })}
              </div>
            </ConfigFormStateless>
          </_ZoneDeleteModal>
        </_ZoneModal>
      </_DeleteDivvyModal>
    </_DivvyModal>
  );
}
