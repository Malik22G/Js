"use client";

import LoadingButton from "@/components/ui/LoadingButton";
import ModalBox from "@/components/ui/Modal/ModalBox";
import { createModalContext } from "@/components/ui/Modal/ModalContext";
import ModalTitle from "@/components/ui/Modal/ModalTitle";
import { Reservation, respondReservation } from "@/lib/api/reservations";
import { atime } from "@/lib/atime";
import { ReactNode, useContext } from "react";
import { ReservationInfo } from "./ReservationModal";
import { useTranslation } from "@/app/[lang]/i18n/client";
import ModalError, { errorHandler } from "@/components/ui/Modal/ModalError";
import { Place } from "@/lib/api/places";
import UnderTierBadge from "./UnderTierBadge";

export type ReservationRejectModalData = Reservation;

export const ReservationRejectModalContext =
  createModalContext<ReservationRejectModalData>();

function ReservationRejectModalInside({
  onChange,
  place,
}: {
  onChange(): void,
  place: Place,
}) {
  const ctx = useContext(ReservationRejectModalContext);
  const { t } = useTranslation("portal/calendar");

  return (
    <>
      <ModalTitle context={ReservationRejectModalContext}>
        {t("rejectReservation")}
      </ModalTitle>

      <ReservationInfo reservation={ctx.data ?? undefined} />

      <p>{t("rejectReservationPrompt")}</p>
      <ModalError context={ReservationRejectModalContext} />

      {place.tier >= 1 ? (
        <LoadingButton
          palette="red"
          className="mt-[8px]"
          action={async () => {
            if (ctx.data === null) return;

            await errorHandler(
              respondReservation(ctx.data.poiid, ctx.data.uuid, {
                status: "REJECTED",
              }),
              ctx.setError
            );

            onChange();
            ctx.update(null);
            await atime(250);
          }}
        >
          {t("reject")}
        </LoadingButton>
      ) : (
        <UnderTierBadge place={place} />
      )}
    </>
  );
}

export default function ReservationRejectModal({
  children,
  onChange,
  place,
}: {
  children: ReactNode,
  onChange(): void,
  place: Place,
}) {
  return (
    <ModalBox<ReservationRejectModalData>
      context={ReservationRejectModalContext}
      siblings={children}
    >
      <ReservationRejectModalInside onChange={onChange} place={place} />
    </ModalBox>
  );
}
