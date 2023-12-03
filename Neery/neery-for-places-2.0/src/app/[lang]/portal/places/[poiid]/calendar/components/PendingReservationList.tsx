"use client";

import { useTranslation } from "@/app/[lang]/i18n/client";
import Button from "@/components/ui/Button";
import {
  Calendar,
  CalendarPlus,
  Check,
  CheckCircle,
  Clock,
  Comment,
  List,
  PenPaper,
  PeoplePlus,
  Person,
  Repeat,
  Utensils,
  WheatAllergy,
} from "@/components/ui/icons";
import { Place } from "@/lib/api/places";
import { Reservation, getReservations } from "@/lib/api/reservations";
import React, { useContext, useEffect, useState } from "react";
import { CreateReservationModalContext } from "../../components/CreateReservationModal";
import { ReservationModalContext } from "../../components/ReservationModal";
import { ClosedEventModalContext } from "./ClosedEventModal";
import { Customer } from "@/lib/api/customers";
import UnderTierBadge from "../../components/UnderTierBadge";
import IconButton from "@/components/ui/IconButton";

function ReservationCardInfo({
  thick,
  narrow,
  icon,
  value,
  link,
  valueStyle,
  iconStyle,
}: {
  thick?: boolean;
  narrow?: boolean;
  icon?: React.FC<{ className: string }>;
  value?: string | number;
  link?: string;
  valueStyle?: string;
  iconStyle?: string;
}) {
  return value !== undefined ? (
    <div
      className={`
      flex items-center ${narrow ? "gap-[4px]" : "gap-[8px]"}
      h-fit
      leading-compact
      ${thick ? "font-medium" : ""}
    `}
    >
      {icon !== undefined
        ? React.createElement(icon, {
            className: `h-[0.75rem] w-[0.75rem] ${iconStyle}`,
          })
        : null}
      {link !== undefined ? (
        <a href={link}>{value}</a>
      ) : (
        <span className={`${valueStyle}`}>{value}</span>
      )}
    </div>
  ) : null;
}

function ReservationCardIcon({
  icon,
  link,
  className,
}: {
  icon?: React.FC<{ className: string }>;
  link?: string;
  className?: string;
}) {
  return (
    <div className="flex items-center h-fit">
      {icon !== undefined ? (
        link !== undefined ? (
          <a href={link}>
            {React.createElement(icon, {
              className: `h-[1rem] w-[1rem] ${className}`,
            })}
          </a>
        ) : (
          React.createElement(icon, {
            className: `h-[1rem] w-[1rem] ${className}`,
          })
        )
      ) : null}
    </div>
  );
}

function ReservationCard({
  reservation: res,
  customer,
}: {
  reservation: Reservation;
  customer?: Customer;
}) {
  const { i18n } = useTranslation("translation");
  const { t } = useTranslation("portal/calendar");
  const ctx = useContext(ReservationModalContext);
  return (
    <button
      className={`
        h-full p-[8px]
        bg-neutral-100 hover:bg-neutral-100/75
        font-work text-[14px]
        rounded-[8px] shadow-2
        flex flex-col gap-[2px]
        shrink-0
      `}
      onClick={() => ctx.update(res)}
    >
      <div className="flex items-center gap-[2px]">
        <ReservationCardIcon
          icon={CheckCircle}
          className="h-[0.75rem] w-[0.75rem] text-green mr-1"
        />
        <ReservationCardInfo value={res.name} thick />
      </div>
      <div className="flex items-center justify-between grow gap-[8px]">
        <ReservationCardIcon
          icon={WheatAllergy}
          className={res.allergens.length ? "" : "text-neutral-200"}
        />
        <ReservationCardIcon
          icon={List}
          className={res.services.length ? "" : "text-neutral-200"}
        />
        <ReservationCardIcon
          icon={Comment}
          className={
            res.comment.length ||
            (res.place_note !== undefined && res.place_note.length > 0)
              ? ""
              : "text-neutral-200"
          }
        />
        <ReservationCardIcon
          icon={Utensils}
          className={res.is_lunch ? "" : "text-neutral-200"}
        />
        {/* <ReservationCardInfo icon={Percent} value={"10"} narrow thick valueStyle="text-primary" iconStyle="text-primary h-[1rem] w-[1rem]" /> */}

        <ReservationCardInfo
          icon={Repeat}
          value={customer?.visits ?? 1}
          narrow
          thick
          valueStyle={(customer?.visits ?? 1) > 1 ? "text-green" : ""}
          iconStyle={
            (customer?.visits ?? 1 > 1 ? "text-green " : "") +
            "h-[1rem] w-[1rem]"
          }
        />

        <ReservationCardIcon
          icon={PenPaper}
          className={(customer?.comment ?? "").length ? "" : "text-neutral-200"}
        />
      </div>
      <div className="flex gap-[8px] items-center">
        <ReservationCardInfo narrow icon={Person} value={res.count} />
        <ReservationCardInfo
          narrow
          icon={Calendar}
          value={new Date(res.date * 1000).toLocaleDateString(i18n.language, {
            day: "numeric",
            month: "short",
            weekday: "short",
          })}
        />
        <ReservationCardInfo
          narrow
          icon={Clock}
          value={new Date(res.date * 1000).toLocaleTimeString(i18n.language, {
            hour: "2-digit",
            minute: "2-digit",
          })}
        />
      </div>
    </button>
  );
}

