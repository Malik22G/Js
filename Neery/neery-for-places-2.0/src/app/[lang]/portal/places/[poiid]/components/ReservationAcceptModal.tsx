"use client";

import LoadingButton from "@/components/ui/LoadingButton";
import ModalBox from "@/components/ui/Modal/ModalBox";
import { createModalContext } from "@/components/ui/Modal/ModalContext";
import ModalTitle from "@/components/ui/Modal/ModalTitle";
import { Reservation, respondReservation } from "@/lib/api/reservations";
import { atime } from "@/lib/atime";
import { ReactNode, useContext } from "react";
import { ReservationInfo } from "./ReservationModal";
import { Zone } from "@/lib/api/zones";
import { useTranslation } from "@/app/[lang]/i18n/client";
import ModalError, { errorHandler } from "@/components/ui/Modal/ModalError";
import { Place } from "@/lib/api/places";
import UnderTierBadge from "./UnderTierBadge";
import TableSelector from "./TableSelector";
import { Divvy } from "@/lib/api/divvies";

export type ReservationAcceptModalData = {
  res: Reservation;
  zoneId?: string[];
};

export const ReservationAcceptModalContext =
  createModalContext<ReservationAcceptModalData>();

function ReservationAcceptModalInside({
  onChange,
  zones,
  divisions,
  place,
}: {
  onChange(): void;
  zones: Zone[];
  divisions: Divvy[];
  place: Place;
}) {
  const ctx = useContext(ReservationAcceptModalContext);
  const { t } = useTranslation("portal/calendar");

  return (
    <>
      <ModalTitle context={ReservationAcceptModalContext}>
        {t("acceptReservation")}
      </ModalTitle>

      <ReservationInfo reservation={ctx.data?.res ?? undefined} />

      <TableSelector
        divisions={divisions}
        zones={zones}
        selectedZones={ctx.data?.zoneId}
        manual={true}
        data={ctx.data}
        onChange={(zones) =>
          ctx.data !== null
            ? ctx.update({
                ...ctx.data,
                zoneId: zones,
              })
            : null
        }
        toggleValue={(zoneId) =>
          ctx.data !== null
            ? ctx.update({
                ...ctx.data,
                zoneId:
                  zoneId === undefined
                    ? []
                    : (ctx.data.zoneId ?? [])?.includes(zoneId)
                    ? (ctx.data.zoneId ?? []).filter((x) => x !== zoneId)
                    : [...(ctx.data.zoneId ?? []), zoneId],
              })
            : null
        }
      />
      <ModalError context={ReservationAcceptModalContext} />

      {place.tier >= 1 ? (
        <LoadingButton
          className="mt-[8px]"
          palette="secondary"
          disabled={
            !ctx.data?.zoneId ||
            ctx.data.zoneId.length === 0 ||
            !ctx.data.zoneId.every((x) => zones.find((z) => z.uuid === x))
          }
          action={async () => {
            if (ctx.data === null) return;

            await errorHandler(
              respondReservation(ctx.data.res.poiid, ctx.data.res.uuid, {
                status: "ACCEPTED",
                zoneId: ctx.data.zoneId,
              }),
              ctx.setError
            );

            onChange();
            ctx.update(null);
            await atime(250);
          }}
        >
          {t("accept")}
        </LoadingButton>
      ) : (
        <UnderTierBadge place={place} />
      )}
    </>
  );
}

export default function ReservationAcceptModal({
  children,
  onChange,
  zones,
  divisions,
  place,
}: {
  children: ReactNode;
  onChange(): void;
  zones: Zone[];
  divisions: Divvy[];
  place: Place;
}) {
  return (
    <ModalBox<ReservationAcceptModalData>
      context={ReservationAcceptModalContext}
      siblings={children}
    >
      <ReservationAcceptModalInside
        zones={zones}
        onChange={onChange}
        divisions={divisions}
        place={place}
      />
    </ModalBox>
  );
}
