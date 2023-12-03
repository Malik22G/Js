"use client";

import { Place, getPlace } from "@/lib/api/places";
import { Zone, getZones } from "@/lib/api/zones";
import { useEffect, useRef, useState } from "react";
import LoaderScreen from "./components/LoaderScreen";
import Calendar from "./components/Calendar";
import {
  Print,
  Calendar as CalendarIcon,
  RestaurantTable,
  Person,
  ListView,
  KanbanView,
} from "@/components/ui/icons";
import { useTranslation } from "@/app/[lang]/i18n/client";
import PendingReservationList from "./components/PendingReservationList";
import CreateReservationModal from "../components/CreateReservationModal";
import ReservationModal from "../components/ReservationModal";
import ReservationDeleteModal from "../components/ReservationDeleteModal";
import ReservationAcceptModal from "../components/ReservationAcceptModal";
import ReservationRejectModal from "../components/ReservationRejectModal";
import ClosedEventModal from "./components/ClosedEventModal";
import { ClosedEvent, getClosedEvents } from "@/lib/api/closedevents";
import { Customer, getCustomers } from "@/lib/api/customers";
import ReservationConfirmModal from "../components/ReservationConfirmModal";
import IconButton from "@/components/ui/IconButton";
import ReservationListview from "@/app/[lang]/portal/places/[poiid]/calendar/components/ReservationListView";
import { getReservations, Reservation } from "@/lib/api/reservations";
import Button from "@/components/ui/Button";
import { Divvy, getDivvies } from "@/lib/api/divvies";
import { useDateDate } from "@/app/[lang]/land/[poiid]/reserve/components/Reserve/screens/ReserveDate/kit";
import { ym } from "@/lib/ym";
import { getPossiblePicks } from "@/lib/wme";
import useWindowDimensions from "@/lib/DimensionHook";

function getDays(dateDate: Date, place: Place) {
  const month = dateDate?.getMonth();

  const now = new Date(dateDate.getFullYear(), month, 1);

  const nowZero = new Date(now);
  nowZero.setHours(0, 1, 0, 0);

  const max = new Date(nowZero.getFullYear(), nowZero.getMonth() + 1, 0);

  const d = new Date(dateDate);

  // If d is the current month, remove past days.
  if (ym(d) === ym(nowZero)) {
    d.setDate(nowZero.getDate());
  } else {
    d.setDate(1);
  }

  d.setHours(0, 0, 0, 0);

  const days = [] as Date[];
  for (
    ;
    d.getMonth() === month &&
    // Don't go over the max reservation distance.
    (ym(d) !== ym(max) || d.getDate() <= max.getDate());
    d.setDate(d.getDate() + 1)
  ) {
    // Get open time picks of place on date
    let picks = getPossiblePicks(place, d, false, true, true);
    // If date is today, filter picks to the future
    if (d.toDateString() === nowZero.toDateString()) {
      picks = picks
        .filter((x) => (x[0] as number) >= now.getHours())
        .map((x) =>
          x[0] === now.getHours()
            ? [x[0], (x[1] as number[]).filter((x) => x >= now.getMinutes())]
            : x
        );
    }

    // Only add to days if place is open that day
    if (picks.length > 0) {
      days.push(new Date(d));
    }
  }

  return days;
}

