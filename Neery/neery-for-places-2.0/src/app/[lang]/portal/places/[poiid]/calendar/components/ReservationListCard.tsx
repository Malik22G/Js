import {
  Comment,
  GuestArrived,
  GuestLeft,
  InfoCircle,
  List,
  Person,
  ReminderMail,
  VoiceMail,
  WheatAllergy,
} from "@/components/ui/icons";
import { Customer } from "@/lib/api/customers";
import { Reservation, respondReservation } from "@/lib/api/reservations";
import IconifyServices from "@/components/ui/IconifyServices";
import { Zone } from "@/lib/api/zones";
import IconButton from "@/components/ui/IconButton";
import React, { useContext } from "react";
import { ReservationModalContext } from "@/app/[lang]/portal/places/[poiid]/components/ReservationModal";
import { useTranslation } from "@/app/[lang]/i18n/client";
import { Place } from "@/lib/api/places";

function AcceptedStateUI(
  {
    place,
    reservation: res,
    zones,
  }
    : {
      place: Place;
      reservation: Reservation;
      zones: Zone[];
    }
) {
  const { t } = useTranslation("portal/calendar");
  const { t: tagT } = useTranslation("tags");

  return (
    <>
      {res.status === "ACCEPTED" ? (
        <div className="hidden md:w-2/12 md:flex md:flex-col gap-2 md:gap-0 md:justify-center">
          {!place.hide_zones
            ? zones?.map((zone) => <p key={zone.uuid}>{zone.name}</p>)
            : null}
        </div>
      ) : (
        <div className="md:w-2/12 flex flex-col justify-center">
          {res.state === "CANCELLED_PLACE"
            ? t("cancelledPlace")
            : res.state === "CANCELLED_USER"
              ? t("cancelledUser")
              : res.expired
                ? t("expired")
                : res.status === "REJECTED"
                  ? t("rejected")
                  : null}
        </div>
      )}
    </>
  );
}

function ArrivedToggle(
  {
    place,
    reservation: res,
    onUpdate,
  }
    : {
      place: Place;
      reservation: Reservation;
      onUpdate: () => void;
    }
) {
  const { t } = useTranslation("portal/calendar");
  const { t: tagT } = useTranslation("tags");

  return (
    <>
      {((res.state === "COMING" && Date.now() / 1000 >= res.date - 900) ||
        res.state === "ARRIVED") &&
        place.tier >= 1 ? (
        <div className="flex flex-col items-center justify-between gap-1">
          <span className="hidden xl:flex text-xs">
            {res.state === "COMING" ? t("arrived") : t("left")}
          </span>
          <IconButton
            icon={res.state === "COMING" ? GuestArrived : GuestLeft}
            palette={res.state === "COMING" ? "green" : "red"}
            className="pointer-events-auto"
            iconClass="w-[1.75rem] h-[1.75rem]"
            size="xlarge"
            action={async () => {
              if (res.state === "COMING") {
                await respondReservation(res.poiid, res, {
                  state: "ARRIVED",
                });
              } else if (res.state === "ARRIVED") {
                await respondReservation(res.poiid, res, {
                  state: "LEFT",
                });
              }
              onUpdate();
            }}
          />
        </div>
      ) :
        <GuestArrived className=" w-[3rem] h-[3rem] text-neutral-400 border rounded-full p-2" />}
    </>
  );
}

