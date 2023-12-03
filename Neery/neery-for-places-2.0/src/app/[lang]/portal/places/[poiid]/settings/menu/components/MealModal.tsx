"use client";

import {
  InputContainer,
  InputLabel,
} from "@/app/[lang]/land/[poiid]/reserve/components/Reserve/screens/ReserveDate/kit";
import Input from "@/components/ui/Input";
import ModalBox from "@/components/ui/Modal/ModalBox";
import { createModalContext } from "@/components/ui/Modal/ModalContext";
import ModalTitle from "@/components/ui/Modal/ModalTitle";
import { ReactNode, useContext, useEffect, useRef, useState } from "react";
import LoadingButton from "@/components/ui/LoadingButton";
import { atime } from "@/lib/atime";
import { PlaceOrID, placeToID } from "@/lib/api/places";
import { i18n } from "i18next";
import { resolveI18n } from "@/lib/api/util";
import {
  Meal,
  MealPatch,
  MealPost,
  createMeal,
  deleteMealImage,
  patchMeal,
  uploadMenuImage,
} from "@/lib/api/meals";
import Select from "@/components/ui/Select";
import { MealCategory } from "@/lib/api/mealcategories";
import { useTranslation } from "@/app/[lang]/i18n/client";
import TextBox from "@/components/ui/TextBox";
import ModalError, { errorHandler } from "@/components/ui/Modal/ModalError";
import Image from "next/image";

export type MealModalData = {
  uuid?: string;
  poiid: string;
  chosenFile?: File;
  data: MealPatch;
};

export function createMealModalData(
  x: PlaceOrID | Meal,
  i18n: i18n
): MealModalData {
  if ((x as Meal).uuid !== undefined) {
    let meal = x as Meal;
    return {
      uuid: meal.uuid,
      poiid: meal.poiid,
      data: {
        name: resolveI18n(meal.name, i18n),
        description: resolveI18n(meal.description, i18n),
        price: meal.price,
        category: meal.category,
        tags: meal.tags,
        featured: meal.featured,
        image_url: meal.image_url,
      },
    };
  } else {
    let place = x as PlaceOrID;
    return { poiid: placeToID(place), data: {} };
  }
}

export const MealModalContext = createModalContext<MealModalData>();

