"use client";

import { useTranslation } from "@/app/[lang]/i18n/client";
import LoadingButton from "@/components/ui/LoadingButton";
import ModalBox from "@/components/ui/Modal/ModalBox";
import { createModalContext } from "@/components/ui/Modal/ModalContext";
import ModalTitle from "@/components/ui/Modal/ModalTitle";
import {
  Person,
  Calendar,
  Envelope,
  Phone,
  List,
  WheatAllergy,
  Comment,
  Utensils,
  Clock,
} from "@/components/ui/icons";
import {
  Reservation,
  date2ndt,
  updateReservation,
} from "@/lib/api/reservations";
import { atime } from "@/lib/atime";
import {
  ReactNode,
  createElement,
  useContext,
  useEffect,
  useState,
} from "react";
import { ReservationDeleteModalContext } from "./ReservationDeleteModal";
import { ReservationAcceptModalContext } from "./ReservationAcceptModal";
import { ReservationRejectModalContext } from "./ReservationRejectModal";
import { Customer, getCustomer } from "@/lib/api/customers";
import Input, { InputProps } from "@/components/ui/Input";
import { localISOString } from "../calendar/components/ClosedEventModal";
import { Zone } from "@/lib/api/zones";
import ModalError, { errorHandler } from "@/components/ui/Modal/ModalError";
import { Place } from "@/lib/api/places";
import UnderTierBadge from "./UnderTierBadge";
import TableSelector from "./TableSelector";
import { Divvy } from "@/lib/api/divvies";
import { FormEmailValidation } from "./CreateReservationModal";
import ajv from "@/lib/ajv";
import { Min } from "@/lib/wme";

export type ReservationModalData = Reservation;

export const ReservationModalContext = createModalContext<Reservation>();

function InfoRow({
  icon,
  textClass,
  value,
  suffix,
  link,
}: {
  icon?: React.FC<{ className: string }>;
  textClass?: string;
  value?: string | number | null;
  suffix?: string;
  link?: string;
}) {
  if (
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.length === 0)
  )
    return null;

  return (
    <div className="flex gap-[8px] items-center">
      {icon !== undefined
        ? createElement(icon, { className: "w-[1rem] shrink-0" })
        : undefined}

      {link !== undefined ? (
        <a href={link} className={textClass}>
          {value}
          {suffix}
        </a>
      ) : (
        <span className={textClass}>
          {value}
          {suffix}
        </span>
      )}
    </div>
  );
}

export function ReservationInfo({
  reservation: res,
}: {
  reservation?: Reservation;
}) {
  const { i18n, t: tTags } = useTranslation("tags");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const { t } = useTranslation("portal/calendar");

  useEffect(() => {
    if (res !== undefined) {
      if (res.customer_id !== undefined) {
        if (customer === null || customer.uuid !== res.customer_id) {
          getCustomer(res.poiid, res.customer_id).then(setCustomer);
        }
      } else {
        setCustomer(null);
      }
    } else {
      setCustomer(null);
    }
  }, [res, customer]);

  return (
    <>
      <div>
        <InfoRow textClass="font-medium" value={res?.name} />
        <InfoRow textClass="text-[14px]" value={customer?.comment} />
      </div>
      <InfoRow icon={Person} value={res?.count} suffix={` ${t("capita")}`} />
      <InfoRow
        icon={Calendar}
        value={
          res?.date
            ? new Date(res.date * 1000).toLocaleString(i18n.language, {
                year: "numeric",
                month: "short",
                day: "numeric",
                weekday: "long",
                hour: "numeric",
                minute: "numeric",
              }) +
              " - " +
              new Date((res.endDate ?? res.date) * 1000).toLocaleString(
                i18n.language,
                {
                  hour: "numeric",
                  minute: "numeric",
                }
              )
            : undefined
        }
      />
      <InfoRow
        icon={Envelope}
        value={res?.email}
        link={"mailto:" + encodeURIComponent(res?.email ?? "")}
      />
      <InfoRow
        icon={Phone}
        value={res?.phone}
        link={"tel:" + encodeURIComponent(res?.phone ?? "")}
      />
      <InfoRow
        icon={List}
        value={
          res?.services && res.services.length > 0
            ? res.services.map((x) => tTags(x)).join(", ")
            : null
        }
      />
      <InfoRow
        icon={WheatAllergy}
        value={
          res?.allergens && res.allergens.length > 0
            ? res.allergens.map((x) => tTags(x)).join(", ")
            : null
        }
      />
      <InfoRow icon={Comment} value={res?.comment} />
      {res?.is_lunch && <InfoRow icon={Utensils} value={t("lunchMenu")} />}
    </>
  );
}

