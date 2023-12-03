"use client";

import {
  InputContainer,
  InputLabel,
} from "@/app/[lang]/land/[poiid]/reserve/components/Reserve/screens/ReserveDate/kit";
import Input from "@/components/ui/Input";
import ModalBox from "@/components/ui/Modal/ModalBox";
import { createModalContext } from "@/components/ui/Modal/ModalContext";
import ModalTitle from "@/components/ui/Modal/ModalTitle";
import PMNumberInput from "@/components/ui/PMNumberInput";
import { Zone, ZonePost, getZones, patchZone, postZone } from "@/lib/api/zones";
import { ReactNode, useContext } from "react";
import LoadingButton from "@/components/ui/LoadingButton";
import { atime } from "@/lib/atime";
import { Divvy, patchDivvy } from "@/lib/api/divvies";
import Select from "@/components/ui/Select";
import { useTranslation } from "@/app/[lang]/i18n/client";
import ModalError, { errorHandler } from "@/components/ui/Modal/ModalError";
import { Place } from "@/lib/api/places";
import UnderTierBadge from "./UnderTierBadge";

export type ZoneModalData = {
  uuid?: string;
  poiid: string;
  data: Partial<ZonePost> & {
    divvy?: string;
  };
};

export function zoneToData(
  { uuid, poiid, ...data }: Zone,
  divvy?: Divvy
): ZoneModalData {
  return {
    uuid,
    poiid,
    data: {
      ...data,
      divvy: divvy?.uuid,
    },
  };
}

export const ZoneModalContext = createModalContext<ZoneModalData>();

function ZoneModalInside({
  divvies,
  place,
  onChange,
}: {
  divvies: Divvy[],
  place: Place,
  onChange(): void,
}) {
  let ctx = useContext(ZoneModalContext);
  let d: ZoneModalData = ctx.data ?? { poiid: "", data: {} };
  const { t } = useTranslation("portal/settings/tables");

  return (
    <>
      <ModalTitle context={ZoneModalContext}>
        {ctx.data?.uuid ? t("modifyTable") : t("createTable")}
      </ModalTitle>

      <InputContainer>
        <InputLabel>{t("name")}</InputLabel>

        <Input
          className="w-1/2"
          value={d.data.name ?? ""}
          onChange={(e) =>
            ctx.update({
              ...d,
              data: { ...d.data, name: e.target.value },
            })
          }
          bare
        />
      </InputContainer>

      <InputContainer>
        <InputLabel>{t("count")}</InputLabel>

        <PMNumberInput
          value={d.data.count ?? 1}
          min={1}
          onChange={(count) =>
            ctx.update({
              ...d,
              data: { ...d.data, count },
            })
          }
        />
      </InputContainer>

      <InputContainer>
        <InputLabel>{t("group")}</InputLabel>

        <Select<string | undefined>
          value={d.data.divvy}
          values={[
            [undefined, t("noGroup")],
            ...divvies.map((div) => [div.uuid, div.name] as [string, string]),
          ]}
          setValue={(divvy) =>
            ctx.update({
              ...d,
              data: {
                ...d.data,
                divvy,
              },
            })
          }
        />
      </InputContainer>
      <ModalError context={ZoneModalContext} />
      {place.tier >= 1 ? (
        <LoadingButton
          palette="secondary"
          className="mt-[8px]"
          disabled={d.data.name === undefined || d.data.name.trim().length === 0}
          action={async () => {
            async function action() {
              let body: ZonePost = {
                name: d.data.name ?? "",
                count: d.data.count ?? 1,
              };
           
              const old =
                d.uuid !== undefined
                  ? (await getZones(d.poiid)).find((x) => x.uuid === d.uuid) ??
                    null
                  : null;

              const uuid =
                d.uuid !== undefined
                  ? (await patchZone(d.poiid, d.uuid, body), d.uuid) // FIXME: patchZone should return a Zone
                  : (await postZone(d.poiid, body)).uuid;

              const oldDiv = divvies.find((x) => x.zones.includes(uuid));
              const div = divvies.find((x) => x.uuid === d.data.divvy);

              if (div !== undefined && !div.zones.includes(uuid)) {
                await patchDivvy(div.poiid, div.uuid, {
                  zones: [...div.zones, uuid],
                });
              }

              if (old && oldDiv !== undefined && oldDiv.uuid !== div?.uuid) {
                await patchDivvy(oldDiv.poiid, oldDiv.uuid, {
                  zones: oldDiv.zones.filter((z) => z !== uuid),
                });
              }
            }
            await errorHandler(action(), ctx.setError);
            onChange();
            ctx.update(null);
            await atime(250);
          }}
        >
          {d.uuid !== undefined ? t("modify") : t("create")}
        </LoadingButton>
      ) : (
        <UnderTierBadge place={place} />
      )}
    </>
  );
}

export default function ZoneModal({
  divvies,
  place,
  children,
  onChange,
}: {
  divvies: Divvy[],
  place: Place,
  children: ReactNode,
  onChange(): void,
}) {
  return (
    <ModalBox<ZoneModalData>
      context={ZoneModalContext}
      siblings={children}
    >
      <ZoneModalInside divvies={divvies} place={place} onChange={onChange} />
    </ModalBox>
  );
}
