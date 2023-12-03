"use client";

import ModalBox from "@/components/ui/Modal/ModalBox";
import { createModalContext } from "@/components/ui/Modal/ModalContext";
import { Zone } from "@/lib/api/zones";
import { ReactNode, useContext } from "react";
import ModalTitle from "@/components/ui/Modal/ModalTitle";
import LoadingButton from "@/components/ui/LoadingButton";
import { atime } from "@/lib/atime";
import { Reservation } from "@/lib/api/reservations";
import { useTranslation } from "@/app/[lang]/i18n/client";
import ModalError, { errorHandler } from "@/components/ui/Modal/ModalError";
import { Place } from "@/lib/api/places";
import UnderTierBadge from "./UnderTierBadge";

export type ReservationConfirmModalData = {
  old: Reservation;
  new: Reservation;
  zones: Zone[];
  op: () => Promise<any>;
};

export const ReservationConfirmModalContext =
  createModalContext<ReservationConfirmModalData>();

function ReservationDetails({
  res,
  zones,
}: {
  res: Reservation | undefined;
  zones: Zone[] | undefined;
}) {
  const { i18n } = useTranslation("translation");

  return (
    <>
      {new Date((res?.date ?? 0) * 1000).toLocaleString(i18n.language, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      })}{" "}
      -{" "}
      {new Date((res?.endDate ?? 0) * 1000).toLocaleString(i18n.language, {
        hour: "numeric",
        minute: "numeric",
      })}{" "}
      |{" "}
      {(res?.zoneId ?? [])
        .map((x) => zones?.find((z) => z.uuid === x))
        .filter((x) => x)
        .map((x) => x?.name)
        .join(", ")}
    </>
  );
}

function ReservationConfirmModalInside({
  onChange,
  place,
}: {
  onChange(): void,
  place: Place,
}) {
  let ctx = useContext(ReservationConfirmModalContext);
  const { t } = useTranslation("portal/calendar");

  return (
    <>
      <ModalTitle context={ReservationConfirmModalContext}>
        {t("modifyReservation")}
      </ModalTitle>

      <p>
        {t("modifyResAck")}
      </p>

      <p>
        {t("previous")} {" "}
        <ReservationDetails res={ctx.data?.old} zones={ctx.data?.zones} />
      </p>
      <p>
        {t("new")} {" "}
        <ReservationDetails res={ctx.data?.new} zones={ctx.data?.zones} />
      </p>
      <ModalError context={ReservationConfirmModalContext} />

      {place.tier >= 1 ? (
        <LoadingButton
          palette="secondary"
          className="mt-[8px]"
          action={async () => {
            if (ctx.data === null) return;

            await errorHandler(ctx.data.op(), ctx.setError);

            onChange();
            ctx.update(null);
            await atime(250);
          }}
        >
          {t("modify")}
        </LoadingButton>
      ) : (
        <UnderTierBadge place={place} />
      )}
    </>
  );
}

export default function ReservationConfirmModal({
  children,
  onChange,
  place,
}: {
  children: ReactNode,
  onChange(): void,
  place: Place,
}) {
  return (
    <ModalBox<ReservationConfirmModalData>
      context={ReservationConfirmModalContext}
      siblings={children}
    >
      <ReservationConfirmModalInside onChange={onChange} place={place} />
    </ModalBox>
  );
}