function SmallCardComponent({
  place,
  reservation: res,
  zones,
  onUpdate,
}: {
  place: Place;
  reservation: Reservation;
  customer?: Customer;
  zones: Zone[];
  onUpdate: () => void;
}) {
  const { t } = useTranslation("portal/calendar");
  const { t: tagT } = useTranslation("tags");

  const resCtx = useContext(ReservationModalContext);

  return (
    <div className="w-full relative flex flex-col">

      <div className="w-full flex flex-col md:flex-row justify-between gap-2">
        <div className="flex gap-3 text-lg">
          <div className="flex items-center">
            {new Date(res.date * 1000).toLocaleTimeString(/*i18n.language*/[], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <div className="flex flex-row gap-2 items-center mr-2">
            <Person />
            <p>{res.count}</p>
          </div>
          <div className="items-center line-clamp-1">{res.name}</div>
        </div>

        <AcceptedStateUI
          place={place}
          reservation={res}
          zones={zones}
        />

        <div className="flex w-full items-center justify-around">
          <WheatAllergy
            className={`${res?.allergens && res.allergens.length > 0 ? "text-black" : "text-neutral-400"} w-[32px] h-[32px]`}
          />
          <List className={`${res?.services && res.services.length > 0 ? "text-black" : "text-neutral-400"} w-[32px] h-[32px]`} />
          <VoiceMail className={`${res.source === "ROBOCALL" ? "text-black" : "text-neutral-400"}  w-[32px] h-[32px]`} />
          <ReminderMail className={`${res.is_reminded ? "text-primary" : "text-neutral-400"}  w-[32px] h-[32px]`} />

          <ArrivedToggle
            place={place}
            reservation={res}
            onUpdate={onUpdate} />

          <IconButton
            icon={InfoCircle}
            className="pointer-events-auto"
            iconClass="w-[3rem] h-[3rem]"
            size="xlarge"
            action={() => resCtx.update(res)}
          />
        </div>
      </div>
    </div>
  );
}

function MediumCardComponent({
  place,
  reservation: res,
  zones,
  onUpdate,
}: {
  place: Place;
  reservation: Reservation;
  customer?: Customer;
  zones: Zone[];
  onUpdate: () => void;
}) {
  const { t } = useTranslation("portal/calendar");
  const { t: tagT } = useTranslation("tags");

  const resCtx = useContext(ReservationModalContext);

  return (
    <div className="w-full relative flex flex-col">
      <div className="w-full flex flex-col md:flex-row justify-between gap-2">

        <div className="flex gap-3 text-lg">
          <div className="flex items-center">
            {new Date(res.date * 1000).toLocaleTimeString(/*i18n.language*/[], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <div className="flex flex-row gap-2 items-center mr-2">
            <Person />
            <p>{res.count}</p>
          </div>
          <div className="items-center line-clamp-1">{res.name}</div>
        </div>
      </div>

      <div className="w-full flex flex-row justify-between gap-2 my-1">

        <AcceptedStateUI
          place={place}
          reservation={res}
          zones={zones}
        />

        <div className="flex w-full items-center justify-around">
          <WheatAllergy className={`${res?.allergens && res.allergens.length > 0 ? "text-black" : "text-neutral-400"} w-[32px] h-[32px]`} />
          <List className={`${res?.services && res.services.length > 0 ? "text-black" : "text-neutral-400"} w-[32px] h-[32px]`} />
          <VoiceMail className={`${res.source === "ROBOCALL" ? "text-black" : "text-neutral-400"}  w-[32px] h-[32px]`} />
          <ReminderMail className={`${res.is_reminded ? "text-primary" : "text-neutral-400"}  w-[32px] h-[32px]`} />

          <ArrivedToggle
            place={place}
            reservation={res}
            onUpdate={onUpdate} />

          <IconButton
            icon={InfoCircle}
            className="pointer-events-auto"
            iconClass="w-[3rem] h-[3rem]"
            size="xlarge"
            action={() => resCtx.update(res)}
          />
        </div>

      </div>
    </div>
  );
}

function LargeCardComponent({
  place,
  reservation: res,
  zones,
  onUpdate,
}: {
  place: Place;
  reservation: Reservation;
  customer?: Customer;
  zones: Zone[];
  onUpdate: () => void;
}) {
  const { t } = useTranslation("portal/calendar");
  const { t: tagT } = useTranslation("tags");

  const resCtx = useContext(ReservationModalContext);

  return (
    <div className="w-full relative flex flex-col">

      <div className="w-full flex flex-row justify-between gap-2">
        <div className="flex w-1/12  items-center">
          {new Date(res.date * 1000).toLocaleTimeString(/*i18n.language*/[], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>

        <div className="flex flex-row w-1/12 gap-2 items-center">
          <Person />
          <p>{res.count}</p>
        </div>

        <div className="flex w-3/12 items-center">{res.name}</div>

        <AcceptedStateUI
          place={place}
          reservation={res}
          zones={zones}
        />

        <div className="flex w-2/12 items-center">
          {res?.allergens && res.allergens.length > 0
            ? res.allergens.map((x) => tagT(x)).join(", ")
            : null}
        </div>

        <div className="w-2/12 flex items-center gap-2">
          <div className="flex flex-row items-center gap-2">
            {res?.services && res.services.length > 0
              ? res.services.map((x) => (
                <IconifyServices
                  key={x}
                  iconTag={x}
                  className="text-primary w-[24px] h-[24px]"
                />
              ))
              : null}
            {res.source === "ROBOCALL" ? (
              <VoiceMail className="text-primary h-[24px]" />
            ) : null}
          </div>
        </div>

        <div className="w-2/12 flex flex-col justify-center">
          <div className="flex flex-row justify-around items-end gap-2">
            <div className="flex flex-col items-center justify-between gap-1">
              {/*<span className="flex text-xs">{t("mailSent")}</span>*/}
              <ReminderMail className={`${res.is_reminded ? "text-primary" : "text-neutral-400"}  w-[3rem] h-[3rem]] border rounded-full p-2`} />
            </div>
            {/*} {res.is_reminded && (
            <div className="flex flex-col items-center justify-between gap-1">
              <span className="flex text-xs">{t("mailSent")}</span>
              <IconButton
                icon={ReminderMail}
                className="pointer-events-auto"
                iconClass="w-[2rem] h-[2rem]"
                size="xlarge"
              />
            </div>
         )}*/}

            <ArrivedToggle
              place={place}
              reservation={res}
              onUpdate={onUpdate} />

            <IconButton
              icon={InfoCircle}
              className="pointer-events-auto"
              iconClass="w-[3rem] h-[3rem]"
              size="xlarge"
              action={() => resCtx.update(res)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReservationListCard({
  place,
  reservation: res,
  zones,
  onUpdate,
}: {
  place: Place;
  reservation: Reservation;
  customer?: Customer;
  zones: Zone[];
  onUpdate: () => void;
}) {
  const { t } = useTranslation("portal/calendar");
  const { t: tagT } = useTranslation("tags");

  const resCtx = useContext(ReservationModalContext);

  const isFresh =
    new Date(res.createdAt).valueOf() >=
    new Date().setMinutes(new Date().getMinutes() - 15);

  return (
    <div
      className={`w-full relative flex flex-col border rounded-lg px-4 py-2 m-2 transition-opacity ${res.state === "LEFT" || res.status !== "ACCEPTED"
        ? "border-[#000000]/20 opacity-20 hover:opacity-100"
        : res.state === "ARRIVED"
          ? "border-primary bg-primary/5"
          : "border-primary"
        }`}
    >
      {res.state === "ARRIVED" ? (
        <div className="absolute -left-[0.2rem] -top-[0.2rem] h-[0.5rem] w-[0.5rem] rounded-full bg-pink animate-ping"></div>
      ) : null}
      {res.state === "COMING" && isFresh ? (
        <div className="absolute -left-[0.25rem] md:-left-[1.25rem] -top-[8px] rounded-full bg-red uppercase text-neutral-100 text-[12px] px-[4px] py-[1px]">
          <p>{t("fresh")}</p>
        </div>
      ) : null}

      <div className="flex md:hidden">
        <SmallCardComponent
          place={place}
          reservation={res}
          zones={zones}
          onUpdate={onUpdate}
        />
      </div >

      <div className="hidden md:flex xl:hidden">
        <MediumCardComponent
          place={place}
          reservation={res}
          zones={zones}
          onUpdate={onUpdate}
        />
      </div >

      <div className="hidden xl:flex">
        <LargeCardComponent
          place={place}
          reservation={res}
          zones={zones}
          onUpdate={onUpdate}
        />
      </div>

      {res.comment.length > 0 ? (
        <div className="flex flex-row mt-2 gap-2">
          <Comment />
          <p className="line-clamp-2">{res.comment}</p>
        </div>
      ) : null}

      {res.place_note !== undefined && res.place_note.length > 0 ? (
        <div className="flex flex-col mt-2 border-t border-dashed grow">
          <div className="flex flex-row mt-2 gap-2">
            <Comment />
            <p className="line-clamp-1">{res.place_note}</p>
          </div>
          <p className="hidden md:flex italic">{t("placeComment")}</p>
        </div>
      ) : null}
    </div>
  );
}

