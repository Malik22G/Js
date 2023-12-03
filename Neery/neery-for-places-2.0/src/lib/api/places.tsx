import { Service } from "./reservations";
import { FetchOptions, _fetch } from "./util";

export type PlaceTag =
  | "BISTRO"
  | "BURGER"
  | "ELEGANT"
  | "MEDITERRANEAN"
  | "INTERNATIONAL"
  | "EXCLUSIVE"
  | "PIZZA"
  | "SALAD"
  | "CHICKEN"
  | "PASTA"
  | "SOUP"
  | "GYROS"
  | "SANDWICH"
  | "BREAKFAST"
  | "STREETFOOD"
  | "FINEDINING"
  | "BRUNCH"
  | "HOMEMADE"
  | "KIDSMEALS"
  | "VEGETARIAN"
  | "VEGAN"
  | "GLUTENFREE"
  | "MEATLOVER"
  | "KOSHER"
  | "PETFRIENDLY"
  | "WHEELCHAIRACCESS"
  | "SZEPCARD"
  | "CASHONLY"
  | "THAI"
  | "MEXICAN"
  | "TURKISH"
  | "GREEK"
  | "INDIAN"
  | "AMERICAN"
  | "ITALIAN"
  | "ASIAN"
  | "HUNGARIAN"
  | "FRENCH"
  | "SPANISH"
  | "CHINESE";
export const placeTags: PlaceTag[] = [
  "BURGER",
  "BISTRO",
  "ELEGANT",
  "MEDITERRANEAN",
  "INTERNATIONAL",
  "EXCLUSIVE",
  "PIZZA",
  "SALAD",
  "CHICKEN",
  "PASTA",
  "SOUP",
  "GYROS",
  "SANDWICH",
  "BREAKFAST",
  "STREETFOOD",
  "FINEDINING",
  "BRUNCH",
  "HOMEMADE",
  "KIDSMEALS",
  "VEGETARIAN",
  "VEGAN",
  "GLUTENFREE",
  "MEATLOVER",
  "KOSHER",
  "PETFRIENDLY",
  "WHEELCHAIRACCESS",
  "SZEPCARD",
  "CASHONLY",
  "THAI",
  "MEXICAN",
  "TURKISH",
  "GREEK",
  "INDIAN",
  "AMERICAN",
  "ITALIAN",
  "ASIAN",
  "HUNGARIAN",
  "FRENCH",
  "SPANISH",
  "CHINESE",
];

export type PlaceOrID = Place | string;

export type Place = {
  poiid: string;
  owner?: string;
  name: string;
  centroid: [number, number];
  description?: string;
  opening?: string;
  email?: string;
  reservation_email?: string;
  phone?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  webpage?: string;
  peaks?: [number, number][];
  max_discount?: number;
  approval?: string;
  granularity: number;
  deadline: number;
  autotable?: number;
  street: string;
  city: string;
  county?: string;
  state?: string;
  country: string;
  postal_code?: string;
  max_count_per_reservation: number;
  default_reservation_length: number;
  max_reservation_length: number;
  max_reservation_distance: number;
  unavailable_until?: number;
  tags: PlaceTag[];
  stripe_customer_id?: string;
  tier: number;
  grace_email_sent?: boolean;
  integrations?: {
    wolt: boolean;
    facebook: FacebookLink;
  };
  timezone: string;
  notifications_enabled?: boolean;
  robocall_number?: string;
  hide_zones?: boolean;
  print_mode?: 0 | 1;
  auto_fb_post?: string | null;
  additional_services: Service[];
  handle?: string;
  auto_remind: boolean;
};

export function placeToID(place: PlaceOrID): string {
  if (typeof place === "string") return place;
  else return place.poiid;
}

export type FacebookLink = {
  pageName: string;
  accessToken: string;
  pageId: string;
};

export type PlacePost = {
  ownerName: string;
  ownerPhone: string;
  placeName: string;
  businessName: string;
  addressLine: string;
  addressCity: string;
  addressCounty?: string;
  addressState?: string;
  addressCountry: string;
  addressZip?: string;
  latitude: number;
  longitude: number;
  placeEmail: string;
  placePhone: string;
  placeFacebook?: string;
  placeTwitter?: string;
  placeWebsite?: string;
  placeInstagram?: string;
  placeDescription?: string;
  opening?: string;
  notificationEmail: string;
  granularity: number;
  deadline: number;
  maxCount: number;
  defaultLength: number;
  maxDistance: number;
  maxLength?: number;
  autotable: number;
  facebookLink?: FacebookLink;
  auto_fb_post?: string;
};

