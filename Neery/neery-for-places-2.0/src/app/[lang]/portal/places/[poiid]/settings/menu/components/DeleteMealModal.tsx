"use client";

import { useTranslation } from "@/app/[lang]/i18n/client";
import LoadingButton from "@/components/ui/LoadingButton";
import ModalBox from "@/components/ui/Modal/ModalBox";
import { createModalContext } from "@/components/ui/Modal/ModalContext";
import ModalError, { errorHandler } from "@/components/ui/Modal/ModalError";
import ModalTitle from "@/components/ui/Modal/ModalTitle";
import { Meal, deleteMeal } from "@/lib/api/meals";
import { resolveI18n } from "@/lib/api/util";
import { atime } from "@/lib/atime";
import { ReactNode, useContext } from "react";

export type DeleteMealModalData = Meal;

export const DeleteMealModalContext = createModalContext<DeleteMealModalData>();

function DeleteMealModalInside({ onChange }: { onChange(): void }) {
  const ctx = useContext(DeleteMealModalContext);
  const { i18n } = useTranslation("translation");
  const { t } = useTranslation("portal/settings/menu");

  return (
    <>
      <ModalTitle context={DeleteMealModalContext}>
        {t("deleteMeal")}
      </ModalTitle>

      <p>
        Biztosan törlöd a(z) &quot;{resolveI18n(ctx.data?.name ?? {}, i18n)}
        &quot; ételt? Ez a művelet visszavonhatatlan.
      </p>
      <ModalError context={DeleteMealModalContext} />
      <LoadingButton
        palette="red"
        className="mt-[8px]"
        action={async () => {
          if (ctx.data === null) return;

          await errorHandler(
            deleteMeal(ctx.data.poiid, ctx.data.uuid),
            ctx.setError
          );

          onChange();
          ctx.update(null);
          await atime(250);
        }}
      >
        {t("delete")}
      </LoadingButton>
    </>
  );
}

export default function DeleteMealModal({
  children,
  onChange,
}: {
  children: ReactNode;
  onChange(): void;
}) {
  return (
    <ModalBox<DeleteMealModalData>
      context={DeleteMealModalContext}
      siblings={children}
    >
      <DeleteMealModalInside onChange={onChange} />
    </ModalBox>
  );
}
