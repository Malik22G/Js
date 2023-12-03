"use client";

import { ReactNode, useContext, useEffect, useRef, useState } from "react";
import DeleteMealModal, {
  DeleteMealModalContext,
} from "./components/DeleteMealModal";
import { useRouter } from "next/navigation";
import IconButton, { IconButtonButtonProps } from "@/components/ui/IconButton";
import { ArrowLeft, Pen, X } from "@/components/ui/icons";
import { Meal, reorderMeal, uploadWoltMenu } from "@/lib/api/meals";
import DeleteCategoryModal, {
  DeleteCategoryModalContext,
} from "./components/DeleteCategoryModal";
import { MealCategory, reorderCategory } from "@/lib/api/mealcategories";
import CategoryModal, {
  CategoryModalContext,
  createCategoryModalData,
} from "./components/CategoryModal";
import { useTranslation } from "@/app/[lang]/i18n/client";
import MealModal, {
  MealModalContext,
  createMealModalData,
} from "./components/MealModal";
import Button, { ButtonButtonProps } from "@/components/ui/Button";
import { PlaceOrID } from "@/lib/api/places";
import { ManualLoadingButton } from "@/components/ui/LoadingButton";
import { ClosedWidgetContext } from "../../components/Config/ConfigWidget";

export function _DeleteMealModal({ children }: { children: ReactNode }) {
  const router = useRouter();
  const wtx = useContext(ClosedWidgetContext);

  return (
    <DeleteMealModal
      onChange={() => {
        router.refresh();
        wtx.data?.key && wtx.update({ key: wtx.data?.key + 1 });
      }}
    >
      {children}
    </DeleteMealModal>
  );
}

export function _DeleteMealButton({
  meal,
  ...props
}: Omit<IconButtonButtonProps, "icon" | "action"> & {
  meal: Meal;
}) {
  const ctx = useContext(DeleteMealModalContext);
  return <IconButton icon={X} action={() => ctx.update(meal)} {...props} />;
}

export function _CategoryModal({ children }: { children: ReactNode }) {
  const router = useRouter();
  const wtx = useContext(ClosedWidgetContext);

  return (
    <CategoryModal
      onChange={() => {
        router.refresh();
        wtx.data?.key && wtx.update({ key: wtx.data?.key + 1 });
      }}
    >
      {children}
    </CategoryModal>
  );
}

export function _CreateCategoryButton({
  place,
  children,
  ...props
}: Omit<ButtonButtonProps, "action"> & {
  place: PlaceOrID;
}) {
  const { i18n } = useTranslation("translation");
  const ctx = useContext(CategoryModalContext);
  const wtx = useContext(ClosedWidgetContext);

  return (
    <Button
      action={() => {
        ctx.update(createCategoryModalData(place, i18n));
        wtx.data?.key && wtx.update({ key: wtx.data?.key + 1 });
      }}
      {...props}
    >
      {children}
    </Button>
  );
}

export function _EditCategoryButton({
  category,
  ...props
}: Omit<IconButtonButtonProps, "icon" | "action"> & {
  category: MealCategory;
}) {
  const ctx = useContext(CategoryModalContext);
  const { i18n } = useTranslation("translation");
  const wtx = useContext(ClosedWidgetContext);

  return (
    <IconButton
      icon={Pen}
      action={() => {
        ctx.update(createCategoryModalData(category, i18n));
        wtx.data?.key && wtx.update({ key: wtx.data?.key + 1 });
      }}
      {...props}
    />
  );
}

export function _DeleteCategoryModal({ children }: { children: ReactNode }) {
  const router = useRouter();
  const wtx = useContext(ClosedWidgetContext);

  return (
    <DeleteCategoryModal
      onChange={() => {
        router.refresh();
        wtx.data?.key && wtx.update({ key: wtx.data?.key + 1 });
      }}
    >
      {children}
    </DeleteCategoryModal>
  );
}