export type PlacePatch = {
  description?: string;
  opening?: string;
  email?: string;
  reservationEmail?: string;
  phone?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  webpage?: string;
  peaks?: [number, number][];
  maxDiscount?: number;
  granularity?: number;
  deadline?: number;
  autotable?: number;
  maxCountPerReservation?: number;
  defaultReservationLength?: number;
  maxReservationLength?: number;
  maxReservationDistance?: number;
  unavailableUntil?: number;
  tags?: string[];
  notifications_enabled?: boolean;
  auto_remind?: boolean;
  hide_zones?: boolean;
  print_mode?: 0 | 1;
  facebookLink?: Partial<FacebookLink> | null;
  auto_fb_post?: string | null;
  additional_services?: Service[];
  handle?: string;
};

export const PlacePostSchema = {
  type: "object",
  properties: {
    ownerName: { type: "string", minLength: 1 },
    ownerPhone: { type: "string", minLength: 1 },
    placeName: { type: "string", minLength: 1 },
    businessName: { type: "string", minLength: 1 },
    addressLine: { type: "string", minLength: 1 },
    addressCity: { type: "string", minLength: 1 },
    addressCounty: { type: "string" },
    addressState: { type: "string" },
    addressCountry: { type: "string", minLength: 1 },
    addressZip: { type: "string" },
    latitude: { type: "number" },
    longitude: { type: "number" },
    placeEmail: { type: "string", format: "email" },
    placePhone: { type: "string", minLength: 1, maxLength: 15 },
    placeFacebook: { type: "string", format: "uri" },
    placeTwitter: { type: "string" },
    placeWebsite: { type: "string", format: "uri" },
    placeInstagram: { type: "string" },
    placeDescription: { type: "string" },
    opening: { type: "string" },
    notificationEmail: { type: "string", format: "email" },
    granularity: { type: "number" },
    deadline: { type: "number" },
    maxCount: { type: "number" },
    defaultLength: { type: "number" },
    maxDistance: { type: "number" },
    maxLength: { type: "number" },
    autotable: { type: "number", minimum: 0, maximum: 2 },
  },
  required: [
    "ownerName",
    "ownerPhone",
    "placeName",
    "businessName",
    "addressLine",
    "addressCity",
    "addressCountry",
    "latitude",
    "longitude",
    "placeEmail",
    "placePhone",
    "notificationEmail",
    "granularity",
    "deadline",
    "maxCount",
    "defaultLength",
    "maxDistance",
    "autotable",
  ],
  additionalProperties: false,
};

export async function getPlace(
  place: PlaceOrID,
  options?: FetchOptions
): Promise<Place> {
  return await _fetch(
    `/places/${encodeURIComponent(placeToID(place))}`,
    options
  );
}

export async function postPlace(
  post: PlacePost,
  options?: FetchOptions
): Promise<Place> {
  return await _fetch("/places", {
    method: "POST",
    data: post,
    ...options,
  });
}

export async function fBImportPlace(
  place: PlaceOrID,
  options?: FetchOptions
): Promise<{ success: true }> {
  return await _fetch(
    `/places/${encodeURIComponent(placeToID(place))}/fb_import`,
    {
      method: "POST",
      ...options,
    }
  );
}

export async function fBPushPlace(
  place: PlaceOrID,
  options?: FetchOptions
): Promise<{ success: true }> {
  return await _fetch(
    `/places/${encodeURIComponent(placeToID(place))}/fb_push`,
    {
      method: "POST",
      ...options,
    }
  );
}

export async function patchPlace(
  place: PlaceOrID,
  patch: PlacePatch,
  options?: FetchOptions
): Promise<Place> {
  return await _fetch(`/places/${encodeURIComponent(placeToID(place))}`, {
    method: "PATCH",
    data: patch,
    ...options,
  });
}

export type Period = {
  hour: number;
  minute: number;
  free: boolean;
  discount: number;
  comment: string;
};

export async function getPeriods(
  place: PlaceOrID,
  params: {
    date: Date;
    count: number;
    mrd?: number;
  },
  options?: FetchOptions
): Promise<Period[]> {
  return await _fetch(
    `/places/${encodeURIComponent(
      placeToID(place)
    )}/periods?${new URLSearchParams({
      year: params.date.getFullYear().toString(),
      month: params.date.getMonth().toString(),
      date: params.date.getDate().toString(),
      count: params.count.toString(),
      ...(params.mrd && { mrd: params.mrd.toString() }),
    })}`,
    options
  );
}
