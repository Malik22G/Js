"use client";
import { useSearchParams } from "next/navigation";
import { LangProps } from "../../props";
import { Reservation, cancelReservation, getReservation } from "@/lib/api/reservations";
import { Place, getPlace } from "@/lib/api/places";
import Button from "@/components/ui/Button";
import LoadingButton from "@/components/ui/LoadingButton";
import { useEffect, useState } from "react";
import { Envelope, Loader, Person, Phone } from "@/components/ui/icons";
import IconButton from "@/components/ui/IconButton";
import { useTranslation } from "../../i18n/client";

export default function ManageReservation({
  params: { lang },
}: LangProps) {
  const { t } = useTranslation("manage/reservation");
  const searchParams = useSearchParams();
  const key = searchParams.get("key") ?? undefined;

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [place, setPlace] = useState<Place | null>(null);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    getReservation("me", "me", {
      emailKey: key,
    }).then(reservation => {
      setReservation(reservation);
      getPlace(reservation.poiid).then(place => setPlace(place));
    }).catch(() => {
      setError(true);
    });
  }, [key]);

  if (error) {
    return (
      <div className="flex flex-col p-8 w-full h-full items-center justify-center text-center gap-6">
        <p>{t("error")}</p>

        {place ? (
          <Button action={`/land/${encodeURIComponent(place.poiid)}`}>
            {t("backToPlace")}
          </Button>
        ) : null}
      </div>
    );
  }

  if (!reservation || !place) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <Loader className="text-primary" />
      </div>
    );
  }

  if (reservation.state.startsWith("CANCELLED_")) {
    return (
      <div className="flex flex-col p-8 w-full h-full items-center justify-center text-center gap-6">
        <p>{t("deleted")}</p>
        <div className="flex gap-2 items-center justify-center">
          <Button action={`/land/${encodeURIComponent(place.poiid)}`}>
            {t("backToPlace")}
          </Button>
          {place.phone ? (
            <IconButton icon={Phone} action={"tel:" + encodeURIComponent(place.phone)} />
          ) : null}
          {place.email ? (
            <IconButton icon={Envelope} action={"mailto:" + encodeURIComponent(place.email)} />
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-8 flex flex-col justify-center items-center gap-6 text-center">
      <p className="font-semibold">{t("areYouSure")}</p>
      <p>{place.name} | {reservation.name} | <Person className="inline pb-[2px]" /> {reservation.count} | {new Date(reservation.date * 1000).toLocaleString(lang, { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric" })}</p>
      <div className="flex gap-4 flex-wrap items-center justify-center">
        <LoadingButton
          action={async () => {
            await cancelReservation(place, reservation, { emailKey: key });
            setReservation(await getReservation(place, reservation, { emailKey: key }));
          }}
          palette="red"
        >
          {t("delete")}
        </LoadingButton>
        <Button
          palette="secondary"
          action={() => {
            window.close();
          }}
        >
          {t("cancel")}
        </Button>
      </div>
    </div>
  );
}
