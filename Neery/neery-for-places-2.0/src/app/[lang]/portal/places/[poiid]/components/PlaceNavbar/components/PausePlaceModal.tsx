"use client";
import Input from "@/components/ui/Input";
import ModalBox from "@/components/ui/Modal/ModalBox";
import { createModalContext } from "@/components/ui/Modal/ModalContext";
import ModalTitle from "@/components/ui/Modal/ModalTitle";
import { ReactNode, useContext } from "react";
import LoadingButton from "@/components/ui/LoadingButton";
import { atime } from "@/lib/atime";
import { Place, patchPlace } from "@/lib/api/places";
import { useTranslation } from "@/app/[lang]/i18n/client";
import { useRouter } from "next/navigation";
import { localISOString } from "../../../calendar/components/ClosedEventModal";
import ModalError, { errorHandler } from "@/components/ui/Modal/ModalError";
export const ClosedPlaceContext = createModalContext<{
  unavailable_until?: number;
}>();

function PlaceInnerModal({ place }: { place: Place }) {
  let ctx = useContext(ClosedPlaceContext);
  const { t } = useTranslation("portal/navbar");
  const router = useRouter();
  return (
    <>
      <ModalTitle context={ClosedPlaceContext}>{t("disableButton")}</ModalTitle>
      <Input
        label="Pause Until"
        type="datetime-local"
        value={
          ctx.data?.unavailable_until &&
          localISOString(ctx.data?.unavailable_until)
        }
        onChange={(e) =>
          ctx.update({ unavailable_until: new Date(e.target.value).valueOf() })
        }
      />
      <ModalError context={ClosedPlaceContext} />
      <div className="flex gap-4 flex-wrap items-center justify-center">
        <LoadingButton
          palette="tertiary"
          className="mt-[8px]"
          action={async () => {
            await errorHandler(
              patchPlace(place, {
                unavailableUntil:
                  new Date().setFullYear(new Date().getFullYear() + 10) / 1000,
              }),
              ctx.setError
            );
            router.refresh();
            ctx.update(null);
            await atime(250);
          }}
        >
          {t("pauseUntilwithdrawn")}
        </LoadingButton>
        <LoadingButton
          palette="secondary"
          className="mt-[8px]"
          disabled={ctx.data?.unavailable_until ? false : true}
          action={async () => {
            ctx.setError(null);
            if (ctx.data?.unavailable_until) {
              await errorHandler(
                patchPlace(place, {
                  unavailableUntil: ctx.data.unavailable_until.valueOf() / 1000,
                }),
                ctx.setError
              );
              router.refresh();
            }
            ctx.update(null);
            await atime(250);
          }}
        >
          {t("disableButton")}
        </LoadingButton>
      </div>
    </>
  );
}

export default function PlaceModal({
  children,
  place,
}: {
  children: ReactNode;
  place: Place;
}) {
  return (
    <ModalBox context={ClosedPlaceContext} siblings={children}>
      <PlaceInnerModal place={place} />
    </ModalBox>
  );
}
