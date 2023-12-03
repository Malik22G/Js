"use client";

import { Place } from "@/lib/api/places";
import ReserveDate from "./screens/ReserveDate";
import { Dispatch, FC, SetStateAction, createElement, useEffect, useState } from "react";
import { ReserveInfo } from "./screens/ReserveInfo";
import { Allergen, Service } from "@/lib/api/reservations";
import ReservePending from "./screens/ReservePending";
import ReserveError from "./screens/ReserveError";
import ReserveAccepted from "./screens/ReserveAccepted";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import ReservePaused from "./screens/ReservePaused";

export type TimeOfDay = "morning" | "afternoon" | "night";

export type ReserveForm = {
  count: number;
  date: Date | null;
  name: string;
  email: string;
  phone: string;
  comment: string;
  allergens: Allergen[];
  services: Service[];
};

export type ReserveScreen = "date" | "info" | "error" | "pending" | "accepted" | "paused";

export type ReserveScreenProps = {
  place: Place;
  form: ReserveForm;
  setForm: Dispatch<SetStateAction<ReserveForm>>;
  navigate: Dispatch<SetStateAction<ReserveScreen>>;
  fullscreen: boolean;
};

const screens: { [S in ReserveScreen]: FC<ReserveScreenProps> } = {
  date: ReserveDate,
  info: ReserveInfo,
  error: ReserveError,
  pending: ReservePending,
  accepted: ReserveAccepted,
  paused: ReservePaused,
};

function getLunchReserveDate(query: ReadonlyURLSearchParams) {
  const day = query.get("day");

  if (!day) return;
  const desiredDay = day === "6" ? 0 : Number(day) + 1;

  const now = new Date();
  const currentDay = now.getDay();
  const dayDifference = (desiredDay - currentDay + 7) % 7;

  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + dayDifference
  );
}

export default function Reserve({
  place,
  fullscreen,
}: {
  place: Place;
  fullscreen: boolean;
}) {
  const params = useSearchParams();

  const reserveDate = getLunchReserveDate(params);

  const [form, setForm] = useState<ReserveForm>({
    count: 0,
    date: reserveDate ?? (null as Date | null),
    name: "",
    email: "",
    phone: "",
    comment: "",
    allergens: [],
    services: [],
  });

  const [screen, navigate] = useState<ReserveScreen>("date");

  useEffect(() => {
    if (place.unavailable_until !== undefined && place.unavailable_until * 1000 > Date.now()) {
      navigate("paused");
    }
  }, [place]);

  const props: ReserveScreenProps = {
    place,
    form,
    setForm,
    navigate,
    fullscreen,
  };

  return createElement(screens[screen], props);
}