export function _DeleteCategoryButton({
  category,
  ...props
}: Omit<IconButtonButtonProps, "icon" | "action"> & {
  category: MealCategory;
}) {
  const ctx = useContext(DeleteCategoryModalContext);

  return <IconButton icon={X} action={() => ctx.update(category)} {...props} />;
}

export function _ReorderMealButton({
  meal,
  direction,
  iconClass,
  ...props
}: Omit<IconButtonButtonProps, "icon" | "action"> & {
  meal: Meal;
  direction: -1 | 1;
}) {
  const router = useRouter();
  const wtx = useContext(ClosedWidgetContext);

  return (
    <IconButton
      icon={ArrowLeft}
      action={async () => {
        await reorderMeal(meal.poiid, meal, direction);
        wtx.data?.key && wtx.update({ key: wtx.data?.key + 1 });
        router.refresh();
      }}
      iconClass={`${iconClass ?? ""} ${
        direction === 1 ? "rotate-90" : "-rotate-90"
      }`}
      {...props}
    />
  );
}

export function _ReorderCategoryButton({
  category,
  direction,
  iconClass,
  ...props
}: Omit<IconButtonButtonProps, "icon" | "action"> & {
  category: MealCategory;
  direction: -1 | 1;
}) {
  const router = useRouter();
  const wtx = useContext(ClosedWidgetContext);

  return (
    <IconButton
      icon={ArrowLeft}
      action={async () => {
        await reorderCategory(category.poiid, category, direction);
        wtx.data?.key && wtx.update({ key: wtx.data?.key + 1 });

        router.refresh();
      }}
      iconClass={`${iconClass ?? ""} ${
        direction === 1 ? "rotate-90" : "-rotate-90"
      }`}
      {...props}
    />
  );
}

export function _MealModal({
  categories,
  children,
}: {
  categories: MealCategory[];
  children: ReactNode;
}) {
  const router = useRouter();
  const wtx = useContext(ClosedWidgetContext);

  return (
    <MealModal
      categories={categories}
      onChange={() => {
        router.refresh();
        wtx.data?.key && wtx.update({ key: wtx.data?.key + 1 });
      }}
    >
      {children}
    </MealModal>
  );
}

export function _CreateMealButton({
  place,
  children,
  ...props
}: Omit<ButtonButtonProps, "action"> & {
  place: PlaceOrID;
}) {
  const { i18n } = useTranslation("translation");
  const ctx = useContext(MealModalContext);
  return (
    <Button
      action={() => ctx.update(createMealModalData(place, i18n))}
      {...props}
    >
      {children}
    </Button>
  );
}

export function EditMealButton({
  meal,
  ...props
}: Omit<IconButtonButtonProps, "action" | "icon"> & {
  meal: Meal;
}) {
  const { i18n } = useTranslation("translation");
  const ctx = useContext(MealModalContext);

  return (
    <IconButton
      icon={Pen}
      action={() => ctx.update(createMealModalData(meal, i18n))}
      {...props}
    />
  );
}

export function WoltUploadButton({
  place,
  children,
  ...props
}: Omit<ButtonButtonProps, "action"> & {
  place: PlaceOrID;
}) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const wtx = useContext(ClosedWidgetContext);
  useEffect(() => {
    wtx.update({ key: 1 });
  }, []);
  return (
    <>
      <ManualLoadingButton
        loading={loading}
        action={() => {
          fileInput.current?.click();
        }}
        {...props}
      >
        {children}
      </ManualLoadingButton>

      <input
        type="file"
        accept="application/json"
        ref={fileInput}
        className="hidden"
        onChange={(e) => {
          if (e.target.files !== null && e.target.files.length > 0) {
            let file = e.target.files[0];

            setLoading(true);

            let reader = new FileReader();
            reader.onload = async () => {
              if (reader.result === null) return;
              await uploadWoltMenu(place, reader.result as string);
              router.refresh();
              setLoading(false);
            };
            reader.readAsText(file);
          }
        }}
      />
    </>
  );
}