function InputRow({
  icon,
  iconClass,
  suffix,
  ...rest
}: {
  icon?: React.FC<{ className: string }>;
  iconClass?: string;
  suffix?: string;
} & InputProps) {
  return (
    <div className="flex gap-[8px] items-center">
      {icon !== undefined
        ? createElement(icon, { className: `w-[1rem] shrink-0 ${iconClass}` })
        : undefined}

      <Input bare={true} {...rest} />
      {suffix}
    </div>
  );
}

function ReservationModalInside({
  onChange,
  zones,
  place,
  divisions,
}: {
  onChange?(): void;
  zones: Zone[];
  divisions: Divvy[];
  place: Place;
}) {
  const ctx = useContext(ReservationModalContext);
  const delCtx = useContext(ReservationDeleteModalContext);
  const accCtx = useContext(ReservationAcceptModalContext);
  const rejCtx = useContext(ReservationRejectModalContext);
  const { t } = useTranslation("portal/calendar");
  const { t: tTags } = useTranslation("tags");
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    if (ctx.data !== null) {
      if (ctx.data.customer_id !== undefined) {
        if (customer === null || customer.uuid !== ctx.data.customer_id) {
          getCustomer(ctx.data.poiid, ctx.data.customer_id).then(setCustomer);
        }
      } else {
        setCustomer(null);
      }
    } else {
      setCustomer(null);
    }
  }, [ctx.data, customer]);
  return (
    <>
      <ModalTitle context={ReservationModalContext}>
        {t("reservationData")}
      </ModalTitle>

      {ctx.data?.status === "PENDING" ? (
        <ReservationInfo reservation={ctx.data} />
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col md:flex-row gap-2 md:gap-4">
              <InputRow
                icon={Person}
                value={ctx.data?.name ?? ""}
                onChange={(e) =>
                  ctx.data
                    ? ctx.update({
                        ...ctx.data,
                        name: e.target.value,
                      })
                    : null
                }
              />
              <InfoRow textClass="text-[14px]" value={customer?.comment} />

              <InputRow
                icon={Person}
                value={ctx.data?.count ?? 0}
                type="number"
                min={0}
                suffix={` ${t("capita")}`}
                onChange={(e) =>
                  ctx.data
                    ? ctx.update({
                        ...ctx.data,
                        count: parseInt(e.target.value, 10),
                      })
                    : null
                }
              />
            </div>

            <div className="flex flex-col md:flex-row gap-2 md:gap-4">
              <InputRow
                icon={Calendar}
                value={
                  ctx.data?.date
                    ? localISOString(ctx.data.date * 1000)
                    : //   year: "numeric",
                      //   month: "short",
                      //   day: "numeric",
                      //   weekday: "long",
                      //   hour: "numeric",
                      //   minute: "numeric",
                      // }) + " - " + new Date((ctx.data.endDate ?? ctx.data.date) * 1000).toLocaleString(i18n.language, {
                      //   hour: "numeric",
                      //   minute: "numeric",
                      // })
                      undefined
                }
                type="datetime-local"
                onChange={(e) =>
                  ctx.data
                    ? ctx.update({
                        ...ctx.data,
                        date: new Date(e.target.value).valueOf() / 1000,
                        ...(ctx.data.endDate && {
                          endDate:
                            new Date(
                              new Date(e.target.value).valueOf() +
                                Math.floor(
                                  (new Date(ctx.data.endDate).valueOf() -
                                    new Date(ctx.data.date).valueOf()) /
                                    60
                                ) *
                                  60 *
                                  1000
                            ).valueOf() / 1000,
                        }),
                      })
                    : null
                }
              />
              <InputRow
                icon={Clock}
                iconClass="w-[1.5rem] h-[1.5rem]"
                value={
                  ctx.data?.endDate
                    ? Math.floor(
                        (new Date(ctx.data.endDate).valueOf() -
                          new Date(ctx.data.date).valueOf()) /
                          60
                      )
                    : //   year: "numeric",
                      //   month: "short",
                      //   day: "numeric",
                      //   weekday: "long",
                      //   hour: "numeric",
                      //   minute: "numeric",
                      // }) + " - " + new Date((ctx.data.endDate ?? ctx.data.date) * 1000).toLocaleString(i18n.language, {
                      //   hour: "numeric",
                      //   minute: "numeric",
                      // })
                      undefined
                }
                type="number"
                step={place.granularity}
                min={place.granularity}
                suffix={` ${t("minutes")}`}
                onChange={(e) =>
                  ctx.data
                    ? ctx.update({
                        ...ctx.data,
                        endDate:
                          new Date(
                            ctx.data.date.valueOf() * 1000 +
                              parseInt(e.target.value) * 60 * 1000
                          ).valueOf() / 1000,
                      })
                    : null
                }
              />
            </div>

            <div className="flex flex-col md:flex-row gap-2 md:gap-4">
              <InputRow
                icon={Envelope}
                iconClass="w-[1.75rem] h-[1.75rem]"
                value={ctx.data?.email ?? ""}
                error={
                  ctx.data?.email !== undefined &&
                  ctx.data?.email.trim() !== "" &&
                  !ajv.validate(FormEmailValidation, ctx.data)
                    ? true
                    : undefined
                }
                onChange={(e) =>
                  ctx.data
                    ? ctx.update({
                        ...ctx.data,
                        email: e.target.value,
                      })
                    : null
                }
              />
              <InputRow
                icon={Phone}
                iconClass="w-[1.5rem] h-[1.55rem]"
                value={ctx.data?.phone ?? ""}
                onChange={(e) =>
                  ctx.data
                    ? ctx.update({
                        ...ctx.data,
                        phone: e.target.value,
                      })
                    : null
                }
              />
            </div>
          </div>
          <InfoRow
            icon={List}
            value={
              ctx.data?.services && ctx.data.services.length > 0
                ? ctx.data.services.map((x) => tTags(x)).join(", ")
                : null
            }
          />
          <InfoRow
            icon={WheatAllergy}
            value={
              ctx.data?.allergens && ctx.data.allergens.length > 0
                ? ctx.data.allergens.map((x) => tTags(x)).join(", ")
                : null
            }
          />
          <InfoRow icon={Comment} value={ctx.data?.comment} />
          {ctx.data?.is_lunch && (
            <InfoRow icon={Utensils} value={t("lunchMenu")} />
          )}

          <TableSelector
            divisions={divisions}
            zones={zones}
            selectedZones={ctx.data?.zoneId}
            data={ctx.data}
            manual={!place.autotable}
            onChange={(zones) =>
              ctx.data
                ? ctx.update({
                    ...ctx.data,
                    zoneId: zones,
                  })
                : null
            }
            toggleValue={(zoneId) =>
              ctx.data
                ? ctx.update({
                    ...ctx.data,
                    zoneId:
                      zoneId === undefined
                        ? undefined
                        : (ctx.data.zoneId ?? [])?.includes(zoneId)
                        ? (ctx.data.zoneId ?? []).filter((x) => x !== zoneId)
                        : [...(ctx.data.zoneId ?? []), zoneId],
                  })
                : null
            }
          />

          <div className="flex items-center gap-2 text-neutral-600">
            <input
              type="checkbox"
              checked={ctx.data?.fixedZones ?? false}
              onChange={(e) =>
                ctx.data
                  ? ctx.update({
                      ...ctx.data,
                      fixedZones: e.target.checked,
                    })
                  : null
              }
            />
            {t("fixedZones")}
          </div>
        </>
      )}

      {ctx.data?.status === "ACCEPTED" ? (
        <Input
          label={t("placeNote")}
          value={ctx.data.place_note ?? ""}
          onChange={(e) =>
            ctx.data
              ? ctx.update({
                  ...ctx.data,
                  place_note: e.target.value,
                })
              : null
          }
        />
      ) : null}
      <ModalError context={ReservationModalContext} />
      {place.tier >= 1 ? (
        <div className="flex gap-[8px] mt-[8px] w-full">
          {ctx.data?.status === "ACCEPTED" ? (
            <>
              <LoadingButton
                className="grow"
                palette="secondary"
                disabled={
                  (ctx.data.email !== undefined &&
                    ctx.data.email.trim() !== "" &&
                    !ajv.validate(FormEmailValidation, ctx.data)) ||
                  (!place.autotable && !ctx.data.zoneId) ||
                  ctx.data.zoneId?.length === 0
                }
                action={async () => {
                  await errorHandler(
                    updateReservation(
                      ctx.data?.poiid ?? "",
                      ctx.data?.uuid ?? "",
                      {
                        date: ctx.data
                          ? date2ndt(new Date(ctx.data.date * 1000))
                          : undefined,
                        endDate: ctx.data
                          ? date2ndt(
                              new Date(
                                (ctx.data.endDate ?? ctx.data.date) * 1000
                              )
                            )
                          : undefined,
                        placeNote: ctx.data?.place_note,
                        name: ctx.data?.name,
                        email: ctx.data?.email,
                        phone: ctx.data?.phone,
                        count: ctx.data?.count,
                        zoneId: ctx.data?.zoneId,
                        fixedZones: ctx.data?.fixedZones,
                      }
                    ),
                    ctx.setError
                  );
                  if (onChange) onChange();
                  ctx.update(null);
                  await atime(250);
                }}
              >
                {t("save")}
              </LoadingButton>
              <LoadingButton
                className="grow"
                palette="red"
                action={async () => {
                  delCtx.update(ctx.data);
                  ctx.update(null);
                  await atime(250);
                }}
              >
                {t("delete")}
              </LoadingButton>
            </>
          ) : ctx.data?.status === "PENDING" ? (
            <>
              <LoadingButton
                className="grow"
                palette="secondary"
                action={async () => {
                  if (ctx.data === null) return;
                  accCtx.update({ res: ctx.data });
                  ctx.update(null);
                  await atime(250);
                }}
              >
                {t("accept")}
              </LoadingButton>
              <LoadingButton
                className="grow"
                palette="red"
                action={async () => {
                  rejCtx.update(ctx.data);
                  ctx.update(null);
                  await atime(250);
                }}
              >
                {t("reject")}
              </LoadingButton>
            </>
          ) : null}
        </div>
      ) : (
        <UnderTierBadge place={place} />
      )}
    </>
  );
}

export default function ReservationModal({
  children,
  onChange,
  zones,
  divisions,
  place,
}: {
  children: ReactNode;
  onChange?(): void;
  zones: Zone[];
  divisions: Divvy[];
  place: Place;
}) {
  return (
    <ModalBox<ReservationModalData>
      context={ReservationModalContext}
      siblings={children}
    >
      <ReservationModalInside
        onChange={onChange}
        zones={zones}
        place={place}
        divisions={divisions}
      />
    </ModalBox>
  );
}
