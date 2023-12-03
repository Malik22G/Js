import { PlaceOrID, placeToID } from "./places";
import { FetchOptions, _fetch } from "./util";

export interface GraphBreakdown {
  labels: string[];
  data: number[];
}

export async function getTotalCount(
  place: PlaceOrID,
  options?: FetchOptions
): Promise<{ count: number }> {
  return await _fetch(
    `/places/stats/${encodeURIComponent(placeToID(place))}/total`,
    {
      method: "POST",
      ...options,
    }
  );
}

export async function getDaysBreakdown(
  place: PlaceOrID,
  days?: number,
  options?: FetchOptions
): Promise<GraphBreakdown> {
  return await _fetch(
    `/places/stats/${encodeURIComponent(placeToID(place))}/daily_breakdown`,
    {
      method: "POST",
      ...(days ? { data: { days } } : {}),
      ...options,
    }
  );
}

export async function getReservationSourcesBreakdown(
  place: PlaceOrID,
  options?: FetchOptions
): Promise<GraphBreakdown> {
  return await _fetch(
    `/places/stats/${encodeURIComponent(placeToID(place))}/reservations_source`,
    {
      method: "POST",
      ...options,
    }
  );
}

export async function getReviewSourcesBreakdown(
  place: PlaceOrID,
  options?: FetchOptions
): Promise<GraphBreakdown> {
  return await _fetch(
    `/places/stats/${encodeURIComponent(placeToID(place))}/review_source`,
    {
      method: "POST",
      ...options,
    }
  );
}

export async function getAcceptedRefused(
  place: PlaceOrID,
  options?: FetchOptions
): Promise<GraphBreakdown> {
  return await _fetch(
    `/places/stats/${encodeURIComponent(placeToID(place))}/accepted_refused`,
    {
      method: "POST",
      ...options,
    }
  );
}
