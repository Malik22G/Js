"use client";

import {
  ConfigFormContextType,
  createFormContext,
} from "../../components/Config/ConfigForm";
import type React from "react";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import ConfigSubmit from "../../components/Config/ConfigSubmit";
import Input from "@/components/ui/Input";
import { InputGroup } from "../../components/Config/ConfigInput";
import TextBox from "../../../../../../../components/ui/TextBox";
import { Min, osm2wme } from "@/lib/wme";
import {
  createLunchMenu,
  deleteLunchImage,
  LunchMenu,
  LunchMenuPost,
  patchLunchMenu,
  uploadLunchMenuImage,
} from "@/lib/api/lunchmenu";
import Image from "next/image";
import lunchMenuPlaceholder from "@/images/lunch_menu_placeholder.png";
import { Place, PlaceOrID, patchPlace } from "@/lib/api/places";
import { useTranslation } from "@/app/[lang]/i18n/client";
import LoadingButton from "@/components/ui/LoadingButton";
import { ButtonButtonProps } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import IconButton from "@/components/ui/IconButton";
import { Delete } from "@/components/ui/icons";
import { ClosedWidgetContext } from "../../components/Config/ConfigWidget";

const days = Array(7).fill("d");

export type SettingsLunchMenuForm = {
  duration: [number | null, number | null];
  menus: DailyMenu[];
  image_url: string;
  poiid?: string;
  uuid?: string;
  fb_post?: string | null;
};

export type DailyMenu = {
  day: number;
  price: number;
  menu: string;
  savedFor: Date;
  savedCheck: boolean;
};

const defaultLunchMenuForm: SettingsLunchMenuForm = {
  duration: [0, 0],
  menus: [],
  image_url: "",
};

function nearestWeekDate(today: Date, dayNumber: number) {
  const currentDay = today.getDay();
  const dayDiff = (dayNumber - currentDay + 7) % 7;
  const nextDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + dayDiff
  );
  return nextDay;
}

function nextWeekDate(today: Date, dayOfWeek: number) {
  var nextWeekDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 7
  );
  var dayDifference = (dayOfWeek - today.getDay() + 7) % 7;
  nextWeekDate.setDate(nextWeekDate.getDate() + dayDifference);
  return nextWeekDate;
}

function standardizeDay(day: number) {
  return day === 0 ? 1 : day === 6 ? 0 : day + 1;
}

export const LunchMenuContext =
  createFormContext<SettingsLunchMenuForm>(defaultLunchMenuForm);

function LunchMenuDayInputs({
  day,
  isDisabled,
}: {
  day: number;
  isDisabled: boolean;
}) {
  const ctx = useContext(LunchMenuContext);
  const { t, i18n } = useTranslation("portal/settings/lunchMenu");
  const modifiedMenus = Array.from(ctx.form.menus);
  const toEditIndex = modifiedMenus.findIndex((m) => m.day === day);
  const stdDay = standardizeDay(day);
  const today = new Date(
    new Date().setHours(
      Min.getHours(ctx.form.duration[1] as number) ?? 0,
      Min.getMinutes(ctx.form.duration[1] as number),
      0,
      0
    )
  );
  const defaultMenu: DailyMenu = {
    day: day,
    menu: "",
    price: 0,
    savedFor: nearestWeekDate(today, stdDay),
    savedCheck: false,
  };

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    if (toEditIndex === -1) {
      const newMenu: DailyMenu = {
        ...defaultMenu,
        [name]:
          name === "price"
            ? parseInt(value)
            : name === "savedCheck"
            ? true
            : value,
      };
      name === "savedCheck" && (newMenu.savedFor = nextWeekDate(today, stdDay));
      modifiedMenus.push(newMenu);
    } else {
      modifiedMenus[toEditIndex] = {
        ...modifiedMenus[toEditIndex],
        [name]:
          name === "price"
            ? parseInt(value)
            : name === "savedCheck"
            ? !modifiedMenus[toEditIndex].savedCheck
            : value,
      };
      name === "savedCheck" &&
        (modifiedMenus[toEditIndex]?.savedCheck
          ? (modifiedMenus[toEditIndex].savedFor = nextWeekDate(today, stdDay))
          : (modifiedMenus[toEditIndex].savedFor = nearestWeekDate(
              today,
              stdDay
            )));
    }
    ctx.update({ menus: modifiedMenus });
  }

  return (
    <InputGroup>
      <TextBox
        label={t("menu")}
        maxLength={250}
        rows={4}
        value={ctx.form.menus[toEditIndex]?.menu ?? ""}
        onChange={handleInputChange}
        name="menu"
        disabled={isDisabled}
      />
      <Input
        value={ctx.form.menus[toEditIndex]?.price ?? ""}
        onChange={handleInputChange}
        label={t("price")}
        type="number"
        name="price"
        disabled={isDisabled}
      />
      <div className="flex flex-row">
        <div className="flex-1 flex items-center">
          <Input
            checked={ctx.form.menus[toEditIndex]?.savedCheck ? true : false}
            onChange={handleInputChange}
            label={t("saveNextWeek")}
            type="checkbox"
            name="savedCheck"
            rootClassName="!flex-row"
            disabled={isDisabled}
          />
        </div>
      </div>

      <div className="flex flex-row items-center justify-between">
        {ctx.form.menus[toEditIndex]?.savedFor && (
          <span className="text-sm">
            {t("validUntil")}{" "}
            {new Date(ctx.form.menus[toEditIndex].savedFor).toLocaleDateString(
              i18n.language
            )}
          </span>
        )}

        {ctx.form.menus[toEditIndex] && (
          <IconButton
            icon={Delete}
            onClick={async () => {
              modifiedMenus.splice(toEditIndex, 1);
              await ctx.update({ menus: modifiedMenus });
              await patchLunchMenu(
                ctx.form.poiid as PlaceOrID,
                {
                  ...ctx.form,
                  menus: modifiedMenus,
                } as LunchMenu
              );
            }}
          />
        )}
      </div>
    </InputGroup>
  );
}

