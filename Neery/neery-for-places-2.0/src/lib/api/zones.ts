import { PlaceOrID, placeToID } from "./places";
import { FetchOptions, _fetch } from "./util";

export type Zone = {
  uuid: string,
  poiid: string,
  name: string,
  count: number,
}

export type ZonePost = {
  name: string,
  count: number,
}

export type ZonePatch = Partial<ZonePost>

export type ZoneOrID = Zone | string;

function zoneToID(zone: ZoneOrID): string {
  if (typeof zone === "string") {
    return zone;
  } else {
    return zone.uuid;
  }
}

export async function getZones(place: PlaceOrID, options?: FetchOptions): Promise<Zone[]> {
  return await _fetch(`/places/${placeToID(place)}/zones`, options);
}

export async function postZone(place: PlaceOrID, data: ZonePost, options?: FetchOptions): Promise<Zone> {
  return await _fetch(`/places/${placeToID(place)}/zones`, {
    method: "POST",
    data,
    ...options,
  });
}

export async function patchZone(place: PlaceOrID, zone: ZoneOrID, data: ZonePatch, options?: FetchOptions): Promise<{ok: true}> {
  return await _fetch(`/places/${placeToID(place)}/zones/${zoneToID(zone)}`, {
    method: "PATCH",
    data,
    ...options,
  });
}

export async function deleteZone(place: PlaceOrID, zone: ZoneOrID, options?: FetchOptions): Promise<{ok: true}> {
  return await _fetch(`/places/${placeToID(place)}/zones/${zoneToID(zone)}`, {
    method: "DELETE",
    ...options,
  });
}
