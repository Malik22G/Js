import { placeToID } from "./places";
import { PlaceOrID } from "./places";
import { FetchOptions, _fetch } from "./util";

export type Allergen =
  | "MILK"
  | "EGG"
  | "PEANUTS"
  | "SOY"
  | "WHEAT"
  | "TREENUT"
  | "SHELLFISH"
  | "FISH"
  | "SESAME"
  | "GLUTEN"
  | "FRUIT"
  | "SEED";
export type Service =
  | "BRINGPET"
  | "BABYCHAIR"
  | "BIRTHDAYCAKE"
  | "SPECIALNEEDS";

export const allergens: Allergen[] = [
  "MILK",
  "EGG",
  "PEANUTS",
  "SOY",
  "WHEAT",
  "TREENUT",
  "SHELLFISH",
  "FISH",
  "SESAME",
  "GLUTEN",
  "FRUIT",
  "SEED",
];
export const services: Service[] = [
  "BRINGPET",
  "BABYCHAIR",
  "BIRTHDAYCAKE",
  "SPECIALNEEDS",
];

export type ReservationOrID = Reservation | string;

export type NaiveDateTime = {
  year: number;
  month: number;
  date: number;
  hour: number;
  minute: number;
};

export function date2ndt(d: Date): NaiveDateTime {
  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    date: d.getDate(),
    hour: d.getHours(),
    minute: d.getMinutes(),
  };
}

export type Status = "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";
export type State =
  | "COMING"
  | "ARRIVED"
  | "LEFT"
  | "CANCELLED_USER"
  | "CANCELLED_PLACE";

export type Reservation = {
  uuid: string;
  poiid: string;
  name?: string;
  email?: string;
  date: number;
  status: string;
  phone?: string;
  count?: number;
  comment: string;
  endDate?: number;
  zoneId?: string[];
  expiresAt?: number;
  expired?: boolean;
  createdAt: number;
  source: string;
  locale?: string;
  allergens: Allergen[];
  services: Service[];
  review_id?: string;
  customer_id?: string;
  is_lunch?: boolean;
  divvy?: string;
  place_note?: string;
  state: State;
  arrived_at?: number;
  left_at?: number;
  cancelled_at?: number;
  fixedZones: boolean;
  is_reminded?: boolean;
};

export type ReservationsGet = {
  status: Status;
  alive?: boolean;
  after?: number;
  before?: number;
};

export type ReservationPost = {
  name: string;
  email: string;
  phone: string;
  date: NaiveDateTime;
  length?: number;
  count: number;
  comment?: string;
  sourceUrl?: string;
  locale?: string;
  allergens: Allergen[];
  services: Service[];
  is_lunch?: boolean;
};

export type ReservationB2BPost = {
  name?: string;
  email?: string;
  phone?: string;
  date: NaiveDateTime;
  length?: number;
  count: number;
  place_note?: string;
  captcha?: string;
  zoneId?: string[];
  sourceUrl?: string;
  locale?: string;
  allergens?: Allergen[];
  services?: Service[];
  fixedZones?: boolean;
};

export type ReservationPatch = {
  date?: NaiveDateTime;
  endDate?: NaiveDateTime;
  zoneId?: string[];
  placeNote?: string;
  name?: string;
  email?: string;
  phone?: string;
  allergens?: Allergen[];
  services?: Service[];
  count?: number;
  fixedZones?: boolean;
};

export type ReservationRespondPatch = {
  status?: Status;
  state?: State;
  zoneId?: string[] | null;
};

export function reservationToID(reservation: ReservationOrID): string {
  if (typeof reservation === "string") return reservation;
  else return reservation.uuid;
}

export async function getReservations(
  place: PlaceOrID,
  query: ReservationsGet,
  options?: FetchOptions
): Promise<Reservation[]> {
  return await _fetch(
    `/places/${placeToID(place)}/reservations?${new URLSearchParams(
      query as any
    ).toString()}`,
    options
  );
}

export async function getReservation(
  place: PlaceOrID,
  reservation: ReservationOrID,
  options?: FetchOptions
): Promise<Reservation> {
  return await _fetch(
    `/places/${placeToID(place)}/reservations/${reservationToID(reservation)}`,
    options
  );
}

export async function createReservation(
  place: PlaceOrID,
  data: ReservationPost,
  options?: FetchOptions
): Promise<Reservation> {
  return await _fetch(`/places/${placeToID(place)}/reservations`, {
    method: "POST",
    data,
    ...options,
  });
}

export async function createB2BReservation(
  place: PlaceOrID,
  data: ReservationB2BPost,
  options?: FetchOptions
): Promise<Reservation> {
  return await _fetch(`/places/${placeToID(place)}/reservations?silent=true`, {
    method: "POST",
    data,
    ...options,
  });
}

export async function updateReservation(
  place: PlaceOrID,
  reservation: ReservationOrID,
  data: ReservationPatch,
  options?: FetchOptions
): Promise<Reservation> {
  return await _fetch(
    `/places/${placeToID(place)}/reservations/${reservationToID(
      reservation
    )}/change`,
    {
      method: "PATCH",
      data,
      ...options,
    }
  );
}

export async function cancelReservation(
  place: PlaceOrID,
  reservation: ReservationOrID,
  options?: FetchOptions
): Promise<{ ok: true }> {
  return await _fetch(
    `/places/${placeToID(place)}/reservations/${reservationToID(
      reservation
    )}/cancel`,
    {
      method: "POST",
      ...options,
    }
  );
}

export async function respondReservation(
  place: PlaceOrID,
  reservation: ReservationOrID,
  data: ReservationRespondPatch,
  options?: FetchOptions
): Promise<{ ok: true }> {
  return await _fetch(
    `/places/${placeToID(place)}/reservations/${reservationToID(reservation)}`,
    {
      method: "PATCH",
      data,
      ...options,
    }
  );
}
