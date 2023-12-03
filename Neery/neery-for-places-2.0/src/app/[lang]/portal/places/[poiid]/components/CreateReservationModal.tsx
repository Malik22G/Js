"use client";

import InputDate from "@/app/[lang]/land/[poiid]/reserve/components/Reserve/screens/ReserveDate/InputDate";
import InputTime from "@/app/[lang]/land/[poiid]/reserve/components/Reserve/screens/ReserveDate/InputTime";
import { InputLabel } from "@/app/[lang]/land/[poiid]/reserve/components/Reserve/screens/ReserveDate/kit";
import Input from "@/components/ui/Input";
import LoadingButton from "@/components/ui/LoadingButton";
import ModalBox from "@/components/ui/Modal/ModalBox";
import { createModalContext } from "@/components/ui/Modal/ModalContext";
import ModalTitle from "@/components/ui/Modal/ModalTitle";
import { Place } from "@/lib/api/places";
import {
  NaiveDateTime,
  ReservationB2BPost,
  createB2BReservation,
  date2ndt,
} from "@/lib/api/reservations";
import { Zone } from "@/lib/api/zones";
import { atime } from "@/lib/atime";
import { ReactNode, useContext, useState } from "react";
import { useTranslation } from "@/app/[lang]/i18n/client";
import Button from "@/components/ui/Button";
import ModalError, { errorHandler } from "@/components/ui/Modal/ModalError";
import UnderTierBadge from "./UnderTierBadge";
import { Divvy } from "@/lib/api/divvies";
import TableSelector from "./TableSelector";
import ajv from "@/lib/ajv";
import { Schema } from "ajv";

export type CreateReservationModalData = {
  uuid?: string;
  poiid: string;
  data: Partial<ReservationB2BPost>;
};

export const CreateReservationModalContext =
  createModalContext<CreateReservationModalData>();

export const FormEmailValidation: Schema = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
  },
  required: ["email"],
  additionalProperties: true,
};

