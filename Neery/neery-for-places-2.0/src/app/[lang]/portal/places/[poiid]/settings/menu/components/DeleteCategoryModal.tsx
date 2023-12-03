"use client";

import { useTranslation } from "@/app/[lang]/i18n/client";
import LoadingButton from "@/components/ui/LoadingButton";
import ModalBox from "@/components/ui/Modal/ModalBox";
import { createModalContext } from "@/components/ui/Modal/ModalContext";
import ModalError, { errorHandler } from "@/components/ui/Modal/ModalError";
import ModalTitle from "@/components/ui/Modal/ModalTitle";
import { MealCategory, deleteCategory } from "@/lib/api/mealcategories";
import { resolveI18n } from "@/lib/api/util";
import { atime } from "@/lib/atime";
import { ReactNode, useContext } from "react";
import { CategoryModalContext } from "./CategoryModal";

export type DeleteCategoryModalData = MealCategory;

export const DeleteCategoryModalContext =
  createModalContext<DeleteCategoryModalData>();

function DeleteCategoryModalInside({ onChange }: { onChange(): void }) {
  const ctx = useContext(DeleteCategoryModalContext);
  const { i18n } = useTranslation("translation");
  const { t } = useTranslation("portal/settings/menu");

  return (
    <>
      <ModalTitle context={DeleteCategoryModalContext}>
        {t("deleteCategory")}
      </ModalTitle>

      <p>
        Biztosan törlöd a(z) &quot;{resolveI18n(ctx.data?.name ?? {}, i18n)}
        &quot; kategóriát? Ez a művelet visszavonhatatlan.
      </p>
      <ModalError context={CategoryModalContext} />

      <LoadingButton
        palette="red"
        className="mt-[8px]"
        action={async () => {
          if (ctx.data === null) return;

          await errorHandler(
            deleteCategory(ctx.data.poiid, ctx.data.uuid),
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

export default function DeleteCategoryModal({
  children,
  onChange,
}: {
  children: ReactNode;
  onChange(): void;
}) {
  return (
    <ModalBox<DeleteCategoryModalData>
      context={DeleteCategoryModalContext}
      siblings={children}
    >
      <DeleteCategoryModalInside onChange={onChange} />
    </ModalBox>
  );
}