export function _LunchMenuTimeInput({
  time,
  onChange,
}: {
  time: number | null;
  onChange: (time: number | null) => void;
}) {
  const [hours, setHours] = useState<number | null>(
    time !== null ? Min.getHours(time) : null
  );
  const [minutes, setMinutes] = useState<number | null>(
    time !== null ? Min.getMinutes(time) : null
  );

  return (
    <input
      type="time"
      value={
        hours !== null && minutes !== null
          ? `${hours.toString().padStart(2, "0")}:${minutes
              .toString()
              .padStart(2, "0")}`
          : ""
      }
      onChange={(e) => {
        let tok = e.target.value.split(":");
        if (tok.length !== 2) {
          tok = ["00", "00"];
        }

        const [hours, minutes] = tok.map((x) => parseInt(x, 10));
        onChange(Min.fromParams(0, hours, minutes));
        setHours(hours);
        setMinutes(minutes);
      }}
    />
  );
}

export function _UploadImageButton({
  children,
  onChange,
  ...props
}: Omit<ButtonButtonProps, "action"> & {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) {
  const [promise, setPromise] = useState<((x: unknown) => void) | undefined>(
    undefined
  );
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <LoadingButton
        {...props}
        action={() => {
          if (inputRef.current !== null) {
            inputRef.current.click();
            return new Promise((resolve) => setPromise(resolve));
          }
        }}
      >
        {children}
      </LoadingButton>

      <input
        type="file"
        accept="image/jpeg, image/png"
        className="hidden"
        ref={inputRef}
        onChange={onChange}
      />
    </>
  );
}