function CreateReservationModalInside({
  place,
  onChange,
  zones,
  divisions,
}: {
  place: Place;
  onChange(): void;
  zones: Zone[];
  divisions: Divvy[];
}) {
  const ctx = useContext(CreateReservationModalContext);
  const d = ctx.data ?? { poiid: "", data: {} };

  const { t } = useTranslation("portal/calendar");

  const [dateValid, setDateValid] = useState<boolean>(false);
  const [timeValid, setTimeValid] = useState<boolean>(false);

  const premadeCounts = [2, 3, 4, 5, 6];

  return (
    <>
      <ModalTitle context={CreateReservationModalContext}>
        {d.uuid !== undefined ? t("modifyReservation") : t("createReservation")}
      </ModalTitle>

      <div
        className={`
        p-[12px]
        border border-neutral-300 rounded-[8px]
        font-medium leading-mobile
        flex flex-col gap-2
      `}
      >
        <div className="flex justify-between items-center">
          <InputLabel>{t("count")}</InputLabel>

          <Input
            type="number"
            value={d.data.count ?? 1}
            min={1}
            step={1}
            onChange={(e) =>
              ctx.update({
                ...d,
                data: {
                  ...d.data,
                  count: parseInt(e.target.value, 10),
                },
              })
            }
          />
        </div>

        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${premadeCounts.length}, minmax(0, 1fr))`,
          }}
        >
          {premadeCounts.map((x) => (
            <Button
              key={x}
              size="small"
              palette="secondary"
              onClick={() =>
                ctx.update({
                  ...d,
                  data: {
                    ...d.data,
                    count: x,
                  },
                })
              }
            >
              {x}
            </Button>
          ))}
        </div>
      </div>

      {ctx.data !== null ? (
        <>
          <InputDate
            place={place}
            count={d.data.count ?? 1}
            mrd={186}
            date={
              d.data.date === undefined
                ? null
                : new Date(
                    d.data.date.year,
                    d.data.date.month - 1,
                    d.data.date.date,
                    d.data.date.hour,
                    d.data.date.minute
                  )
            }
            setDate={(date) => {
              if (ctx.data === null) return;
              ctx.update({
                ...d,
                data: {
                  ...d.data,
                  date: date === null ? undefined : date2ndt(date),
                },
              });
            }}
            setDateValid={setDateValid}
          />

          <InputTime
            place={place}
            count={d.data.count ?? 1}
            mrd={186}
            date={
              d.data.date === undefined
                ? null
                : new Date(
                    d.data.date.year,
                    d.data.date.month - 1,
                    d.data.date.date,
                    d.data.date.hour,
                    d.data.date.minute
                  )
            }
            setDate={(date) => {
              if (ctx.data === null) return;

              ctx.update({
                ...d,
                data: {
                  ...d.data,
                  date: date === null ? undefined : date2ndt(date),
                },
              });
            }}
            dateValid={dateValid}
            setTimeValid={setTimeValid}
            fullscreen={false}
            force={true} // TODO: change this to a checkbox
          />
        </>
      ) : null}

      <TableSelector
        divisions={divisions}
        zones={zones}
        selectedZones={d.data.zoneId}
        data={ctx.data}
        onChange={(zones) => {
          ctx.update({
            ...d,
            data: {
              ...d.data,
              zoneId: zones,
            },
          });
        }}
        manual={!place.autotable}
        toggleValue={(zoneId) => {
          ctx.update({
            ...d,
            data: {
              ...d.data,
              zoneId:
                zoneId === undefined
                  ? undefined
                  : (d.data.zoneId ?? [])?.includes(zoneId)
                  ? (d.data.zoneId ?? []).filter((x) => x !== zoneId)
                  : [...(d.data.zoneId ?? []), zoneId],
            },
          });
        }}
      />

      <div className="flex items-center gap-2 text-neutral-600">
        <input
          type="checkbox"
          checked={d.data.fixedZones ?? false}
          onChange={(e) =>
            ctx.update({
              ...d,
              data: {
                ...d.data,
                fixedZones: e.target.checked,
              },
            })
          }
        />
        {t("fixedZones")}
      </div>

      <Input
        label={t("name")}
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
      />

      <Input
        label={t("mail")}
        type="email"
        value={d.data.email ?? ""}
        autoComplete="email"
        error={
          d.data.email !== undefined &&
          d.data.email.trim() !== "" &&
          !ajv.validate(FormEmailValidation, d.data)
            ? true
            : undefined
        }
        onChange={(e) =>
          ctx.update({
            ...d,
            data: {
              ...d.data,
              email: e.target.value,
            },
          })
        }
      />

      <Input
        label={t("phone")}
        type="tel"
        value={d.data.phone ?? ""}
        onChange={(e) =>
          ctx.update({
            ...d,
            data: {
              ...d.data,
              phone: e.target.value,
            },
          })
        }
      />

      <Input
        label={t("placeNote")}
        value={d.data.place_note ?? ""}
        onChange={(e) =>
          ctx.update({
            ...d,
            data: {
              ...d.data,
              place_note: e.target.value,
            },
          })
        }
      />

      <ModalError context={CreateReservationModalContext} />
      {place.tier >= 1 ? (
        <LoadingButton
          className="mt-[8px] shrink-0"
          palette="secondary"
          disabled={
            !dateValid ||
            !timeValid ||
            d.data.date === undefined ||
            (d.data.email !== undefined &&
              d.data.email.trim() !== "" &&
              !ajv.validate(FormEmailValidation, d.data)) ||
            (!place.autotable && !d.data.zoneId) ||
            d.data.zoneId?.length === 0
          }
          action={async () => {
            if (d.data.date === undefined) return;

            if (d.uuid === undefined) {
              await errorHandler(
                createB2BReservation(place, {
                  ...d.data,
                  date: d.data.date as NaiveDateTime,
                  count: d.data.count ?? 1,
                }),
                ctx.setError
              );
            } else {
              return ctx.setError("Patching reservations is unimplemented");
            }

            onChange();
            ctx.update(null);
            await atime(250);
          }}
        >
          {d.uuid !== undefined ? t("modify") : t("create")}
        </LoadingButton>
      ) : (
        <UnderTierBadge place={place} />
      )}
    </>
  );
}

export default function CreateReservationModal({
  children,
  place,
  zones,
  divisions,
  onChange,
}: {
  children: ReactNode;
  place: Place;
  zones: Zone[];
  divisions: Divvy[];
  onChange(): void;
}) {
  return (
    <ModalBox<CreateReservationModalData>
      context={CreateReservationModalContext}
      siblings={children}
    >
      <CreateReservationModalInside
        place={place}
        onChange={onChange}
        zones={zones}
        divisions={divisions}
      />
    </ModalBox>
  );
}
