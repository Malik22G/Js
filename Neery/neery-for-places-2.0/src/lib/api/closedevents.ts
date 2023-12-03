import { PlaceOrID, placeToID } from "./places";
import { FetchOptions, _fetch } from "./util";

export type ClosedEvent = {
  uuid: string;
  poiid: string;
  date: number;
  endDate: number;
  internal_comment: string;
  external_comment: string;
  is_blocking: boolean;
};

export type ClosedEventPost = {
  date: number;
  endDate: number;
  internal_comment: string;
  external_comment: string;
  is_blocking: boolean;
};

export type ClosedEventPatch = Partial<ClosedEventPost>;

export type ClosedEventOrID = ClosedEvent | string;

function closedEventToID(closedEvent: ClosedEventOrID): string {
  if (typeof closedEvent === "string") {
    return closedEvent;
  } else {
    return closedEvent.uuid;
  }
}

export async function getClosedEvents(
  place: PlaceOrID,
  options?: FetchOptions
): Promise<ClosedEvent[]> {
  return await _fetch(`/places/${placeToID(place)}/closedEvents`, options);
}

export async function postClosedEvent(
  place: PlaceOrID,
  data: ClosedEventPost,
  options?: FetchOptions
): Promise<ClosedEvent> {
  return await _fetch(`/places/${placeToID(place)}/closedEvents`, {
    method: "POST",
    data,
    ...options,
  });
}

export async function patchClosedEvent(
  place: PlaceOrID,
  closedEvent: ClosedEventOrID,
  data: ClosedEventPatch,
  options?: FetchOptions
): Promise<ClosedEvent> {
  return await _fetch(
    `/places/${placeToID(place)}/closedEvents/${closedEventToID(closedEvent)}`,
    {
      method: "PATCH",
      data,
      ...options,
    }
  );
}

export async function deleteClosedEvent(
  place: PlaceOrID,
  closedEvent: ClosedEventOrID,
  options?: FetchOptions
): Promise<{ ok: true }> {
  return await _fetch(
    `/places/${placeToID(place)}/closedEvents/${closedEventToID(closedEvent)}`,
    {
      method: "DELETE",
      ...options,
    }
  );
}
