"use client";

import LoadingButton from "@/components/ui/LoadingButton";
import ModalBox from "@/components/ui/Modal/ModalBox";
import { createModalContext } from "@/components/ui/Modal/ModalContext";
import ModalTitle from "@/components/ui/Modal/ModalTitle";
import { Divvy, deleteDivvy } from "@/lib/api/divvies";
import { atime } from "@/lib/atime";
import { ReactNode, useContext } from "react";
import { useTranslation } from "@/app/[lang]/i18n/client";
import ModalError, { errorHandler } from "@/components/ui/Modal/ModalError";
import UnderTierBadge from "../../../components/UnderTierBadge";
import { Place } from "@/lib/api/places";

export type DeleteDivvyModalData = Divvy;

export const DeleteDivvyModalContext =
  createModalContext<DeleteDivvyModalData>();

function DeleteDivvyModalInside({
  onChange,
  place,
}: {
  onChange(): void,
  place: Place,
}) {
  const ctx = useContext(DeleteDivvyModalContext);
  const { t } = useTranslation("portal/settings/tables");
  return (
    <>
      <ModalTitle context={DeleteDivvyModalContext}>
        {t("deleteGroup")}
      </ModalTitle>

      <p>
        Biztosan törlöd a(z) &quot;{ctx.data?.name ?? ""}&quot; csoportot? Ez a
        művelet visszavonhatatlan.
      </p>
      <ModalError context={DeleteDivvyModalContext} />

      {place.tier >= 1 ? (
        <LoadingButton
          palette="red"
          className="mt-[8px]"
          action={async () => {
            if (ctx.data === null) return;

            await errorHandler(
              deleteDivvy(ctx.data.poiid, ctx.data.uuid),
              ctx.setError
            );

            onChange();
            ctx.update(null);
            await atime(250);
          }}
        >
          {t("delete")}
        </LoadingButton>
      ) : (
        <UnderTierBadge
          place={place}
        />
      )}
    </>
  );
}

export default function DeleteDivvyModal({
  children,
  onChange,
  place,
}: {
  children: ReactNode,
  onChange(): void,
  place: Place,
}) {
  return (
    <ModalBox<DeleteDivvyModalData>
      context={DeleteDivvyModalContext}
      siblings={children}
    >
      <DeleteDivvyModalInside onChange={onChange} place={place} />
    </ModalBox>
  );
}
