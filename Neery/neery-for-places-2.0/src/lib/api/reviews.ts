import { _fetch } from "@/lib/api/util";
import { PlaceOrID, placeToID } from "./places";

export type ReviewObject = {
  food?: number;
  service?: number;
  value?: number;
  review?: string;
  hearSource?: string;
  other?: string;
};

export type Review = {
  uuid: string;
  poiid: string;
  reservation_id?: string;
  name: string;
  review: ReviewObject;
  created_at: number;
  reply?: string;
  source?: string;
};

export type ReviewOrID = Review | string;

export function reviewToID(review: ReviewOrID): string {
  if (typeof review === "string") return review;
  else return review.uuid;
}

export type ReviewPost = {
  reviewId: string;
  food?: number;
  service?: number;
  value?: number;
  review?: string;
  hearSource?: string;
  other?: string;
};

export async function postReview(
  place: PlaceOrID,
  review: ReviewOrID,
  data: Omit<ReviewPost, "reviewId">
) {
  return await _fetch(`/places/${placeToID(place)}/reviews`, {
    method: "POST",
    data: {
      reviewId: reviewToID(review),
      ...data,
    },
  });
}

export type Customer = {
  customerName: string;
  placeName: string;
  count: number;
  date: number;
};

export async function getReview(
  place: PlaceOrID,
  review: ReviewOrID
): Promise<{ review: Review }> {
  return await _fetch(
    `/places/${placeToID(place)}/reviews/${reviewToID(review)}`
  );
}

export async function getCustomerFromReview(
  place: PlaceOrID,
  review: ReviewOrID
): Promise<Customer> {
  return await _fetch(
    `/places/${placeToID(place)}/reviews/${reviewToID(review)}/customer`
  );
}

export async function getReviewsFromPlace(
  place: PlaceOrID
): Promise<{ count: number; reviews: Review[] }> {
  return await _fetch(`/places/${placeToID(place)}/reviews`);
}

export type Rating = {
  rating: number | null;
  food: number | null;
  service: number | null;
  value: number | null;
  count: number;
};

export async function getRatingFromPlace(place: PlaceOrID): Promise<Rating> {
  return await _fetch(`/places/${placeToID(place)}/rating`);
}

export type ReviewPatch = {
  reply?: string;
};

export async function patchReview(
  place: PlaceOrID,
  review: ReviewOrID,
  data: ReviewPatch
) {
  return await _fetch(
    `/places/${placeToID(place)}/reviews/${reviewToID(review)}`,
    {
      method: "PATCH",
      data,
    }
  );
}
