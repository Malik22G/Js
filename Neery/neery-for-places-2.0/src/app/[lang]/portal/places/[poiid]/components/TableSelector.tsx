"use client";

import { useTranslation } from "@/app/[lang]/i18n/client";
import {
  InputContainer,
  InputLabel,
} from "@/app/[lang]/land/[poiid]/reserve/components/Reserve/screens/ReserveDate/kit";
import Button from "@/components/ui/Button";
import MultiSelectButtons from "@/components/ui/MultiSelectButtons";
import { Divvy } from "@/lib/api/divvies";
import { Zone } from "@/lib/api/zones";
import React, { ReactNode, useEffect, useState } from "react";
export type DivisionSelection = Array<[string | undefined | null, string]>;

type ZoneValue = [string | undefined, ReactNode, string];

export default function TableSelector({
  divisions,
  zones,
  selectedZones,
  onChange,
  toggleValue,
  manual = false,
  data,
}: {
  divisions: Divvy[];
  zones: Zone[];
  selectedZones?: string[];
  onChange: (selectedZones: string[] | undefined) => void;
  toggleValue: (value: string | undefined) => void;
  manual?: boolean;
  data: any;
}) {
  useEffect(() => {
    if (data === null) {
      setSelectedDivisions([undefined]);
      resetZoneValues();
    }
  }, [data]);

  const { t } = useTranslation("portal/calendar");
  const automaticTable = [
    undefined,
    t("automatic"),
    t("automatic"),
  ] as ZoneValue;

  const [selectedDivisions, setSelectedDivisions] = useState<
    (string | null | undefined)[]
  >([undefined]);

  const [zoneValues, setZoneValues] = useState<ZoneValue[]>([]);

  function zoneMapping(z: Zone) {
    return [
      z.uuid,
      <>
        {z.name} &bull; {z.count} {t("capita")}
      </>,
      z.name,
    ] as [string, ReactNode, string];
  }

  const allZones = divisions.map((d) => d.zones).flat();

  useEffect(() => {
    resetZoneValues();
  }, []);

  function resetZoneValues() {
    if (manual) {
      setZoneValues([...zones.map(zoneMapping)]);
    } else {
      setZoneValues([automaticTable, ...zones.map(zoneMapping)]);
    }
  }

  function changeDivisions(value: (string | null | undefined)[]) {
    setSelectedDivisions(value);
    let finalZones = [] as [string | undefined, ReactNode, string][];
    if (!(value.length === 1 && value[0] === undefined)) {
      const zonesFromDivisions = divisions
        .filter((d) => value.includes(d.uuid))
        .map((d) => d.zones)
        .flat();
      finalZones = zones
        .filter((z) => zonesFromDivisions.includes(z.uuid))
        .map(zoneMapping);
      if (value.includes(null)) {
        finalZones = [
          ...finalZones,
          ...zones.filter((z) => !allZones.includes(z.uuid)).map(zoneMapping),
        ];
      }
    } else {
      finalZones = zones.map(zoneMapping);
    }
    if (!manual) {
      finalZones = [automaticTable, ...finalZones];
    }
    setZoneValues(finalZones);
    const zoneIds = finalZones.map((fZ) => fZ[0] as string);
    let finalSelectedZones;
    if (!zoneIds || zoneIds.length === 0 || selectedZones === undefined) {
      finalSelectedZones = undefined;
    } else {
      const filter = selectedZones.filter((z) => zoneIds.includes(z));
      if (filter.length > 0) {
        finalSelectedZones = filter;
      }
    }
    onChange(finalSelectedZones);
  }
  return (
    <InputContainer
      className={`
    flex flex-col gap-[15px]
  `}
    >
      <div className="flex justify-between items-center">
        <InputLabel>Groups</InputLabel>
        <Button
          palette="secondary"
          onClick={() => {
            changeDivisions([undefined]);
            onChange(undefined);
          }}
          disabled={
            selectedDivisions.length === 1 && selectedDivisions[0] === undefined
          }
        >
          {t("clearSelection")}
        </Button>
      </div>
      <MultiSelectButtons<string | undefined | null>
        values={[
          [undefined, t("allGroups")],
          [null, t("unGrouped")],
          ...(divisions.map((d) => [d.uuid, d.name]) as [string, string][]),
        ]}
        value={selectedDivisions}
        toggleValue={(division) => {
          const finalSelection =
            division === undefined
              ? [undefined]
              : (selectedDivisions ?? [])?.includes(division)
              ? (selectedDivisions ?? []).filter((x) => x !== division)
              : [...(selectedDivisions ?? []), division].filter(
                  (x) => x !== undefined
                );

          changeDivisions(
            finalSelection.length === 0 ? [undefined] : finalSelection
          );
        }}
      />
      <div className="flex justify-between items-center">
        <InputLabel>{t("table")}</InputLabel>
        <Button
          palette="secondary"
          onClick={() => {
            toggleValue(undefined);
          }}
          disabled={!selectedZones || selectedZones.length === 0}
        >
          {t("clearSelection")}
        </Button>
      </div>
      {manual ? (
        <MultiSelectButtons<string>
          value={selectedZones ?? []}
          values={zoneValues as [string, ReactNode, string][]}
          toggleValue={toggleValue}
        />
      ) : (
        <MultiSelectButtons<string | undefined>
          value={selectedZones ?? [undefined]}
          values={zoneValues}
          toggleValue={toggleValue}
        />
      )}
    </InputContainer>
  );
}
