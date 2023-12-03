"use client";

import LoadingButton from "@/components/ui/LoadingButton";
import ModalBox from "@/components/ui/Modal/ModalBox";
import { createModalContext } from "@/components/ui/Modal/ModalContext";
import ModalError, { errorHandler } from "@/components/ui/Modal/ModalError";
import ModalTitle from "@/components/ui/Modal/ModalTitle";
import { Place } from "@/lib/api/places";
import { Reservation, cancelReservation } from "@/lib/api/reservations";
import { atime } from "@/lib/atime";
import { ReactNode, useContext } from "react";
import UnderTierBadge from "./UnderTierBadge";

export type ReservationDeleteModalData = Reservation;

export const ReservationDeleteModalContext =
  createModalContext<ReservationDeleteModalData>();

function ReservationDeleteModalInside({
  onChange,
  place,
}: {
  onChange(): void,
  place: Place,
}) {
  const ctx = useContext(ReservationDeleteModalContext);

  return (
    <>
      <ModalTitle context={ReservationDeleteModalContext}>
        Foglalás törlése
      </ModalTitle>

      <p>Biztosan törlöd ezt a foglalást? Ez a művelet visszavonhatatlan.</p>

      <ModalError context={ReservationDeleteModalContext} />
      {place.tier >= 1 ? (
        <LoadingButton
          palette="red"
          className="mt-[8px]"
          action={async () => {
            if (ctx.data === null) return;

            await errorHandler(
              cancelReservation(ctx.data.poiid, ctx.data.uuid),
              ctx.setError
            );

            onChange();
            ctx.update(null);
            await atime(250);
          }}
        >
          Törlés
        </LoadingButton>
      ) : (
        <UnderTierBadge place={place} />
      )}
    </>
  );
}

export default function ReservationDeleteModal({
  children,
  onChange,
  place,
}: {
  children: ReactNode,
  onChange(): void,
  place: Place,
}) {
  return (
    <ModalBox<ReservationDeleteModalData>
      context={ReservationDeleteModalContext}
      siblings={children}
    >
      <ReservationDeleteModalInside onChange={onChange} place={place} />
    </ModalBox>
  );
}
