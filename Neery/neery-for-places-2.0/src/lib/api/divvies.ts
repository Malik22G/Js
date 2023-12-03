import { PlaceOrID, placeToID } from "./places";
import { FetchOptions, _fetch } from "./util";

export type Divvy = {
  uuid: string,
  poiid: string,
  name: string,
  zones: string[],
}

export type DivvyPost = {
  name: string,
  zones?: string[],
}

export type DivvyPatch = Partial<DivvyPost>

export type DivvyOrID = Divvy | string;

function divvyToID(zone: DivvyOrID): string {
  if (typeof zone === "string") {
    return zone;
  } else {
    return zone.uuid;
  }
}

export async function getDivvies(place: PlaceOrID, options?: FetchOptions): Promise<Divvy[]> {
  return await _fetch(`/places/${placeToID(place)}/divvies`, options);
}

export async function postDivvy(place: PlaceOrID, data: DivvyPost, options?: FetchOptions): Promise<Divvy> {
  return await _fetch(`/places/${placeToID(place)}/divvies`, {
    method: "POST",
    data,
    ...options,
  });
}

export async function patchDivvy(place: PlaceOrID, divvy: DivvyOrID, data: DivvyPatch, options?: FetchOptions): Promise<Divvy> {
  return await _fetch(`/places/${placeToID(place)}/divvies/${divvyToID(divvy)}`, {
    method: "PATCH",
    data,
    ...options,
  });
}

export async function deleteDivvy(place: PlaceOrID, divvy: DivvyOrID, options?: FetchOptions): Promise<{ok: true}> {
  return await _fetch(`/places/${placeToID(place)}/divvies/${divvyToID(divvy)}`, {
    method: "DELETE",
    ...options,
  });
}
