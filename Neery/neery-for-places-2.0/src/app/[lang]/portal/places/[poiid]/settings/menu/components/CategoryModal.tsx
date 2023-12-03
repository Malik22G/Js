"use client";

import {
  InputContainer,
  InputLabel,
} from "@/app/[lang]/land/[poiid]/reserve/components/Reserve/screens/ReserveDate/kit";
import Input from "@/components/ui/Input";
import ModalBox from "@/components/ui/Modal/ModalBox";
import { createModalContext } from "@/components/ui/Modal/ModalContext";
import ModalTitle from "@/components/ui/Modal/ModalTitle";
import { ReactNode, useContext } from "react";
import LoadingButton from "@/components/ui/LoadingButton";
import { atime } from "@/lib/atime";
import {
  MealCategory,
  MealCategoryPatch,
  MealCategoryPost,
  createCategory,
  patchCategory,
} from "@/lib/api/mealcategories";
import { PlaceOrID, placeToID } from "@/lib/api/places";
import { i18n } from "i18next";
import { useTranslation } from "@/app/[lang]/i18n/client";
import { resolveI18n } from "@/lib/api/util";
import ModalError, { errorHandler } from "@/components/ui/Modal/ModalError";

export type CategoryModalData = {
  uuid?: string;
  poiid: string;
  data: MealCategoryPatch;
};

export function createCategoryModalData(
  x: PlaceOrID | MealCategory,
  i18n: i18n
): CategoryModalData {
  if ((x as MealCategory).uuid !== undefined) {
    let category = x as MealCategory;
    return {
      uuid: category.uuid,
      poiid: category.poiid,
      data: {
        name: resolveI18n(category.name, i18n),
        description: resolveI18n(category.description, i18n),
      },
    };
  } else {
    let place = x as PlaceOrID;
    return { poiid: placeToID(place), data: {} };
  }
}

export const CategoryModalContext = createModalContext<CategoryModalData>();

function CategoryModalInside({ onChange }: { onChange(): void }) {
  const { t } = useTranslation("portal/settings/menu");
  let ctx = useContext(CategoryModalContext);
  let d: CategoryModalData = ctx.data ?? { poiid: "", data: {} };

  return (
    <>
      <ModalTitle context={CategoryModalContext}>
        {d.uuid !== undefined ? t("modifyCategory") : t("newCategory")}
      </ModalTitle>

      <InputContainer>
        <InputLabel>{t("name")}</InputLabel>

        <Input
          className="w-3/4"
          value={d.data.name ?? ""}
          onChange={(e) =>
            ctx.update({
              ...d,
              data: {
                ...d.data,
                name: e.target.value,
              },
            })
          }
          bare
        />
      </InputContainer>

      <InputContainer>
        <InputLabel>{t("description")}</InputLabel>

        <Input
          className="w-full ml-[12px]"
          value={d.data.description ?? ""}
          onChange={(e) =>
            ctx.update({
              ...d,
              data: {
                ...d.data,
                description: e.target.value,
              },
            })
          }
          bare
        />
      </InputContainer>
      <ModalError context={CategoryModalContext} />

      <LoadingButton
        palette="secondary"
        className="mt-[8px]"
        disabled={d.data.name === undefined || d.data.name.trim().length === 0}
        action={async () => {
          async function action() {
            if (d.uuid !== undefined) {
              await patchCategory(d.poiid, d.uuid, d.data);
            } else {
              await createCategory(d.poiid, d.data as MealCategoryPost);
            }
          }
          await errorHandler(action(), ctx.setError);
          onChange();
          ctx.update(null);
          await atime(250);
        }}
      >
        {d.uuid !== undefined ? t("modify") : t("create")}
      </LoadingButton>
    </>
  );
}

export default function CategoryModal({
  children,
  onChange,
}: {
  children: ReactNode;
  onChange(): void;
}) {
  return (
    <ModalBox<CategoryModalData>
      context={CategoryModalContext}
      siblings={children}
    >
      <CategoryModalInside onChange={onChange} />
    </ModalBox>
  );
}