export default function PlaceCalendar({
  params: { poiid },
}: {
  params: { poiid: string };
}) {
  const { i18n } = useTranslation("translation");

  const [date, setDate] = useState(new Date(new Date().setHours(0, 0, 0, 0)));
  const [dateDir, setDateDir] = useState<1 | -1>(1);
  const [place, setPlace] = useState<Place | null>(null);
  const [zones, setZones] = useState<Zone[] | null>(null);
  const [divisions, setDivisions] = useState<Divvy[] | null>(null);
  const [events, setEvents] = useState<ClosedEvent[] | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [resSig, setResSig] = useState<number>(0);
  const [currentView, setCurrentView] = useState<"calendar" | "list">(
    "calendar"
  );
  const [reservations, setReservations] = useState<Reservation[] | null>(null);
  const [cancelledReservations, setCancelledReservations] = useState<
    Reservation[] | null
  >(null);

  const [sound_newReservation, setSound_newReservation] =
    useState<HTMLAudioElement | null>(null);
  const [sound_reservationExpired, setSound_reservationExpired] =
    useState<HTMLAudioElement | null>(null);
  const { width } = useWindowDimensions();

  const datepickRef = useRef<HTMLInputElement>(null);
  const { t: t1 } = useTranslation("portal/navbar");
  const { t: t2 } = useTranslation("portal/calendar");
  useEffect(() => {
    if (width && width <= 768) setCurrentView("list");
  }, [width]);
  useEffect(() => {
    setCurrentView(
      (localStorage.getItem("currentView") as "calendar" | "list" | null) ??
      "calendar"
    );

    const nr = new Audio("/sounds/new_reservation.wav");
    nr.oncanplay = () => {
      setSound_newReservation(nr);

      function nrAudioCamp() {
        nr.volume = 0;
        nr.play();

        setTimeout(() => {
          nr.pause();
          nr.volume = 1;
        }, 100);

        window.removeEventListener("touchstart", nrAudioCamp);
      }

      window.addEventListener("touchstart", nrAudioCamp);
    };

    const re = new Audio("/sounds/reservation_expired.wav");
    re.oncanplay = () => {
      setSound_reservationExpired(re);

      function reAudioCamp() {
        re.volume = 0;
        re.play();

        setTimeout(() => {
          re.pause();
          re.volume = 1;
        }, 100);

        window.removeEventListener("touchstart", reAudioCamp);
      }

      window.addEventListener("touchstart", reAudioCamp);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("currentView", currentView);
  }, [currentView]);

  useEffect(() => {
    setPlace(null);
    setZones(null);
    setDivisions(null);

    getPlace(poiid).then(setPlace);

    getZones(poiid).then((zones) => {
      zones.sort((a, b) => a.name.localeCompare(b.name));
      setZones(zones);
    });

    getDivvies(poiid).then((divisions) => {
      divisions.sort((a, b) => a.name.localeCompare(b.name));
      setDivisions(divisions);
    });

    getClosedEvents(poiid).then(setEvents);

    getCustomers(poiid).then(setCustomers);

    let timer = setInterval(() => {
      setResSig((x) => x + 1);
    }, 60 * 1000);

    return () => {
      clearInterval(timer);
    };
  }, [poiid]);

  async function saveReservations(poiid: string, d = date) {
    const [res, cancelled] = await Promise.all([
      getReservations(poiid, {
        status: "ACCEPTED",
        after: new Date(d).setHours(0, 0, 0, 0).valueOf(), // midnight, today
        before: new Date(d).setHours(24, 0, 0, 0).valueOf(), // midnight, tomorrow
      }),
      getReservations(poiid, {
        status: "CANCELLED",
        after: new Date(d).setHours(0, 0, 0, 0).valueOf(), // midnight, today
        before: new Date(d).setHours(24, 0, 0, 0).valueOf(), // midnight, tomorrow
      }),
    ]);

    // if (d.valueOf() !== date.valueOf()) return; // we have clicked past this

    setReservations(res);
    setCancelledReservations(cancelled);

    return [res, cancelled];
  }

  useEffect(() => {
    if (!place) return;
    setReservations(null);
    setCancelledReservations(null);
    saveReservations(place.poiid, new Date(date));
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [place, date]);
  /* eslint-enable react-hooks/exhaustive-deps */

  useEffect(() => {
    if (!place) return;

    (async () => {
      const lastResLength = (reservations ?? []).length;
      const lastCanLength = (cancelledReservations ?? []).length;
      const [res, cancelled] = await saveReservations(
        place.poiid,
        new Date(date)
      );

      if (res.length > lastResLength && sound_newReservation !== null) {
        sound_newReservation.play();
      }

      if (
        cancelled.length > lastCanLength &&
        sound_reservationExpired !== null
      ) {
        sound_reservationExpired.play();
      }
    })();

    /* eslint-disable react-hooks/exhaustive-deps */
  }, [resSig]);
  const dateDate = useDateDate(date);
  const [days, setDays] = useState<Date[]>([]);
  const scrollableElement = useRef<HTMLDivElement>(null);

  function autoScrollElement() {
    if (days !== null) {
      const currentDay = days.findIndex(
        (x) => x.toDateString() === dateDate?.toDateString()
      );
      scrollableElement.current &&
        scrollableElement.current?.scrollTo({ left: currentDay * 52 - 52 * 2 });
    }
  }
  useEffect(() => {
    if (place) {
      const days = getDays(dateDate as Date, place);
      setDays(days);
      autoScrollElement();
    }
  }, [dateDate, place]);

  useEffect(() => {
    if (days !== null && scrollableElement.current !== null)
      autoScrollElement();

    /* eslint-disable react-hooks/exhaustive-deps */
  }, [days, scrollableElement.current]);
  /* eslint-enable react-hooks/exhaustive-deps */

  if (
    zones === null ||
    place === null ||
    events === null ||
    divisions === null
  ) {
    return <LoaderScreen />;
  }

  let pplNow = (reservations ?? [])
    .filter(
      (x) =>
        x.status === "ACCEPTED" &&
        x.date <= Date.now() / 1000 &&
        (x.endDate ?? x.date) >= Date.now() / 1000
    )
    .reduce((a, x) => (x.count ?? 0) + a, 0);
  let zonesNow = (reservations ?? [])
    .filter(
      (x) =>
        x.status === "ACCEPTED" &&
        x.date <= Date.now() / 1000 &&
        (x.endDate ?? x.date) >= Date.now() / 1000
    )
    .reduce((a, x) => (x.zoneId ?? []).length + a, 0);
  const root =
    process.env.NEXT_PUBLIC_NEERY_ENV === "production"
      ? "https://places.neery.net"
      : "https://places.staging.neery.net";
  const url = `${root}/portal/places/${encodeURIComponent(
    place.poiid
  )}/settings`;
  return (
    <ClosedEventModal
      onChange={() => getClosedEvents(poiid).then(setEvents)}
      place={place}
    >
      <CreateReservationModal
        zones={zones}
        divisions={divisions}
        place={place}
        onChange={() => setResSig((x) => x + 1)}
      >
        <ReservationDeleteModal
          onChange={() => setResSig((x) => x + 1)}
          place={place}
        >
          <ReservationAcceptModal
            divisions={divisions}
            zones={zones}
            place={place}
            onChange={() => setResSig((x) => x + 1)}
          >
            <ReservationRejectModal
              onChange={() => setResSig((x) => x + 1)}
              place={place}
            >
              <ReservationConfirmModal
                onChange={() => setResSig((x) => x + 1)}
                place={place}
              >
                <ReservationModal
                  divisions={divisions}
                  onChange={() => setResSig((x) => x + 1)}
                  zones={zones}
                  place={place}
                >
                  <div
                    className={`
                    w-full md:w-[calc(100%-250px)] lg:w-[calc(100%-300px)] 
                    flex flex-col
                  `}
                  >
                    <PendingReservationList
                      place={place}
                      customers={customers}
                      resSig={resSig}
                      date={date}
                    />

                    {place.opening && zones.length !== 0 && (
                      <div className="flex p-[8px] bg-neutral-100 items-center justify-around gap-[6px]">
                        <div
                          className="flex items-center
                              justify-center gap-[4px] grow 
                              md:grow-0 md:justify-start md:gap-[6px] "
                        >
                          <button
                            className={`flex cursor-pointer py-2 px-2 rounded-full transition-colors bg-primary-light text-primary`}
                            onClick={() => {
                              let uA = navigator.userAgent || navigator.vendor;
                              if (
                                /iPad|iPhone|iPod/.test(uA) ||
                                (uA.includes("Mac") && "ontouchend" in document)
                              ) {
                                datepickRef.current?.focus();
                              } else if (/Android/i.test(uA)) {
                                datepickRef.current?.click();
                              } else {
                                datepickRef.current?.showPicker();
                              }
                            }}
                          >
                            <input
                              ref={datepickRef}
                              className="absolute opacity-0 pointer-events-none"
                              type="date"
                              value={`${date.getFullYear()}-${(
                                date.getMonth() + 1
                              )
                                .toString()
                                .padStart(2, "0")}-${date
                                  .getDate()
                                  .toString()
                                  .padStart(2, "0")}`}
                              onChange={(e) => {
                                setDate(new Date(e.target.value));
                              }}
                            />
                            <span className={`p-1`}>
                              <CalendarIcon className="w-[1.5rem] h-[1.5rem]" />
                            </span>
                          </button>

                          <div className="flex shrink-0 justify-center drop-shadow-md">
                            <div
                              role="radiogroup"
                              className="flex overflow-x-scroll scrollbar-hidden gap-[6px] py-1
                                    max-w-xs
                                    sm:max-w-sm
                                    md:max-w-xs 
                                    lg:max-w-xs 
                                    xl:max-w-md
                                    2xl:max-w-2xl"
                              ref={scrollableElement}
                            >
                              {days.map((day) => (
                                <button
                                  role="radio"
                                  key={day.toDateString()}
                                  aria-checked={
                                    day.toDateString() === date?.toDateString()
                                  }
                                  className={`
                                      flex flex-col items-center justify-evenly
                                      h-[64px] w-[46px] shrink-0
                                      rounded-[12px]

                                      text-neutral-600 bg-neutral-100
                                      transition-colors
                                      hover:bg-primary-xlight
                                      aria-checked:bg-primary aria-checked:text-neutral-100
                                      disabled:bg-neutral-200 disabled:text-neutral-500
                                      aria-disabled:bg-neutral-200 aria-disabled:text-neutral-500

                                      first:ml-[12px] last:mr-[12px]
                                      ${day.getDate() === new Date().getDate()
                                      ? "border border-primary-hover text-primary-hover"
                                      : ""
                                    }
                                    `}
                                  onClick={() => setDate(day)}
                                >
                                  <span>
                                    {t1(("daysShort." + day.getDay()) as any)}
                                  </span>
                                  <span>{day.getDate()}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="hidden md:flex gap-[12px] xl:gap-[24px]">
                          <IconButton
                            icon={ListView}
                            size="xlarge"
                            action={() => setCurrentView("list")}
                            iconClass="w-[1.5rem] h-[1.5rem]"
                            className="flex"
                          />
                          <IconButton
                            icon={KanbanView}
                            size="xlarge"
                            className="flex"
                            action={() => setCurrentView("calendar")}
                            iconClass="w-[1.5rem] h-[1.5rem]"
                          />
                          <IconButton
                            icon={Print}
                            action={`/portal/places/${encodeURIComponent(
                              poiid
                            )}/print/${encodeURIComponent(
                              new Date(
                                date.getFullYear(),
                                date.getMonth(),
                                date.getDate(),
                                12
                              ).toJSON()
                            )}`}
                            iconClass="w-[1.5rem] h-[1.5rem]"
                            className="hidden xl:flex"
                            size="xlarge"
                          />
                        </div>
                        <div className="hidden lg:flex gap-[6px] items-center">
                          <div className="flex flex-col items-center justify-between">
                            <span className="text-xs">
                              {t2("todayOccupied")}
                            </span>
                            <div className="flex flex-row items-center shrink-0 p-2 gap-2">
                              <Person className="text-green-light w-[1.5rem] h-[1.5rem]" />
                              <p className="text-lg">
                                {(reservations ?? [])
                                  .filter((x) => x.status === "ACCEPTED")
                                  .reduce((a, x) => (x.count ?? 0) + a, 0)}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-center justify-between">
                            <span className="text-xs">{t2("nowOccupied")}</span>
                            <div className="flex flex-row items-center shrink-0 p-2 gap-2">
                              <Person className="text-green-light w-[1.5rem] h-[1.5rem]" />
                              <p className="text-lg">{pplNow}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-center justify-between">
                            <span className="text-xs">
                              {t2("tableOccupied")}
                            </span>
                            <div className="flex flex-row items-center shrink-0 p-2 gap-2">
                              <RestaurantTable className="text-green-light w-[1.75rem] h-[1.75rem]" />
                              <p className="text-lg">
                                {(zones ?? []).length - zonesNow}
                              </p>
                              <p className="text-lg">
                                {"("}
                                {(
                                  (zonesNow / (zones ?? []).length) *
                                  100
                                ).toFixed(0)}
                                {"%)"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex lg:hidden gap-[2px] items-center border-b border-neutral-200 justify-center sm:gap-[16px] pb-[2px] sm:pb-[8px] sm:border-0">
                      <div className="flex items-center justify-between px-2">
                        <span className="text-xs ">
                          {t2("todayOccupiedSmall")}
                        </span>
                        <div className="flex flex-row items-center shrink-0 pl-2 gap-2">
                          <Person className="text-green-light w-[1rem] h-[1rem]" />
                          <p className="text-md text-center">
                            {(reservations ?? [])
                              .filter((x) => x.status === "ACCEPTED")
                              .reduce((a, x) => (x.count ?? 0) + a, 0)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-x sm:border-0 border-neutral-200 px-2">
                        <span className="text-xs text-center">{t2("nowOccupied")}</span>
                        <div className="flex flex-row items-center shrink-0 pl-2 gap-2">
                          <Person className="text-green-light w-[1rem] h-[1rem]" />
                          <p className="text-md">{pplNow}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-center px-1">
                        <span className="text-xs text-center">
                          {t2("tableOccupiedSmall")}
                        </span>
                        <div className="flex flex-row items-center shrink-0 pl-2 gap-2">
                          <RestaurantTable className="text-green-light w-[1.25rem] h-[1.25rem]" />
                          <p className="text-md">
                            {(zones ?? []).length - zonesNow}
                          </p>
                          <p className="text-md">
                            {"("}
                            {(
                              (zonesNow / (zones ?? []).length) *
                              100
                            ).toFixed(0)}
                            {"%)"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {!place.opening || zones.length === 0 ? (
                      <div className="font-work p-5 flex flex-col gap-[5px] items-center justify-center">
                        {i18n.t("noOpeningTimes")}{" "}
                        <Button action={url} palette="secondary">
                          {t1("settings")}
                        </Button>
                      </div>
                    ) : currentView === "calendar" ? (
                      <Calendar
                        place={place}
                        zones={zones}
                        events={events}
                        customers={customers}
                        date={date}
                        dateDir={dateDir}
                        setDate={setDate}
                        saveReservations={saveReservations}
                        reservations={reservations}
                      />
                    ) : (
                      <ReservationListview
                        place={place}
                        zones={zones}
                        events={events.filter(
                          (e) =>
                            e.date >= new Date(date).setHours(0, 0, 0, 0) &&
                            e.date < new Date(date).setHours(24, 0, 0, 0)
                        )}
                        customers={customers}
                        reservations={reservations}
                        cancelledReservations={cancelledReservations}
                        saveReservation={saveReservations}
                      />
                    )}
                    <div
                      className={`${place.tier >= 1 ? "min-h-[64px]" : "min-h-[116px]"
                        } w-full md:hidden py-2`}
                    ></div>
                  </div>
                </ReservationModal>
              </ReservationConfirmModal>
            </ReservationRejectModal>
          </ReservationAcceptModal>
        </ReservationDeleteModal>
      </CreateReservationModal>
    </ClosedEventModal>
  );
}
