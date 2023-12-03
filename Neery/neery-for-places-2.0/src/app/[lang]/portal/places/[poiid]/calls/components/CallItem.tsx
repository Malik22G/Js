"use client";

import { Call } from "@/lib/api/calls";
import { useContext, useEffect, useState } from "react";
import { ReservationModalContext } from "../../components/ReservationModal";
import { Reservation, getReservation } from "@/lib/api/reservations";
import { useTranslation } from "@/app/[lang]/i18n/client";

export default function CallItem({ call, lang }: { call: Call, lang: string }) {
  const rctx = useContext(ReservationModalContext);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const { t } = useTranslation("portal/calls");

  useEffect(() => {
    (async () => {
      if (call.reservation !== undefined) {
        setReservation(await getReservation(call.poiid, call.reservation));
      }
    })();
  }, [call.poiid, call.reservation]);

  return (
    <div className="p-[8px] rounded-xl border border-neutral-300 flex flex-col gap-2">
      <div className="flex justify-between">
        <span>{call.caller}</span>
        <span>{new Date(call.created_at).toLocaleString(lang)}</span>
      </div>
      <div className="flex justify-center">
        <audio controls>
          <source src={call.recording_url} type="audio/mpeg" />
        </audio>
      </div>
      <textarea
        value={call.transcript}
        className="p-[8px] text-sm rounded border border-neutral-200"
        disabled
      />
      <div className="text-xs">
        {["PROCESSING", "PENDING"].includes(call.status) ? (
          <span>{t("processing")}</span>
        ) : !call.reservation ? (
          <span>{t("notCreated")}</span>
        ) : reservation ? (
          <button
            onClick={() => {
              rctx.update(reservation);
            }}
          >
            {new Date(reservation.date * 1000).toLocaleString(lang)}, {reservation.count ?? 0}x
          </button>
        ) : (
          <span>Betöltés...</span>
        )}
      </div>
    </div>
  );
}
