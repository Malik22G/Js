import { PlaceOrID, placeToID } from "./places";
import { FetchOptions, _fetch } from "./util";

export type CallOrID = Call | string;

export type Call = {
  uuid: string;
  poiid: string;
  sid: string;
  status: "PENDING" | "ABSENT" | "PROCESSING" | "FAILED" | "DONE";
  caller: string;
  recording_url?: string;
  transcript?: string;
  reservation?: string;
  customer?: string;
  created_at: number;
};

export function callToID(call: CallOrID): string {
  if (typeof call === "string") return call;
  else return call.uuid;
}

export async function getCalls(place: PlaceOrID, options?: FetchOptions): Promise<Call[]> {
  return await _fetch(`/places/${encodeURIComponent(placeToID(place))}/calls`, options);
}

export async function setupCalls(place: PlaceOrID, options?: FetchOptions): Promise<{ ok: true }> {
  return await _fetch(`/places/${encodeURIComponent(placeToID(place))}/calls/setup`, {
    method: "POST",
    ...options,
  });
}