export function _LunchMenuInputs({ place }: { place: Place }) {
  const ctx = useContext(LunchMenuContext);
  const { t } = useTranslation("portal/settings/lunchMenu");

  function handleTimeChange(time: number | null, index: number) {
    const newDuration = [...ctx.form.duration] as [
      number | null,
      number | null
    ];
    newDuration[index] = time;
    ctx.update({ duration: newDuration });
  }
  const router = useRouter();
  return (
    <div className="flex flex-col mb-6 w-full gap-2">
      <div className="text-primary font-semibold">{t("span")}</div>
      <div className="flex flex-row items-start justify-start">
        <_LunchMenuTimeInput
          time={ctx.form.duration[0]}
          onChange={(time) => handleTimeChange(time, 0)}
        />
        <div className="mx-4">-</div>
        <_LunchMenuTimeInput
          time={ctx.form.duration[1]}
          onChange={(time) => handleTimeChange(time, 1)}
        />
      </div>
      <div className="flex flex-col items-start justify-start lg:w-1/2">
        <div className="text-primary font-semibold ">{t("image")}</div>
        <Image
          className="rounded-md my-2"
          src={ctx.form.image_url ? ctx.form.image_url : lunchMenuPlaceholder}
          unoptimized={ctx.form.image_url !== "" ? true : false}
          {...(ctx.form.image_url !== "" && { width: 1092, height: 612 })}
          alt={"Lunch Menu Background"}
        />
        <_UploadImageButton
          palette="secondary"
          onChange={async (e) => {
            const file = ((e.target as HTMLInputElement).files ?? [])[0];
            if (file !== undefined) {
              if (!ctx.form.uuid || !ctx.form.poiid) {
                await createLunchMenu(place, ctx.form as LunchMenuPost);
              }
              const uploadData = await uploadLunchMenuImage(place, {
                type: file.type as "image/jpeg" | "image/png",
                length: file.size,
              });
              const awsUpload = await fetch(uploadData.uploadUrl, {
                method: "PUT",
                mode: "cors",
                body: file,
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
                } catch (_) {}

                throw err;
              }

              router.refresh();
            }
          }}
        >
          {t("upload")}
        </_UploadImageButton>
        {ctx.form.image_url && (
          <LoadingButton
            action={async () => {
              if (ctx.form.uuid) {
                await deleteLunchImage(place, ctx.form.uuid);
              }
              router.refresh();
            }}
          >
            {t("deleteImage")}
          </LoadingButton>
        )}
      </div>
    </div>
  );
}

export function _FBPost({ place }: { place: Place }) {
  const { t } = useTranslation("portal/settings/lunchMenu");
  const ctx = useContext(LunchMenuContext);
  return (
    <div className="w-full">
      {place.auto_fb_post !== undefined || ctx.form.fb_post !== undefined ? (
        <TextBox
          placeholder={t("autoFBPost")}
          onChange={(e) =>
            ctx.update({
              ...ctx.form,
              fb_post: e.target.value !== "" ? e.target.value : null,
            })
          }
          {...(place.auto_fb_post && { defaultValue: place.auto_fb_post })}
        />
      ) : (
        <Input
          type="checkbox"
          label={t("autoFBPost")}
          rootClassName="!flex-row"
          onChange={() => ctx.update({ ...ctx.form, fb_post: null })}
        />
      )}
    </div>
  );
}

export function _LunchMenu({ place }: { place: Place }) {
  const { t } = useTranslation("portal/settings/lunchMenu");
  const { opening } = place;

  const daysOpen = useMemo(() => {
    if (!opening) return [];

    return osm2wme(opening).map((x) => Min.getDay(x[0]));
  }, [opening]);

  if (!opening) return null;

  return (
    <div className="w-full h-full flex flex-col">
      <_LunchMenuInputs place={place} />
      <div className="flex flex-row flex-wrap w-full">
        {days.map((day, i) => {
          const isDisabled = !daysOpen.includes(i);

          return (
            <div
              key={`day-${i}`}
              className="mb-4 flex flex-col mr-4 bg-primary-xlight rounded-lg py-2 px-3"
            >
              <div className="text-primary font-semibold">{t(`days.${i}`)}</div>
              <LunchMenuDayInputs day={i} isDisabled={isDisabled} />
            </div>
          );
        })}
      </div>
      {/*<_FBPost place={place} />*/}
    </div>
  );
}
async function handleSave(
  ctx: ConfigFormContextType<SettingsLunchMenuForm>,
  poiid: string
) {
  if (ctx.form.poiid && ctx.form.uuid) {
    await patchLunchMenu(poiid, ctx.form as LunchMenu);
  } else {
    await createLunchMenu(poiid, ctx.form as LunchMenuPost);
  }
  if (ctx.form.fb_post !== undefined) {
    await patchPlace(poiid, { auto_fb_post: ctx.form.fb_post });
  }
}
export function _LunchMenuSubmit({ poiid }: { poiid: string }) {
  const ctx = useContext(LunchMenuContext);
  const { t } = useTranslation("portal/settings/lunchMenu");
  const wtx = useContext(ClosedWidgetContext);
  useEffect(() => {
    wtx.update({ key: 1 });
  }, []);
  return (
    <ConfigSubmit
      submit={async () => {
        await handleSave(ctx, poiid);
        wtx.data?.key && wtx.update({ key: wtx.data?.key + 1 });
      }}
      ctx={ctx}
    >
      {t("save")}
    </ConfigSubmit>
  );
}