function MealModalInside({
  onChange,
  categories,
}: {
  onChange(): void;
  categories: MealCategory[];
}) {
  let { i18n } = useTranslation("translation");
  const { t } = useTranslation("portal/settings/menu");
  let ctx = useContext(MealModalContext);
  let d: MealModalData = ctx.data ?? { poiid: "", data: {} };

  const inputRef = useRef<HTMLInputElement>(null);
  const [promise, setPromise] = useState<((x: unknown) => void) | undefined>(
    undefined
  );
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    undefined
  );
  useEffect(() => {
    if (d.chosenFile) {
      setImagePreview(URL.createObjectURL(d.chosenFile));
    } else {
      setImagePreview(undefined);
    }
  }, [d.chosenFile]);
  return (
    <>
      <ModalTitle context={MealModalContext}>
        {d.uuid !== undefined ? t("modifyMeal") : t("newMeal")}
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

        <TextBox
          rows={3}
          className="w-full ml-[12px]"
          wrapperClasses={"w-full mx-auto"}
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

      <InputContainer>
        <InputLabel>{t("category")}</InputLabel>

        <Select<string | undefined>
          className="ml-[12px]"
          value={d.data.category}
          values={categories.map((x) => [x.uuid, resolveI18n(x.name, i18n)])}
          setValue={(value) =>
            ctx.update({
              ...d,
              data: {
                ...d.data,
                category: value,
              },
            })
          }
        />
      </InputContainer>

      <InputContainer className="flex flex-col gap-[16px]">
        <InputLabel>{t("price")}</InputLabel>

        <div className="grid grid-cols-3 gap-[8px]">
          {(
            [
              ["inplace", t("inplace")],
              ["wolt", "Wolt"],
              ["foodpanda", "Foodpanda"],
            ] as const
          ).map((x) => (
            <div key={x[0]} className="flex flex-col gap-[4px] items-center">
              <p className="text-[14px]">{x[1]}</p>
              <Input
                className="w-full arrows-hidden"
                type="number"
                placeholder="Ft"
                value={(d.data.price ?? {})[x[0]] ?? ""}
                onChange={(e) =>
                  ctx.update({
                    ...d,
                    data: {
                      ...d.data,
                      price: {
                        ...d.data.price,
                        [x[0]]:
                          e.target.value.length === 0
                            ? undefined
                            : parseFloat(e.target.value),
                      },
                    },
                  })
                }
              />
            </div>
          ))}
        </div>
      </InputContainer>

      <InputContainer>
        <InputLabel>{t("featured")}</InputLabel>

        <input // TODO: this sucks - MG
          type="checkbox"
          checked={d.data.featured ?? false}
          onChange={(e) =>
            ctx.update({
              ...d,
              data: {
                ...d.data,
                featured: e.target.checked,
              },
            })
          }
        />
      </InputContainer>

      <InputContainer>
        <InputLabel>{t("uploadLabel")}</InputLabel>
        <InputContainer className="border-0 flex flex-col flex-1 gap-[8px] items-center">
          {(imagePreview || d.data.image_url !== undefined) && (
            <Image
              src={(imagePreview || d.data.image_url) as string}
              alt="mealImage"
              unoptimized={true}
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "200px", height: "auto" }}
            />
          )}
          <LoadingButton
            palette="secondary"
            action={() => {
              if (inputRef.current !== null) {
                inputRef.current.click();
                return new Promise((resolve) => setPromise(resolve));
              }
            }}
          >
            {t("uploadButton")}
          </LoadingButton>
          {d.data.image_url && (
            <LoadingButton
              palette="secondary"
              action={async () => {
                await deleteMealImage(d.poiid, d.uuid as string);
                ctx.update({
                  ...d,
                  data: { ...d.data, image_url: undefined },
                });
                onChange();
              }}
            >
              {t("deleteImage")}
            </LoadingButton>
          )}

          <input
            type="file"
            accept="image/jpeg, image/png"
            className="hidden"
            ref={inputRef}
            onChange={(e) => {
              const file = ((e.target as HTMLInputElement).files ?? [])[0];
              if (
                file !== undefined &&
                ["image/jpeg", "image/png"].includes(file.type)
              ) {
                ctx.update({ ...d, chosenFile: file });
              }
            }}
          />
        </InputContainer>
      </InputContainer>
      <ModalError context={MealModalContext} />
      <LoadingButton
        palette="secondary"
        className="mt-[8px]"
        disabled={
          d.data.name === undefined ||
          d.data.name.trim().length === 0 ||
          d.data.category === undefined
        }
        action={async () => {
          async function imageUpload(uuid: string) {
            if (d.chosenFile !== undefined && uuid !== undefined) {
              const uploadData = await uploadMenuImage(d.poiid, {
                uuid: uuid,
                type: d.chosenFile.type as "image/jpeg" | "image/png",
                length: d.chosenFile.size,
              });
              const awsUpload = await fetch(uploadData.uploadUrl, {
                method: "PUT",
                mode: "cors",
                body: d.chosenFile,
              });
              if (awsUpload.status >= 400) {
                const err = {
                  status: awsUpload.status,
                  body: await awsUpload.text(),
                };

                try {
                  const jsonBody = JSON.parse(err.body);
                  if (jsonBody) {
                    err.body = jsonBody;
                  }
                } catch {}

                throw err;
              }
            }
          }
          async function patchOrCreate() {
            if (d.uuid !== undefined) {
              await patchMeal(d.poiid, d.uuid, d.data);
              await imageUpload(d.uuid);
            } else {
              const data = await createMeal(d.poiid, {
                ...d.data,
                price: d.data.price ?? {},
              } as MealPost);
              await imageUpload(data.uuid);
            }
          }

          await errorHandler(patchOrCreate(), ctx.setError);

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

export default function MealModal({
  children,
  onChange,
  categories,
}: {
  children: ReactNode;
  onChange(): void;
  categories: MealCategory[];
}) {
  return (
    <ModalBox<MealModalData> context={MealModalContext} siblings={children}>
      <MealModalInside onChange={onChange} categories={categories} />
    </ModalBox>
  );
}