export default function PendingReservationList({
  place,
  customers,
  resSig,
  date,
}: {
  place: Place;
  customers: Customer[];
  resSig: number;
  date?: Date;
}) {
  const [reservations, setReservations] = useState<Reservation[] | null>(null);
  const resCtx = useContext(CreateReservationModalContext);
  const eventCtx = useContext(ClosedEventModalContext);
  const { t } = useTranslation("portal/calendar");

  useEffect(() => {
    getReservations(place.poiid, {
      status: "PENDING",
      alive: true,
    }).then(setReservations);
  }, [place.poiid, resSig]);

  return (
    <div
      className={`bg-neutral-150  ${
        reservations !== null && reservations.length > 0
          ? `h-[140px] p-[16px] shrink-0`
          : "shrink p-[8px]"
      } md:h-[140px] md:p-[16px] flex`}
    >
      {/**for large screens */}
      <div className="hidden md:flex grow gap-[8px] overflow-scroll scrollbar-hidden">
        <div className="grow flex gap-[8px] overflow-scroll scrollbar-hidden">
          {reservations?.map((res) => (
            <ReservationCard
              key={res.uuid}
              reservation={res}
              customer={customers.find((cust) => cust.uuid === res.customer_id)}
            />
          ))}
        </div>
        <div className="flex shrink-0 flex-col gap-[8px] items-center justify-center pl-[8px]">
          {place.tier >= 1 ? (
            <>
              <Button
                palette="secondary"
                className="w-full"
                onClick={() =>
                  resCtx.update({
                    poiid: place.poiid,
                    data: date
                      ? {
                          date: {
                            date: date.getDate(),
                            hour: 0,
                            minute: 0,
                            month: date.getMonth() + 1,
                            year: date.getFullYear(),
                          },
                        }
                      : {},
                  })
                }
              >
                {t("manualReservation")}
              </Button>

              <Button
                palette="secondary"
                className="w-full"
                onClick={() =>
                  eventCtx.update({
                    poiid: place.poiid,
                    data: { is_blocking: true },
                  })
                }
              >
                {t("createEvenet")}
              </Button>
            </>
          ) : (
            <UnderTierBadge
              place={place}
              className="h-full min-w-[300px] max-w-[380px]"
            />
          )}
        </div>
      </div>
      {/**for mobile view */}
      <div className="flex grow md:hidden md:shrink overflow-scroll scrollbar-hidden">
        <div
          className={`bg-neutral-150  ${
            reservations !== null && reservations.length > 0
              ? "hidden"
              : "flex grow gap-2 items-center justify-center"
          } shrink-0`}
        >
          <Check className="border rounded-full p-1 w-[1.25rem] h-[1.25rem] text-green " />
          <p className="text-md">{t("noPending")}</p>
        </div>
        <div
          className={`${
            reservations !== null && reservations.length > 0
              ? "grow flex gap-[8px] overflow-scroll scrollbar-hidden"
              : "hidden"
          }`}
        >
          {reservations?.map((res) => (
            <ReservationCard
              key={res.uuid}
              reservation={res}
              customer={customers.find((cust) => cust.uuid === res.customer_id)}
            />
          ))}
        </div>
      </div>
      <div
        className={`fixed left-[0px] bottom-[0px] ${
          place.tier >= 1 ? "h-[64px]" : "h-[116px]"
        } w-full z-40 md:hidden`}
      >
        <div className="flex flex-row justify-evenly py-2 bg-neutral-150">
          {place.tier >= 1 ? (
            <>
              <IconButton
                icon={PeoplePlus}
                iconClass="shrink-0 w-[1.25rem] h-[1.25rem]"
                className="border rounded full py-4 px-12"
                size="xlarge"
                onClick={() =>
                  resCtx.update({
                    poiid: place.poiid,
                    data: date
                      ? {
                          date: {
                            date: date.getDate(),
                            hour: 0,
                            minute: 0,
                            month: date.getMonth() + 1,
                            year: date.getFullYear(),
                          },
                        }
                      : {},
                  })
                }
              />
              <IconButton
                icon={CalendarPlus}
                iconClass="shrink-0 w-[1.25rem] h-[1.25rem]"
                className="border rounded full py-4 px-12"
                size="xlarge"
                onClick={() =>
                  eventCtx.update({
                    poiid: place.poiid,
                    data: { is_blocking: true },
                  })
                }
              />
            </>
          ) : (
            <UnderTierBadge
              place={place}
              className="h-full min-w-[300px] max-w-[380px]"
            />
          )}
        </div>
      </div>
    </div>
  );
}
